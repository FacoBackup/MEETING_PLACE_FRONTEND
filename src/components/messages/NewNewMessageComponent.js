import React from 'react';
import "../../style/messages/MessagesStyle.css";
import MessageBox from "./box/MessageBoxComponent";
import axios from 'axios';
import Host from '../../Host'
import Dexie from "dexie";
import Cookies from 'universal-cookie';
import InfiniteScroll from 'react-infinite-scroll-component'

class MessagesComponent extends React.Component{
    constructor(params){
        super()
        this.state={
            messages: [],
            isLoading: true,
            firstFetchScrollDown: false,
            fetchedLastPage: false,
            subjectID: params.subjectID,
            isGroup: params.isGroup,
            date:new Date(),
            
            db:  new Dexie('api_web_db'),
            currentPage: null
        }
        this.FetchMessagesByPage = this.FetchMessagesByPage.bind(this)
    }
 
    componentDidMount(){        
        this.timerID = setInterval(
            () => this.tick(),
            500
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        // console.log("PAGE Y OFFSET " + window.pageYOffset)
        // console.log("PAGE HEIGHT INNER " + window.innerHeight)
        // console.log("PAGE HEIGHT OUTER " + window.outerHeight)
        // console.log("DOCUMENT " + document.body.scrollHeight)
        // console.log("DOCUMENT - OUTER  " +( document.body.scrollHeight - window.outerHeight))
        console.log(window.outerHeight)
        if(this.state.fetchedLastPage === false){ //ONLY RUNDS ON WHILE NO ONE SENDED A MESSAGE, GETS LAST PAGE
            this.FetchMessagesByPage()
            
            
            this.setState({
                fetchedLastPage: true,
                
            }, () => this.scrollToEnd())

        }
        else{
            
            if(this.state.firstFetchScrollDown === false){
                this.scrollToEnd()
                this.setState({
                    firstFetchScrollDown: true
                })
            }
                
            const lastSize = this.state.messages.length
            this.FetchNewMessages()
            if(this.state.messages.length > lastSize)
                this.scrollToEnd()

            //this.splitMessagesArray()
        }    
        
        this.setState({
            date: new Date(),
        });
    }

    scrollToEnd (){
        
        window.scrollTo(0, (window.outerHeight * 1000))
    }

    scrollToLastHight(lastHight){
        console.log(lastHight)
        console.log(window.outerHeight)
        window.scrollTo(0, (window.outerHeight-lastHight))
    }

    splitMessagesArray(){
        const size = this.state.messages.length
        if(size >= 40){
            const newMessages = this.state.messages.splice(0,size/2);
            this.setState({
                messages: newMessages
            })
        }       
    }

    async FetchMessagesByPage(){
        this.setState({
            isLoading: true
        })
        if(this.state.currentPage === null || this.state.currentPage > 1){
            await axios({
                method: 'patch',
                url:  Host()+'api/fetch/by/page',
                headers: {"Authorization": 'Bearer ' +(new Cookies()).get("JWT")},
                data: {
                    subjectID: this.state.subjectID,
                    isUser: this.state.isGroup === true? false: true,
                    page: this.state.currentPage === null? null: this.state.currentPage-1
                }
            }).then(res=>{
    
                if(res.data.length > 0 && typeof res.data.length !== 'undefined' && this.state.currentPage !== 1){
                
                    const lastHight = window.pageYOffset
                    const newMessages = [...this.state.messages,...res.data]
                    this.setState({
                        messages: newMessages,
                        currentPage:  typeof res.data[0] !== 'undefined' && typeof res.data[0].page !== 'undefined' ?  res.data[0].page : null,
                        isLoading: false
                    })    
                    this.scrollToLastHight(lastHight)    
                }
            })
            .catch(error => {
                console.log(error)
            });
        }
        
    }
  
    async FetchNewMessages(){

        await axios({
            method: 'patch',
            url:  Host()+'api/fetch/unseen/messages',
            headers: {"Authorization": 'Bearer ' +(new Cookies()).get("JWT")},
            data: {
                subjectID: this.state.subjectID,
                isUser: this.state.isGroup === true? false: true,
                page: null
            }
        }).then(res=>{
            
            if(res.data.length > 0 && typeof res.data.length !== 'undefined'){
            
                this.setState({
                    messages: [...this.state.messages, ...res.data],
                    currentPage:  typeof res.data[0] !== 'undefined' && typeof res.data[0].page !== 'undefined' ?  res.data[0].page : null
                })
                this.scrollToEnd()
            }
        })
        .catch(error => {
            console.log(error)
        });
    }
    renderInfiniteScroll(){
      
        return(
            <div className="messages_component_container">  
                <div className="messages_component" style={{backgroundColor: 'white'}} ref={this.state.conversationContainer}>
                    <InfiniteScroll
                        dataLength={this.state.messages.length} //This is important field to render the next data
                        next={() => this.FetchMessagesByPage()}
                        loader={<h4>Loading...</h4>}
                        
                        inverse={true}
                        hasMore={this.state.currentPage > 1 ? true: false}
                        >
                        {this.state.messages === [] ? <div></div> : this.state.messages.map((message, index) =>(
                            <div className={(message.creatorID === this.state.userID) ? "my_message_container" : "subject_message_container"} style={{padding: '1vh'}}>
                                <MessageBox messageID = {message.id} conversationID={message.conversationID} content= {message.content} imageURL={message.imageURL} creationDate= {message.creationDate} userID= {(new Cookies()).get("ID")}  creatorID={message.creatorID}  read={message.seenByEveryone}/>
                                <div ref={this.state.essagesEndRef} />
                            </div>   
                        ))}   
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
    render(){    
        return(
            this.renderInfiniteScroll()
        );
    }    
}   

export default MessagesComponent;
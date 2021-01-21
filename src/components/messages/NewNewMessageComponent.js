import React from 'react';
import "../../style/messages/MessagesStyle.css";
import MessageBox from "./box/MessageBoxComponent";
import axios from 'axios';
import Host from '../../Host'
import Dexie from "dexie";
import Cookies from 'universal-cookie';
import InfiniteScroll from 'react-infinite-scroll-component'
import Skeleton from '@material-ui/lab/Skeleton'

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
            conversation: {},
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


        }    
        
        this.setState({
            date: new Date(),
        });
    }

    scrollToEnd (){
        var length = this.state.messages.length
        
        if(length > 0){

            var element = document.getElementsByClassName("class").length;
            
            document.getElementsByClassName("class")[element-1].scrollIntoView({behavior:'smooth',block:'end'})
            window.scrollTo(0, document.body.scrollHeight)
        }
        
    }

    scrollToLastHight(lastIndex){
        document.getElementsByClassName("class")[lastIndex].scrollIntoView();
    
    }

    splitMessagesArray(){
        const size = this.state.messages.length
        if(size >= 40){
            const newMessages = this.state.messages.splice(size/2,size);
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
                
                    

                    const newMessages = [...res.data,...this.state.messages]
                    
                    this.setState({
                        messages: newMessages,
                        currentPage:  typeof res.data[0] !== 'undefined' && typeof res.data[0].page !== 'undefined' ?  res.data[0].page : null,
                        isLoading: false
                    })    
                    if((this.state.messages.length-res.data.length) === 0){

                        this.scrollToEnd()
                    }
                        
                    if((this.state.messages.length-res.data.length) !== 0)
                        this.scrollToLastHight(res.data.length-1)    
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
                this.splitMessagesArray()
                this.scrollToEnd()
            }
        })
        .catch(error => {
            console.log(error)
        });
    }

    renderSkeleton(){
        return(
            <>         
            <div className="subject_message_container" >
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        
                        <Skeleton variant="circle" style={{backgroundColor:'rgba(255,255,255,.2)',width:'50px', height:'50px'}}/>
                        <div style={{width:'85%'}}>
                        <Skeleton style={{backgroundColor:'rgba(255,255,255,.2)',width:'85%', height:'20px'}}/>
                        <Skeleton style={{backgroundColor:'rgba(255,255,255,.2)',width:'55%', height:'20px'}}/>
                        </div>
                        
                        
                    </div>
                    <div className="subject_message_box_container" style={{backgroundColor:'transparent'}}>
                    
                        <Skeleton variant="rect" style={{backgroundColor:'rgba(255,255,255,.2)',height:'300px', borderRadius:'8px', width:'100%'}}/>
                    </div>
                
                </div>
            </>
        )
    }

    renderInfiniteScroll(){
        
        return(
            <div className="messages_component_container">  
                <div className="messages_component " ref={this.state.conversationContainer}>
                    {this.state.isLoading === true ? <div style={{display:'grid', rowGap:'1vh'}}> 
                        {this.renderSkeleton()}
                    </div>: null}
                    <InfiniteScroll
                        dataLength={this.state.messages.length} 
                        next={() => this.FetchMessagesByPage()}

                        inverse={true}
                        hasMore={this.state.currentPage > 1 ? true: false}
                        >
                        {this.state.messages === [] ? <div></div> : this.state.messages.map((message) =>(
                            <div key ={message.id} className="class">
                                <MessageBox conversation={this.state.conversation} messageID = {message.id} conversationID={message.conversationID} content= {message.content} imageURL={message.imageURL} creationDate= {message.creationDate} userID= {(new Cookies()).get("ID")}  creatorID={message.creatorID}  read={message.seenByEveryone}/>
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
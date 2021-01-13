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
            subjectID: params.subjectID,
            isGroup: params.isGroup,
            date:new Date(),
            db:  new Dexie('api_web_db'),
            currentPage: 0
        }
    }
  
    componentDidMount(){
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
  

  
        this.setState({
            date: new Date(),
        });
    }



    scrollToEnd (){
        
        window.scrollTo(0, (window.innerHeight))
    };

    async FetchMessagesByPage(pageNumber){
        alert("FETCHING")
        this.setState({
            currentPage: this.state.currentPage + 1
        })
        await axios({
            method: 'patch',
            url:  Host()+'api/fetch/by/page',
            headers: {"Authorization": 'Bearer ' +(new Cookies()).get("JWT")},
            data: {
                subjectID: this.state.subjectID,
                isUser: this.state.isGroup === true? false: true,
                page: pageNumber
            }
        }).then(res=>{
            this.setState({
                messages: [...this.state.messages, ...res.data]
            })
                
        })
        .catch(error => {
            console.log(error)
        });
    }
  
    
   
    render(){    
        return(
            <div className="messages_component_container">  
                <InfiniteScroll
                    dataLength={this.state.messages.length} //This is important field to render the next data
                    next={() => 
                        this.FetchMessagesByPage()
                        
                    }
                    inverse={true}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            Yes baby
                        </p>
                    }

                
                    >
                    <div className="messages_component" style={{backgroundColor: 'white'}} ref={this.state.conversationContainer}>
                        {this.state.messages === [] ? <div></div> : this.state.messages.map((message,index) =>(
                            <div className={(message.creatorID === this.state.userID) ? "my_message_container" : "subject_message_container"} style={{padding: '1vh'}}>
                                <MessageBox messageID = {message.id} conversationID={this.state.conversationID} content= {message.content} imageURL={message.imageURL} creationDate= {message.creationDate} userID= {this.state.userID}  creatorID={message.creatorID}  read={message.seenByEveryone}/>
                                <div ref={this.state.essagesEndRef} />
                            </div>   
                        ))}   
                            
                    </div>
                </InfiniteScroll>
            </div>
        );
      
    }    
}   

export default MessagesComponent;
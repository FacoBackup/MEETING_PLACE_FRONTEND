import React, {useEffect, useState} from 'react';
import Navigation from "../navigation/NavigationBar"
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../style/cards.css";


function Chat ({match}){
    
    useEffect(()=>{
        fetchMessages()
    },[]);

    const cookies = new Cookies();
    const [conversation,setConversation] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    
    const fetchMessages = async () =>{
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/get/conversation',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
            data: {
                subjectID: match.params.email,
                isGroup: false
            }
        }).then(res=>{
            setConversation(res.data);
        })
        .catch(error => {
            alert(match.params.email)
            console.log(error);
        });
    }

    async function send (){
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/message',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
            data: {
                message: messageInput,
                imageURL: null,
                receiverID: match.params.email,
                isGroup: false
            }
        }).then(()=>{
            fetchMessages();
        })
        .catch(error => {
            console.log(error);
        });
    };

    function handleChange (event)  {
        setMessageInput(event.target.value) ;
    }

    return(
        <div>
            <Navigation/>
            <div className="Container">
                <h1>Conversation with {match.params.email}</h1>
                {conversation.map((message, index) => 
                    <div>
                        <h3>{message.content}</h3> 
                        <p> from {message.creatorID}</p>
                        <p> read: {JSON.stringify(message.read)}</p>
                    </div>)}
                <label>
                    <input type="text" name="message" value={messageInput} onChange={handleChange}></input>
                </label>
                <button onClick={send}>Send</button>
            </div>
        </div>
    );

}   

export default Chat;
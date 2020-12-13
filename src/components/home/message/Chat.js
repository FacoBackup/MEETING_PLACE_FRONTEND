import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../../style/cards.css";

const cookies = new Cookies();
function Chat ({match}){
    useEffect(()=>{
        fetchMessages()
    },[]);
    const [conversation,setConversation] = useState([]);
    const [message, setMessage] = useState([]);

    const fetchMessages = async () =>{
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/get/conversation',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT").data},
            data: {
                subjectID: match.params.email,
                isGroup: false
            }
        }).then(res=>{
            alert(match.params.email)
            setConversation(res);
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
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT").data},
            data: {
                message: message,
                imageURL: null,
                receiverID: match.params.email,
                isGroup: false
            }
        }).then(res=>{
            setConversation(res);
        })
        .catch(error => {
            console.log(error);
        });
    };

    function handleChange (event)  {
        setMessage(event.target.value) ;
    }

    return(
        <div>
            
            <h1>messages: {conversation.forEach(<li>{conversation.content}</li>)}</h1>
            <label>
                <input type="text" name="message" value={message} onChange={handleChange}></input>
            </label>
            <button onClick={send}>Send</button>
        </div>
    );

}   

export default Chat;
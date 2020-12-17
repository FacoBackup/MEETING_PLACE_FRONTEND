import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../style/cards.css";
import { TextField } from 'office-ui-fabric-react/lib/TextField';

function Conversations (){
    
    useEffect(()=>{
        fetchMessages()
    },[]);

    const cookies = new Cookies();
    const [conversations,setConversations] = useState([]);
    
    const fetchMessages = async () =>{
        await axios({
            method: 'get',
            url: 'http://localhost:8080/api/conversation/all',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
        }).then(res=>{
            setConversations(res.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return(
        <div>
            {conversations.map((chat, index) => 
                <div>
                    <Link style={{textDecoration:'none', textAlign:'center'}} to={"/chat/" + chat.id+"/"+JSON.stringify(chat.isGroup)}><p>{(chat.name).replace(cookies.get('ID', ""))}</p></Link>
                </div>)}
        </div>
    );

}   

export default Conversations;
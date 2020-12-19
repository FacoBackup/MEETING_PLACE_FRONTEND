import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../style/cards.css"

function Following(){
    const cookies = new Cookies();
    const [following, setFollowing] = useState([]);
    
    useEffect(()=>{
        fetchData();
    },[]);

    async function fetchData () {
        await axios({
            method: 'get',
            url: 'http://localhost:8080/api/following',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},

        }).then(res=>{
    
            setFollowing(res.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return(
        <div style={{paddingLeft:'10px', paddingRight: '10px'}}>
            <h1>FOLLOWING</h1>
            {following.map((user, index) => 
            <div >
                <p>{user.followedID}</p> 
                <Link to={'/chat/'+user.followedID}><button>Send message</button></Link>
            </div>)}
        </div>
    );
}

export default Following;
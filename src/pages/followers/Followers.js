import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 

function Followers(){

    const cookies = new Cookies();
    const [followers, setFollowers] = useState([]);
    
    useEffect(()=>{
        fetchData();
    });

    async function fetchData () {
        await axios({
            method: 'get',
            url: 'http://localhost:8080/api/followers',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},

        }).then(res=>{
        
            setFollowers(res.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return(
        <div>
            <h3>Followers</h3>
            {followers.map((user, index) => 
            <div>
                <h3>{user.followerID}</h3> 
                <Link to={'/chat/'+user.followerID}><button>Send message</button></Link>
            </div>)}
        </div>
    );
}

export default Followers;
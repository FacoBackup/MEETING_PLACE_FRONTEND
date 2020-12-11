import NavBar from "../navigation/NavBar";
import Footer from "../footer/FooterBar";
import React, {Component, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 


function Profile(){
    var accepted = false
    const cookies = new Cookies();
    const fetchData = async () => {
    await axios({
        method: 'get',
        url: 'http://localhost:8080/api/user',
        headers: {"Authorization": 'Bearer ' + cookies.get("JWT").data}
    }).then(response=>{
       alert("ACCEPTED")
       accepted = true
    })
    .catch(error => {
        if(error.response.status === 401){
            alert("mission failed we'll get em next time")
            return(<Redirect to={"/login"}/>)
        }
        else
            alert("Some error occurred")
    });
    }
   
    useEffect(() => {
        fetchData();
    },[]);
    
    return(
        <div>
            
            <NavBar/>
        
                <h3>Profile</h3>
                <h1>Accepted: {JSON.stringify(accepted)}</h1>
            <Footer/>
        </div>
    );

}

export default Profile;
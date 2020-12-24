import React, { useState } from 'react';
import {Link, Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 


function UserSearch(){
    const [profile, setProfile] = useState({});
    const [searchInput, setInput] = useState('');

    const [isFollower, setIsFollower] = useState(false);
    const [found, setFound] = useState(false);
    const [searched, setSearched] = useState(false);
    const [valid, setValid] = useState(true);
    const cookies = new Cookies();
    
    async function fetchData (){
        if(typeof cookies.get("ID") !== 'undefined' && cookies.get("ID") !== searchInput){
            await axios({
                method: 'get',
                url: 'http://localhost:8080/api/user/name',
                params: {
                    userID: searchInput
                }
            }).then(res=>{
                alert
                setProfile(res);
                setFound(true);
                setSearched(true);
            })
            .catch(error => {
                 setFound(false);
                 setSearched(true);
            });
        }else if(typeof cookies.get("ID") !== 'undefined' && cookies.get("ID") === searchInput)
            setValid(false)  ;
        
        fetchIsFollower()
    }
    
    function handleChange (event)  {
        setInput(event.target.value) ;
    }

    async function fetchIsFollower(){
        await axios({
            method: 'patch',
            url: 'http://localhost:8080/api/follower',
            headers: {"Authorization": 'Bearer '+cookies.get("JWT")},
            data: {
                userID: searchInput
            }
        }).then(res=>{
            setIsFollower(res.data);
        })
        .catch();
        
    }

    async function follow (){
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/follow',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
            data: {
                subjectID: profile.data.email,
                community: false
            }
        }).then(res=>{
           setIsFollower(true);
        })
        .catch();
    }

    async function unfollow () {
        await axios({
            method: 'delete',
            url: 'http://localhost:8080/api/unfollow',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
            data: {
                subjectID: profile.data.email,
                community: false
            }
        }).then(res=>{
           setIsFollower(false);
        })
        .catch();
    }

    if(found && searched && valid){
        return(
            <div>
                <div className="Container">
                    
                    <label>
                        <input type="text" name="email" value={searchInput} onChange={handleChange}></input>
                    </label>
                    <button onClick={fetchData}>Search</button>
            
                    <h3>Profile</h3>
                    <ul>
                        <li>name: {profile.data.name}</li>
                        <li>email: {profile.data.email}</li>
                        <li>phoneNumber: {profile.data.phoneNumber}</li>
                        <li>about: {profile.data.about}</li>
                        <li>image: {profile.data.imageURL}</li>
                        <li>birthDate: {profile.data.birthDate}</li>
                        <li>cityOfBirth: {profile.data.cityOfBirth}</li>
                        <li>nationality : {profile.data.nationality}</li>
                    </ul>
                    <button><Link to={'/chat/'+profile.data.email+"/false"}>Send message</Link></button>
                    {isFollower ? <button onClick={unfollow}>UNFOLLOW</button> : <button onClick={follow}>FOLLOW</button> }
                </div>

            </div>
        );
    }
    else if(searched && !found && valid)
        return(
            <div>
        
                <div className="Container">
                    <label>
                        <input type="text" name="email" value={searchInput} onChange={handleChange}></input>
                    </label>
                    <button onClick={fetchData}>Search</button>
                    <h3>Nothing found</h3>
                </div>
            </div>
        );
    else if(!searched)
        return(
            <div>
                <div className="Container">
                    <label>
                        <input type="text" name="email" value={searchInput} onChange={handleChange}></input>
                    </label>
                    <button onClick={fetchData}>Search</button>
                </div>
            </div>
        );
    else if (!valid){
        return (<Redirect to="/"/>);
    }
        
}

export default UserSearch;
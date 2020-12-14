import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../../style/cards.css";
import NavBar from "../../navigation/NavBar";

function ProfileSearch(props){
    const [profile, setProfile] = useState({});
    const [searchInput, setInput] = useState('');

    const [isFollower, setIsFollower] = useState(false);
    const [found, setFound] = useState(false);
    const [searched, setSearched] = useState(false);

    const cookies = new Cookies();

    const fetchData = async () => {
        await axios({
            method: 'patch',
            url: 'http://localhost:8080/api/user/search',
            data: {
                userID: searchInput
            }
        }).then(res=>{
            setProfile(res);
            setFound(true);
            setSearched(true);
            fetchIsFollower();
        })
        .catch(error => {
             setFound(false);
             setSearched(true);
        });
    }
    
    function handleChange (event)  {
        setInput(event.target.value) ;
    }

    const fetchIsFollower = async () => {
        await axios({
            method: 'patch',
            url: 'http://localhost:8080/api/follower',
            headers: {"Authorization": 'Bearer '+cookies.get("JWT").data},
            data: {
                userID: searchInput
            }
        }).then(res=>{
           setIsFollower(res);
        })
        .catch();
    }

    async function follow (){
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/follow',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT").data},
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
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT").data},
            data: {
                subjectID: profile.data.email,
                community: false
            }
        }).then(res=>{
           setIsFollower(false);
        })
        .catch();
    }

    if(found && searched){
        return(
            <div>
                <NavBar/>
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
                    <button><Link to={'/chat/'+profile.data.email}>Send message</Link></button>
                    {isFollower ? <button onClick={unfollow}>UNFOLLOW</button> : <button onClick={follow}>FOLLOW</button> }
                </div>

            </div>
        );
    }
    else if(searched && !found)
        return(
            <div>
                 <NavBar/>
                <div className="Container">
                    <label>
                        <input type="text" name="email" value={searchInput} onChange={handleChange}></input>
                    </label>
                    <button onClick={fetchData}>Search</button>
                    <h3>Nothing found</h3>
                </div>
            </div>
        );
    else 
        return(
            <div>
                <NavBar/>
                <div className="Container">
                    <label>
                        <input type="text" name="email" value={searchInput} onChange={handleChange}></input>
                    </label>
                    <button onClick={fetchData}>Search</button>
                </div>
            </div>
        );
}

export default ProfileSearch;
import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import "./SearchComponentStyle.css"
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { TextField } from '@fluentui/react';

function UserSearch(){
    const [profile, setProfile] = useState([]);
    const [searchInput, setInput] = useState('');
    const cookies = new Cookies();
    
    async function fetchData (event){
        
        if(typeof event !== 'undefined')
            setInput(event.target.value) ;
    
        if(typeof cookies.get("ID") !== 'undefined'){
            await axios({
                method: 'patch',
                url: 'http://localhost:8080/api/search/user',
                headers: {"Authorization": 'Bearer '+cookies.get("JWT")},
                data: {
                    userID: searchInput
                }
            }).then(res=>{
       
                setProfile(res.data);
      
            
            })
            .catch(error => console.log(error));
        }
    }
    async function follow (params){

        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/follow',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
            data: {
                subjectID: params,
                community: false
            }
        }).then(()=>{
           fetchData()
        })
        .catch();
    }

    async function unfollow (params) {
        await axios({
            method: 'delete',
            url: 'http://localhost:8080/api/unfollow',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
            data: {
                subjectID: params,
                community: false
            }
        }).then(()=>{
            fetchData()
        })
        .catch();
    }

    const renderProfile= (
        
        <div>
           {profile  === [] ?  <div>Nothing Found</div>: profile.map(user => 
            <div className="search_personas_container">
                <Persona
                {...{
                    imageUrl: (user.imageURL === null) ?  user.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                    text: user.name,
                    secondaryText: user.email
                }}
                size={PersonaSize.size48}
                imageAlt="Conversation picture"
                />
                <PrimaryButton href={'/chat/'+user.email+"/false"} text="Send Message"/>
            
                {user.isFollowing ? <DefaultButton onClick={() => unfollow(user.email)} text="Unfollow"/>: <PrimaryButton onClick={() => follow(user.email)} text="Follow"/>}
            </div>
            )}
        </div>)

    
        return(
            <div className="search_component">
                <div>
                    <p>Search</p>
                </div>
                <div className="search_box_container">
                    <TextField onChange={fetchData} laceholder="Search User"/>
                </div>
                <div className="search_result_container">
                    {renderProfile}
                </div>
                
            </div>
        )
    
    // if(){
    //     return(
    //         <div className="search_component">
    //             <div>
    //                 <SearchBox onChange={fetchData} placeholder="Search User"/>
                    
                
               
    //             </div>

    //         </div>
    //     );
    // }
    // else if(searched && !found && valid)
    //     return(
    //         <div className="search_component">
        
    //             <div className="Container">
    //                     <SearchBox onChange={fetchData} placeholder="Search User"/>
    //                 <h3>Nothing found</h3>
    //             </div>
    //         </div>
    //     );
    // else if(!searched)
    //     return(
    //         <div className="search_component">
    //             <div className="Container">
    //             <SearchBox onChange={fetchData} placeholder="Search User"/>
    //             </div>
    //         </div>
    //     );
   
        
}

export default UserSearch;
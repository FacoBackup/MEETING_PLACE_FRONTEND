import React from 'react';
import "./TopicCreationStyle.css"
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
// import axios from 'axios';
// import Dexie from "dexie";
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
// import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

class TopicCreation extends React.Component{
    constructor(params){
        super(params)
        this.state={
            title:'',
            body:'',
            token: params.token,
            imageURL: '',
        }
        
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
        
    }


    
    // async createTopic(){
    //     await axios({
    //         method: 'get',
    //         url: 'http://localhost:8080/api/user',
    //         headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")}
    //     }).then(res=>{
    //         this.setState({
    //             profile: res.data
    //         })
    //     })
    //     .catch()
    // }

    render(){
        return(
            <div className="timeline_component_container">
                <div className="topic_creation_container">
                    <div className="topic_creation_title">
                        <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>Express Yourself</p>
                    </div>
                    <div  className="topic_creation_top_buttons">
                        <DefaultButton text="To Community"/> 
                        <DefaultButton text="Upload Image"/> 
                        <Toggle label="Visibility" defaultChecked onText="Only Fans" offText="Public"/>
                    </div>
                    <div className="topic_creation_fields">
                        <TextField placeholder="Title" multiline resizable={false} name='header' onChange={this.handleChange}/>
                        <TextField  placeholder="Body" multiline autoAdjustHeight name='body' onChange={this.handleChange}/>    
                    </div>
                    <div className="topic_creation_bottom_buttons">
                        <PrimaryButton text="Create"/> 
                    </div>                   
                </div>
            </div>
        );  
    }
        
    
       
}

export default TopicCreation;
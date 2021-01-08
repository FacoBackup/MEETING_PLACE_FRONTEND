import React from 'react';
import "./TopicCreationStyle.css"
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import axios from 'axios';

import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
// import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

class TopicCreation extends React.Component{
    constructor(params){
        super(params)
        this.state={
            title:'',
            body:'',
            token: params.token,
            imageURL: null,
            communityID: null
        }
        
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
        
    }

    getFile(event) {
        console.log(event)

        let reader = new FileReader();
        reader.readAsDataURL(event[0]);
        reader.onload =() =>{
          this.setState({
              imageURL: reader.result
          })
        }
    }
    
    async createTopic(){
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/topic',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data:{
                header: this.state.title,
                body: this.state.body,
                imageURL: this.state.imageURL,
                communityID: this.state.communityID,
                mainTopicID: null
            }
        }).then(res=>{
            alert(res.response.status)
            if(res.response.status === 201)
                window.location.reload()
        })
        .catch(error => console.log(error))
    }

    imageRender(){
        if(this.state.imageURL !== null)
            return(
                <div style={{display:'flex', justifyContent:'center'}}>
                    <img style={{margin:'auto',width:'70%', borderRadius:'8px'}} alt="topic Image" src={this.state.imageURL}/>
                </div>
                
            )
    }
    render(){
        return(
            <div className="timeline_component_container">
                <div className="topic_creation_container">
                    <div className="topic_creation_title">
                        <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>Express Yourself</p>
                    </div>
                    <div  className="topic_creation_top_buttons">
                    <input type="file" name="file"  onChange={event => this.getFile(event.target.files)}/>
                        <DefaultButton text="To Community"/> 
                        <Toggle label="Visibility" defaultChecked onText="Only Fans" offText="Public"/>
                    </div>
                    <div className="topic_creation_fields">
                        <TextField placeholder="Title" multiline resizable={false} name='title' onChange={this.handleChange}/>
                        <TextField  placeholder="Body" multiline autoAdjustHeight name='body' onChange={this.handleChange}/>    
                        {this.imageRender()}
                    </div>
                    <div className="topic_creation_bottom_buttons">
                        <PrimaryButton text="Create" onClick={() => this.createTopic()}/> 
                    </div>                   
                </div>
            </div>
        );  
    }
        
    
       
}

export default TopicCreation;
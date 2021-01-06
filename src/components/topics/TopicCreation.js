import React from 'react';
import "./TopicCreationStyle.css"
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import axios from 'axios';
import Dexie from "dexie";
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

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
    
    render(){
        return(
            <div className="timeline_component_container">
                {/* <DefaultButton text="Timeline" disabled={true} style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'auto'}} href="/signout"/>
                <DefaultButton text="My Topics" disabled={true} style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'auto'}} href="/signout"/>
                <PrimaryButton text="Create New" disabled={true} style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'auto'}} href="/signout"/> */}
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
                <div className="topic_container">
                    <div className="topic_creator_persona_container">
                        <Persona
                            {...{
                                imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                text: "CREATOR NAME",
                                secondaryText: "CREATOR EMAIL"
                            }}
                            size={PersonaSize.size48}
                            imageAlt="Profile Picture"
                        />
                    </div>
                    <div className="topic_fields_container">
                        <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>TITLE</p>
                        <p style={{ fontSize: FontSizes.size16, fontWeight:FontWeights.semilight}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </div>
                    <div className="topic_image_container">
                        <img alt="Topic Image" classname="topic_image" src= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU"/>
                    </div>
                    <div className="topic_buttons_container">
                        <DefaultButton text="Like"/> 
                        <DefaultButton text="Dislike"/> 
                        <DefaultButton text="Comment"/> 
                        <DefaultButton text="Share" disabled={true}/> 
                    </div>
                </div>
                <div className="topic_container">
                    <div className="topic_creator_persona_container">
                        <Persona
                            {...{
                                imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                text: "CREATOR NAME",
                                secondaryText: "CREATOR EMAIL"
                            }}
                            size={PersonaSize.size48}
                            imageAlt="Profile Picture"
                        />
                    </div>
                    <div className="topic_fields_container">
                        <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>TITLE</p>
                        <p style={{ fontSize: FontSizes.size16, fontWeight:FontWeights.semilight}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </div>
                    <div className="topic_image_container">
                        <img alt="Topic Image" classname="topic_image" src= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU"/>
                    </div>
                    <div className="topic_buttons_container">
                        <DefaultButton text="Like"/> 
                        <DefaultButton text="Dislike"/> 
                        <DefaultButton text="Comment"/> 
                        <DefaultButton text="Share" disabled={true}/> 
                    </div>
                </div>
                <div className="timeline_end_container">
                    <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>You are all caught up for now</p>
                </div>
            </div>
        );  
    }
        
    
       
}

export default TopicCreation;
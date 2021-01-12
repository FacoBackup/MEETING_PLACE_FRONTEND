import React from 'react';
import "../../style/topics/TopicCreationStyle.css"
import { DefaultButton,Modal, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import axios from 'axios';
import Dexie from "dexie";
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Host from '../../Host'
import Cookies from 'universal-cookie';
import DeleteTopic from '../../functions/topics/DeleteTopic'
import UpdateTopic from '../../functions/topics/UpdateTopic'

class TopicComponent extends React.Component{
    
    constructor(params){
        super(params)
        this.state={
            token: params.token,   
            db: new Dexie('api_web_db'),
            community: params.community,
            subjectID: params.subjectID,
            timeline: params.timeline,
            topics: [],
            deleteModal: false,
            editMode: false,
            headerInput: null,
            bodyInput: null
        }
        this.updateTopic = this.updateTopic.bind(this)
        this.deleteTopic = this.deleteTopic.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount(){ //here
        if(this.state.timeline === false)
            this.fetchSubjectTopics()
        else
            this.fetchTimeline()
    }

    async fetchTimeline(){

        await axios({
            method: 'get',
            url:  Host()+'api/timeline/all' ,
            headers: {"Authorization": 'Bearer ' +this.state.token},            
        }).then(res=>{
            
            this.setState({
                topics: res.data
            })
          
        })
        .catch(error => {
            console.log(error)
        });
    }

    async fetchSubjectTopics(){
        await axios({
            method: 'patch',
            url:  Host()+"api/get/topics/subject",
            headers: {"Authorization": 'Bearer ' +this.state.token},
            data:{
                subjectID: this.state.subjectID,
                community: this.state.community   
            }
            
        }).then(res=>{
            console.log("FETCH SUBJECT TOPICS -> " + JSON.stringify(res.data))
            if(typeof res.data != "undefined" && res.data != null && res.data.length != null && res.data.length !== 0){
                this.setState({
                    topics:(res.data)
                })
            }
        })
        .catch(error => {
            console.log(error)
        });
    }

    async deleteTopic(topicID){
        await DeleteTopic(topicID);
    
        (this.state.timeline === true )? this.fetchTimeline() : this.fetchSubjectTopics()
    }

    async updateTopic(topicID){
        await UpdateTopic(topicID, this.state.headerInput, this.state.bodyInput);
        this.setState({
            editMode: false
        })
        (this.state.timeline === true )? this.fetchTimeline() : this.fetchSubjectTopics()
        
    }

    renderEditButton(creator, topicID){
        if(creator === (new Cookies()).get("ID")){
            return(
                <div >
                    <DefaultButton text="Edit" onClick={() => this.setState({
                        editMode: true
                    })}/>
                </div>
            )
        }
    }
    renderDeleteButton(creator){
        if(creator === (new Cookies()).get("ID"))
            return(
                <div>
                     <DefaultButton text="Delete" style ={{color: "white",backgroundColor:'red'}} onClick={() => this.setState({
                        deleteModal: true
                    })}/>
                </div>
            )
    }
    renderImage(topic){
        if(typeof topic.imageURL !== 'undefined')
            return(
                <div className="topic_image_container">
                    <img style={{borderRadius:'8px', width:'100%', height: '100%'}}alt="Topic" src={topic.imageURL}/>
                </div>
            )
    }
    renderModal(topicID){
        if(this.state.deleteModal === true)
            return(
                <Modal
                titleAriaId={"TESTE"}
                isOpen={true}
                onDismiss={true}
                isBlocking={false}
                
                > 
                    <div style={{marginTop: '18%',display: 'grid', justifyContent:'center', placeItems: 'center', rowGap:'1vh'}}>

                        <DefaultButton text="Are you sure?" onClick={() => this.deleteTopic(topicID)}/>
                        <PrimaryButton text="Cancel" onClick={() => this.setState({
                            deleteModal: false
                        })}/>
                    </div>
                </Modal>
            )
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    renderEditMode(){
        if(this.state.editMode === true)
            return(
                <div>
                    <div >
                        {this.state.topics === [] ? <div></div> : this.state.topics.map(topic => (
                            <div className="topic_container"> 
                                <div className="topic_creator_persona_container">
                                    <Persona
                                        {...{
                                            imageUrl:  (typeof topic.subjectImageURL !== 'undefined')? topic.subjectImageURL : null,
                                            text: topic.subjectName,
                                            secondaryText: (typeof topic.communityID === 'undefined' ? topic.creatorID :  topic.communityName)
                                        }}
                                        size={PersonaSize.size56}
                                        imageAlt="User"
                                    />
                                    
                                    <p style={{ fontSize: FontSizes.size14, fontWeight:FontWeights.regular, color:"#3b3a39"}}>Created on: {(new Date(topic.creationDate)).toLocaleString()}</p>
                                </div>
                                <div className="topic_fields_container">
                                    <TextField defaultValue={topic.header} label="New Title" multiline name="headerInput" onChange={this.handleChange}/>
                                    <TextField defaultValue={topic.body} label="New Body" multiline name="bodyInput" onChange={this.handleChange}/>
                                   
                                </div>
                        
                                {this.renderImage(topic)}  
                                {this.renderModal(topic.id)}
                            
                                <div className="topic_buttons_container">
                                    
                                    <DefaultButton text="Cancel" onClick={() =>
                                        this.setState({
                                            editMode: false
                                        })
                                    }/>
                                    <PrimaryButton text="Save Changes" onClick={() => this.updateTopic(topic.id)}/>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="timeline_end_container">
                        <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>You are all caught up for now</p>
                    </div>
                </div>
            )
    }
    renderTopic(){
        if(this.state.editMode === false)
            return(
                <div>
                    <div >
                        {this.state.topics === [] ? <div></div> : this.state.topics.map(topic => (
                            <div className="topic_container"> 
                                <div className="topic_creator_persona_container">
                                    <Persona
                                        {...{
                                            imageUrl: (typeof topic.subjectImageURL !== 'undefined')? topic.subjectImageURL : null ,
                                            text: topic.subjectName,
                                            secondaryText: (typeof topic.communityID === 'undefined' ? topic.creatorID :  topic.communityName)
                                        }}
                                        size={PersonaSize.size56}
                                        imageAlt="User"
                                    />
                                    
                                    <p style={{ fontSize: FontSizes.size14, fontWeight:FontWeights.regular, color:"#3b3a39"}}>Created on: {(new Date(topic.creationDate)).toLocaleString()}</p>
                                </div>
                                <div className="topic_fields_container">
                                    <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>{topic.header}</p>
                                    <p style={{ fontSize: FontSizes.size16, fontWeight:FontWeights.semilight}}>{topic.body}</p>
                                </div>
                        
                                {this.renderImage(topic)}  
                                {this.renderModal(topic.id)}
                            
                                <div className="topic_buttons_container">
                                    <DefaultButton text="Like" disabled={true}/> 
                                    <DefaultButton text="Dislike" disabled={true}/> 
                                    <DefaultButton text="Comment" disabled={true}/> 
                                    <DefaultButton text="Share" disabled={true}/> 
                                    {this.renderEditButton(topic.creatorID, topic.id)}
                                    {this.renderDeleteButton(topic.creatorID)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="timeline_end_container">
                        <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>You are all caught up for now</p>
                    </div>
                </div>
            )
    }
    render(){
        
        return(
            <div>
                {this.renderTopic()}
                {this.renderEditMode()}
            </div>
        )
    }
}

export default TopicComponent
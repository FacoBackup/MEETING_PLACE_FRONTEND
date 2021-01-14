import React from 'react';
import "../../../style/topics/TopicCreationStyle.css"
import { DefaultButton,Modal, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Cookies from 'universal-cookie';
import DeleteTopic from '../../../functions/topics/DeleteTopic'
import UpdateTopic from '../../../functions/topics/UpdateTopic'


class TopicBoxComponent extends React.Component{
    constructor(params){
        super()
        this.state={
            topic: params.topic,
            editMode: false,
            headerInput: null,
            bodyInput: null,
            deleteModal: false,
        }
        this.updateTopic = this.updateTopic.bind(this)
        this.deleteTopic = this.deleteTopic.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.renderDeleteButton = this.renderDeleteButton.bind(this)
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

    async deleteTopic(topicID){
        await DeleteTopic(topicID);
    
        window.location.reload()
    }

    async updateTopic(topicID){
        
        await UpdateTopic(topicID, this.state.headerInput, this.state.bodyInput);
        this.setState({
            editMode: false
        })
        window.location.reload()
        
    }

    renderEditButton(creator){
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
    renderEditMode(){
       

        if(this.state.editMode === true)
            return(
                <div>  
                    <div className="topic_container"> 
                        <div className="topic_creator_persona_container">
                        <Persona
                            {...{
                                imageUrl: (typeof this.state.topic.communityImageURL !== 'undefined')? this.state.topic.communityImageURL  : (typeof this.state.topic.creatorImageURL !== 'undefined')? this.state.topic.creatorImageURL: null ,
                                text: (typeof this.state.topic.communityName !== 'undefined')? this.state.topic.communityName  : this.state.topic.creatorName,
                                secondaryText: this.state.topic.creatorID,
                            }}
                            size={PersonaSize.size56}
                            imageAlt="Subject"
                        />
                            
                            <p style={{ fontSize: FontSizes.size14, fontWeight:FontWeights.regular, color:"#3b3a39"}}>Created on: {(new Date(this.state.topic.creationDate)).toLocaleString()}</p>
                        </div>
                        <div className="topic_fields_container">
                            <TextField defaultValue={this.state.topic.header} label="New Title" multiline name="headerInput" onChange={this.handleChange}/>
                            <TextField defaultValue={this.state.topic.body} label="New Body" multiline name="bodyInput" onChange={this.handleChange}/>
                            
                        </div>
                
                        {this.renderImage(this.state.topic)}  
                        
                    
                        <div className="topic_buttons_container">
                            
                            <DefaultButton text="Cancel" onClick={() =>
                                this.setState({
                                    editMode: false
                                })
                            }/>
                            <PrimaryButton text="Save Changes" onClick={() => this.updateTopic(this.state.topic.id)}/>
                        </div>
                    </div>
                </div>
            )
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }
   
    render(){
        return(
            <>
                {this.renderEditMode()}
                <div className="topic_container"> 
                    <div className="topic_creator_persona_container">
                        <Persona
                            {...{
                                imageUrl: (typeof this.state.topic.communityImageURL !== 'undefined')? this.state.topic.communityImageURL  : (typeof this.state.topic.creatorImageURL !== 'undefined')? this.state.topic.creatorImageURL: null ,
                                text: (typeof this.state.topic.communityName !== 'undefined')? this.state.topic.communityName  : this.state.topic.creatorName,
                                secondaryText: this.state.topic.creatorID,
                            }}
                            size={PersonaSize.size56}
                            imageAlt="Subject"
                        />
                        
                        <p style={{ fontSize: FontSizes.size14, fontWeight:FontWeights.regular, color:"#3b3a39"}}>Created on: {(new Date(this.state.topic.creationDate)).toLocaleString()}</p>
                    </div>
                    <div className="topic_fields_container">
                        <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>{this.state.topic.header}</p>
                        <p style={{ fontSize: FontSizes.size16, fontWeight:FontWeights.semilight}}>{this.state.topic.body}</p>
                    </div>
                    {this.renderModal(this.state.topic.id)}
                    {this.renderImage(this.state.topic)}  
                    <div className="topic_buttons_container">
                        <DefaultButton text="Like" disabled={true}/> 
                        <DefaultButton text="Dislike" disabled={true}/> 
                        <DefaultButton text="Comment" disabled={true}/> 
                        <DefaultButton text="Share" disabled={true}/> 
                        {this.renderEditButton(this.state.topic.creatorID)}
                        {this.renderDeleteButton(this.state.topic.creatorID)}
                    </div>
                </div>
            </>
        )
    }
}

export default TopicBoxComponent
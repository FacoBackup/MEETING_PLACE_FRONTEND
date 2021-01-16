import React from 'react';
import "../../../style/topics/TopicCreationStyle.css"
import { DefaultButton,Modal, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Cookies from 'universal-cookie';
import DeleteTopic from '../../../functions/topics/DeleteTopic'
import UpdateTopic from '../../../functions/topics/UpdateTopic'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import ArchiveIcon from '@material-ui/icons/Archive';
import EditIcon from '@material-ui/icons/Edit';
import Avatar from '@material-ui/core/Avatar'
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
                
                <Button onClick={() => this.setState({ editMode: true})}><EditIcon/>Edit</Button>
                
            )
        }
    }
    renderDeleteButton(creator){
        
        if(creator === (new Cookies()).get("ID"))
            return(
                <Button onClick={() => this.setState({ deleteModal: true})}><DeleteIcon/>Delete</Button>
            )
    }
    renderEditMode(){
       

        if(this.state.editMode === true)
            return(
                <div>  
                    <div className="topic_container"> 
                        <div className="topic_creator_persona_container">
                        <Avatar
                            style={{ margin:'auto',height: '85px', width: '85px' }}
                            src = {(typeof this.state.topic.communityImageURL !== 'undefined')? this.state.topic.communityImageURL  : (typeof this.state.topic.creatorImageURL !== 'undefined')? this.state.topic.creatorImageURL: null }
                            alt="user"
                        />
                        <p>{(typeof this.state.topic.communityName !== 'undefined')? this.state.topic.communityName  : this.state.topic.creatorName} {this.state.topic.creatorID}</p>                                    
                        {/* <Persona
                            {...{
                                imageUrl: (typeof this.state.topic.communityImageURL !== 'undefined')? this.state.topic.communityImageURL  : (typeof this.state.topic.creatorImageURL !== 'undefined')? this.state.topic.creatorImageURL: null ,
                                text: (typeof this.state.topic.communityName !== 'undefined')? this.state.topic.communityName  : this.state.topic.creatorName,
                                secondaryText: this.state.topic.creatorID,
                            }}
                            size={PersonaSize.size56}
                            imageAlt="Subject"
                        /> */}
                            
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
            <div className="profile_topics_container">
                {this.renderEditMode()}
                
                <div className="topic_container"> 
                    <div className="topic_creator_persona_container">
                        {/* <Persona
                            {...{
                                imageUrl: (typeof this.state.topic.communityImageURL !== 'undefined')? this.state.topic.communityImageURL  : (typeof this.state.topic.creatorImageURL !== 'undefined')? this.state.topic.creatorImageURL: null ,
                                text: (typeof this.state.topic.communityName !== 'undefined')? this.state.topic.communityName  : this.state.topic.creatorName,
                                secondaryText: this.state.topic.creatorID,
                            }}
                            size={PersonaSize.size56}
                            imageAlt="Subject"
                        /> */}
                        <Avatar
                            style={{ marginRight:'1vw',height: '85px', width: '85px' }}
                            src = {(typeof this.state.topic.communityImageURL !== 'undefined')? this.state.topic.communityImageURL  : (typeof this.state.topic.creatorImageURL !== 'undefined')? this.state.topic.creatorImageURL: null }
                            alt="user"
                        />
                        <h4 style={{fontWeight:'500'}}>{(typeof this.state.topic.communityName !== 'undefined')? this.state.topic.communityName  : this.state.topic.creatorName}</h4>                                    
                        <h5 style={{fontWeight:'500', color:'#aaadb1'}}>Created on: {(new Date(this.state.topic.creationDate)).toLocaleString()}</h5>
                    </div>
                    <div className="topic_fields_container">
                        <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>{this.state.topic.header}</p>
                        <p style={{ fontSize: FontSizes.size16, fontWeight:FontWeights.semilight}}>{this.state.topic.body}</p>
                    </div>
                    {this.renderModal(this.state.topic.id)}
                    {this.renderImage(this.state.topic)}  
                    <div className="topic_buttons_container">
                        <ButtonGroup size="large" variant="text">
                            <Button> <ThumbUpIcon/>0</Button>
                            <Button> <ThumbDownAltIcon/>0</Button>
                            <Button> <ChatBubbleIcon/>0</Button>
                            <Button> <ArchiveIcon/>Archive</Button>
                            {this.renderEditButton(this.state.topic.creatorID)}
                            {this.renderDeleteButton(this.state.topic.creatorID)}
                            
                        </ButtonGroup>
                        {/* <DefaultButton text="Like" disabled={true}/> 
                        <DefaultButton text="Dislike" disabled={true}/> 
                        <DefaultButton text="Comment" disabled={true}/> 
                        <DefaultButton text="Share" disabled={true}/>  */}
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default TopicBoxComponent
import React from 'react';
import "../../../style/topics/TopicCreationStyle.css"
// import { DefaultButton,Modal, PrimaryButton } from 'office-ui-fabric-react';
// import { FontSizes, FontWeights } from '@fluentui/theme';
// import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
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
import TextField from '@material-ui/core/TextField'
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });


class TopicBoxComponent extends React.Component{
    constructor(params){
        super()
        this.state={
            topic: params.topic,
            editMode: false,
            headerInput: null,
            bodyInput: null,
            
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
                <Button onClick={() => this.deleteTopic(this.state.topic.id)}><DeleteIcon/>Delete</Button>
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
                            <h4 style={{fontWeight:'500'}}>{(typeof this.state.topic.communityName !== 'undefined')? this.state.topic.communityName  : this.state.topic.creatorName}</h4>                                    
                            <h5 style={{fontWeight:'500', color:'#aaadb1'}}>Created on: {(new Date(this.state.topic.creationDate)).toLocaleString()}</h5>
                          
                        </div>
                        <div className="topic_fields_container">
                            
                            <TextField 
                                style={{
                                    backgroundColor:'#303741',
                                    borderRadius:'2px'
                                }}
                                InputProps={{
                                    style:{
                                        color:'white'
                                    }
                                }}
                                defaultValue={this.state.topic.header} 
                                multiline name="headerInput" 
                                variant="outlined" 
                                onChange={this.handleChange}/>
                            <TextField
                                 style={{
                                    backgroundColor:'#303741',
                                    borderRadius:'2px'
                                }}
                                InputProps={{
                                    style:{
                                        color:'white'
                                    }
                                }}
                                defaultValue={this.state.topic.body} 
                                multiline name="bodyInput"
                                variant="outlined" 
                                onChange={this.handleChange}/>
                            
                        </div>
                
                        {this.renderImage(this.state.topic)}  
                        
                    
                        <div className="topic_buttons_container">
                            
                            <Button 
                                variant="contained" color="default"
                                disableElevation
                                onClick={() =>
                                    this.setState({
                                        editMode: false
                                    })   
                                }
                                style={{marginRight:'5vw'}}
                            >Cancel</Button> 

                            <Button variant="contained" disableElevation color="primary" onClick={() => this.updateTopic(this.state.topic.id)}>Save Changes</Button>
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
    renderTopic(){
        if(this.state.editMode === false)
            return(
                <div className="profile_topics_container">   
                <div className="topic_container"> 
                    <div className="topic_creator_persona_container">
                    
                        <Avatar
                            style={{ marginRight:'1vw',height: '85px', width: '85px' }}
                            src = {(typeof this.state.topic.communityImageURL !== 'undefined')? this.state.topic.communityImageURL  : (typeof this.state.topic.creatorImageURL !== 'undefined')? this.state.topic.creatorImageURL: null }
                            alt="user"
                        />
                        <h4 style={{fontWeight:'500'}}>{(typeof this.state.topic.communityName !== 'undefined')? this.state.topic.communityName  : this.state.topic.creatorName}</h4>                                    
                        <h5 style={{fontWeight:'500', color:'#aaadb1'}}>Created on: {(new Date(this.state.topic.creationDate)).toLocaleString()}</h5>
                    </div>
                    <div className="topic_fields_container">
                        
                        <h3 style={{fontWeight:'600'}}>{this.state.topic.header}</h3>
                        <h4 style={{fontWeight:'500', color:'#aaadb1'}}>{this.state.topic.body}</h4>
                      
                    </div>
                    
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
                    </div>
                </div>
            </div>
            )
    }
    render(){
        return(
            <>
                {this.renderEditMode()}
                {this.renderTopic()}
            </>
        )
    }
}

export default TopicBoxComponent
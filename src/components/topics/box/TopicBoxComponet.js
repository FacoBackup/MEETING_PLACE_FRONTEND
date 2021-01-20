import React from 'react';
import "../../../style/topics/TopicCreationStyle.css"

import Cookies from 'universal-cookie';
import DeleteTopic from '../../../functions/topics/DeleteTopic'
import UpdateTopic from '../../../functions/topics/UpdateTopic'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ThumbUpIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAltRounded';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import ArchiveIcon from '@material-ui/icons/ArchiveRounded';
import EditIcon from '@material-ui/icons/Edit';
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Host from '../../../Host'
class TopicBoxComponent extends React.Component{
    constructor(params){
        super()
        this.state={
            topic: params.topic,
            editMode: false,
            headerInput: null,
            bodyInput: null,
            liked: params.topic.liked,
            disliked: params.topic.disliked,
            archived: params.topic.archived,
            fetchedLike: false,
            fetchedDislike: false
        }
        this.updateTopic = this.updateTopic.bind(this)
        this.deleteTopic = this.deleteTopic.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.renderDeleteButton = this.renderDeleteButton.bind(this)
    }
    
   

    //UPDATES
    async deleteTopic(topicID){
        try{
            await DeleteTopic(topicID);
            window.location.reload()
        }catch(error){
            console.log(error)
        }
        
    }

    async updateTopic(topicID){
        try{
            await UpdateTopic(topicID, this.state.headerInput, this.state.bodyInput);
            this.setState({
                editMode: false
            })
            window.location.reload()
        }catch(error){
            console.log(error)
        }
    }

    async likeTopic(topicID){
        try{
            this.setState({
                liked: this.state.liked === true? false : true,
                disliked:false
            })
            await axios({
                method: 'put',
                url: Host()+'api/like',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                data:{
                    topicID: topicID
                }
            }).then(res => {
                console.log(res)
                this.setState({
                    fetchedLike: true
                })
            })
            .catch(error => console.log(error))
        }catch(error){
            console.log(error)
        }
    }

    async dislikeTopic(topicID){
        try{
            this.setState({
                disliked: !this.state.disliked,
                liked:false
            })
            await axios({
                method: 'put',
                url: Host()+'api/dislike',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                data:{
                    topicID: topicID
                }
            }).catch(error => {
                console.log(error)
                this.setState({
                    fetchedDislike: true
                })
            })
        }catch(error){
            console.log(error)
        }
    }

    async archiveTopic(topicID){
        try{
            this.setState({
                archived: this.state.archived === true? false : true
            })
            await axios({
                method: 'put',
                url: Host()+'api/archive/topic',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                data:{
                    topicID: topicID
                }
            }).then(res => console.log(res))
            .catch(error => console.log(error))
        }catch(error){
            console.log(error)
        }
    }
    //UPDATES

    //RENDER
    renderImage(topic){
        if(typeof topic.imageURL !== 'undefined')
            return(
                <div className="topic_image_container">
                    <img style={{borderRadius:'8px', width:'100%', height: '100%'}}alt="Topic" src={topic.imageURL}/>
                </div>
            )
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
                <Button style={{backgroundColor: 'red', color:'white'}} disableElevation variant="contained" onClick={() => this.deleteTopic(this.state.topic.id)}><DeleteIcon/>Delete</Button>
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
    //RENDER


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
                            style={{ marginRight:'1vw',height: '75px', width: '75px' }}
                            src = {(typeof this.state.topic.communityImageURL !== 'undefined')? this.state.topic.communityImageURL  : (typeof this.state.topic.creatorImageURL !== 'undefined')? this.state.topic.creatorImageURL: null }
                            alt="user"
                        />
                        <h4 style={{fontWeight:'450', fontSize:'18px', textTransform: 'capitalize'}}>{(typeof this.state.topic.communityName !== 'undefined')? this.state.topic.communityName  : this.state.topic.creatorName}</h4>                                    
                        <h5 style={{fontWeight:'500', color:'#aaadb1'}}>Created on: {(new Date(this.state.topic.creationDate)).toLocaleString()}</h5>
                    </div>
                    <div className="topic_fields_container">
                        
                        <h3 style={{fontWeight:'500'}}>{this.state.topic.header}</h3>
                        <h4 style={{fontWeight:'500', color:'#aaadb1'}}>{this.state.topic.body}</h4>
                      
                    </div>
                    
                    {this.renderImage(this.state.topic)}  
                    <div className="topic_buttons_container">
                    
                        <Button  style={{color:(this.state.liked === true ?  "#39adf6": "white"),display:'flex', justifyContent:'space-between', alignItems:'center', alignContent:'center'}} 
                            onClick={() => this.likeTopic(this.state.topic.id)}>     
                            <ThumbUpIcon/>

                        </Button>
                        
                        <Button 
                            style={{color:(this.state.disliked === true ? "red": "white"),display:'flex', justifyContent:'space-between', alignItems:'center', alignContent:'center'}} 
                            onClick={() => this.dislikeTopic(this.state.topic.id)}> 
                                <ThumbDownAltIcon/>
                            </Button>
                        <Button style={{display:'flex', justifyContent:'space-between', alignItems:'center', alignContent:'center'}}> <ChatBubbleIcon/>{this.state.topic.comments}</Button>

                        <Button style={{color: (this.state.archived === true ? "#39adf6": "white")}} 
                            onClick={() => this.archiveTopic(this.state.topic.id)}>
                                <ArchiveIcon/>
                            </Button>

                        {this.renderEditButton(this.state.topic.creatorID)}
                        {this.renderDeleteButton(this.state.topic.creatorID)}
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
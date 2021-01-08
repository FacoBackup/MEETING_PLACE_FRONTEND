import React from 'react';
import "./TopicCreationStyle.css"
import { DefaultButton,Modal, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import axios from 'axios';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import CommunitySearchComponent from '../community/CommunitySearchComponent'
import Host from '../../Host'

class TopicCreation extends React.Component{
    constructor(params){
        super(params)
        this.state={
            title:'',
            body:'',
            token: params.token,
            imageURL: null,
            communityID: null,
            openModal: false,
            imageModal: false,
            communityModal: false
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
            url: Host()+'api/topic',
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
            if(typeof res.response.status !== 'undefined' && res.response.status === 201)
                window.location.reload()
        })
        .catch(error => console.log(error))
    }

    imageRender(){
        if(this.state.imageURL !== null)
            return(
                <div style={{display:'flex', justifyContent:'center'}}>
                    <img style={{margin:'auto',width:'70%', borderRadius:'8px'}} alt="topic" src={this.state.imageURL}/>
                </div>
                
            )
    }

    modalRender(){
        console.log("STATE -> " + JSON.stringify(this.state.imageModal))
        if(this.state.imageModal === true)
           return(
                <Modal
                // titleAriaId={"TESTE"}
                isOpen={true}
                onDismiss={true}
                isBlocking={false}
                
                containerClassName={"contentStyles.container"}
                >
                    <div className='modal_container'>
                        <div className="modal_title_component">
                            <h2 >Upload an image for your topic</h2>
                        </div>
                        <div className="modal_top_component">
                            <input type="file" name="file"  onChange={event => this.getFile(event.target.files)}/>
                        </div>
                        <div className="modal_middle_component" >
                            {this.imageRender()}
                        </div>
                        <div className="modal_bottom_component" style={{display:'flex', justifyContent:'space-between', }}>
                            <DefaultButton text="Cancel" onClick={()=> this.setState({
                                imageModal: false,
                                communityModal:false,
                                openModal:false,
                                imageURL: null
                            })}/>
                            
                            <PrimaryButton text="Choose"/>
                        </div>
                    </div>
                </Modal>
           )

           else if(this.state.communityModal === true && this.state.imageModal === false)
            return(
                    <Modal
                    titleAriaId={"TESTE"}
                    isOpen={true}
                    onDismiss={true}
                    isBlocking={false}
                    //dragOptions={true}
                    containerClassName={"contentStyles.container"}
                    >
                        <div className='modal_container'>
                            <div className="modal_title_component">
                                <h2 >Post your topic in a community</h2>
                            </div>
                            <div className="modal_top_component" >
                                <CommunitySearchComponent token ={this.state.token}/>
                            </div>
                            <div className="modal_bottom_component" style={{display:'flex', justifyContent:'space-between', }}>
                                <DefaultButton text="Cancel" onClick={()=> this.setState({
                                    imageModal: false,
                                    communityModal:false,
                                    openModal:false,
                                    imageURL: null
                                })}/>
                                
                                <PrimaryButton text="Choose"/>
                            </div>
                        </div>
                    </Modal>
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
                    
                        <DefaultButton text="To Community" onClick={() => this.setState({
                            openModal: true,
                            imageModal:false,
                            communityModal:true
                        })}/> 
            
                        <Toggle label="Visibility" defaultChecked onText="Only Fans" offText="Public"/>
                        <DefaultButton text="Upload Image" onClick={() => this.setState({
                            openModal: true,
                            imageModal:true,
                            communityModal:false
                        })}/> 
                        {this.modalRender()}
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
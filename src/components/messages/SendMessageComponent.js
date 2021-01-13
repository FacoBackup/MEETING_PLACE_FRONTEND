import React from 'react';
import "../../style/messages/MessagesStyle.css";
import { FontSizes, FontWeights } from '@fluentui/theme';

import { DefaultButton, Modal, PrimaryButton } from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import axios from 'axios';
import Host from '../../Host'

import Cookies from 'universal-cookie';


class SendMessageComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            isGroup: params.isGroup,
            imageURL: null, 
            subjectID: params.subjectID,
            messageInput: ''
        }
        this.SendMessage = this.SendMessage.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        this.setState({
            messageInput: event.target.value
        })
    }

    async SendMessage() {
        alert(this.state.subjectID)
        await axios({
            method: 'post',
            url: (this.state.isGroup === true) ? Host()+ 'api/message/group': Host()+ 'api/message/user',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                message: this.state.messageInput,
                imageURL: this.state.imageURL,
                receiverID: this.state.isGroup === true ? null: this.state.subjectID,
                isGroup: this.state.isGroup,
                conversationID: this.state.isGroup === true ? this.state.subjectID: ""
            }
        })
        .then(()=>{
            this.setState({
                imageURL: null
            })
        })
        .catch(error => {
            console.log(error);
        });       
    }
    renderImageModal(){
        if(this.state.imageURL !== null){
            return(
                <div style={{display:'flex', justifyContent:'center'}}>
                    <img style={{margin:'auto',width:'70%', borderRadius:'8px'}} alt="message" src={this.state.imageURL}/>
                </div>
                
            ) 
        }
    }

    getFile(event) {
        
        this.setState({
            imageURL: null
        })
        
        let reader = new FileReader();
      
        if (!event[0].name.match(/.(jpg|jpeg|png|gif)$/i)){
            alert('not an image')
            this.setState({
                imageURL: null
            })
        }
        else{
            reader.readAsDataURL(event[0]);
            reader.onload =() =>{
                this.setState({
                    imageURL: reader.result
                })
              }
        }
    }
    
    renderModal(){
        if(this.state.imageModal === true){
            return(
                <Modal
                titleAriaId={"TESTE"}
                isOpen={true}
                onDismiss={true}
                isBlocking={false}
                
                containerClassName={"contentStyles.container"}
                >
                    <div className='modal_container' >
                        <div className="modal_title_component">
                            <h2 >Upload an image for your message</h2>
                        </div>
                        <div className="modal_top_component" style={{display:'flex', justifyContent:'center'}}>
                            <input type="file"  name="file"  onChange={event => this.getFile(event.target.files)}/>
                        </div>
                        <div className="modal_middle_component" >
                            {this.renderImageModal()}
                        </div>
                        <div className="modal_bottom_component" style={{display:'flex', justifyContent:'space-between'}}>
                            {this.state.imageURL === null ? 
                            <DefaultButton text="Cancel" onClick={()=> this.setState({
                                imageModal: false
                            })}/> : 
                            <DefaultButton text="Remove Image" onClick={()=> this.setState({
                                imageURL: null
                            })}/>    
                        }
                            
                            <PrimaryButton text="Choose" onClick={()=> this.setState({
                                imageModal: false,
                                communityModal:false,
                                openModal:false
                            })}/>
                        </div>
                    </div>
                </Modal>
           )

        }
    }
    renderSelectedImage(){
        if(this.state.imageURL !== null)
            return(
                <div style={{display:'grid', alignContent:'center', paddingLeft:'.3vw', paddingRight:'.3vw'}}>
                    <img style={{margin:'auto',width:'100px', borderRadius:'8px'}} alt="message" src={this.state.imageURL}/>
                </div>  
            ) 
    }
    render(){
        return(
            <div className="message_input_container" >
                <div className="message_input_box">
                    <TextField  placeholder="Message" multiline autoAdjustHeight  resetValue={(this.state.messageInput === null)}  onChange={this.handleChange} />                       
                </div>
                
                {this.renderSelectedImage()}  
                <div className="message_input_buttons">
                    <PrimaryButton text="Send" style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }}onClick={() => this.SendMessage()}/>      
                    <DefaultButton style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} text="Upload Image" onClick={()=> 
                    this.setState({
                        imageModal: true
                    })
                    }/>
                </div>    
            </div>
        )
    }
    
}

export default SendMessageComponent
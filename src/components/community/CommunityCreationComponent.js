import { Redirect } from "react-router-dom"
import axios from 'axios';
import { DefaultButton,Modal, Persona,PersonaSize, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import "./CommunityCreationComponentStyle.css"
import React from 'react'
import CommunitySearchComponent from '../community/CommunitySearchComponent'
import Host from '../../Host'

class CommunityCreationComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            token: params.token,
            name: '',
            about:'',
            imageURL: null,
            relatedCommunity:{},
            created: false,
            openModal: false,
            imageModal: false,
            date:new Date(),
            communityModal: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.createCommunity = this.createCommunity.bind(this)
    }

    componentDidMount(){
        
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
        
    }
    
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        const parsedCommunity = (sessionStorage.getItem("SELECTED_COMMUNITY") !== null) ? JSON.parse(sessionStorage.getItem("SELECTED_COMMUNITY")): null
        if(typeof this.state.relatedCommunity.communityID === 'undefined')
            this.setState({
                date: new Date(),
                relatedCommunity: (parsedCommunity !== null) ? parsedCommunity: this.state.relatedCommunity,
            },() => console.log("related COMMUNITY -------------------------> " + JSON.stringify(this.state.relatedCommunity)));

        if(typeof this.state.relatedCommunity.communityID !== 'undefined'){
            sessionStorage.removeItem("SELECTED_COMMUNITY")
            this.setState({
        
                communityModal:false,
        
            })
        }
            
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async createCommunity(){
        console.log(this.state.token)
        await axios({
            method: 'post',
            url: Host()+'api/community',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data:{
                about : this.state.about,
                name : this.state.name,
                relatedCommunityID: this.state.relatedCommunity.communityID !== 'undefined' ? this.state.relatedCommunity.communityID: null ,
                imageURL: this.state.imageURL
            }
        }).then(()=>{
            this.setState({
                created: true
            })
        })
        .catch(error => console.log(error))
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
    imageRender(){
        if(this.state.imageURL !== null)
            return(
                <div>
                    <h5 style={{textAlign:'center'}}>Selected Image</h5>
                    <div style={{display:'flex', justifyContent:'center'}}>
                    
                    <img style={{margin:'auto',width:'70%', borderRadius:'8px'}} alt="topic" src={this.state.imageURL}/>
                </div>
                </div>
                
                
            )
    }
    renderSelectedCommunity(){
        if(typeof this.state.relatedCommunity.communityID !== 'undefined')
            return(
                <div>
                    <h5 style={{textAlign:'center'}}>Selected Community</h5>
                    <div className="personas_container">
                    
                       <Persona
                            {...{
                                imageUrl: (this.state.relatedCommunity.imageURL === null) ?  this.state.relatedCommunity.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                text: this.state.relatedCommunity.name,
                                secondaryText: this.state.relatedCommunity.role
                            }}
                            size={PersonaSize.size48}
                            imageAlt="Community picture"
                            />
                    </div>
                </div>
                
            )
    }
    modalRender(){
    
        if(this.state.imageModal === true  && this.state.communityModal === false)
           return(
                <Modal
                titleAriaId={"TESTE"}
                isOpen={true}
                onDismiss={true}
                isBlocking={false}
                
                
                >
                    <div className='modal_container'>
                        <div className="modal_title_component">
                            <h2 >Upload an pic for your new community</h2>
                        </div>
                        <div className="modal_top_component" style={{display:'flex', justifyContent:'center'}}>
                            <input type="file" name="file"  onChange={event => this.getFile(event.target.files)}/>
                        </div>
                        <div className="modal_middle_component" >
                            {this.imageRender()}
                        </div>
                        <div className="modal_bottom_component" style={{display:'flex', justifyContent:'space-between'}}>
                            {this.state.imageURL === null ? 
                            <DefaultButton text="Cancel" onClick={()=> this.setState({
                                imageModal: false,
                                communityModal:false,
                                openModal:false,
                              
                            })}/> : 
                            <DefaultButton text="Remove Image" onClick={()=> this.setState({
                                imageModal: false,
                                communityModal:false,
                                openModal:false,
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

           else if(this.state.communityModal === true && this.state.imageModal === false)
            return(
                    <Modal
                    titleAriaId={"TESTE"}
                    isOpen={true}
                    onDismiss={true}
                    isBlocking={false}
                    
                    >
                        <div className='modal_container'>
                            <div className="modal_title_component">
                                <h2 >Link your community to another one</h2>
                                <p >The members of this community will apear in the main community too.</p>
                                <p >You have to be a moderator in the main community to be able to link the two.</p>
                            </div>
                            <div className="modal_top_component" >
                                <CommunitySearchComponent token ={this.state.token} isModal={true}/>
                            </div>
                            <div className="modal_bottom_component" style={{margin:'auto'}}>
                                <DefaultButton text="Cancel" onClick={()=> this.setState({
                                    imageModal: false,
                                    communityModal:false,
                                    openModal:false,
                                    imageURL: null
                                })}/>
                            </div>
                        </div>
                    </Modal>
            )
    }

    render(){
        if(this.state.created === false)
            return(
                <div>
                    <div className="community_creation_component">
                        <div className="community_creation_title">
                            <p style={{ fontSize: FontSizes.size20, fontWeight:FontWeights.regular }}>Create Your Own Community</p>
                        </div>
                        <div className="community_creation_fields">
                            <TextField placeholder="Name" name='name' onChange={this.handleChange}/>
                            <TextField placeholder="About This Community" name='about' onChange={this.handleChange}/>
                            {typeof this.state.relatedCommunity.communityID === 'undefined' ? 
                            <div> 
                                {this.imageRender()}
                                {this.renderSelectedCommunity()}
                            </div>:
                             <div> 
                                {this.renderSelectedCommunity()}
                                {this.imageRender()}
                            </div>
                            }
                        </div>
                        <div className="community_creation_buttons">
                            {this.modalRender()}
                            {(typeof this.state.relatedCommunity.communityID === 'undefined') ? 
                            <DefaultButton text="Related Community" onClick={() => this.setState({
                     
                                imageModal:false,
                                communityModal:true
                            })}/>: 
                            <DefaultButton text="Remove Community" onClick={() => this.setState({
                                relatedCommunity: {}
                            })}/> 
                            }
                            {this.state.imageURL === null ? 
                                <DefaultButton text="Upload Image" onClick={() => this.setState({

                                    imageModal:true,
                                    communityModal:false
                                })}/> : 
                                <DefaultButton text="Remove Image" onClick={() => this.setState({
                                    imageURL: null
                                })}/>        
                        }                    
                            <PrimaryButton text="Create" onClick={this.createCommunity}/>
                        </div>
                    </div>
                </div>
            )
        else{
            alert("Created With Success")
            return(
                <Redirect to={'/'}/>
            )        
        }
    
    }
}

export default CommunityCreationComponent
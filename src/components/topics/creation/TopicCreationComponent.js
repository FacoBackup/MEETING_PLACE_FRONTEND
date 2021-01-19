import React from 'react';
import "../../../style/topics/TopicCreationStyle.css"
import { DefaultButton,Modal, PrimaryButton, Persona,PersonaSize } from 'office-ui-fabric-react';

import TextField from '@material-ui/core/TextField'
import axios from 'axios';

import CommunitySearchComponent from '../../search/community/CommunitySearchComponent'
import Host from '../../../Host'
import Button from '@material-ui/core/Button';

class TopicCreationComponent extends React.Component{
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
            communityModal: false,
            date: new Date(),
            selectedCommunity: {}
        }
        
        this.handleChange = this.handleChange.bind(this)
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
        if(typeof this.state.selectedCommunity.communityID === 'undefined')
            this.setState({
                date: new Date(),
                selectedCommunity: (parsedCommunity !== null) ? parsedCommunity: this.state.selectedCommunity,
            },() => console.log("PARENT COMMUNITY -------------------------> " + JSON.stringify(this.state.selectedCommunity)));

        if(typeof this.state.selectedCommunity.communityID !== 'undefined'){
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

    getFile(event) {
        
        this.setState({
            imageURL: null
        })
        
        let reader = new FileReader();
      
        if (!event[0].name.match(/.(jpg|jpeg|png|gif|webp)$/i)){
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
    
    async createTopic(){
        await axios({
            method: 'post',
            url: Host()+'api/topic',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data:{
                header: this.state.title,
                body: this.state.body,
                imageURL: this.state.imageURL,
                communityID: this.state.selectedCommunity.communityID,
                mainTopicID: null
            }
        }).then(()=>{
            alert("Created With Success")
            
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

    renderSelectedCommunity(){
        if(typeof this.state.selectedCommunity.communityID !== 'undefined')
            return(
                <div style={{marginTop:'1vh'}}>
                    <h5 style={{textAlign:'center'}}>Selected Community</h5>
                    <div className="personas_container">
                    
                       <Persona
                            {...{
                                imageUrl: (typeof this.state.selectedCommunity.imageURL !== "undefined") ?  this.state.selectedCommunity.imageURL : null,
                                text: this.state.selectedCommunity.name,
                                secondaryText: this.state.selectedCommunity.role
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
                
                containerClassName={"contentStyles.container"}
                >
                    <div className='modal_container' >
                        <div className="modal_title_component">
                            <h2 >Upload an image for your topic</h2>
                        </div>
                        <div className="modal_top_component" style={{display:'flex', justifyContent:'center'}}>
                            <input type="file"  name="file"  onChange={event => this.getFile(event.target.files)}/>
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
                    //dragOptions={true}
                    containerClassName={"contentStyles.container"}
                    >
                        <div className='modal_container' >
                            <div className="modal_title_component">
                                <h2 >Post your topic in a community</h2>
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
        return(
            
            
                <div className="topic_creation_container" >
                        {this.modalRender()}
                    <div className="topic_creation_title">
                        <h3>Express Yourself</h3>
                    </div>
                    <div  className="topic_creation_top_buttons">
                        
                        <Button
                            variant="contained"
                            color="default"
                            disableElevation
                            onClick={() => 
                                this.setState({
                                    openModal: true,
                                    imageModal:false,
                                    communityModal:true
                                })}>
                            Community
                        </Button>
                        
                        {/* <Toggle label="Visibility" defaultChecked onText="Only Fans" offText="Public"/> */}
                        <input  id="contained-button-file" type="file" style={{display:'none'}} onChange={event => this.getFile(event.target.files)}/>
                        <label htmlFor="contained-button-file">
                            
                            <Button 
                            component="span"
                                variant="contained"
                                color="default"
                                disableElevation
                            >  
                            
                             Upload image   
                            </Button>
                        </label>
                    
                    </div>
                    <div className="topic_creation_fields">
                        <TextField 
                            placeholder="Title" 
                            multiline 
                            
                            variant ="outlined"
                            name='title' 
                            style={{
                                backgroundColor:'#303741',
                                borderRadius:'2px'
                            }}
                            InputProps={{
                                style:{
                                    color:'white'
                                }
                            }}
                            onChange={this.handleChange}/>
                        <TextField  
                            placeholder="Body"
                            multiline 
                            autoAdjustHeight 
                            variant ="outlined"
                            
                            style={{
                                backgroundColor:'#303741',
                                borderRadius:'2px'

                            }}
                            InputProps={{
                                style:{
                                    color:'white'
                                }
                            }}
                            name='body' 
                            onChange={this.handleChange}/>    
                        {typeof this.state.selectedCommunity.communityID === 'undefined' ? 
                            <div> 
                                <div style={{marginBottom:'1vh'}}> 
                                    {this.imageRender()}
                                </div>
                                
                                {this.renderSelectedCommunity()}
                            </div>:
                             <div> 
                                <div style={{marginBottom:'1vh'}}> 
                                    {this.renderSelectedCommunity()}    
                                </div>
                                
                                {this.imageRender()}
                            </div>
                            }
                    </div>
                    <div className="topic_creation_bottom_buttons">
                        <Button 
                         disableElevation 
                         style={{}} 
                         variant='contained' 
                         color="primary" 
                         onClick={() => this.createTopic()}>Create</Button>
                    </div>                   
                </div>
            
        );  
    }
        
    
       
}

export default TopicCreationComponent;
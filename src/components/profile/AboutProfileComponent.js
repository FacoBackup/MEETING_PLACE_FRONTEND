import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "./ProfileBarStyle.css";
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Dexie from "dexie";

class AboutProfile extends Component{
    constructor(params){
        super()
        this.state={
            profile: params.profile,
            imageURL: null,
            phoneNumber: '',
            backgroundImageURL: null,
            about: '',
            nationality: '',
            birthCity: '',
            multiline: false,
            editAbout: false,
            editPhone: false,
            editNationality: false,
            editBorn: false,
        }
    }
    componentDidMount(){
        this.fetchData()
    }

    async fetchData(){
        if(typeof (new Cookies()).get("JWT") !== 'undefined'){
            await axios({
                method: 'get',
                url: 'http://localhost:8080/api/user',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")}
            }).then(res=>{
                this.setState({
                    profile: res.data
                })
            })
            .catch()
        }         
    }


    getFile(event, name) {
        console.log(event)

        let reader = new FileReader();
        reader.readAsDataURL(event[0]);
        reader.onload =() =>{
          this.setState({
              [name]: reader.result
          })
        }
    }

    render(){
        
            return(
                <div>
                      <div >
                    {this.state.editAbout === true ? <TextField />: 
                    <div> 
                        <p>{this.state.profile.about}</p>
                        <DefaultButton text='Edit' onClick={() => this.setState({
                            editAbout: true,
                        })}/>
                    </div> }
                  
                    {this.state.editPhone === true ? <TextField />: 
                    <div> 
                        <p>{this.state.profile.phoneNumber}</p>
                        <DefaultButton text='Edit' onClick={() => this.setState({
                            editPhone: true,
                        })}/>
                    </div> }

                    {this.state.editBorn === true ? <TextField />: 
                    <div> 
                       <p>{this.state.profile.cityOfBirth}</p>
                        <DefaultButton text='Edit' onClick={() => this.setState({
                            editPhone: true,
                        })}/>
                    </div> }
                    
                    {this.state.editNationality === true ? <TextField />: 
                    <div> 
                        <p>{this.state.profile.nationality}</p>
                        <DefaultButton text='Edit' onClick={() => this.setState({
                            editNationality: true,
                        })}/>
                    </div> }
                    <p>Upload a new profile pic</p>
                    <input type="file" name="imageURL"  onChange={event => this.getFile(event.target.files, 'imageURL')}/>
                    <p>Upload a new profile background</p>
                    <input type="file" name="backgroundImageURL"  onChange={event => this.getFile(event.target.files,'backgroundImageURL' )}/>
                    </div>
                </div>
              
            );  
        
    }
 
       
}

export default ProfileBar;
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "./ProfileBarStyle.css";
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
// import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import Host from '../../Host'
import "./AboutProfileComponentStyle.css"

class AboutProfileComponent extends Component{
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
        this.handleChange = this.handleChange.bind(this)
    }
    componentDidMount(){
        this.fetchData()
    }
    handleChange (event)  {
        
        this.setState({
            [event.target.name]: event.target.value
        })
        event.preventDefault();
    }

    async fetchData(){
        if(typeof (new Cookies()).get("JWT") !== 'undefined'){
            await axios({
                method: 'get',
                url: Host()+'api/user',
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

    async submitChanges() {
        await axios({
            method: 'patch',
            url: Host()+'api/profile',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data:{
                about : this.state.about,
                nationality : this.state.nationality,
                city: this.state.birthCity,
                name: null,
                imageURL: this.state.imageURL,
                backgroundImageURL: this.state.backgroundImageURL
            }
        }).then(()=>{
            window.location.reload()
        })
        .catch()
    
    }
    render(){
        
            return(
                <div className="about_profile_component_container">
                    <div className="profile_fields_container">
                        <p>Upload a new profile background</p>
                        <input type="file" name="backgroundImageURL"  onChange={event => this.getFile(event.target.files,'backgroundImageURL' )}/>
                    </div>
                    <div className="profile_fields_container">
                        <p>Upload a new profile pic</p>
                        <input type="file" name="imageURL"  onChange={event => this.getFile(event.target.files, 'imageURL')}/>
                    </div>
                    {this.state.editAbout === true ? <TextField placeholder="About you" name="about" onChange={this.handleChange}/>: 
                    <div className="profile_fields_container"> 
                        <p>{(typeof this.state.profile.about !== 'undefined' &&this.state.profile.about !== null)? this.state.profile.about: "About You Here" }</p>
                        <DefaultButton text='Edit' onClick={() => this.setState({
                            editAbout: true,
                        })}/>
                    </div> }
                
                    {this.state.editPhone === true ? <TextField />: 
                    <div className="profile_fields_container"> 
                        <p>{(typeof this.state.profile.phoneNumber !== 'undefined' &&this.state.profile.phoneNumber !== null)? this.state.profile.phoneNumber: "Your Phone Number Here" }</p>
                        <DefaultButton text='Edit' onClick={() => this.setState({
                            editPhone: true,
                        })}/>
                    </div> }

                    {this.state.editBorn === true ? <TextField placeholder="Where you were born" />: 
                    <div className="profile_fields_container"> 
                    <p>{(typeof this.state.profile.cityOfBirth !== 'undefined' &&this.state.profile.cityOfBirth !== "")? this.state.profile.cityOfBirth: "Your City Of Birth Here" }</p>
                        <DefaultButton text='Edit' onClick={() => this.setState({
                            editPhone: true,
                        })}/>
                    </div> }
                    
                    {this.state.editNationality === true ? <TextField />: 
                    <div className="profile_fields_container"> 
                        <p>{(typeof this.state.profile.nationality !== 'undefined' &&this.state.profile.nationality !== "")? this.state.profile.nationality: "Your Nationality Here" }</p>
                        <DefaultButton text='Edit' onClick={() => this.setState({
                            editNationality: true,
                        })}/>
                    </div> }
                    <div className="save_changes_button_container">
                        <PrimaryButton text="Save Changes" onClick={() => this.submitChanges()}/>
                    </div>
                </div>
              
            );  
        
    }
 
       
}

export default AboutProfileComponent;
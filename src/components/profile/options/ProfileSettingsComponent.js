import React from  'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import axios from 'axios';
import Cookies from 'universal-cookie';
import Host from '../../../Host'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';

const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

class ProfileSettingsComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            profile : params.profile,
            about: params.profile.about, 
            phoneNumber: params.profile.phoneNumber,
            nationality: params.profile.nationality,
            privacy: null,
            name: params.profile.name,
            backgroundImage: params.profile.backgroundImageURL,
            pic: params.profile.imageURL
        }
        this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    
    async updateProfile(){
        try{
            await axios({
                method: 'put',
                url: Host()+'api/profile',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                data:{
                    name:this.state.name !== null ? this.state.name.toLowerCase(): this.state.name,
                    about: this.state.about,
                    nationality:this.state.nationality,
                    phoneNumber: this.state.phoneNumber,
                    backgroundImageURL: this.state.backgroundImage !== this.state.profile.backgroundImageURL ? this.state.backgroundImage : null,
                    imageURL: this.state.pic !== this.state.profile.pic ? this.state.pic : null
                }
            }).then(res=>{
                console.log(res)
                alert("Done")
                window.location.reload()
            })
            .catch(error => console.log(error))
        }catch(error){
            console.log(error)
        }
    }
    getFile(event, name) {
        
        this.setState({
            [name]: null,
          
        })
        
        let reader = new FileReader();
      
        if (!event[0].name.match(/.(jpg|jpeg|png|gif|webp)$/i)){
            alert('not an image')
        }
        else{
            reader.readAsDataURL(event[0]);
            reader.onload =() =>{
                this.setState({
                    [name]: reader.result
                })
              }
        }
    }
    
    render(){
        return (
            <div className="profile_settings_container">
                <ThemeProvider theme={theme}>
                    <div>
                        <p style={{marginLeft:'5px',fontSize:'17px',fontWeight:'400', textTransform:'capitalize', textAlign:'center'}}>Settings</p>
                    </div>
                    <div>
                        <TextField variant="outlined" multiline defaultValue={this.state.profile.name} style={{width:'30vw'}}  label="Name" name="name" onChange={this.handleChange}/>
                        
                    </div>
                    <div>
                        <TextField variant="outlined" multiline defaultValue={this.state.profile.about} style={{width:'30vw'}} label="About you" name="about" onChange={this.handleChange}/>
                        
                    </div>
                    <div>
                        <TextField variant="outlined" multiline defaultValue={this.state.profile.nationality} style={{width:'30vw'}} label="Your nationality" name="nationality" onChange={this.handleChange}/>
                        
                    </div>
                    <div>
                        <TextField variant="outlined" multiline defaultValue={this.state.profile.phoneNumber} style={{width:'30vw'}} label="Your Phone number" name="phoneNumber" onChange={this.handleChange}/>
                        
                    </div>
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <input  id="contained-button-file" type="file" style={{display:'none'}} onChange={event => this.getFile(event.target.files, "pic")}/>
                        <label htmlFor="contained-button-file">
                            
                            <Button 
                                component="span"
                                variant="contained"
                                color="default"
                                disableElevation
                            >  
                            
                            Pic 
                            </Button>
                        </label>
                        <input  id="contained-button-file-background" type="file" style={{display:'none'}} onChange={event => this.getFile(event.target.files, "backgroundImage")}/>
                        <label htmlFor="contained-button-file-background">
                            
                            <Button 
                                component="span"
                                variant="contained"
                                color="default"
                                disableElevation
                                style={{marginLeft:'10px'}}
                            >  
                            
                            Background 
                            </Button>
                        </label>
                    
                    </div>
                        {typeof this.state.pic !== 'undefined' && this.state.pic !== null ? 
                        <div style={{display: 'flex', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                            <Avatar alt="pic" src={this.state.pic} style={{width:'60px', height:'60px'}}/>
                            <p style={{marginLeft:'10px', fontSize:'15px', fontWeight:'500'}}>Selected Pic</p>
                            <Button variant="contained" style={{marginLeft:'10px',backgroundColor:'red', color:'white'}} disableElevation onClick={() => this.setState({
                                    pic: null
                                })}><DeleteRoundedIcon/> </Button>
                        </div>: null}
                        
                            
                        {typeof this.state.backgroundImage !== 'undefined' && this.state.backgroundImage !== null ? 
                            <div style={{backgroundColor:'#3b424c', borderRadius:'8px', display:'grid', alignContent:'space-between'}}> 
                                <p style={{fontSize:'15px', fontWeight:'500', textAlign: 'center'}}>Selected Background Image</p>
                                <img alt="background" style={{maxWidth:'30vw', borderRadius:'8px'}} src={this.state.backgroundImage}/>
                                <Button variant="contained" style={{backgroundColor:'red', color:'white'}} disableElevation onClick={() => this.setState({
                                    backgroundImage: null
                                })}> <DeleteRoundedIcon/> Remove</Button>
                            </div> : null}
                        
                    <Button variant="contained" style={{textTransform:'capitalize', width:'15vw', margin:'auto'}} color="primary" disableElevation onClick={() => this.updateProfile()}>save</Button>
                </ThemeProvider>
            </div>
        )
    }
}

export default ProfileSettingsComponent
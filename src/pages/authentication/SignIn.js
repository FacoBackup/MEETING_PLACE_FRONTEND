import React, {Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import localIpUrl from 'local-ip-url';
import "../../style/authentication/SigninStyle.css"
import Button from '@material-ui/core/Button';
import Host from '../../Host'
import TextField from '@material-ui/core/TextField'
import MuiAlert from '@material-ui/lab/Alert'
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Snackbar from '@material-ui/core/Snackbar'

const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

class SignIn extends Component {
    constructor(){
        super()
        this.state={
            email: '',
            password:'',
            accepted: null,
            cookies: new Cookies(),
            
        }
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    Alert(props){
        return(<MuiAlert elevation={4} variant="filled" {...props}/>)
    }
     
    componentDidMount(){   
        Object.keys((new Cookies()).getAll()).forEach(name => (new Cookies()).remove(name))
        localStorage.clear()
    }


    handleChangeEmail (event)  {
        
        this.setState({
            email: event.target.value
        })
        event.preventDefault();
    }
    handleChangePassword (event)  {
        this.setState({
            password: event.target.value
        })
        event.preventDefault();
    }

    async handleSubmit (){
        console.log("teste")
        await axios({
            method: 'put',
            url: Host()+'api/login',
            headers:{'Access-Control-Allow-Origin': '*'} ,
            data: {
                userID: this.state.email,
                password: this.state.password,
                ip: localIpUrl('public')
            }
            })
            .then(response => {   
                this.state.cookies.set('JWT',response.data,{path:'/'});
                this.state.cookies.set('ID',this.state.email,{path:'/'});
                this.setState({
                    accepted:true
                })    
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    accepted:false
                })  
            })
        console.log("2")
        if(this.state.accepted === null)
            this.setState({
                accepted: false
            })
    }
    
    render(){
    
        if(this.state.accepted === true)
            return (    
                <Redirect to='/'/>
            );
        else{
            return (
                <div className="sign_in_container">
                    <ThemeProvider theme={theme}>
                    <div className="sign_in_component">
                        <div className="sign_in_title_container">
                            <h2>Sign In</h2>
                            {/* <p style={{ fontSize: FontSizes.size24, fontWeight:FontWeights.semibold }}>Sign in</p> */}
                        </div>
                        <div className="sign_input_container">
                            <TextField 
                                variant="outlined" 
                                label="Email address" 
                                
                                multiline 
                            
                                onChange={this.handleChangeEmail}/>
                            <TextField
                                variant="filled" 
                                type="password" 
                        
                                autoComplete="current-password" 
                                label="Password" 
                                onChange={this.handleChangePassword}/>
                        </div>

                        <div className="sign_button_container">
                            <Button 
                                disableElevation 
                                
                                variant='contained' 
                                color="primary" onClick={() => this.handleSubmit()}>SIGN IN</Button>
                            <Button disableElevation style={{fontWeight:'bold'}} variant='contained' color="default" href="/creation">CREATE AN ACCOUNT</Button>
                        </div>
                        <Snackbar open={this.state.accepted === false} autoHideDuration={6000} onClose={() => this.setState({accepted: null})}>
                            <this.Alert severity="error">Some error occurred, maybe try later.</this.Alert>
                        </Snackbar>
                    </div>
                    </ThemeProvider>
                </div>
            );    
        }  
    }
}



export default (SignIn)
import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import localIpUrl from 'local-ip-url';
import "./styles/SigninStyle.css"
import Button from '@material-ui/core/Button';
import Host from '../../Host'
import TextField from '@material-ui/core/TextField'
import MuiAlert from '@material-ui/lab/Alert'
import {createMuiTheme} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";
import Snackbar from '@material-ui/core/Snackbar'

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

const cookies = new Cookies()
class SignIn extends Component {
    constructor() {
        super(null)
        this.state = {
            input: '',
            password: '',
            accepted: null,
            error: false,
            errorMessage: null
        }
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    Alert(props) {
        return (<MuiAlert elevation={4} variant="filled" {...props}/>)
    }

    componentDidMount() {
        cookies.remove("JWT")
        cookies.remove("ID")
    }

    handleChangeInput(event) {

        this.setState({
            input: event.target.value
        })
        event.preventDefault();
    }

    handleChangePassword(event) {
        this.setState({
            password: event.target.value
        })
        event.preventDefault();
    }

    async handleSubmit() {
      try{
          await axios({
              method: 'put',
              url: Host() + 'api/login',
              headers: {'Access-Control-Allow-Origin': '*'},
              data: {
                  input: this.state.input,
                  password: this.state.password,
                  ip: localIpUrl('public')
              }
          })
          .then(response => {
              cookies.set('JWT', response.data, {path: '/'});
              this.getID()
          })
          .catch(error => {
              this.setState({
                  error: true,
                  errorMessage: error.message
              })
              console.log(error)
          })
      }catch (e){
          console.log(e)
      }
    }

    async getID(){

        try{
            await axios({
                method: 'get',
                url: Host() + 'api/id',
                headers: {"Authorization": 'Bearer ' + (cookies).get("JWT")},
                data: {
                    input: this.state.input,
                    password: this.state.password,
                    ip: localIpUrl('public')
                }
            })
                .then(response => {
                    cookies.set('ID', response.data, {path: '/'});
                    this.setState({
                        accepted: true
                    })
                })
                .catch(error => {
                    console.log(error)
                    this.setState({
                        accepted: false
                    })
                })
            if (this.state.accepted === null)
                this.setState({
                    accepted: false
                })
        }catch (e){
            console.log(e)
        }
    }
    render() {
        if (this.state.accepted === true)
            return (
                <Redirect to='/home'/>
            );
        else {
            return (
                <div className="sign_in_container">
                    <ThemeProvider theme={theme}>
                        <div className="sign_in_component">
                            <div className="sign_in_title_container">
                                <h2>Sign In</h2>
                            </div>
                            <div className="sign_input_container">
                                <TextField
                                    variant="outlined"
                                    label="Email, Phone or User name"

                                    multiline

                                    onChange={this.handleChangeInput}/>
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
                                    style={{border:'#39adf6 2px solid', color:'white', textTransform:'capitalize'}}
                                    variant='outlined'
                                    onClick={() => this.handleSubmit()}>Sign in</Button>
                                <Button disableElevation style={{color:'white', textTransform:'capitalize'}}
                                        variant='outlined'
                                        href="/creation">Create an account</Button>
                            </div>
                            <Snackbar open={this.state.error === true} autoHideDuration={6000}
                                      onClose={() => this.setState({error: false, errorMessage: null})}>
                                <this.Alert severity="error">Some error occurred ({this.state.errorMessage}).</this.Alert>
                            </Snackbar>
                        </div>
                    </ThemeProvider>
                </div>
            );
        }
    }
}


export default (SignIn)
import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import "../../style/authentication/SignupStyle.css";
import Snackbar from '@material-ui/core/Snackbar'
import Moment from 'moment';
import Host from '../../Host'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import {MenuItem, Select} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import {createMuiTheme} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";
import MuiAlert from '@material-ui/lab/Alert'

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

class SignUp extends Component {
    constructor() {
        super(null)
        this.state = {
            email: '',
            password: '',
            name: '',
            userName: '',
            phone: '',
            birth: '',
            gender: '',
            success: null,
            redirect: false,
            error: null,
            randomNumber:((Math.random() * 10).toFixed(4)).toString().replace(".", "")
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async handleSubmit() {

        try {
            await axios({
                method: 'post',
                url: Host() + 'api/user',
                data: {
                    email: this.state.email,
                    password: this.state.password,
                    name: this.state.name.toLowerCase(),
                    userName: "#"+this.state.userName.replace(" ", '').toLowerCase() + "_" + this.state.randomNumber,
                    gender: this.state.gender,
                    birthDate: Date.parse(Moment(this.state.birth.replace("_", "")).format('DD/MM/yyyy')),
                    phoneNumber: (this.state.phone).replace(" ", ""),
                }
            })
                .then(() => {
                    this.setState({
                        success: true
                    });
                })
                .catch(error => {
                    console.log(error)
                    this.setState({
                        success: false,
                        error: error
                    });
                })
        } catch (error) {
            console.log(error)
            this.setState({
                success: false
            });
        }
    }

    Alert(props) {
        return (<MuiAlert elevation={4} variant="filled" {...props}/>)
    }

    render() {
        if ((this.state.success === false || this.state.success === null) && this.state.redirect === false) {
            return (
                <div className="sign_up_container">
                    <ThemeProvider theme={theme}>
                        <div className="sign_up_component">
                            <div className="sign_up_title_container">
                                <h2>Sign up</h2>
                            </div>
                            <div className="sign_up_input_container">
                                <TextField
                                    label="Name"
                                    name="name"
                                    variant="outlined"
                                    onChange={this.handleChange}

                                />

                                <TextField
                                    label="Email address"
                                    name="email"
                                    variant="outlined"
                                    onChange={this.handleChange}

                                />
                                <div sytle={{display: 'grid', justifyContent: 'center', lineBreak:'auto'}}>
                                    <TextField
                                    style={{width:'100%'}}
                                        label="User name"
                                        name="userName"
                                        variant="outlined"
                                        onChange={this.handleChange}
                                    />
                                    {this.state.userName !== '' ? <p style={{wordBreak:'break-all', color:'#aaadb1', textAlign: 'center'}}>#{this.state.userName.replace(" ", '').toLowerCase() + "_" + this.state.randomNumber}</p> : null}
                                </div>
                                <TextField
                                    type="password"
                                    label="Password"
                                    name="password"
                                    variant="outlined"
                                    onChange={this.handleChange}

                                />
                                <TextField
                                    label="Phone number"
                                    name="phone"
                                    variant="outlined"
                                    onChange={this.handleChange}
                                />

                                <TextField
                                    label="Birthday"
                                    type="date"
                                    name="birth"
                                    variant="outlined"
                                    onChange={this.handleChange}
                                    defaultValue="2020-01-15"

                                />
                                <InputLabel id="select-id">Gender</InputLabel>
                                <Select
                                    labelId="select-id"
                                    name="gender"

                                    variant="outlined"
                                    value={this.state.gender}

                                    onChange={this.handleChange}>

                                    <MenuItem key={"male"} value="male">
                                        Male
                                    </MenuItem>


                                    <MenuItem key={"female"} value="female">
                                        Female
                                    </MenuItem>

                                </Select>

                            </div>

                            <div className="sign_up_buttons_container">
                                <Button disableElevation style={{fontWeight: 'bold'}} color="default "
                                        variant='contained' href="/authenticate"> Sign in</Button>
                                <Button disableElevation style={{fontWeight: 'bold', float: 'right'}} color="primary"
                                        variant='contained' onClick={this.handleSubmit}>Create Account</Button>
                            </div>

                        </div>
                    </ThemeProvider>
                    <Snackbar open={this.state.success !== null} autoHideDuration={6000} onClose={() => this.setState({
                        redirect: this.state.success === true,
                        success: null
                    })}>
                        <this.Alert
                            severity={this.state.success === true ? "success" : "error"}>{this.state.success === true ? "Success, we are redirecting you to sign in." : "Some error occurred, maybe try later("+this.state.error+")."}</this.Alert>
                    </Snackbar>
                </div>
            );
        } else
            return (<Redirect to={'/authenticate'}/>);
    }
}

export default SignUp;
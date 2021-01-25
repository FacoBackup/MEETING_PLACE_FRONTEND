import React from 'react';
import "../styles/MessagesStyle.css";
import TextField from '@material-ui/core/TextField'
import Button from "@material-ui/core/Button"
import axios from 'axios';
import Host from '../../../Host'
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import Cookies from 'universal-cookie';
import EmojiEmotionsRoundedIcon from '@material-ui/icons/EmojiEmotionsRounded';
import ImageRoundedIcon from '@material-ui/icons/ImageRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";


class SendMessageComponent extends React.Component {

    constructor(params) {
        super(params)
        this.state = {
            isGroup: params.isGroup,
            imageURL: null,
            subjectID: params.subjectID,
            messageInput: '',
            sending: false,
            errorMessage: null,
            error: false
        }
        this.SendMessage = this.SendMessage.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({
            messageInput: event.target.value
        })
    }
    Alert(props) {
        return (<MuiAlert elevation={4} variant="filled" {...props}/>)
    }
    async SendMessage() {
       try{
           if(this.state.messageInput.length > 0){
               this.setState({
                   sending: true,
               })

               await axios({
                   method: 'post',
                   url: (this.state.isGroup === true) ? Host() + 'api/message/group' : Host() + 'api/message/user',
                   headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                   data: {
                       message: this.state.messageInput,
                       imageURL: this.state.imageURL,
                       receiverID: this.state.isGroup === true ? null : this.state.subjectID,
                       isGroup: this.state.isGroup,
                       conversationID: this.state.isGroup === true ? this.state.subjectID : null
                   }
               })
                   .then(() => {
                       this.setState({
                           imageURL: null,
                           messageInput: ''
                       })
                   })
                   .catch(error => {
                       this.setState({
                           error: true,
                           errorMessage: error.message
                       })
                       console.log(error);

                   });
               this.setState({
                   sending: false
               })
           }
           else{
               this.setState({
                   error: true,
                   errorMessage: "No Content"
               })
           }
       }catch (e) {
            this.setState({
                error: true,
                errorMessage: e.message
            })
           console.log(e)
       }
    }

    getFile(event) {

        this.setState({
            imageURL: null
        })

        let reader = new FileReader();

        if (!event[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
            alert('not an image')
            this.setState({
                imageURL: null
            })
        } else {
            reader.readAsDataURL(event[0]);
            reader.onload = () => {
                this.setState({
                    imageURL: reader.result
                })
            }
        }
    }

    renderSelectedImage() {
        if (this.state.imageURL !== null)
            return (
                <div style={{margin: '1vh', display: "flex", justifyContent: 'flex-start'}}>
                    <img alt="message" style={{borderRadius: '8px', maxWidth: '20vw', maxHeight: "20vh"}}
                         src={this.state.imageURL}/>
                    <Button onClick={() => this.setState({
                        imageURL: null
                    })}>
                        <DeleteRoundedIcon/>
                    </Button>

                </div>
            )
    }

    render() {
        return (

                <div className="message_input_content_container">
                    {this.renderSelectedImage()}
                    <div className="message_input_container">
                        <TextField
                            placeholder="Message"
                            variant="outlined"
                            label={this.state.sending === true ? "Sending..." : null}
                            multiline autoAdjustHeight
                            value={this.state.messageInput}
                            style={{
                                backgroundColor: '#303741',
                                borderRadius: '2px',
                                width: '35vw'
                            }}
                            InputProps={{
                                style: {
                                    color: 'white'
                                }
                            }}
                            onChange={this.handleChange}/>


                        <Button disabled>
                            <EmojiEmotionsRoundedIcon/>
                        </Button>

                        <input id="contained-button-file" type="file" style={{display: 'none'}}
                               onChange={event => this.getFile(event.target.files)}/>
                        <label htmlFor="contained-button-file">
                            <Button
                                component="span"
                            >
                                <ImageRoundedIcon/>
                            </Button>
                        </label>

                        <Button onClick={() => this.SendMessage()}>
                            <SendRoundedIcon style={{color: '#3eaef3'}}/>
                        </Button>
                    </div>
                    <Snackbar open={this.state.error === true} autoHideDuration={6000} onClose={() => this.setState({
                        error: false
                    })}>
                        <this.Alert
                            severity={this.state.errorMessage === "No Content" ? "warning":"error"}>{this.state.errorMessage === "No Content" ? "No Content":"Some error occurred, maybe try later("+this.state.errorMessage+")."}</this.Alert>
                    </Snackbar>
                </div>
        )
    }

}

export default SendMessageComponent
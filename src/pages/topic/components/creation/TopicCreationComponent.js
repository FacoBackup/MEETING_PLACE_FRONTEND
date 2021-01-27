import React from 'react';
import "../../../shared/styles/TopicStyles.css"
import "../../../shared/styles/DedicatedPagesStyle.css"
import Modal from "@material-ui/core/Modal"
import TextField from '@material-ui/core/TextField'
import axios from 'axios';
import DeleteRounded from '@material-ui/icons/DeleteRounded'
import CommunitySearchComponent from '../../../shared/components/CommunitySearchComponent'
import Host from '../../../../Host'
import Button from '@material-ui/core/Button';
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Avatar from "@material-ui/core/Avatar";

class TopicCreationComponent extends React.Component {
    constructor(params) {
        super(params)
        this.state = {
            title: '',
            body: '',
            token: params.token,
            imageURL: null,
            communityID: null,
            openModal: false,
            imageModal: false,
            communityModal: false,
            date: new Date(),
            selectedCommunity: {},
            error: null,
            errorMessage: null,
            hashes: [],
            hashedText: []

        }

        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        const parsedCommunity = (sessionStorage.getItem("SELECTED_COMMUNITY") !== null) ? JSON.parse(sessionStorage.getItem("SELECTED_COMMUNITY")) : null
        if (typeof this.state.selectedCommunity.communityID === 'undefined')
            this.setState({
                date: new Date(),
                selectedCommunity: (parsedCommunity !== null) ? parsedCommunity : this.state.selectedCommunity,
            })
        if (typeof this.state.selectedCommunity.communityID !== 'undefined') {
            sessionStorage.removeItem("SELECTED_COMMUNITY")
            this.setState({

                communityModal: false,

            })
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })

    }

    getFile(event) {

        this.setState({
            imageURL: null
        })

        let reader = new FileReader();

        if (!event[0].name.match(/.(jpg|jpeg|png|gif|webp)$/i)) {
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

    async createTopic() {
        try {
            if(this.state.body.length > 0 && this.state.title.length>0){

                function removeDuplicated(names) {
                    let unique = {};
                    names.forEach(function(i) {
                        if(!unique[i]) {
                            unique[i] = true;
                        }
                    });
                    return Object.keys(unique);
                }
                const hashtags = removeDuplicated(this.state.body.match(/#[a-z,0-9]+/gi))
                const users = this.state.body.match(/@[a-z,0-9]+/gi)

                await axios({
                    method: 'post',
                    url: Host() + 'api/topic',
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data: {
                        header: this.state.title,
                        body: this.state.body,
                        imageURL: this.state.imageURL,
                        communityID: this.state.selectedCommunity.communityID,
                        mainTopicID: null,
                        hashTags: hashtags,
                        mentionedUsers: users
                    }
                }).then(() => {
                    this.setState({
                        error: false
                    })
                }).catch(error => {
                    this.setState({
                        error: true,
                        errorMessage: error.message
                    })
                    console.log(error)
                })
            }
            else{
                this.setState({
                    error: true,
                    errorMessage: "Missing Field"
                })
            }
        } catch (error) {
            this.setState({
                error: true,
                errorMessage: error.message
            })
            console.log(error)
        }
    }

    imageRender() {
        if (this.state.imageURL !== null)
            return (
                <div style={{display: 'grid', justifyContent: 'center'}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <img style={{margin: 'auto', width: '30vw', borderRadius: '8px'}} alt="topic"
                             src={this.state.imageURL}/>

                    </div>
                    <Button style={{backgroundColor: 'red', color: 'white'}} variant="contained"
                            onClick={() => this.setState({
                                imageURL: null
                            })}><DeleteRounded/> Remove</Button>
                </div>
            )
    }

    renderSelectedCommunity() {
        if (typeof this.state.selectedCommunity.communityID !== 'undefined')
            return (
                <div style={{marginTop: '1vh'}}>
                    <p style={{fontWeight:'500',textAlign: 'center'}}>Selected Community</p>
                    <div className={"subject_content_container"} style={{width:'17vw'}}>

                        <Avatar
                            style={{width: '50px', height: '50px'}}
                            src={this.state.selectedCommunity.imageURL }
                           alt={"community"}
                        />
                        <ul>
                            <li>{this.state.selectedCommunity.name}</li>
                            <li style={{fontWeight: '500', color: '#aaadb1'}}>{this.state.selectedCommunity.about}</li>
                        </ul>
                        <Button style={{backgroundColor:'red', color:'white', display:'flex', alignItems:"center"}} onClick={() => this.setState({
                            selectedCommunity: {}
                        })}>Remove</Button>
                    </div>
                </div>

            )
    }

    modalRender() {
        return (
            <Modal
                open={this.state.communityModal}
                onClose={() => this.setState({
                    communityModal: false
                })}
            >
                <div className='modal_container'>
                    <div style={{textAlign:'center'}}>
                        <h3 style={{fontWeight: '500'}}>Link your community to another one</h3>
                        <p style={{fontWeight: '500', color: '#aaadb1'}}>The members of this community will appear in the main community too.</p>
                        <p style={{fontWeight: '500', color: '#aaadb1'}}>You have to be a moderator in the main community to be able to link the two.</p>
                    </div>
                    <CommunitySearchComponent token={this.state.token}/>
                    <Button onClick={() => this.setState({
                        communityModal: false
                    })} variant="contained" disableElevation>Cancel</Button>

                </div>
            </Modal>
        )
    }
    finishProcedure(){
        if(this.state.error === true){
            this.setState({
                error: null
            })
        }
        else
            window.location.reload()
    }
    Alert(props) {
        return (<MuiAlert elevation={4} variant="filled" {...props}/>)
    }
    render() {
        return (
            <div className="topic_creation_container">
                {this.modalRender()}
                <div className="topic_creation_title">
                    <h3 style={{fontWeight: '400'}}>Express Yourself</h3>
                </div>
                <div className="topic_creation_top_buttons">

                    <Button
                        disableElevation style={{color:'white', textTransform:'capitalize'}}
                        variant='outlined'
                        onClick={() =>
                            this.setState({
                                openModal: true,
                                imageModal: false,
                                communityModal: true
                            })}>
                        Community
                    </Button>

                    {/* <Toggle label="Visibility" defaultChecked onText="Only Fans" offText="Public"/> */}
                    <input id="contained-button-file" type="file" style={{display: 'none'}}
                           onChange={event => this.getFile(event.target.files)}/>
                    <label htmlFor="contained-button-file">

                        <Button
                            component="span"
                            disableElevation style={{color:'white', textTransform:'capitalize'}}
                            variant='outlined'
                        >

                            Upload image
                        </Button>
                    </label>

                </div>
                <div className="topic_creation_fields">
                    <TextField
                        placeholder="Title"
                        multiline

                        variant="outlined"
                        name='title'
                        style={{
                            backgroundColor: '#303741',
                            borderRadius: '2px'
                        }}
                        InputProps={{
                            style: {
                                color: 'white'
                            }
                        }}
                        onChange={this.handleChange}/>
                    <TextField
                        placeholder="Body"
                        multiline
                        autoAdjustHeight
                        variant="outlined"

                        style={{
                            backgroundColor: '#303741',
                            borderRadius: '2px'

                        }}
                        InputProps={{
                            style: {
                                color: 'white'
                            }
                        }}
                        name='body'
                        onChange={this.handleChange}/>
                    {typeof this.state.selectedCommunity.communityID === 'undefined' ?
                        <div>
                            <div style={{marginBottom: '1vh'}}>
                                {this.imageRender()}
                            </div>

                            {this.renderSelectedCommunity()}
                        </div> :
                        <div>
                            <div style={{marginBottom: '1vh'}}>
                                {this.renderSelectedCommunity()}
                            </div>

                            {this.imageRender()}
                        </div>
                    }
                </div>
                <div className="topic_creation_bottom_buttons">
                    <Button
                        disableElevation
                        style={{border:'#39adf6 2px solid', color:'white', textTransform:'capitalize'}}
                        variant='outlined'

                        onClick={() => this.createTopic()}>Create</Button>
                </div>
                <Snackbar open={this.state.error !== null} autoHideDuration={2500} onClose={() =>this.finishProcedure()}>
                    <this.Alert
                        severity={!this.state.error? "success":"error"}>{this.state.error ? ("Some error occurred ("+this.state.errorMessage+")") : "Created With Success"}</this.Alert>
                </Snackbar>
            </div>
        );
    }
}

export default TopicCreationComponent;
import axios from 'axios';
import Button from '@material-ui/core/Button'
import Modal from "@material-ui/core/Modal"
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField';
import "../../../style/community/CommunityCreationComponentStyle.css"
import React from 'react'
import CommunitySearchComponent from '../../search/community/CommunitySearchComponent'
import Host from '../../../Host'
import Cookies from 'universal-cookie';
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

class CommunityCreationComponent extends React.Component {
    constructor(params) {
        super(params)
        this.state = {
            token: (new Cookies()).get("JWT"),
            name: '',
            about: '',
            communityPic: null,
            relatedCommunity: {},
            created: null,
            date: new Date(),
            communityModal: false,
            errorMessage: null
        }
        this.handleChange = this.handleChange.bind(this)
        this.createCommunity = this.createCommunity.bind(this)
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
        if (typeof this.state.relatedCommunity.communityID === 'undefined')
            this.setState({
                date: new Date(),
                relatedCommunity: (parsedCommunity !== null) ? parsedCommunity : this.state.relatedCommunity,
            });

        if (typeof this.state.relatedCommunity.communityID !== 'undefined') {
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

    async createCommunity() {
        try{
            await axios({
                method: 'post',
                url: Host() + 'api/community',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data: {
                    about: this.state.about,
                    name: this.state.name,
                    relatedCommunityID: this.state.relatedCommunity.communityID !== 'undefined' ? this.state.relatedCommunity.communityID : null,
                    pic: this.state.communityPic
                }
            }).then(() => {
                this.setState({
                    created: true
                })
            }).catch(error => {
                this.setState({
                    created: false,
                    errorMessage: error.message
                })
                console.log(error)
            })
        }catch (e){
            this.setState({
                created: false,
                errorMessage: e.message
            })
            console.log(e)
        }

    }

    getPic(event) {

        this.setState({
            communityPic: null
        })

        let reader = new FileReader();

        if (!event[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
            alert('not an image')
            this.setState({
                communityPic: null
            })
        } else {
            reader.readAsDataURL(event[0]);
            reader.onload = () => {
                this.setState({
                    communityPic: reader.result
                })
            }
        }
    }

    imageRender() {
        if (this.state.communityPic !== null)
            return (
                <div>
                    <h5 style={{textAlign: 'center'}}>Selected Image</h5>
                    <div style={{display: 'flex', justifyContent: 'center'}}>

                        <img style={{margin: 'auto', width: '20vw', borderRadius: '8px'}} alt="topic"
                             src={this.state.communityPic}/>
                    </div>
                </div>


            )
    }
    Alert(props) {
        return (<MuiAlert elevation={4} variant="filled" {...props}/>)
    }
    renderSelectedCommunity() {
        if (typeof this.state.relatedCommunity.communityID !== 'undefined' && (this.state.relatedCommunity.role !== null && typeof this.state.relatedCommunity.role !== 'undefined') )
            return (
                <div className="personas_container">
                    <Avatar src={this.state.relatedCommunity.imageURL} style={{height:'65px', width:'65px'}} alt={"community"}/>
                    <ul>
                        <li>{this.state.relatedCommunity.name}</li>
                        <li>{this.state.relatedCommunity.about}</li>
                    </ul>
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


    render() {
        return (

            <div className="community_creation_component">
                <div className="community_creation_title">
                    <p>Create a
                        Community</p>
                </div>
                <div className="community_creation_fields">
                    <TextField variant="outlined" label="Name" name='name' style={{width:'35vw'}} onChange={this.handleChange}/>
                    <TextField variant="outlined" label="About This Community" name='about' onChange={this.handleChange}/>

                    {this.imageRender()}
                    {this.renderSelectedCommunity()}


                </div>
                <div className="community_creation_buttons">
                    {this.modalRender()}
                    {(typeof this.state.relatedCommunity.communityID === 'undefined') ?
                        <Button  variant="contained" disableElevation onClick={() => this.setState({

                            imageModal: false,
                            communityModal: true
                        })}>Set Main Community</Button> :
                        <Button variant="contained" disableElevation style={{color:'white', backgroundColor:'red'}} onClick={() => this.setState({
                            relatedCommunity: {}
                        })}>Remove Community</Button>
                    }
                    {this.state.communityPic === null ?
                        <div>
                            <input id="community_pic" type="file" style={{display: 'none'}}
                                   onChange={event => this.getPic(event.target.files)}/>
                            <label htmlFor="community_pic">

                                <Button
                                    component="span"
                                    variant="contained"
                                    color="default"
                                    disableElevation
                                >

                                    Upload image
                                </Button>
                            </label>
                        </div>:
                        <Button variant="contained" disableElevation style={{color:'white', backgroundColor:'red'}} onClick={() => this.setState({
                            communityPic: null
                        })}>Remove Image</Button>
                    }
                    <Button variant="contained" disableElevation color="primary" onClick={this.createCommunity}>Create</Button>
                </div>
                <Snackbar open={this.state.created !== null} autoHideDuration={4000} onClose={() => this.setState({
                    created: null,
                    errorMessage: null
                })}>
                    <this.Alert
                        severity={this.state.created? "success":"error"}>{!this.state.created ? ("Some error occurred ("+this.state.errorMessage+")") : "Created With Success"}</this.Alert>
                </Snackbar>
            </div>
        )
    }
}

export default CommunityCreationComponent
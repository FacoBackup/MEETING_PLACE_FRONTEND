import React from 'react';
import "../../../shared/styles/TopicStyles.css"
import Cookies from 'universal-cookie';
import DeleteTopic from '../../../shared/functions/topics/DeleteTopic'
import UpdateTopic from '../../../shared/functions/topics/UpdateTopic'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ThumbUpIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAltRounded';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import ArchiveIcon from '@material-ui/icons/ArchiveRounded';
import EditIcon from '@material-ui/icons/Edit';
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Host from '../../../../Host'

class TopicBoxComponent extends React.Component {
    constructor(params) {
        super(params)
        this.state = {
            topic: params.topic,
            editMode: false,
            headerInput: params.topic.header,
            bodyInput: params.topic.body,
            liked: params.topic.liked,
            disliked: params.topic.disliked,
            archived: params.topic.archived,
            likes: null,
            dislikes: null
        }
        this.updateTopic = this.updateTopic.bind(this)
        this.deleteTopic = this.deleteTopic.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.renderDeleteButton = this.renderDeleteButton.bind(this)
    }

    componentDidMount() {
        this.fetchDislikes(this.state.topic.id).catch(r => console.log(r))
        this.fetchLikes(this.state.topic.id).catch(r => console.log(r))

        const hashtags = this.state.topic.body.match(/#[a-z,0-9]+/gi)
        for(let i = 0; i< hashtags.length; i++){
            this.highlightHashtags(hashtags[i])
        }

    }


    //UPDATES
    async deleteTopic(topicID) {
        try {
            await DeleteTopic(topicID);
            window.location.reload()
        } catch (error) {
            console.log(error)
        }

    }

    async updateTopic(topicID) {
        try {

            const hashtags = this.state.bodyInput.match(/#[a-z,0-9]+/gi)
            const users = this.state.bodyInput.match(/@[a-z,0-9]+/gi)
            await UpdateTopic(topicID, this.state.headerInput, this.state.bodyInput, users, hashtags);
            this.setState({
                editMode: false
            })
            window.location.reload()

        } catch (error) {
            console.log(error)
        }
    }

    async likeTopic(topicID) {
        try {
            this.setState({
                liked: this.state.liked !== true,
                disliked: false
            })
            await axios({
                method: 'put',
                url: Host() + 'api/like',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                data: {
                    topicID: topicID
                }
            }).then(() => {
                this.fetchLikes(this.state.topic.id).catch(r => console.log(r))
                this.fetchDislikes(this.state.topic.id).catch(r => console.log(r))
            }).catch(error => console.log(error))
        } catch (error) {
            console.log(error)
        }
    }
    async fetchLikes(topicID) {
        try {
            await axios({
                method: 'patch',
                url: Host() + 'api/fetch/quantity/likes',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                data: {
                    topicID: topicID
                }
            }).then(r=>{
                this.setState({
                    likes: r.data
                })
            }).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }
    async fetchDislikes(topicID) {
        try {
            await axios({
                method: 'patch',
                url: Host() + 'api/fetch/quantity/dislikes',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                data: {
                    topicID: topicID
                }
            }).then(r=>{
                this.setState({
                    dislikes: r.data
                })
            }).catch(error => {
                console.log(error)

            })
        } catch (error) {
            console.log(error)
        }
    }
    async dislikeTopic(topicID) {
        try {
            this.setState({
                disliked: !this.state.disliked,
                liked: false
            })
            await axios({
                method: 'put',
                url: Host() + 'api/dislike',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                data: {
                    topicID: topicID
                }
            }).then(() => {
                this.fetchLikes(this.state.topic.id).catch(r => console.log(r))
                this.fetchDislikes(this.state.topic.id).catch(r => console.log(r))
            }).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async archiveTopic(topicID) {
        try {
            this.setState({
                archived: this.state.archived !== true
            })
            await axios({
                method: 'put',
                url: Host() + 'api/archive/topic',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                data: {
                    topicID: topicID
                }
            }).then(res => console.log(res))
                .catch(error => console.log(error))
        } catch (error) {
            console.log(error)
        }
    }

    //UPDATES
    highlightHashtags(text) {
        const inputText = document.getElementById(this.state.topic.id);
        let innerHTML = inputText.innerHTML;
        const index = innerHTML.indexOf(text);
        if (index >= 0) {
            innerHTML = innerHTML.substring(0,index) + "<span style='color:#39adf6'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
            inputText.innerHTML = innerHTML;
        }
    }
    //RENDER
    creatorName;
    communityImageURL;
    renderImage(topic) {
        if (typeof topic.imageURL !== 'undefined')
            return (
                <div className="topic_image_container">
                    <img style={{borderRadius: '8px', width: '100%', height: '100%'}} alt="Topic" src={topic.imageURL}/>
                </div>
            )
    }

    renderEditButton(creator) {
        console.log(creator)
        if (creator.toString() === (new Cookies()).get("ID")) {
            return (

                <Button onClick={() => this.setState({editMode: true})} variant={"outlined"} style={{marginRight:'10px',color: "white", border:'#39adf6 2px solid'}} ><EditIcon/>Edit</Button>

            )
        }
    }

    renderDeleteButton(creator) {

        if (creator.toString() === (new Cookies()).get("ID"))
            return (
                <Button variant={"outlined"} style={{color: "white", border:'#e34f50 2px solid'}} disableElevation
                        onClick={() => this.deleteTopic(this.state.topic.id)}><DeleteIcon/>Delete</Button>
            )
    }

    renderEditMode() {


        if (this.state.editMode === true)
            return (
                <div>

                    <div className="topic_container">
                        <div className="topic_creator_info_container">
                            <Avatar
                                style={{margin: 'auto', height: '75px', width: '75px'}}
                                src={(typeof this.state.topic.communityImageURL !== 'undefined') ? this.state.topic.communityImageURL : (typeof this.state.topic.creatorImageURL !== 'undefined') ? this.state.topic.creatorImageURL : null}
                                alt="user"
                            />
                            <p style={{fontWeight: '500'}}>{(typeof this.state.topic.communityName !== 'undefined') ? this.state.topic.communityName : this.state.topic.creatorName}</p>
                            <p style={{fontWeight: '350', color: '#aaadb1'}}>Created
                                on: {(new Date(this.state.topic.creationDate)).toLocaleString()}</p>

                        </div>
                        <div className="topic_fields_container">

                            <TextField
                                style={{
                                    backgroundColor: '#303741',
                                    borderRadius: '2px'
                                }}
                                InputProps={{
                                    style: {
                                        color: 'white'
                                    }
                                }}
                                defaultValue={this.state.topic.header}
                                multiline name="headerInput"
                                variant="outlined"
                                onChange={this.handleChange}/>
                            <TextField
                                style={{
                                    backgroundColor: '#303741',
                                    borderRadius: '2px'
                                }}
                                InputProps={{
                                    style: {
                                        color: 'white'
                                    }
                                }}
                                defaultValue={this.state.topic.body}
                                multiline name="bodyInput"
                                variant="outlined"
                                onChange={this.handleChange}/>

                        </div>

                        {this.renderImage(this.state.topic)}


                        <div className="topic_buttons_container">

                            <Button
                                variant="outlined"
                                disableElevation
                                onClick={() =>
                                    this.setState({
                                        editMode: false
                                    })
                                }
                                style={{marginRight: '5vw', color:'white'}}
                            >Cancel</Button>

                            <Button variant="outlined" disableElevation
                                style={{color: "white", border:'#39adf6 2px solid'}}
                                    onClick={() => this.updateTopic(this.state.topic.id)}>Save Changes</Button>
                        </div>
                    </div>

                </div>
            )
    }

    //RENDER


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    renderTopic() {

        if (this.state.editMode === false)
            return (
                <div className="profile_topics_container">
                    <div className="topic_container">
                        <div className="topic_creator_info_container">

                            <Avatar
                                style={{marginRight: '1vw', height: '75px', width: '75px'}}
                                src={(typeof this.state.topic.communityImageURL !== 'undefined') ? this.state.topic.communityImageURL : (typeof this.state.topic.creatorImageURL !== 'undefined') ? this.state.topic.creatorImageURL : null}
                                alt="user"
                            />
                            <p style={{
                                fontWeight: '400',
                                fontSize: '18px',
                                textTransform: 'capitalize'
                            }}>{(typeof this.state.topic.communityName !== 'undefined') ? this.state.topic.communityName : this.state.topic.creatorName}</p>
                            <p style={{fontSize:'15px',fontWeight: '350', color: '#aaadb1'}}>Created
                                on: {(new Date(this.state.topic.creationDate)).toLocaleString()}</p>
                        </div>
                        <div className="topic_fields_container">

                            <p style={{fontWeight: '550', fontSize:'18px'}}>{this.state.topic.header}</p>
                            <p id={this.state.topic.id} style={{fontWeight: '400', color: '#aaadb1'}}>{this.state.topic.body}</p>

                        </div>

                        {this.renderImage(this.state.topic)}
                        <div className="topic_buttons_container">

                            <Button style={{
                                color: (this.state.liked === true ? "#39adf6" : "#aaadb1"),
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                alignContent: 'center'
                            }}
                                    onClick={() => this.likeTopic(this.state.topic.id)}>
                                <ThumbUpIcon/>
                                {this.state.likes}
                            </Button>

                            <Button
                                style={{
                                    color: (this.state.disliked === true ? "#e34f50" : "#aaadb1"),
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    alignContent: 'center'
                                }}
                                onClick={() => this.dislikeTopic(this.state.topic.id)}>
                                <ThumbDownAltIcon/>
                                {this.state.dislikes}
                            </Button>
                            <Button style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                alignContent: 'center',
                                color:"#aaadb1"

                            }}
                                disabled
                            > <ChatBubbleIcon/>{this.state.topic.comments}</Button>

                            <Button style={{color: (this.state.archived === true ? "#39adf6" : "#aaadb1")}}
                                    onClick={() => this.archiveTopic(this.state.topic.id)}>
                                <ArchiveIcon/>
                            </Button>

                            {this.renderEditButton(this.state.topic.creatorID)}
                            {this.renderDeleteButton(this.state.topic.creatorID)}
                        </div>
                    </div>
                </div>
            )
    }

    render() {

        return (
            <>
                {this.renderEditMode()}
                {this.renderTopic()}
            </>
        )
    }
}

export default TopicBoxComponent
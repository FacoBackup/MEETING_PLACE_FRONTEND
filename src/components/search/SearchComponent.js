import axios from 'axios';
import {createMuiTheme} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";
import Button from '@material-ui/core/Button'
import React from 'react'
import "../../style/profile/SocialStyle.css"
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField';
import "../../style/profile/UserCommunitiesStyle.css"
import "../../style/search/SearchComponentStyle.css"
import Host from '../../Host'
import followUser from '../../functions/social/FollowUser'
import UnfollowUser from '../../functions/social/UnfollowUser'
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FollowCommunity from "../../functions/community/FollowCommunity";
import InfiniteScroll from "react-infinite-scroll-component";

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

class SearchComponent extends React.Component {
    isFollowing;
    constructor(params) {
        super(params)
        this.state = {
            token: params.token,
            subjects: [],
            maxID: null,
            community: false
        }
        this.fetchData = this.fetchData.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    handleChange(event) {
        if(event.target.name === "community"){
            console.log(event)
            this.setState({
                community: event.target.value === "community",
                subjects: [],
                maxID: null
            })

            this.fetchData(event.target.value).catch(r => console.log(r));
        }
        else{
            if(event.target.value.length === 0)
                this.setState({
                    subjects: [],
                    maxID: null
                })
            this.fetchData(event.target.value).catch(r => console.log(r));
        }

    }

    async fetchData(input) {
        try{

            if (input !== '' && this.state.community === false)
                await axios({
                    method: 'patch',
                    url: Host() + 'api/search/user',
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data: {
                        maxID: this.state.maxID,
                        subjectName: input.toLowerCase()
                    }
                }).then(res => {
                    console.log(res)
                    this.setState({
                        subjects: res.data,
                        maxID: (res.data.length > 0) ? res.data[res.data.length-1].userID : null
                    })

                }).catch(error => {
                    console.log(error)
                    this.setState({
                        subjects: [],
                        maxID: null
                    })
                })
            else if(input !== '' && this.state.community === true){
                await axios({
                    method: 'patch',
                    url: Host() + 'api/search/community',
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data: {
                        maxID: this.state.maxID,
                        subjectName: input.toLowerCase()
                    }
                }).then(res => {
                    console.log(res)
                    this.setState({
                        subjects: res.data,
                        maxID: (res.data.length > 0) ? res.data[res.data.length-1].userID : null
                    })

                }).catch(error => {
                    console.log(error)
                    this.setState({
                        subjects: [],
                        maxID: null
                    })
                })
            }


        }catch (e) {
            console.log(e)
        }

    }

    async follow(userID) {
        await followUser(userID).then(r => console.log(r))
        this.setState({
            subjects: [],
            maxID: null
        })
        this.fetchData().then(r => console.log(r))
    }

    async unfollow(userID) {
        await UnfollowUser(userID).then(r => console.log(r))
        this.setState({
            subjects: [],
            maxID: null
        })
        this.fetchData().then(r => console.log(r))
    }

    async followCommunity(id){
        await FollowCommunity(id).then(r => console.log(r))
        this.fetchData().then(r => console.log(r))
    }

    renderAsUser(subject){
       if(this.state.community === false){
           return(
               <div style={{
                   width:'65%',
                   margin:'1vh auto',
                   display:'grid',
                   justifyContent:'center',
                   justifyItems:'center',
                   backgroundColor: '#3b424c',
                   borderRadius: '8px',
                   paddingRight: '10px',
                   paddingLeft: '10px'}}>
                   <div style={{
                       display: 'flex',
                       justifyContent: 'flex-start',
                       alignItems: 'center',
                       alignContent: 'center',

                   }}>
                       <Avatar
                           style={{height: '55px', width: '55px'}}
                           src={subject.imageURL}
                           alt="user"

                       />
                       <ul>
                           <li style={{fontSize: '17px', fontWeight: '400'}}>
                               {subject.name}
                           </li>
                           <li style={{fontSize: '17px', fontWeight: '400', color: '#aaadb1'}}>
                               {subject.userName}
                           </li>
                           <li style={{fontSize: '17px', fontWeight: '400', color: '#aaadb1'}}>
                               {subject.email}
                           </li>
                       </ul>
                   </div>
                   <div style={{
                       display: 'flex',
                       justifyContent: 'space-between',
                       justifyItems:'space-between',
                       width:'100%',
                       marginBottom:'1vh'

                   }}>
                       <Button text="See Profile" href={"/profile/" + subject.userID } variant="outlined" style={{color:'white'}} disableElevation><PersonRoundedIcon/> Profile</Button>
                       <Button href={"/chat/"+subject.userID+"/false/null"} variant="outlined" style={{color:'white'}} disableElevation><ChatRoundedIcon/></Button>
                       {subject.isFollowing === true ?
                           <Button onClick={() => this.unfollow(subject.userID)} variant="contained" style={{backgroundColor:'red', color:'white', display:'flex', alignContent:'center', alignItems:'center', justifyContent:'space-between', fontWeight:'500'}} disableElevation><RemoveCircleRoundedIcon/> Unfollow</Button> :
                           <Button onClick={() => this.follow(subject.userID)} variant="contained" color="primary" disableElevation><AddCircleRoundedIcon/></Button>}
                   </div>
               </div>
           )
       }
    }
    renderAsCommunity(subject){
        if(this.state.community === true){
            return(
                <div style={{width:'65%', margin:'1vh auto', display:'grid', justifyContent:'center', justifyItems:'center',backgroundColor: '#3b424c',
                    borderRadius: '8px',
                    paddingRight: '10px',
                    paddingLeft: '10px'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        alignContent: 'center',

                    }}>
                        <Avatar
                            style={{height: '55px', width: '55px'}}
                            src={subject.imageURL}
                            alt="community"

                        />
                        <ul>
                            <li style={{fontSize: '17px', fontWeight: '400'}}>
                                {subject.name}
                            </li>

                            <li style={{fontSize: '17px', fontWeight: '400', color: '#aaadb1'}}>
                                {typeof subject.role !== 'undefined' && subject.role !== null ? "Your role: " + subject.role : subject.about}
                            </li>
                        </ul>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        justifyItems:'space-between',
                        width:'100%',
                        marginBottom:'1vh'

                    }}>
                        <Button href={"/community/" + subject.communityID } variant="contained" disableElevation >SEE</Button>
                        {typeof subject.role !== 'undefined' && subject.role !== null  ?
                            <Button disabled variant="contained" style={{backgroundColor:'red', color:'white', display:'flex', alignContent:'center', alignItems:'center', justifyContent:'space-between', fontWeight:'500'}} disableElevation><RemoveCircleRoundedIcon/> {subject.role === "FOLLOWER" ? "Unfollow": "Leave"}</Button> :
                            <Button onClick={() => this.followCommunity(subject.communityID)} variant="contained" color="primary" disableElevation><AddCircleRoundedIcon/></Button>}
                    </div>
                </div>
            )
        }
    }
    render() {
        return (
           <ThemeProvider theme={theme}>
            <div className="search_component">

                <div className="search_box_container">
                    <TextField style={{width:'32vw'}} label={"Search " + (this.state.community === true ? "Communities" : "Users")} variant="outlined"  onChange={this.handleChange}/>
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="option" name="community" value={this.state.community === true?  "community":"user"} onChange={this.handleChange}>
                            <FormControlLabel value="user" control={<Radio />} label="User" />
                            <FormControlLabel value="community" control={<Radio />} label="Community" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <InfiniteScroll
                        dataLength={this.state.subjects.length}
                        next={() => this.fetchData()}

                        inverse={true}
                        hasMore={this.state.maxID > 1}
                        loader={console.log("LOADING")}>
                        {this.state.subjects.map((subject) =>
                            <>
                                {this.renderAsCommunity(subject)}
                                {this.renderAsUser(subject)}
                            </>
                        )}
                    </InfiniteScroll>

                </div>
            </div>
            </ThemeProvider> 
        )
    }
}

export default SearchComponent
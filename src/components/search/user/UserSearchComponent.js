
import axios from 'axios';
import {createMuiTheme} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";
import Button from '@material-ui/core/Button'
import {FontSizes, FontWeights} from '@fluentui/theme';
import React from 'react'
import "../../../style/profile/SocialStyle.css"
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField';
import "../../../style/profile/UserCommunitiesStyle.css"
import "../../../style/search/SearchComponentStyle.css"
import Host from '../../../Host'
import followUser from '../../../functions/social/FollowUser'
import UnfollowUser from '../../../functions/social/UnfollowUser'
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

class UserSearchComponent extends React.Component {
    constructor(params) {
        super(params)
        this.state = {
            token: params.token,
            users: [],
            date: new Date(),
            searchInput: '',
            maxID: null
        }
        this.fetchData = this.fetchData.bind(this)
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

        this.fetchData().then(r => console.log(r));
        this.setState({
            date: new Date(),
        });
    }

    handleChange(event) {

        this.setState({
            searchInput: event.target.value
        })
        this.fetchData().then(r => console.log(r));
    }

    async fetchData() {
        try{
            if (this.state.searchInput !== '')
                await axios({
                    method: 'patch',
                    url: Host() + 'api/search/user',
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data: {
                        maxID: this.state.maxID,
                        subjectName: this.state.searchInput.toLowerCase()
                    }
                }).then(res => {
                    
                    if(typeof res.data.length !== 'undefined' && res.data.length > 0){
                        this.setState({
                            users: res.data
                        })
                    }
                }).catch(error => console.log(error))
        }catch (e) {
            console.log(e)
        }

    }

    async follow(userID) {
        followUser(userID).then(r => console.log(r))
        this.fetchData().then(r => console.log(r))
    }

    async unfollow(userID) {
        UnfollowUser(userID).then(r => console.log(r))
        this.fetchData().then(r => console.log(r))
    }

    render() {
        return (
           <ThemeProvider theme={theme}>
            <div className="search_component">
                <div>
                    <p style={{
                        fontSize: FontSizes.size18,
                        fontWeight: FontWeights.regular,
                        textAlign: 'center'
                    }}>Search for a user</p>
                </div>
                <div className="search_box_container">
                    <TextField style={{width:'35vw'}} label="Search" variant="outlined" onChange={this.handleChange}/>
                </div>
                <div>
                    {this.state.users.map((user) =>
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
                                    src={user.imageURL}
                                    alt="user"

                                />
                                <ul>
                                    <li style={{fontSize: '17px', fontWeight: '400'}}>
                                        {user.name}
                                    </li>
                                    
                                    <li style={{fontSize: '17px', fontWeight: '400', color: '#aaadb1'}}>
                                        {user.email}
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
                                <Button text="See Profile" href={"/profile/" + user.userID } variant="outlined" style={{color:'white'}} disableElevation><PersonRoundedIcon/> Profile</Button>
                                <Button href={"/chat/"+user.userID+"/false/null"} variant="outlined" style={{color:'white'}} disableElevation><ChatRoundedIcon/></Button>
                                {user.isFollowing === true ?
                                <Button onClick={() => this.unfollow(user.userID)} variant="contained" style={{backgroundColor:'red', color:'white', display:'flex', alignContent:'center', alignItems:'center', justifyContent:'space-between', fontWeight:'500'}} disableElevation><RemoveCircleRoundedIcon/> Unfollow</Button> :
                                <Button onClick={() => this.follow(user.userID)} variant="contained" color="primary" disableElevation><AddCircleRoundedIcon/></Button>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </ThemeProvider> 
        )
    }
}

export default UserSearchComponent
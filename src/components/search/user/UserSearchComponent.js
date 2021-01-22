
import axios from 'axios';
import {DefaultButton, PrimaryButton} from 'office-ui-fabric-react';
import {FontSizes, FontWeights} from '@fluentui/theme';
import React from 'react'
import "../../../style/profile/SocialStyle.css"
import {Persona, PersonaSize} from 'office-ui-fabric-react/lib/Persona';
import {TextField} from '@fluentui/react';
import "../../../style/profile/UserCommunitiesStyle.css"
import "../../../style/search/SearchComponentStyle.css"
import Host from '../../../Host'
import followUser from '../../../functions/social/FollowUser'
import UnfollowUser from '../../../functions/social/UnfollowUser'

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
                        userID: this.state.maxID,
                        userName: this.state.searchInput.toLowerCase()
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
            <div>
                <div className="search_component">
                    <div>
                        <p style={{
                            fontSize: FontSizes.size18,
                            fontWeight: FontWeights.regular,
                            textAlign: 'center'
                        }}>Search User</p>
                    </div>
                    <div className="search_box_container">
                        <TextField placeholder="Search Community" onChange={this.handleChange}/>
                    </div>
                    <div>
                        {this.state.users.map((user) =>
                            <div className="personas_container">
                                <Persona
                                    {...{
                                        imageUrl: user.imageURL,
                                        text: user.name,
                                        secondaryText: user.email,
                                        tertiaryText: user.phoneNumber

                                    }}
                                    size={PersonaSize.size72}
                                    imageAlt="Conversation picture"
                                />
                                <DefaultButton text="See Profile" href={"/profile/" + user.userID }/>
                                <PrimaryButton href={"/chat/"+user.userID+"/false/"} text="Send Message"/>
                                {user.isFollowing === true ?
                                    <DefaultButton onClick={() => this.unfollow(user.userID)} text="Unfollow"/> :
                                    <PrimaryButton onClick={() => this.follow(user.userID)} text="Follow"/>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default UserSearchComponent
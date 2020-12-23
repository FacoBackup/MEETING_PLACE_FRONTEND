import React from 'react';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../style/PageModel.css"
import Navigation from "../../components/navigation/NavigationBar"
import Profile from "../../components/profile/Profile"
import ConversationBar from "../../components/conversations/ConversationBar"
import { getTheme } from '@fluentui/react';
import { NeutralColors } from '@fluentui/theme';

class Followers extends React.Component{
    constructor(){
        super()
        this.state={
            cookies: new Cookies(),
            followers: [],
            date: new Date(),
            theme: getTheme()
        } 
    }
    componentDidMount(){
        this.timerID = setInterval(
            () => this.tick(),
            500
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        this.fetchData();
        this.setState({
            date: new Date(),
        });
    }
    fetchData = async () => {
        await axios({
            method: 'get',
            url: 'http://localhost:8080/api/followers',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},

        }).then(res=>{
            this.setState({
                followers: res.data
            })
        })
        .catch(error => {
            console.log(error);
        });
    }

    render(){
        return(
            <div className="page_container">
                <div className="top_container">
                    <Navigation/>
                </div>
                <div className="left_components" style={{borderRadius: '8px' ,boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}}>
                    <Profile/>
                </div>
                <div className="middle_components" style={{borderRadius: '8px' ,boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}}>
                    <h3>Followers</h3>
                    {this.state.followers !== [] ? this.state.followers.map((user, index) => 
                    <div>
                        <h3>{user.followerID}</h3> 
                        <Link to={'/chat/'+user.followerID}><button>Send message</button></Link>
                    </div>): <div> </div>}
                </div>
               <div className="right_components" style={{borderRadius: '8px' ,boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}}>
                    <ConversationBar/>
               </div>
            </div>
        );
    }
    
}

export default Followers;
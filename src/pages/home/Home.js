import React, {Component} from 'react';
import Profile from "../../components/profile/Profile"
import Navigation from "../../components/navigation/NavigationBar"
import "../home/Home.css";
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { NeutralColors } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import Following from "../../components/following/Following"
import TopicCreation from "../../components/topics/creation/TopicCreation"
class Home extends Component{
  state={
    cookies: new Cookies(),
    theme : getTheme()
  }  
  render(){
    if(typeof this.state.cookies.get("JWT") !== 'undefined')
      return (
        <div className="homeContainer">
            <div className="navbarContainer">
              <Navigation/>
            </div>

      
              <div style={{ borderRadius: '8px' , boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white }} className="profileContainer">
                <Profile/>
              </div>
              <div style={{borderRadius: '8px' ,boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}} className="topicCreationContainer" >
                <TopicCreation/>
              </div>
              <div style={{borderRadius: '8px' ,boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}} className="chatsContainer" >
                <Following/>
              </div>
        </div>
      );
    else
        <Redirect to="/authenticate"/>
  }
}

export default Home;

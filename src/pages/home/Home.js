import React, {Component} from 'react';
import Profile from "../../components/profile/Profile"
import Navigation from "../../components/navigation/NavigationBar"
import "../home/Home.css";
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { NeutralColors } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import TopicCreation from "../../components/topics/creation/TopicCreation";
import Conversations from "../../components/chat/Conversation";

class Home extends Component{
  
  state={
    cookies: new Cookies(),
    theme : getTheme()
  }  
  
  render(){
    if(typeof this.state.cookies.get("JWT") !== 'undefined'){
      return (
        <div className="home_page_container">
            <div className="navigation_container">
                <Navigation/>
            </div>
            <div style={{ borderRadius: '8px',backgroundColor: NeutralColors.white }} className="home_left_components">
                <div >
                  <Profile/>
                </div>
                {/* <div style={{ borderRadius: '8px',backgroundColor: NeutralColors.white }} className="home_settings_pannel_container">
                  <p>PLACEHOLDER</p>
                </div> */}
            </div>
            <div className="home_middle_components">
                <div style={{borderRadius: '8px' ,boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}} className="home_topic_control_bar_container" >
                  <TopicCreation/>
                </div>
                <div style={{borderRadius: '8px' ,boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}} className="home_timeline_container" >
                  <h3 style={{textAlign:'center'}}>PLACEHOLDER TIMELINE</h3>
                </div>
            </div>
            
            <div style={{borderRadius: '8px',backgroundColor: NeutralColors.white}} className="home_right_components" >
              <Conversations/>
            </div>
        </div>
      );
    }
    else
      return (<Redirect to="/authenticate"/>);
      
   
  }
}

export default Home;

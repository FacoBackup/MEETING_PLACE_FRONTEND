import React, {Component} from 'react';
import Profile from "../../components/profile/Profile"
import Conversations from "../../components/conversations/ConversationBar";
import Navigation from "../../components/navigation/NavigationBar"
import "../home/Home.css";
import "../../style/PageModel.css"
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { NeutralColors } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import TopicCreation from "../../components/topics/TopicCreation";


class Home extends Component{
  
  state={
    cookies: new Cookies(),
    theme : getTheme()
  }  
  
  render(){
    if(typeof this.state.cookies.get("JWT") !== 'undefined'){
      return (
        <div className="page_container">
            <div className="top_container">
                <Navigation/>
            </div>
            <div style={{backgroundColor: NeutralColors.white }} className="left_components">
                <div >
                  <Profile/>
                </div>
            </div>
            <div className="middle_components">
                <div style={{boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}} className="home_topic_control_bar_container" >
                  <TopicCreation/>
                </div>
                <div style={{boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}} className="home_timeline_container" >
                  <h3 style={{textAlign:'center'}}>PLACEHOLDER TIMELINE</h3>
                </div>
            </div>
            
            <div style={{backgroundColor: NeutralColors.white}} className="right_components" >
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

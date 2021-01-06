import React, {Component} from 'react';
import Profile from "../../components/profile/Profile"
import Conversations from "../../components/conversations/ConversationBar";
import "../timeline/TimelineStyle.css";
import "../../style/PageModel.css"
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import TopicCreation from '../../components/topics/TopicCreation'
import TopicComponent from '../../components/topics/TopicComponent'

class Timeline extends Component{
  
  render(){
    if(typeof (new Cookies()).get("JWT") !== 'undefined'){
      return (
        <div className="page_container">
            <div  className="center_component">
              <TopicCreation token={( new Cookies()).get("JWT")}/>
              <TopicComponent token={( new Cookies()).get("JWT")}/>
            </div>
            <div className="left_components">
              <Profile/>
            </div>
            <div  className="right_components" >
              <Conversations/>
            </div>
        </div>
      );
    }
    else
      return (<Redirect to="/authenticate"/>);
  }
}

export default Timeline;

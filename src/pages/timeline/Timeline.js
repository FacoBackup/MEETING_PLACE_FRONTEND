import React, {Component} from 'react';
import Profile from "../../components/profile/Profile"
import Conversations from "../../components/conversations/ConversationBar";
import "../timeline/TimelineStyle.css";
import "../../style/PageModel.css"
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import TopicCreation from '../../components/topics/TopicCreation'
import axios from 'axios';
import Dexie from "dexie";

class Timeline extends Component{
  state={
    cookies: new Cookies(),
    topics: [],
    date:new Date(),
    db:  new Dexie('api_web_db')
  }  


  setupDB(){      
    if(this.state.db.isOpen() === false){
      
        this.state.db.version(1).stores({
            timeline: "id,header,body,approved, creatorID, mainTopicID, creationDate, communityID, imageURL"
        })
    }
  }

  async setTopics(){      
    this.setState({
        topics: await this.state.db.timeline.sortBy('creationDate')
    })        
  }
  async fetchTimeline(){
     
    if(this.state.db.isOpen() === false){
            
      this.setupDB()
      this.state.db.open().catch((error) => {
          console.log(error)
      }) 
    }

    const data = await this.state.db.timeline.where("conversationID").equals(this.state.conversationID).toArray()

    //if(this.state.db.timeline)

  }

  render(){
    if(typeof this.state.cookies.get("JWT") !== 'undefined'){
      return (
        <div className="page_container">
            <div  className="center_component">
              <TopicCreation token={this.state.cookies.get("JWT")}/>
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

import React, {Component} from 'react';
import Profile from "../../components/profile/Profile"
import Conversations from "../../components/conversations/ConversationBar";

import "../home/Home.css";
import "../../style/PageModel.css"
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

import { getTheme } from '@fluentui/react';



class Home extends Component{
  
  state={
    cookies: new Cookies(),
    theme : getTheme()
  }  
  
  render(){
    if(typeof this.state.cookies.get("JWT") !== 'undefined'){
      return (
        <div>
        
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

export default Home;

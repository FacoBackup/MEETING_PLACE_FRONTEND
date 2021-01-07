import React, {Component} from 'react';
import UserSearch from "../../components/search/user/NewUserSearch"
import Profile from "../../components/profile/Profile"
import Conversations from "../../components/conversations/ConversationBar"
import "../../style/PageModel.css"
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';

class Search extends Component{
  render(){
    
    if(typeof (new Cookies()).get("JWT") !== 'undefined'){
      return (
        <div>
          <div className="center_component">
            <UserSearch token={new Cookies().get("JWT")}/>
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

export default Search;

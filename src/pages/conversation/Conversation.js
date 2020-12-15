import React, {Component} from 'react';
import Chat from "../../components/Chat/Chat"
import Navigation from "../../components/navigation/NavigationBar"

class Conversation extends Component{
  render(){
    return (
      <div>
          <Navigation/>
          <Chat/>
      </div>
    );
  }
}

export default Conversation;

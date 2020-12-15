import React, {Component} from 'react';
import Profile from "../../components/profile/Profile"
import Navigation from "../../components/navigation/NavigationBar"

class Home extends Component{
  render(){
    return (
      <div>
          <Navigation/>
          <Profile/>
      </div>
    );
  }
}

export default Home;

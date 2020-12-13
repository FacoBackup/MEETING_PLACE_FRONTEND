import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from "./components/authentication/Login";
import Profile from "./components/home/profile/Profile";
import Creation from "./components/creation/user/UserCreation";
import Logout from "./components/authentication/logout";
import Home from "./components/home/Home"
import Search from "./components/home/search/ProfileSearch"
import Chat from "./components/home/message/Chat"
function App() {
  return (
    <div>
      
      <Router>
          <Switch>    
              
              <Route path="/" exact component={Home}/>
              <Route path="/chat/:email" exact component={Chat}/>
              <Route path="/search" exact component={Search}/>
              <Route path="/logout" exact component={Logout}/>
              <Route path="/login" exact component={Login}/>
              <Route path="/creation" exact component={Creation}/>
          </Switch>
      </Router>
    
    </div>
  );
}

export default App;

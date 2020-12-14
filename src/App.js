import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from "./components/authentication/Login";
import Profile from "./components/profile/Profile";
import Creation from "./components/creation/user/UserCreation";
import Logout from "./components/authentication/logout";
import Home from "./pages/home/Home"
import Search from "./pages/search/ProfileSearch"
import Chat from "./components/conversation/Chat"
function App() {
  return (
    <div>
      
      <Router>
          <Switch>    
              
              <Route path="/" exact component={Home}/>
              <Route path="/chat/:email" exact component={Chat}/>
              <Route path="/search" exact component={Search}/>
              <Route path="/signout" exact component={Logout}/>
              <Route path="/authenticate" exact component={Login}/>
              <Route path="/creation" exact component={Creation}/>
          </Switch>
      </Router>
    
    </div>
  );
}

export default App;

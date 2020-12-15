import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Creation from "./components/creation/user/UserCreation";
import SignOut from "./components/authentication/Signout";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import Conversation from "./components/Chat/Chat";
import Followers from "./components/followers/Followers";
import Following from "./components/following/Following";
import Auth from "./components/authentication/SignIn"

function AppRoutes() {
  return (
    <div>
      <Router>
          <Switch>    
              <Route path="/following" exact component={Following}/>
              <Route path="/followers" exact component={Followers}/>
              <Route path="/" exact component={Home}/>
              <Route path="/chat/:email" exact component={Conversation}/>
              <Route path="/search_user" exact component={Search}/>
              <Route path="/signout" exact component={SignOut}/>
              <Route path="/authenticate" exact component={Auth}/>
              <Route path="/creation" exact component={Creation}/>
          </Switch>
      </Router>
    
    </div>
  );
}

export default AppRoutes;

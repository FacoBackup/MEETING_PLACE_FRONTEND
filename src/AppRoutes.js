import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import SignUp from "./pages/user/Signup";
import SignOut from "./pages/authentication/Signout";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import Chat from "./pages/chat/Chat";
import Followers from "./pages/followers/Followers";
import Following from "./pages/following/Following";
import SignIn from "./pages/authentication/SignIn"

function AppRoutes() {
  return (
    <div>
      <Router>
          <Switch>    
              <Route path="/following" exact component={Following}/>
              <Route path="/followers" exact component={Followers}/>
              <Route path="/" exact component={Home}/>
              <Route path="/chat/:id/:isGroup" exact component={Chat}/>
              <Route path="/search_user" exact component={Search}/>
              <Route path="/signout" exact component={SignOut}/>
              <Route path="/authenticate" exact component={SignIn}/>
              <Route path="/creation" exact component={SignUp}/>
          </Switch>
      </Router>
    
    </div>
  );
}

export default AppRoutes;

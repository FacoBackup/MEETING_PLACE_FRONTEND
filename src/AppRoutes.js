import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import SignUp from "./pages/user/Signup";

import Home from "./pages/timeline/Timeline";
import Search from "./pages/search/Search";
import Chat from "./pages/chat/Chat";
import Followers from "./pages/social/followers/Followers";
import Following from "./pages/social/following/Following";
import SignIn from "./pages/authentication/SignIn"

function AppRoutes() {
  return (
    <div>
      <Router>
          <Switch>    
              <Route path="/following" exact component={Following}/>
              <Route path="/followers" exact component={Followers}/>
              <Route path="/" exact component={Home}/>
              <Route path="/chat/:username/:isGroup/:absoluteid" exact component={Chat}/>
              <Route path="/search_user" exact component={Search}/>
              <Route path="/authenticate" exact component={SignIn}/>
              <Route path="/creation" exact component={SignUp}/>
          </Switch>
      </Router>
    
    </div>
  );
}

export default AppRoutes;

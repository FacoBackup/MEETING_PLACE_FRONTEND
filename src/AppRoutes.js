import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import SignUp from "./pages/user/Signup";
import Community from "./pages/community/Community"
import Home from "./pages/timeline/Timeline";
import Search from "./pages/search/Search";
import Conversation from "./pages/conversation/Conversation";
import SignIn from "./pages/authentication/SignIn"
import CommunityOptions from "./pages/community/options/CommunityOptions"
import Profile from "./pages/profile/Profile"

function AppRoutes() {
  return (
    <div>
      <Router>
          <Switch>    
              <Route path="/topic/:topicID/:likes" exact component={Profile}/>  
              <Route path="/profile/:userID/:option" exact component={Profile}/>
              <Route path="/community/:id" exact component={Community}/>
              <Route path="/communities" exact component={CommunityOptions}/>
              <Route path="/" exact component={Home}/>
              <Route path="/chat/:username/:isGroup/:absoluteid" exact component={Conversation}/>
              <Route path="/search_user" exact component={Search}/>
              <Route path="/authenticate" exact component={SignIn}/>
              <Route path="/creation" exact component={SignUp}/>
          </Switch>
      </Router>
    
    </div>
  );
}

export default AppRoutes;

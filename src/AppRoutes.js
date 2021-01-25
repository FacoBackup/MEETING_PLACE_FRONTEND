import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import SignUp from "./pages/signup/Signup";
import Community from "./pages/community/Community"
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import Conversation from "./pages/conversation/Conversation";
import SignIn from "./pages/signin/SignIn"
import Profile from "./pages/profile/Profile"
import Dashboard from './pages/dashboard/Dashboard'

function AppRoutes() {
    return (
        <div>
            <Router>
                <Switch>
                    <Route path="/topic/:topicID/:likes" exact component={Profile}/>
                    <Route path="/profile/:userID" exact component={Profile}/>
                    <Route path="/community/:id" exact component={Community}/>
                    <Route path="/" exact component={Home}/>
                    <Route path="/dashboard" exact component={Dashboard}/>
                    <Route path="/chat/:subjectID/:isGroup/:conversationID" exact component={Conversation}/>
                    <Route path="/search_user" exact component={Search}/>
                    <Route path="/authenticate" exact component={SignIn}/>
                    <Route path="/creation" exact component={SignUp}/>
                </Switch>
            </Router>
        </div>
    );
}

export default AppRoutes;

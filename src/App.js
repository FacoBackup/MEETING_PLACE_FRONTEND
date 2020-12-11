import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from "./components/authentication/Login";
import Profile from "./components/profile/Profile";
import Creation from "./components/creation/user/UserCreation";
import NavBar from "./components/navigation/NavBar";
import Logout from "./components/authentication/logout";

function App() {
  return (
    <div>
      
      <Router>
          <Switch>    
              <Route path="/logout" exact component={Logout}/>
              <Route path="/login" exact component={Login}/>
              <Route path="/profile/:email" exact component={Profile}/>
              <Route path="/creation" exact component={Creation}/>
          </Switch>
      </Router>
    
    </div>
  );
}

export default App;

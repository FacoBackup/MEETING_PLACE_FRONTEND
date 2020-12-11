import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import Creation from "./components/creation/user/UserCreation";

function App() {
  return (
    <div>
      
      <Router>
          <Switch>    
              <Route path="/login" exact component={Login}/>
              <Route path="/profile/:email" exact component={Profile}/>
              <Route path="/creation" exact component={Creation}/>
          </Switch>
      </Router>
    
    </div>
  );
}

export default App;

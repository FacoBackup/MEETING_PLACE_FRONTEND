import React, {Component} from 'react';
import UserSearch from "../../components/search/user/UserSearch"
import Navigation from "../../components/navigation/NavigationBar"

class Search extends Component{
  render(){
    return (
      <div>
          <Navigation/>
          <UserSearch/>
      </div>
    );
  }
}

export default Search;

import React, {Component} from 'react';
import './Navigation.css';
import {Link} from 'react-router-dom';
class NavBar extends Component {
    render(){
        console.log(this.props);
        return (
            <nav className="nav-style">
                <h3>Nav here</h3>
                <ul className="nav-links">
                    {/* <Link to='/get'>
                    <li>GET</li>
                    </Link>
                    <Link to='/new/get'>
                    <li>NEW GET</li>
                    </Link>
                    <Link to='/patch'>
                    <li>PATCH</li>
                    </Link>
                    <Link to= '/post'>
                    <li>POST</li>
                    </Link>
                    <Link to='/delete'>
                    <li>DELETE</li>
                    </Link> */}
                </ul>
            </nav>
        );
    }
}

export default NavBar;
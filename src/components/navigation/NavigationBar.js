import React, {Component, useEffect, useState} from 'react';
import './Navigation.css';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';

function NavigationBar (){
    const [isLogged, setLogged] = useState(false);
    const [path, setPath] = useState('authenticate')
    const cookies = new Cookies();

    useEffect(()=>{
        checkLogin();
    })

    function checkLogin() {
        if(typeof cookies.get("JWT") !== 'undefined'){
            setLogged(true);
            setPath('signout');
        }
        else{
            setLogged(false);
            setPath('authenticate');
        }    
    }
    
    return (
        <nav className="nav-style">
            <h3>Nav here </h3>
            
            <ul className="nav-links">
                <Link to='/'>
                    <button>Home</button>
                </Link>
                <Link to="/search_user" >
                    <button>Search</button>
                </Link>
                <Link to={'/'+ path}>
                    
                    {isLogged ? <button>Sign out</button> : <button>Sign in</button>}
                </Link>

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


export default NavigationBar;
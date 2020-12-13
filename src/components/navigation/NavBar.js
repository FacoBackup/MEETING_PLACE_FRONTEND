import React, {Component, useEffect, useState} from 'react';
import './Navigation.css';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';

function Navigation (){
    const [isLogged, setLogged] = useState(false);
    const [path, setPath] = useState('login')
    const cookies = new Cookies();
    useEffect(()=>{
        checkLogin();
    })
    function checkLogin() {
        if(typeof cookies.get("JWT") !== 'undefined'){
            setLogged(true);
            setPath('logout');
        }
        else{
            setLogged(false);
            setPath('login');
        }    
    }
    return (
        <nav className="nav-style">
            <h3>Nav here</h3>
            <ul className="nav-links">
                <Link to='/search'>
                    <button>Search</button>
                </Link>
                <Link to={'/'+ path}>
                    {isLogged ? <button>logout</button> : <button>login</button>}
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


export default Navigation;
import React from 'react';
import './Navigation.css';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { NeutralColors } from '@fluentui/theme';

import { FontSizes, FontWeights } from '@fluentui/theme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

function NavigationBar (){
    const _items = [
        {
          key: 'home',
          text: 'Home',
          iconProps: { iconName: 'Home' },
          href: "/",
        },
        {
          key: 'search',
          text: 'Search',
          iconProps: { iconName: 'Search' },
          href: "/search_user",
        }
      ];

    return (
       <div className="nav_container" style={{backgroundColor: NeutralColors.white }}>
          
          <a href="/" style={{fontSize: FontSizes.size14}}>Home</a>
        
          
          <TextField placeholder="search" />
       </div>

       
        // <nav className="nav-style">
        //     <h3>Nav here </h3>
            
        //     <ul className="nav-links">
        //         <Link to='/'>
        //             <button>Home</button>
        //         </Link>
        //         <Link to="/search_user" >
        //             <button>Search</button>
        //         </Link>
        //         <Link to={'/'+ path}>
                    
        //             {isLogged ? <button>Sign out</button> : <button>Sign in</button>}
        //         </Link>

        //         {/* <Link to='/get'>
        //         <li>GET</li>
        //         </Link>
        //         <Link to='/new/get'>
        //         <li>NEW GET</li>
        //         </Link>
        //         <Link to='/patch'>
        //         <li>PATCH</li>
        //         </Link>
        //         <Link to= '/post'>
        //         <li>POST</li>
        //         </Link>
        //         <Link to='/delete'>
        //         <li>DELETE</li>
        //         </Link> */}
        //     </ul>
        // </nav>
    );
}


export default NavigationBar;
import React from 'react'
import { DefaultButton } from 'office-ui-fabric-react';
// import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

class FrontNewsComponent extends React.Component{

    render(){
        return(
            <div className="profile_bar_container">
                <div className="profile_bar_background_image_container">
                    <img className= "profile_bar_background_image" alt="logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4w-mN9-DqN_kQlRYJ-xggDC3RAqsPoum4dQ&usqp=CAU"/>    
                </div>
                
              <div className="profile_bar_buttons_container">
                        
                        <DefaultButton text="Go Up" onClick={() => window.scrollTo(0,0)}/>
                        <DefaultButton text="Refresh News"/>
                        <DefaultButton text="Ramais"/>
                        <DefaultButton text="PLACEHOLDER"/>
                        <DefaultButton text="PLACEHOLDER"/>
                        <DefaultButton text="PLACEHOLDER"/>
                        <DefaultButton text="PLACEHOLDER"/>
                        <DefaultButton text="PLACEHOLDER"/>
                        <DefaultButton text="PLACEHOLDER"/>
                        <DefaultButton text="PLACEHOLDER"/>
                        <DefaultButton text="PLACEHOLDER"/>
                        <DefaultButton text="Home" href="/"/>
                        

                        
                </div>
            </div>
        )
    }
}

export default FrontNewsComponent;
import React from 'react';
import Cookies from 'universal-cookie';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

function TopicCreation(){
 
    const cookies = new Cookies();
 

    return(
        <div style={{display: "grid", placeItems:'center'}}>
            <div style={{width:'60vw'}}>
                <TextField  placeholder="Title" multiline autoAdjustHeight />
            </div>
            <div style={{width:'60vw'}}>
                <TextField  placeholder="Content" multiline autoAdjustHeight />
            </div>
        </div>
    );  
       
}

export default TopicCreation;
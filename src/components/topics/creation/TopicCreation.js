import React from 'react';
import Cookies from 'universal-cookie';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import "../creation/TopicCreationStyle.css"
import { Button } from '@fluentui/react-button';
import { FontSizes, FontWeights } from '@fluentui/theme';

function TopicCreation(){
 
    const cookies = new Cookies();
 

    return(
        <div className="topicCreationContainer">
            <div className="topicInputContainer">
                <TextField  placeholder="Title" multiline autoAdjustHeight />
            </div>
        </div>
    );  
       
}

export default TopicCreation;
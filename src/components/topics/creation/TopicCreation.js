import React from 'react';
import Cookies from 'universal-cookie';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import "../creation/TopicCreationStyle.css"
import { Button } from '@fluentui/react-button';
import { FontSizes, FontWeights } from '@fluentui/theme';

function TopicCreation(){
 
    const cookies = new Cookies();

    return(
        <div className="topic_creation_container">
            <Button style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'auto'}} href="/signout">Timeline</Button>
            <Button style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'auto'}} href="/signout">My topics</Button>
            <Button style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'auto'}} href="/signout">Create New</Button>
        </div>
    );  
       
}

export default TopicCreation;
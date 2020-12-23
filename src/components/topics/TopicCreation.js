import React from 'react';
import "./TopicCreationStyle.css"
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';

function TopicCreation(){
    return(
        <div className="topic_creation_container">
            <DefaultButton text="Timeline" disabled={true} style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'auto'}} href="/signout"/>
            <DefaultButton text="My Topics" disabled={true} style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'auto'}} href="/signout"/>
            <PrimaryButton text="Create New" disabled={true} style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'auto'}} href="/signout"/>
        </div>
    );  
       
}

export default TopicCreation;
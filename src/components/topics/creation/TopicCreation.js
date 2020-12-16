import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 

import { NeutralColors } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import { Button } from '@fluentui/react-button';
import { FontSizes, FontWeights } from '@fluentui/theme';
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
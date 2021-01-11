import "./MessageBoxStyle.css";
import { FontSizes, FontWeights } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import React from 'react'
class MessageBox extends React.Component {
    constructor(params){
        super()
        this.state={
            content: params.content ,
            imageURL: params.imageURL ,
            creationDate: params.creationDate ,
            userID: params.userID,
            creatorID: params.creatorID,
            read: params.read
        }
    }
    
    renderImage (){
        
        if(typeof this.state.imageURL !== 'undefined')
            return(
                <div>
                    <img style={{borderRadius:'8px', width: '500px'}} alt="message" src={this.state.imageURL}/>
                </div>
            )
    }
    
    render(){
        if(this.state.creatorID === this.state.userID)
        return (
            <div className="my_message_box_container" style={(this.state.read === true) ? {boxShadow: (getTheme()).effects.elevation4, border: '5px solid rgba(0, 255, 0, .5)'}  : {boxShadow: (getTheme()).effects.elevation4, border: '5px solid rgba(237,235,233, .3)'} } >
                <p style={{fontSize: FontSizes.size16, fontWeight:FontWeights.semibold}}>{this.state.content}</p>
                {this.renderImage()}
                <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular, color:"#3b3a39"}}>{(new Date(this.state.creationDate)).toLocaleString()}</p>
                
            </div>
        )
    else
        return (
            <div className="subject_message_box_container" style={{boxShadow: (getTheme()).effects.elevation4 }}>
                <p style={{fontSize: FontSizes.size16, fontWeight:FontWeights.semibold}}>{this.state.content}</p>
                {this.renderImage()}
                <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular, color:"#3b3a39"}}>Sent on: {(new Date(this.state.creationDate)).toLocaleString()}</p>
                
            </div>
        )
    }   
   
}
export default MessageBox;
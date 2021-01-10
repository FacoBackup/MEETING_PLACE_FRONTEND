import "./MessageBoxStyle.css";
import { FontSizes, FontWeights } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';

function MessageBox(content, valid, creationDate, userID, creatorID, read) {
    
    if(creatorID === userID)
        return (
            <div className="my_message_box_container" style={(read === true) ? {boxShadow: (getTheme()).effects.elevation4, border: '5px solid rgba(0, 255, 0, .5)'}  : {boxShadow: (getTheme()).effects.elevation4, border: '5px solid rgba(237,235,233, .3)'} } >
                <p style={{fontSize: FontSizes.size16, fontWeight:FontWeights.semibold}}>{content}</p>
                <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular, color:"#3b3a39"}}>{(new Date(creationDate)).toLocaleString()}</p>
                
            </div>
        )
    else
        return (
            <div className="subject_message_box_container" style={{boxShadow: (getTheme()).effects.elevation4 }}>
                <p style={{fontSize: FontSizes.size16, fontWeight:FontWeights.semibold}}>{content}</p>
                <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular, color:"#3b3a39"}}>Sent on: {(new Date(creationDate)).toLocaleString()}</p>
            </div>
        )
}
export default MessageBox;
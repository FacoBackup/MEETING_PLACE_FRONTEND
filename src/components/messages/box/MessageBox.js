import "./MessageBoxStyle.css";
import { FontSizes, FontWeights } from '@fluentui/theme';
import { useEffect } from "react";

function MessageBox(content, valid, creationDate, userID, creatorID, read) {
    
    creationDate = new Date(creationDate);
    const dateOfCreation = creationDate.toDateString()

    if(creatorID === userID)
        return (
            <div className="my_message_box_container">
                <p style={{fontSize: FontSizes.size16, fontWeight:FontWeights.semibold}}>{content}</p>
                <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular}}>Seen: {JSON.stringify(read)}</p>
              
            </div>
        )
    else
        return (
            <div className="subject_message_box_container">
                <p style={{fontSize: FontSizes.size16, fontWeight:FontWeights.semibold}}>{content}</p>
                <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular}}>Sent on: {dateOfCreation}</p>
                <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular}}>Valid for: {((valid-Date.now())/3600000).toFixed(0)} Hours</p>
        
            </div>
        )
}
export default MessageBox;
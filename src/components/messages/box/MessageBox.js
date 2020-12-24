import "./MessageBoxStyle.css";
import { FontSizes, FontWeights } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';

function MessageBox(content, valid, creationDate, userID, creatorID, read) {
    
    creationDate = new Date(creationDate);
    creationDate = creationDate.toDateString()
    valid = new Date(valid)
    valid = valid.toString()
    const theme = getTheme();

    if(creatorID === userID)
        return (
            <div className="my_message_box_container" style={(read === true) ? {boxShadow: theme.effects.elevation4, border: '5px solid rgba(0, 255, 0, .5)'}  : {boxShadow: theme.effects.elevation4, border: '5px solid rgba(237,235,233, .3)'} } >
                <p style={{fontSize: FontSizes.size16, fontWeight:FontWeights.semibold}}>{content}</p>
                <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular}}>Seen: {JSON.stringify(read)}</p>
                
            </div>
        )
    else
        return (
            <div className="subject_message_box_container" style={{boxShadow: theme.effects.elevation4 }}>
                <p style={{fontSize: FontSizes.size16, fontWeight:FontWeights.semibold}}>{content}</p>
                <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular}}>Sent on: {creationDate}</p>
                <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular}}>Valid until: {valid}</p>
            </div>
        )
}
export default MessageBox;
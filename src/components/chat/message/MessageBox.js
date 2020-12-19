import "../message/MessageBoxStyle.css";
import { FontSizes, FontWeights } from '@fluentui/theme';

function MessageBox(content, valid, from, creationDate, signed, creatorID, read) {
    
    creationDate = new Date(creationDate);
    const dateOfCreation = creationDate.toString();
    

    if(creatorID === signed)
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
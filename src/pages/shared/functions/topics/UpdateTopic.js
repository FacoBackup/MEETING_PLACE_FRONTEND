import Cookies from 'universal-cookie';
import axios from 'axios';
import Host from '../../../../Host'

async function UpdateTopic(topicID, header, body, users, hashtags) {
    try{
        await axios({
            method: 'put',
            url: Host() + 'api/topic',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                topicID: topicID,
                header: header,
                body: body,
                hashTags: hashtags,
                mentionedUsers: users
            }
        }).then(() =>
            alert("Changes Saved")
        ).catch(error => {
            console.log(error)
            alert("Some error occurred")
        })
    }catch (e) {
        console.log(e)
    }
}

export default UpdateTopic
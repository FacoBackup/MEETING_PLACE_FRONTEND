import Cookies from 'universal-cookie';
import axios from 'axios';
import Host from '../../Host'

async function UpdateTopic(topicID, header, body){
    await axios({
        method: 'put',
        url: Host()+'api/topic',
        headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
        data:{
            topicID: topicID,
            header: header,
            body: body
        }
    })
    .catch(error => {
        console.log(error)
        alert("Some error occurred")
    })

}

export default UpdateTopic
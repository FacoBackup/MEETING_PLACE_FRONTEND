import Cookies from 'universal-cookie';
import axios from 'axios';
import Host from '../../Host'

async function DeleteTopic(topicID) {
    await axios({
        method: 'delete',
        url: Host()+'api/topic',
        headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
        data:{
            topicID: topicID
        }
    })
    .catch(error => {
        console.log(error)
        alert("Some error occurred")
    })
}

export default DeleteTopic
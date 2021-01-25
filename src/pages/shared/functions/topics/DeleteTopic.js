import Cookies from 'universal-cookie';
import axios from 'axios';
import Host from '../../../../Host'

async function DeleteTopic(topicID) {
    try{
        await axios({
            method: 'delete',
            url: Host() + 'api/topic',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                topicID: topicID
            }
        }).then(() =>
            alert("Deleted With Success")
        ).catch(error => {
            console.log(error)
            alert("Some error occurred")
        })
    }catch (e) {
        console.log(e)
    }

}

export default DeleteTopic
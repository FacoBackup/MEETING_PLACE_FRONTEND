import axios from 'axios'
import Host from '../../../Host'
import Cookies from 'universal-cookie';


async function FollowUser (params){

    await axios({
        method: 'post',
        url: Host()+'api/follow',
        headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
        data: {
            subjectID: params,
            community: false
        }
    }).then(()=>{
        
    })
    .catch();
}

export default FollowUser
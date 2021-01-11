import axios from 'axios'
import Host from '../../../Host'
import Cookies from 'universal-cookie';


async function UnfollowUser (params) {
    await axios({
        method: 'delete',
        url: Host()+'api/unfollow',
        headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
        data: {
            subjectID: params,
            community: false
        }
    }).then(()=>{
    
    })
    .catch();
}

export default UnfollowUser
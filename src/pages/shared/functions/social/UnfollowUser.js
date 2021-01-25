import axios from 'axios'
import Host from '../../../../Host'
import Cookies from 'universal-cookie';


async function UnfollowUser(params) {
    try{
        await axios({
            method: 'delete',
            url: Host() + 'api/unfollow',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                subjectID: params,
                community: false
            }
        }).catch(e => console.log(e));
    }catch (e) {
        console.log(e)
    }

}

export default UnfollowUser
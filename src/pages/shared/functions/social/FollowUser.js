import axios from 'axios'
import Host from '../../../../Host'
import Cookies from 'universal-cookie';


async function FollowUser(params) {
    try{
        await axios({
            method: 'post',
            url: Host() + 'api/follow',
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

export default FollowUser
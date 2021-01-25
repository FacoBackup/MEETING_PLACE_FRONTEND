import axios from 'axios'
import Host from '../../../../Host'
import Cookies from 'universal-cookie';

async function FollowCommunity(communityID) {
    try{
        await axios({
            method: 'post',
            url: Host() + 'api/follow',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                subjectID: communityID,
                community: true
            }
        }).catch(error => console.log(error))
    }catch (e) {
        console.log(e)
    }
}

export default FollowCommunity
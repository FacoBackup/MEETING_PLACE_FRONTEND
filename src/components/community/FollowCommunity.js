import axios from 'axios'
import Host from '../../Host'
import Cookies from 'universal-cookie';

async function FollowCommunity(communityID){

    await axios({
        method: 'post',
        url: Host()+'api/follow',
        headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
        data:{
            subjectID: communityID,
            community: true
        }
    }).then(res=>{
        
    })
    .catch(error => console.log(error))
}

export default FollowCommunity
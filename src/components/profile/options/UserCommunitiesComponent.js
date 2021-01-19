import axios from 'axios';
import { FontSizes, FontWeights } from '@fluentui/theme';
import "../../../style/profile/UserCommunitiesStyle.css"
import React from 'react'
import "../../../style/profile/SocialStyle.css"
import Avatar from '@material-ui/core/Avatar'
import Host from '../../../Host'
import Cookies from 'universal-cookie';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import Button from '@material-ui/core/Button'

class UserCommunitiesComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            token: params.token,
            communities: [],
            date: new Date(),
            conversations: {},
            userID: params.userID
        }
      this.fetchData = this.fetchData.bind(this)
    }

    componentDidMount(){
        this.fetchData();
        this.timerID = setInterval(
            () => this.tick(),
            10000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
    
        this.setState({
            date: new Date(),
        });
    }

    async fetchData(){

        await axios({
            method: 'patch',
            url: Host()+'api/get/all/user/communities',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data: {
                userID: this.state.userID
            }
        }).then(res=>{
            this.setState({
                communities: res.data
            })
        })
        .catch(error => console.log(error))
    }

    render(){
        return(
            <div >
                <p style={{fontSize:'20px',fontWeight:'500', textAlign:'center'}}>Communities</p>
                {(this.state.communities.length === 0 && this.state.userID === (new Cookies()).get("ID")) ? 
                    
                    <p style={{ fontSize: FontSizes.size16, fontWeight:FontWeights.regular, textAlign:'center'}}>Looks like you are not a member of any community, try searching by one.</p>
                    
                :this.state.communities.map((community)=> 

                    <div style={{width:'20vw',display:'flex', justifyContent:'space-between', alignItems:'center', alignContent:'center', backgroundColor:'#3b424c', borderRadius:'8px', paddingRight:'10px', paddingLeft:'10px'}}>
                        <div style={{display:'flex', alignItems:'center', alignContent:'center'}}>
                            <Avatar
                                style={{ height: '55px', width: '55px' }}
                                src = {community.imageURL}
                                alt="community"
                            
                            >{typeof community.imageURL !== 'undefined' && community.imageURL !==null ? null: <PeopleAltRoundedIcon/>}</Avatar>
                            <ul>
                                <li style={{fontSize:'17px',fontWeight:'400'}}>
                                    {community.name} 
                                </li>
                                <li style={{fontSize:'17px',fontWeight:'400', color:'#aaadb1'}}>
                                    {community.about}
                                </li>
                            </ul>
                        </div>
                        <Button style={{marginLeft:'10px'}} variant="contained" disableElevation color="default" href={"/community/"+community.communityID }>See</Button>
                    </div>
                )}
            </div>      
        );
    }
}

export default UserCommunitiesComponent
import React from 'react'
import axios from 'axios'; 
import { DefaultButton } from 'office-ui-fabric-react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Host from '../../../Host'
import { FontSizes, FontWeights } from '@fluentui/theme';
import Cookies from 'universal-cookie';

class CommunityUsersComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            options: params.options,
            communityID: params.communityID,
            token: params.token,
            members:[]
        }
    }
    componentDidUpdate(lastParams){
        console.log(JSON.stringify(lastParams.options !== this.props.options))
        if(lastParams.options !== this.props.options){
            this.setState({
                members:[],
                options: this.props.options
            })
            this.fetchOptions(this.props.options)
        }
            
    }
    componentDidMount(){
        this.fetchOptions()
    }
    
    renderPageName(){
        switch(this.state.options){
            case 0:{
                return(
                    "Followers"
                )
            }
            case 1:{
                return(
                    "Members"
                )
            }
            case 2: {
                return(
                    "Moderators"
                )
            }
            default :{
                return(
                    "All Users Related To This Community"
                )
            }
        }
    }

    async fetchOptions(options){
        switch(options){
            case 0:{ //Followers
                this.setState({
                    members:[]
                })
                await axios({
                    method: 'patch',
                    url: Host()+'api/get/followers/community',
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data:{
                        communityID: this.state.communityID
                    }
                }).then(res=>{
                    this.setState({
                        members: res.data
                    })
                })
                .catch(error=>console.log(error))

                break
            }
            case 1:{ //Members
                this.setState({
                    members:[]
                })
                await axios({
                    method: 'patch',
                    url: Host()+'api/get/all/users',
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data:{
                        communityID: this.state.communityID
                    }
                }).then(res=>{
                    this.setState({
                        members: res.data
                    })
                })
                .catch(error=>console.log(error))
                
                break
            }
            case 2:{ //Moderators
                this.setState({
                    members:[]
                })
                await axios({
                    method: 'patch',
                    url: Host()+'api/get/mods',
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data:{
                        communityID: this.state.communityID
                    }
                }).then(res=>{
                    this.setState({
                        members: res.data
                    })
                })
                .catch(error=>console.log(error))
                
                break
            }
            default:{ //All
                this.setState({
                    members:[]
                })
                await axios({
                    method: 'patch',
                    url: Host()+'api/get/community/related/users',
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data:{
                        communityID: this.state.communityID
                    }
                }).then(res=>{
                    
                    this.setState({
                        members: res.data
                    })
                })
                .catch(error=>console.log(error))
                break
            }
        }
    }
    render(){
        return(
            <div className="dedicated_content_container">
                
                <p style={{textAlign:'center', fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>{this.renderPageName()}</p>
                {this.state.members.map((member) => (
                    <div className='personas_container'>
                            <Persona
                                {...{
                                    imageUrl: member.userImageURL,
                                    text: member.userName,
                                    secondaryText: (member.communityName !== null && typeof member.communityName !== 'undefined') ? "From Related Community : " +member.communityName: null,
                                    tertiaryText: (member.role !== null && typeof member.role !== 'undefined') ? "Member Role : " + member.role : null
                                }}
                                size={PersonaSize.size72}
                                imageAlt="user"
                            />
                            {member.userEmail !== (new Cookies()).get("ID") ? <DefaultButton text="Send Message" href={"/chat/"+member.userEmail+"/false/null"}/>: "" }
                    </div>
                ))}       
            </div>

        )
    }
}

export default CommunityUsersComponent
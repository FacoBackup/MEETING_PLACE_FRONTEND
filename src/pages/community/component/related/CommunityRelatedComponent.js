import React from 'react'
import axios from 'axios';
import {DefaultButton, PrimaryButton} from 'office-ui-fabric-react';
import {Persona, PersonaSize} from 'office-ui-fabric-react/lib/Persona';
import Host from '../../../../Host'
import {FontSizes, FontWeights} from '@fluentui/theme';
import Cookies from 'universal-cookie';
import FollowCommunity from '../../../shared/functions/community/FollowCommunity';

class CommunityRelatedComponent extends React.Component {
    constructor(params) {
        super(params)
        this.state = {
            relatedCommunities: [],
            communityID: params.communityID
        }
    }

    componentDidMount() {
        this.fetchRelatedCommunities()
    }

    async fetchRelatedCommunities() {
        await axios({
            method: 'patch',
            url: Host() + 'api/get/all/related/communities',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                communityID: this.state.communityID
            }
        }).then(res => {

            this.setState({
                relatedCommunities: res.data
            })
        })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div className="">
                <p style={{textAlign: 'center', fontSize: FontSizes.size18, fontWeight: FontWeights.regular}}>Related
                    Communities</p>
                {(this.state.relatedCommunities.length === 0) ? <div>
                    <p style={{textAlign: 'center', fontSize: FontSizes.size16, fontWeight: FontWeights.regular}}>No
                        communities are related to this one.</p>
                </div> : this.state.relatedCommunities.map((community) => (
                    <div className='personas_container'>
                        <Persona
                            {...{
                                imageUrl: community.imageURL,
                                text: community.name,
                                secondaryText: (typeof community.about !== 'undefined' && community.about !== null) ? "About this component: " + community.about : null,
                                tertiaryText: (community.role !== null && typeof community.role !== 'undefined') ? "Your role in this one: " + community.role : null
                            }}
                            size={PersonaSize.size72}
                            imageAlt="community"
                        />
                        <DefaultButton text="See Community" href={"/component/" + community.communityID}/>
                        {typeof community.role === 'undefined' ?
                            <PrimaryButton text="Follow Community" onClick={() => FollowCommunity()}/> :
                            <DefaultButton text="Quit Community" disabled={true}/>}
                    </div>
                ))}

            </div>

        )
    }
}

export default CommunityRelatedComponent

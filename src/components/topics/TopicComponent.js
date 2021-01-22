import React from 'react';
import "../../style/topics/TopicStyles.css"
import {FontSizes, FontWeights} from '@fluentui/theme';
import axios from 'axios';
import Dexie from "dexie";
import Host from '../../Host'
import TopicBoxComponent from './box/TopicBoxComponet'
import InfiniteScroll from 'react-infinite-scroll-component'

import Skeleton from '@material-ui/lab/Skeleton'

class TopicComponent extends React.Component {

    constructor(params) {
        super(params)
        this.state = {
            token: params.token,
            db: new Dexie('api_web_db'),
            community: params.community,
            subjectID: params.subjectID,
            timeline: params.timeline,
            hasMore: true,
            topics: [],
            isLoading: true,
            maxID: null
        }
    }

    componentDidMount() { //here

        if (this.state.timeline === false)
            this.fetchSubjectTopics().then(r => console.log(r))
        else
            this.fetchTimeline().then(r => console.log(r))
    }

    async fetchTimeline() {
        try{
            this.setState({
                isLoading: true
            })
            if (this.state.hasMore === true) {
                await axios({
                    method: 'patch',
                    url: Host() + 'api/fetch/timeline',
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data: {
                        maxID: this.state.maxID
                    }
                }).then(res => {
                    const size = res.data.length

                    if (size !== 'undefined' && size > 0 && this.state.hasMore === true)
                        this.setState({
                            topics: [...this.state.topics, ...res.data],
                            maxID: res.data[size - 1].id

                        })

                    this.setState({
                        isLoading: false,
                        hasMore: size >= 5
                    })

                }).catch(error => {
                    console.log(error)
                });
            }
        }catch (e) {
            console.log(e)
        }
    }

    async fetchSubjectTopics() {
       try{
           this.setState({
               isLoading: true
           })
           await axios({
               method: 'patch',
               url: Host() + "api/fetch/topics/subject",
               headers: {"Authorization": 'Bearer ' + this.state.token},
               data: {
                   subjectID: this.state.subjectID,
                   community: this.state.community,
                   maxID: this.state.maxID
               }

           }).then(res => {
               const size = res.data.length

               if (size !== 'undefined' && size > 0)
                   this.setState({
                       topics: [...this.state.topics, ...res.data],
                       maxID: res.data[size - 1].id,
                       hasMore: size >= 10
                   })
           }).catch(error => {
               console.log(error)
           });
           this.setState({
               isLoading: false
           })
       }catch (e) {
           console.log(e)
       }
    }


    renderTopic() {

        return (
            <>
                <InfiniteScroll
                    dataLength={this.state.topics.length}
                    next={() => this.state.timeline === true ? this.fetchTimeline() : this.fetchSubjectTopics()}
                    loader={console.log("LOADING")}
                    inverse={false}
                    hasMore={this.state.hasMore}
                >
                    {this.state.topics === [] ? null : this.state.topics.map(topic => (
                        <TopicBoxComponent topic={topic}/>
                    ))}
                </InfiniteScroll>

                {this.state.isLoading === true ?
                    <div className="profile_topics_container">
                        <div className="topic_container"
                             style={{display: 'grid', justifyContent: 'center', alignContent: "center", rowGap: '1vh'}}>
                            <Skeleton variant="rect" width={'35vw'} height={'10vh'}
                                      style={{backgroundColor: 'rgba(255,255,255,.2)', borderRadius: '8px'}}/>
                            <Skeleton variant="text"
                                      style={{backgroundColor: 'rgba(255,255,255,.2)', borderRadius: '8px'}}/>
                            <Skeleton variant="text"
                                      style={{backgroundColor: 'rgba(255,255,255,.2)', borderRadius: '8px'}}/>
                            <Skeleton variant="rect" width={'35vw'} height={'40vh'}
                                      style={{backgroundColor: 'rgba(255,255,255,.2)', borderRadius: '8px'}}/>
                        </div>
                    </div>
                    : null}
                <div className="timeline_end_container topic_container">
                    <p style={{fontSize: FontSizes.size18, fontWeight: FontWeights.regular}}>You are all caught up for
                        now</p>
                </div>
            </>
        )
    }

    render() {

        return (
            <>
                {this.renderTopic()}
            </>
        )
    }
}

export default TopicComponent
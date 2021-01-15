import React from 'react';
import "../../style/topics/TopicCreationStyle.css"
import { FontSizes, FontWeights } from '@fluentui/theme';
import axios from 'axios';
import Dexie from "dexie";
import Host from '../../Host'
import TopicBoxComponent from './box/TopicBoxComponet'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import Skeleton from '@material-ui/lab/Skeleton'

class TopicComponent extends React.Component{
    
    constructor(params){
        super(params)
        this.state={
            token: params.token,   
            db: new Dexie('api_web_db'),
            community: params.community,
            subjectID: params.subjectID,
            timeline: params.timeline,
            hasMore: true,
            topics: [],
            isLoading: true,
            lastPage: Date.now()
        }
    }

    componentDidMount(){ //here
        if(this.state.timeline === false)
            this.fetchSubjectTopics()
        else
            this.fetchTimeline()
    }

    async fetchTimeline(){
        this.setState({
            isLoading: true
        })
        await axios({
            method: 'patch',
            url:  Host()+'api/fetch/timeline' ,
            headers: {"Authorization": 'Bearer ' +this.state.token},      
            data:{
                timePeriod: this.state.lastPage
            }     
        }).then(res=>{
            const size = res.data.length
            
            if(size !== 'undefined' && size > 0)
                this.setState({
                    topics:[...this.state.topics, ...res.data],
                    lastPage: res.data[size-1].creationDate-1,
                    hasMore: size < 10 ? false: true
                })

            this.setState({
                isLoading: false
            })
        })
        .catch(error => {
            console.log(error)
        });
        
    }

    async fetchSubjectTopics(){
        console.log(this.state.lastPage)
        this.setState({
            isLoading: true
        })
        await axios({
            method: 'patch',
            url:  Host()+"api/fetch/topics/subject",
            headers: {"Authorization": 'Bearer ' +this.state.token},
            data:{
                subjectID: this.state.subjectID,
                community: this.state.community, 
                timePeriod: this.state.lastPage
            }
            
        }).then(res=>{
            console.log("FETCHED -> " + JSON.stringify(res.data))
            const size = res.data.length
            
            if(size !== 'undefined' && size > 0)
                this.setState({
                    topics:[...this.state.topics, ...res.data],
                    lastPage: res.data[size-1].creationDate-1,
                    hasMore: size < 10 ? false: true
                })
        })
        .catch(error => {
            console.log(error)
        });
        this.setState({
            isLoading: false
        })
    }


    renderTopic(){
        
        return(
            <div>
                <div >
                 
                    <InfiniteScroll
                        dataLength={this.state.topics.length} 
                        next={() => this.state.timeline === true ? this.fetchTimeline():this.fetchSubjectTopics()}

                        inverse={false}
                        hasMore={this.state.hasMore}
                        >
                            {this.state.topics === [] ? <div></div> : this.state.topics.map(topic => (
                                <TopicBoxComponent topic ={topic}/>
                            ))}
                    </InfiniteScroll>

                  
                </div>
                   
                {this.state.isLoading === true ? <div className="topic_container" style={{display:'grid',justifyContent:'center', alignContent:"center", rowGap:'1vh'}}> 
                    <Skeleton variant="rect" width={700} height={100} style={{backgroundColor:'rgba(255,255,255,.2)', borderRadius:'8px'}}/>
                    <Skeleton variant="text" style={{backgroundColor:'rgba(255,255,255,.2)', borderRadius:'8px'}} />
                    <Skeleton variant="text" style={{backgroundColor:'rgba(255,255,255,.2)', borderRadius:'8px'}} />
                    
                    <Skeleton variant="rect" width={700} height={500} style={{backgroundColor:'rgba(255,255,255,.2)', borderRadius:'8px'}}/>
                    
                    </div>: null}
                <div className="timeline_end_container">
                    <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>You are all caught up for now</p>
                </div>
            </div>
        )
    }
    render(){
        
        return(
            <div>
                {this.renderTopic()}  
            </div>
        )
    }
}

export default TopicComponent
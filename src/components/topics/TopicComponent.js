import React from 'react';
import "./TopicCreationStyle.css"
import { DefaultButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import axios from 'axios';
import Dexie from "dexie";
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Host from '../../Host'
import Cookies from 'universal-cookie';


class TopicComponent extends React.Component{
    
    constructor(params){
        super(params)
        this.state={
            token: params.token,   
            db: new Dexie('api_web_db'),
            community: params.community,
            subjectID: params.subjectID,
            timeline: params.timeline,
            topics: []
        }
    }
    componentDidMount(){ //here
        this.fetchData()
    }
    
    async setTopics(){      
        this.setState({
            topics: await (this.state.community === true ? this.state.db.topics.where("communityID").equals(this.state.subjectID).sortBy('creationDate') : this.state.db.topics.where("creatorID").equals(this.state.subjectID)).sortBy('creationDate')
        })        
    }
    async insertTopics(res){
        console.log("----->"+JSON.stringify(res))
        this.state.db.transaction('rw', this.state.db.topics, async() => {
            
            res.forEach(topic => {
                if(this.state.timeline === true){

                }
            
                const value = this.state.db.topics.where('id').equals(topic.id).toArray()
                
                if(value.length === 0 || typeof value.length === 'undefined')
                    this.state.db.topics.add({
                        id: topic.id, 
                        header: topic.header, 
                        body: topic.body, 
                        approved: topic.approved, 
                        creatorID: topic.creatorID,
                        mainTopicID: topic.mainTopicID, 
                        creationDate: topic.creationDate, 
                        communityID: topic.communityID,
                        imageURL: topic.imageURL,
                        subjectName: topic.subjectName,
                        communityName: topic.communityName,
                        subjectImageURL: topic.subjectImageURL
                    })
            });
        }).catch(error=>console.log(error))
       
    }
    async fetchData(){  
        console.log("VALUES FOUND IN TOPICS -> " + JSON.stringify(this.state.topics))
        if(this.state.db.isOpen() === false){
            this.state.db.version(1).stores({
                messages: "id,content,imageURL,creatorID, conversationID, type, valid, creationDate, seenByEveryone, receiverAsUserID",
                topics: "id,header,body,approved, creatorID, mainTopicID, creationDate, communityID, imageURL,subjectName, communityName, subjectImageURL"
            }) 
        }
        await this.state.db.open().catch((error) => {
            console.log(error)
        }) 
        const data = await (this.state.community === true ? this.state.db.topics.where("communityID").equals(this.state.subjectID).toArray() : this.state.db.topics.where("creatorID").equals(this.state.subjectID)).toArray()
        //here
        await axios({
            method: (this.state.topics === true ? 'patch': 'get'),
            url: (this.state.topics === true ? Host()+"api/get/topics/subject" : (data.lenght === 0 || typeof data.lenght === 'undefined' ? Host()+'api/timeline/all': Host()+'api/timeline/new')),
            headers: {"Authorization": 'Bearer ' +this.state.token},
            data:{
                subjectID: (this.state.timeline === true) ? (new Cookies()).get("ID") : this.state.subjectID,
                community: (this.state.timeline === true) ? false : this.state.community   
            }
            
        }).then(res=>{
            console.log("VALUES FOUND IN RESPONSE -> " + JSON.stringify(res.data))
            if(typeof res.data != "undefined" && res.data != null && res.data.length != null && res.data.length !== 0){
                this.insertTopics(res.data)
            }
            this.setTopics()
        })
        .catch(error => {
            console.log(error)
        });
        

    }
    render(){
        return(
            <div>
                <div >
                    {this.state.topics === [] ? <div></div> : this.state.topics.map(topic => (
                        <div className="topic_container"> 
                            <div className="topic_creator_persona_container">
                                <Persona
                                    {...{
                                        imageUrl:(topic.subjectImageURL === null) ?  topic.subjectImageURL.imageURL :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                        text: topic.subjectName,
                                        secondaryText: (typeof topic.communityID === 'undefined' ? topic.creatorID :  topic.communityName)
                                    }}
                                    size={PersonaSize.size48}
                                    imageAlt="User"
                                />
                                <p style={{ fontSize: FontSizes.size14, fontWeight:FontWeights.regular, color:"#3b3a39"}}>Sent on: {(new Date(topic.creationDate)).toLocaleString()}</p>
                            </div>
                            <div className="topic_fields_container">
                                <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>{topic.header}</p>
                                <p style={{ fontSize: FontSizes.size16, fontWeight:FontWeights.semilight}}>{topic.body}</p>
                            </div>
                            <div className="topic_image_container">
                                <img style={{borderRadius:'8px', width:'100%', height: '100%'}}alt="Topic" src={ (topic.imageURL !== null) ? topic.imageURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU"}/>
                            
                            </div>
                            {/* <div style={{textAlign:'center'}}>
                              
                            </div> */}
                            <div className="topic_buttons_container">
                                <DefaultButton text="Like" disabled={true}/> 
                                <DefaultButton text="Dislike" disabled={true}/> 
                                <DefaultButton text="Comment" disabled={true}/> 
                                <DefaultButton text="Share" disabled={true}/> 
                            </div>
                        </div>
                    ))}
                </div>
                <div className="timeline_end_container">
                    <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>You are all caught up for now</p>
                </div>
            </div>
        )
    }
}

export default TopicComponent
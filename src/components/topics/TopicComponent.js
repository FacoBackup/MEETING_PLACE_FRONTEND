import React from 'react';
import "./TopicCreationStyle.css"
import { DefaultButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import axios from 'axios';
import Dexie from "dexie";
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Host from '../../Host'
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

    setupDB(){      
        if(this.state.db.isOpen() === false){
          
            this.state.db.version(1).stores({
                topics: "id,header,body,approved, creatorID, mainTopicID, creationDate, communityID, imageURL"
            })
        }
      }
    
    async setTopics(){      
        this.setState({
            topics: await this.state.db.topics.sortBy('creationDate')
        })        
    }
    async insertTopics(res){
   
        this.state.db.transaction('rw', this.state.db.topics, async() => {
            res.forEach(topic => {
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
                        imageURL: topic.imageURL 
                    })
            });
        }).catch(error=>console.log(error))
       
    }
    async fetchData(){
        console.log("TOPIC -> " + JSON.stringify(this.state.topics))
        if(this.state.db.isOpen() === false){
                
            this.setupDB()
            this.state.db.open().catch((error) => {
                console.log(error)
            }) 
        }

        const data = await this.state.db.topics.toArray()

        
        await axios({
            method: (this.state.topics === true ? 'get':'patch'),
            url: (this.state.topics === true ?(data.lenght === 0 || typeof data.lenght === 'undefined' ? Host()+'api/timeline/all': Host()+'api/timeline/new') : Host()+"api/get/topics/subject"),
            headers: {"Authorization": 'Bearer ' +this.state.token},
            data:{
                subjectID:this.state.subjectID,
                community: this.state.community                
            }
            
        }).then(res=>{
        
            if(typeof res.data != "undefined" && res.data != null && res.data.length != null && res.data.length !== 0){
                this.insertTopics(res.data)
            }
            this.setMessages()
        })
        .catch(error => {
            console.log(error)
        });
        

    }
    render(){
        return(
            <div>
                <div className="topic_container">
                    {this.state.topics === [] ? <div></div> : this.state.topics.map(topic => (
                        <div>
                            <div className="topic_creator_persona_container">
                                <Persona
                                    {...{
                                        imageUrl:(topic.subjectImageURL === null) ?  topic.subjectImageURL.imageURL :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                        text: topic.subjectName,
                                        secondaryText: (topic.communityID !== null ? topic.communityName : topic.creatorID)
                                    }}
                                    size={PersonaSize.size48}
                                    imageAlt="User"
                                />
                            </div>
                            <div className="topic_fields_container">
                                <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>{topic.header}</p>
                                <p style={{ fontSize: FontSizes.size16, fontWeight:FontWeights.semilight}}>{topic.body}</p>
                            </div>
                            <div className="topic_image_container">
                                <img style={{borderRadius:'8px', width:'100%', height: '100%'}}alt="Topic" src={ (topic.imageURL !== null) ? topic.imageURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU"}/>
                            </div>
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
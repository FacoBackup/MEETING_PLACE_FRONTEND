import React from 'react';
import "./TopicCreationStyle.css"
import { DefaultButton,Modal, PrimaryButton } from 'office-ui-fabric-react';
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
            topics: [],
            deleteModal: false
        }
    }

    componentDidMount(){ //here
        if(this.state.timeline === false)
            this.fetchSubjectTopics()
        else
            this.fetchTimeline()
    }
    
    async setTimeline(){      
        // .sortBy('creationDate')
        this.setState({
            topics: await this.state.db.topics.orderBy('creationDate').reverse().toArray()
        })        
    }

    async insertTimeline(res){
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
                        imageURL: topic.imageURL,
                        subjectName: topic.subjectName,
                        communityName: topic.communityName,
                        subjectImageURL: topic.subjectImageURL
                    })
            });

            // this.state.db.topics.until('creationDate').equals(((new Date()).getTime())-259200000).delete() //delete all topics older than 3 days
           
        }).catch(error=>console.log(error))
       
    }
    
    async fetchTimeline(){

        if(this.state.db.isOpen() === false){
            this.state.db.version(1).stores({
                messages: "id,content,imageURL,creatorID, conversationID, type, valid, creationDate, seenByEveryone, receiverAsUserID",
                topics: "id,header,body,approved, creatorID, mainTopicID, creationDate, communityID, imageURL,subjectName, communityName, subjectImageURL"
            }) 
        }
        await this.state.db.open().catch((error) => {
            console.log(error)
        }) 

        const data = await this.state.db.topics.toArray()

        await axios({
            method: 'get',
            url:  Host()+((data.length === 0 || typeof data.length === 'undefined') ? 'api/timeline/all':'api/timeline/new') ,
            headers: {"Authorization": 'Bearer ' +this.state.token},            
        }).then(res=>{
            console.log("TIMELINE ITEMS -> "+ JSON.stringify(res.data))
            if(typeof res.data != "undefined" && res.data != null && res.data.length != null && res.data.length !== 0)
               this.insertTimeline(res.data)
            this.setTimeline()
        })
        .catch(error => {
            console.log(error)
        });
    }

    async fetchSubjectTopics(){
        await axios({
            method: 'patch',
            url:  Host()+"api/get/topics/subject",
            headers: {"Authorization": 'Bearer ' +this.state.token},
            data:{
                subjectID: this.state.subjectID,
                community: this.state.community   
            }
            
        }).then(res=>{
            if(typeof res.data != "undefined" && res.data != null && res.data.length != null && res.data.length !== 0){
                this.setState({
                    topics:(res.data)
                })
            }
        })
        .catch(error => {
            console.log(error)
        });
    }

    async deleteTopic(topicID){
        await axios({
            method: 'delete',
            url: Host()+'api/topic',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data:{
                topicID: topicID
            }
        }).then(res=>{
  
            window.location.reload()
        })
        .catch(error => console.log(error))
    }

    renderEditButton(creator, topicID){
        if(creator === (new Cookies()).get("ID")){
            return(
                <div >
                    <DefaultButton text="Edit" style={{marginRight: '1vh'}}/>
                </div>
            )
        }
    }
    renderDeleteButton(creator){
        if(creator === (new Cookies()).get("ID"))
            return(
                <div>
                     <DefaultButton text="Delete" style ={{color: "white",backgroundColor:'red'}} onClick={() => this.setState({
                        deleteModal: true
                    })}/>
                </div>
            )
    }
    renderImage(topic){
        if(typeof topic.imageURL !== 'undefined')
            return(
                <div className="topic_image_container">
                    <img style={{borderRadius:'8px', width:'100%', height: '100%'}}alt="Topic" src={topic.imageURL}/>
                </div>
            )
    }
    renderModal(topicID){
        if(this.state.deleteModal === true)
            return(
                <Modal
                titleAriaId={"TESTE"}
                isOpen={true}
                onDismiss={true}
                isBlocking={false}
                
                > 
                    <div style={{marginTop: '18%',display: 'grid', justifyContent:'center', placeItems: 'center', rowGap:'1vh'}}>

                        <DefaultButton text="Are you sure?" onClick={() => this.deleteTopic(topicID)}/>
                        <PrimaryButton text="Cancel" onClick={() => this.setState({
                            deleteModal: false
                        })}/>
                    </div>
                </Modal>
            )
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
                                    size={PersonaSize.size56}
                                    imageAlt="User"
                                />
                                
                                <p style={{ fontSize: FontSizes.size14, fontWeight:FontWeights.regular, color:"#3b3a39"}}>Created on: {(new Date(topic.creationDate)).toLocaleString()}</p>
                            </div>
                            <div className="topic_fields_container">
                                <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>{topic.header}</p>
                                <p style={{ fontSize: FontSizes.size16, fontWeight:FontWeights.semilight}}>{topic.body}</p>
                            </div>
                    
                            {this.renderImage(topic)}  
                            {this.renderModal(topic.id)}
                          
                            <div className="topic_buttons_container">
                                <DefaultButton text="Like" disabled={true}/> 
                                <DefaultButton text="Dislike" disabled={true}/> 
                                <DefaultButton text="Comment" disabled={true}/> 
                                <DefaultButton text="Share" disabled={true}/> 
                                {this.renderEditButton(topic.creatorID, topic.id)}
                                {this.renderDeleteButton(topic.creatorID)}
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
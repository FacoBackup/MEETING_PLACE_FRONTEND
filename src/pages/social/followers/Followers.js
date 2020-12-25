import React from 'react';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../../style/PageModel.css"
import "../SocialStyle.css"
import Profile from "../../../components/profile/Profile"
import ConversationBar from "../../../components/conversations/ConversationBar"
import { getTheme } from '@fluentui/react';
import { NeutralColors } from '@fluentui/theme';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

class Followers extends React.Component{
    constructor(){
        super()
        this.state={
            cookies: new Cookies(),
            followers: [],
            date: new Date(),
            theme: getTheme()
        } 
    }
    componentDidMount(){
        this.timerID = setInterval(
            () => this.tick(),
            10000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        this.fetchData();
        this.setState({
            date: new Date(),
        });
    }
    fetchData = async () => {
        await axios({
            method: 'get',
            url: 'http://localhost:8080/api/follower',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},

        }).then(res=>{
            this.setState({
                followers: res.data
            })
        })
        .catch(error => {
            console.log(error);
        });
    }

    render(){
        return(
            <div className="page_container">
                
                <div className="left_components" style={{boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}}>
                    <Profile/>
                </div>
                <div className="center_component social_component_container" style={{boxShadow: this.state.theme.effects.elevation8}}>
                    <div className="socail_info_container">
                    <p style={{textAlign:'center'}}>Followers</p>
                    {this.state.followers.map((follower)=> 
                         <Persona
                         {...{
                             imageUrl: (follower.imageURL === null) ?  follower.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                             text: follower.name,
                             secondaryText: follower.email
                         }}
                         size={PersonaSize.size48}
                         imageAlt="Conversation picture"
                     />
                    )}
                    </div>
                </div>
               <div className="right_components" style={{boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}}>
                    <ConversationBar/>
               </div>
            </div>
        );
    }
    
}

export default Followers;
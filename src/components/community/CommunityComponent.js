import "./CommunityComponentStyle.css"
import axios from 'axios'; 
import { Redirect } from "react-router-dom";

class CommunityComponent extends React.Component{
    constructor(params){
        super()
        this.state={
            community: {},
            communityID: params.communityID
        }
    }

    async fetchData(){
        await axios({
            method: 'patch',
            url: 'http://localhost:8080/api/get/community',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
            data:{
                communityID: this.state.communityID
            }
        }).then(res=>{
            this.setState({
                community: res.data
            })
        })
        .catch(error=>console.log(error))
    }

    render(){
        if(this.state.community !== {})
            return(
                <div>
                    Opa
                </div>
            )
        else{
            alert("Some error ocurred")
            return(
                <Redirect to='/'/>
            )
        } 
            
    }
}

export default CommunityComponent;
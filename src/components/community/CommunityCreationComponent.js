import { Redirect } from "react-router-dom"
import axios from 'axios';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import "./CommunityCreationComponentStyle.css"
import React from 'react'


class CommunityCreationComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            token: params.token,
            name: '',
            about:'',
            imageURL: null,
            parentCommunityID: null,
            created: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.createCommunity = this.createCommunity.bind(this)
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async createCommunity(){
        console.log(this.state.token)
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/community',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data:{
                about : this.state.about,
                name : this.state.name,
                parentCommunityID: this.state.parentCommunityID,
                imageURL: this.state.imageURL
            }
        }).then(()=>{
            this.setState({
                created: true
            })
        })
        .catch(error => console.log(error))
    }

    render(){
        if(this.state.created === false)
            return(
                <div>
                    <div className="community_creation_component">
                        <div className="community_creation_title">
                            <p style={{ fontSize: FontSizes.size20, fontWeight:FontWeights.regular }}>Create Your Own Community</p>
                        </div>
                        <div className="community_creation_fields">
                            <TextField placeholder="Name" name='name' onChange={this.handleChange}/>
                            <TextField placeholder="About This Community" name='about' onChange={this.handleChange}/>
                            <TextField placeholder="Parent Community" disabled={true}/>
                        </div>
                        <div className="community_creation_buttons">
                            
                            <DefaultButton text="Upload Image" disabled={true}/>
                            <DefaultButton text="PlaceHolder" disabled={true}/>                            
                            <PrimaryButton text="Create" onClick={this.createCommunity}/>
                        </div>
                    </div>
                </div>
            )
        else{
            alert("Created With Success")
            return(
                <Redirect to={'/'}/>
            )        
        }
    
    }
}

export default CommunityCreationComponent
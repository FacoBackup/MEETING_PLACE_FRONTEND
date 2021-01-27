import React from 'react'
import axios from 'axios'
import Host from '../../../../Host'
import Cookies from 'universal-cookie'
import {Link} from "react-router-dom";

export default class TrendingComponent extends React.Component{
    numberOfTopics;
    tagValue;
    constructor(params){
        super(params)
        this.state={
            selectedTag: params.tagID,
            trending: []
        }
    }

    componentDidMount() {
        this.fetchTrending().catch(e => console.log(e))
    }

    async fetchTrending() {
        try{
            await axios({
                method: 'get',
                url: Host() + 'api/fetch/trending',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")}
            }).then(res => {
                console.log("IT IS HERE")
                console.log(res)
                this.setState({
                    trending: res.data
                })
            }).catch(error => {
                console.log(error)
            });

        }catch (e) {
            console.log(e)
        }
    }
    render(){
        return(
            <div className={"right_bottom_half_container"}>
                <div className={"component_title_container"}>
                    <p style={{
                        marginLeft: '1vw',
                        fontWeight: '400',
                        color:'#ededed',
                        textTransform: 'capitalize'
                    }}>Top Tags</p>
                </div>
                <div>
                    {this.state.trending.map(tag => (
                        <Link to={"/home/"+tag.tagID} style={{textDecoration:'none', color:'white'}}>
                            <div className={parseInt(this.state.selectedTag) !== tag.tagID ?"content_bar_box_container" : "content_bar_selected_item_box_container"}>
                                <div>
                                    <p>{tag.tagValue}</p>
                                </div>
                                <div>
                                    <p style={{color:'#aaadb1'}}>{tag.numberOfTopics}</p>
                                </div>

                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }
}
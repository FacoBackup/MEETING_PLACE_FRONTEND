import React from 'react'
import axios from 'axios'
import Host from '../../../../Host'
import Cookies from 'universal-cookie'

export default class TrendingComponent extends React.Component{
    constructor(){
        super(null)
        this.state={
            trending: []
        }
    }

    async fetchTrending() {
        try{
            await axios({
                method: 'get',
                url: Host() + 'api/fetch/trending',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")}
            }).then(res => {
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
                    }}>Trending</p>
                </div>
            </div>
        )
    }
}
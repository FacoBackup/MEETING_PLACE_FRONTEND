import React from 'react'
import "../../style/front/FrontComponentsStyle.css"
import News from '../../components/front/news/FrontNewsComponent'
import SideBar from '../../components/front/bar/FrontSideBarComponent'
import Trending from '../../components/front/trending/FrontTrendingComponent'
class Front extends React.Component{

    render(){
        return(
            <div>
                <div className="left_components">
                    <SideBar/>
                </div>    
                <div className="right_components">
                    <Trending/>
                    
                </div>
                <div className="center_component">
                     <News />    
                </div>    
              
            </div>
        )
    }
}

export default Front;
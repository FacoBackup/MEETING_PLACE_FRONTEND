import React from 'react'
import "../../style/dashboard/DashboardComponentsStyle.css"
import News from '../../components/dashboard/news/FrontNewsComponent'
import SideBar from '../../components/dashboard/bar/FrontSideBarComponent'
import Trending from '../../components/dashboard/trending/FrontTrendingComponent'

class Front extends React.Component {

    render() {
        return (
            <div>
                <div className="left_components">
                    <SideBar/>
                </div>
                <div className="right_components">
                    <Trending/>

                </div>
                <div className="center_component">
                    <News/>
                </div>

            </div>
        )
    }
}

export default Front;
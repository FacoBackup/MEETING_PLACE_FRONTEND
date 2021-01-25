import React from 'react'
import "./styles/DashboardComponentsStyle.css"
import News from './component/news/FrontNewsComponent'
import SideBar from './component/bar/FrontSideBarComponent'
import Trending from './component/trending/FrontTrendingComponent'

class Dashboard extends React.Component {

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

export default Dashboard;
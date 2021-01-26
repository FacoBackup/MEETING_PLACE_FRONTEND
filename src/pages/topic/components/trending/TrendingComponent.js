import React from 'react'

export default class TrendingComponent extends React.Component{
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
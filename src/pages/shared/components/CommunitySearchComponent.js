import axios from 'axios';
import React from 'react'
import "../../profile/styles/SocialStyle.css"
import {createMuiTheme} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";
import Host from '../../../Host'
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

class CommunitySearchComponent extends React.Component {
    constructor(params) {
        super(params)
        this.state = {
            token: params.token,
            communities: [],
            date: new Date(),
            searchInput: '',
            maxID: null
        }
        this.fetchData = this.fetchData.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {

        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {

        this.fetchData().then(r => console.log(r))
        this.setState({
            date: new Date(),
        });
    }

    handleChange(event) {

        this.setState({
            searchInput: event.target.value
        })
        this.fetchData().then(r => console.log(r))
    }

    async fetchData() {
        try{
            await axios({
                method: 'get',
                url: Host() + 'api/moderator/in',
                headers: {"Authorization": 'Bearer ' + this.state.token}
            }).then(res => {
                const size = res.data.length
                if(typeof size !== 'undefined' && size > 0){
                    this.setState({
                        communities: res.data
                    })
                }
            }).catch(error => console.log(error))
        }catch (e) {
            console.log(e)
        }
    }

    selectCommunity(community) {
        sessionStorage.setItem("SELECTED_COMMUNITY", JSON.stringify(community))
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div >
                    {this.state.communities.map((subject) =>
                        <div className={"subject_content_container"}>

                            <Avatar
                                style={{height: '55px', width: '55px'}}
                                src={subject.imageURL}
                                alt="community"

                            />
                            <ul>
                                <li style={{fontSize: '17px', fontWeight: '400'}}>
                                    {subject.name}
                                </li>
                                <li style={{fontWeight: '400', color: '#aaadb1', fontSize:'17px'}}>
                                    {subject.about}
                                </li>
                            </ul>

                            <Button variant="contained" color="primary" onClick={() => this.selectCommunity(subject)} disableElevation>Select</Button>
                        </div>
                    )}
                </div>
            </ThemeProvider>
        )
    }
}

export default CommunitySearchComponent
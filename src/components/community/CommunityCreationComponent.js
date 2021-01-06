
class CommunityCreationComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            token: params.token,
            name: '',
            about:'',
            imageURL:'',

        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async createCommunity(){

    }

    render(){
        return(
            <div>
                Hello
            </div>
        )
    }
}

export default CommunityCreationComponent
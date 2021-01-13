async function SendMessageComponent (userID){
    const SendMessage = async() => {
        await axios({
            method: 'post',
            url: (this.state.isGroup === true) ? Host()+ 'api/message/group': Host()+ 'api/message/user',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data: {
                message: this.state.messageInput,
                imageURL: this.state.imageURL,
                receiverID:(this.state.isGroup === true) ? null : this.state.receiverName,
                isGroup: this.state.isGroup,
                conversationID: (this.state.isGroup === true) ? this.state.conversationID: ""
            }
        })
        .then(()=>{
        })
        .catch(error => {
            console.log(error);
        });       
    }
}
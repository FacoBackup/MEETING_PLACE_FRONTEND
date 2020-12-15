function Error({error}) {
    return (
        <div>
            <h1>Error Code</h1>
            <p>{error.response.status}</p>
            <br/>
            <h1>Error Message</h1>
            <p>{error.response.message}</p>
        </div>
    )
}

export default Error;
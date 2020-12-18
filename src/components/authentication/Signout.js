import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import { useEffect} from 'react';

function SignOut(){

    const cookies = new Cookies();

    useEffect(() =>{
        fetchData();
     })   

    async function fetchData () {
        if(typeof cookies.get("JWT") !== 'undefined'){
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/logout',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT")}
            }).then(()=>{
                cookies.remove("JWT");
                cookies.remove('ID');
            })
            .catch(error=>{
                console.log(cookies.get("JWT"))
            }
            )
        }

    }
    
    return(<Redirect to="/authenticate"/>)
    
}

export default SignOut;
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import { useEffect} from 'react';

const cookies = new Cookies();
function SignOut(){
         
    const fetchData = async() => {
        if(typeof cookies.get("JWT") !== 'undefined'){
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/logout',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT").data}
            }).then(response=>{
                cookies.remove("JWT")
                return(<Redirect to="/authenticate"/>)
            })
            .catch(()=> {
                return(<Redirect to="/authenticate"/>)
            });
        }
    }

    useEffect(() =>{
        fetchData();
     },[])   

    return(<Redirect to="/authenticate"/>)
}

export default SignOut;
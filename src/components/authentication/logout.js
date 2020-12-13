import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import { useEffect} from 'react';

const cookies = new Cookies();
function Logout(){
         
    const fetchData = async() => {
        if(typeof cookies.get("JWT") !== 'undefined'){
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/logout',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT").data}
            }).then(response=>{
                cookies.remove("JWT")
                return(<Redirect to="/login"/>)
            })
            .catch(()=> {
                return(<Redirect to="/login"/>)
            });
        }
    }

    useEffect(() =>{
        fetchData();
     },[])   

    return(<Redirect to="/login"/>)
}

export default Logout;
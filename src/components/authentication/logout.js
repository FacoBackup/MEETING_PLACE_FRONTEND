import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import { useEffect} from 'react';

const cookies = new Cookies();
function Logout(){
         
    const fetchData = async() => {
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/logout',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT").data}
        }).then(response=>{
            cookies.remove("JWT")
            return(<Redirect to="/login"/>)
        })
        .catch(error => {
            if(error.response.status === 401)
                return(<Redirect to="/login"/>)
            else{
                alert(error)
                alert("Some error occured")
            }
                
    
        });
    }

    useEffect(() =>{
        fetchData();
     },[])   

    return(<Redirect to="/login"/>)
}

export default Logout;
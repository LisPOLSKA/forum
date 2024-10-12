import React from "react";
import axios from "axios";
import { useState } from "react";

const Logout = () => {
    const [err, setErr] = useState(null);
    const handleClick = async e =>{
        e.preventDefault()
    
        try{
          await axios.post("http://localhost:8800/api/auth/logout")
        }catch(err){
          setErr(err.response?.data);
        }
      }
    handleClick();
  return (<div>
  </div>);
};

export default Logout;

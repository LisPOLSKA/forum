import { useState } from "react"
import "./register.scss"
import {Link} from "react-router-dom"
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username:"",
    email:"",
    password:"",
    checkPassword:"",
  })
  const [err, setErr] = useState(null);

  const handleChange = e =>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}));
  }

  const handleClick = async e =>{
    e.preventDefault()

    try{
      await axios.post("http://localhost:8800/api/auth/register", inputs)
    }catch(err){
      setErr(err.response.data);
    }
  }

  console.log(err);

  return (
    <div className="register">
      <div className="card">
        <div className="mid">
          <h1>Rejestracja</h1>
          <form>
            <input type="text" placeholder="Nazwa użytkownika" name="username" onChange={handleChange}/>
            <input type="email" placeholder="E-mail" name="email" onChange={handleChange}/>
            <input type="password" placeholder="Hasło" name="password" onChange={handleChange}/>
            <input type="password" placeholder="Powtórz Hasło" name="checkPassword" onChange={handleChange}/>
            <button onClick={handleClick}>Zarejstruj</button>
            {err && err}
          </form>
          <Link to="/login">
            <span>Strona logowania</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
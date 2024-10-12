import { useState, useRef } from "react"
import "./register.scss"
import {Link} from "react-router-dom"
import axios from "axios";
import React from "react";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from 'react-router-dom'


const Register = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const usernameRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value){
      return setError('Hasła nie są takie same')
    }
    try{
      setError('')
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value, usernameRef.current.value)
      navigate("/");
    }catch(err){
      var errorMessage = err.message
      if(errorMessage === 'auth/weak-password'){
        setError("Za słabe hasło")
      }else if(errorMessage === 'auth/invalid-email'){
        setError("Nieprawidłowy email")
      }else{
        setError(err.message || 'Nie udała się utworzyć konta')
      }
    }
    setLoading(false);
  }


  return (
    <div className="register">
      <div className="card">
        <div className="mid">
          <h1>Rejestracja</h1>
          {currentUser && currentUser.email}
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nazwa użytkownika" name="username" 
            ref={usernameRef}/>
            <input type="email" placeholder="E-mail" name="email" 
            ref={emailRef}/>
            <input type="password" placeholder="Hasło" name="password" 
            ref={passwordRef}/>
            <input type="password" placeholder="Powtórz Hasło" name="checkPassword" 
            ref={passwordConfirmRef}/>
            <button disabled={loading}
            type="submit">Zarejestruj
            </button>
            {error && error}
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
import { useRef, useState } from "react"
import "./forgotPassword.scss"
import {Link} from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {auth} from "../../../firebase"
import { sendPasswordResetEmail } from "firebase/auth"

const ForgotPassword = () => {
  const emailRef = useRef();
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions")
    } catch {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
    <div className="login">
      <div className="card">
        <div className="mid">
          <h1>Reset hasła</h1>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="email" name="email" ref={emailRef}/>
            {error && <span className="alert error">{error}</span>}
            {message && <span className="alert message">{message}</span>}
            <button type="submit">Zresetuj hasło</button>
          </form>
          <Link to="/login">Zaloguj się</Link>
          <Link to="/signup">
            <span>Rejestracja</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
import { useContext } from "react"
import "./login.scss"
import {Link} from "react-router-dom"
import { AuthContext } from "../../context/authContext"

const Login = () => {
  const {login} = useContext(AuthContext);
  
  const handleLogin = () => {
    login()
  };

  return (
    <div className="login">
      <div className="card">
        <div className="mid">
          <h1>Zaloguj</h1>
          <form>
            <input type="text" placeholder="Nazwa użytkownika"/>
            <input type="password" placeholder="Hasło"/>
            <button onClick={handleLogin}>Zaloguj</button>
          </form>
          <Link to="/register">
            <span>Rejestracja</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
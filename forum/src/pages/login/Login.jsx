import "./login.scss"
import {Link} from "react-router-dom"

const Login = () => {
  return (
    <div className="login">
      <div className="card">
        <div className="mid">
          <h1>Zaloguj</h1>
          <form>
            <input type="text" placeholder="Nazwa użytkownika"/>
            <input type="password" placeholder="Hasło"/>
            <button>Zaloguj</button>
          </form>
          <Link to="/register">
            <a>Rejestracja</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
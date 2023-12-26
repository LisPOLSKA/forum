import "./register.scss"
import {Link} from "react-router-dom"

const Register = () => {
  return (
    <div className="register">
      <div className="card">
        <div className="mid">
          <h1>Rejestracja</h1>
          <form>
            <input type="text" placeholder="Nazwa użytkownika"/>
            <input type="email" placeholder="E-mail" />
            <input type="password" placeholder="Hasło"/>
            <input type="password" placeholder="Powtórz Hasło"/>
            <button>Zarejstruj</button>
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
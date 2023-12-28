import { useContext, useState } from "react"
import "./login.scss"
import {Link, useNavigate} from "react-router-dom"
import { AuthContext } from "../../context/authContext"

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/")
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="mid">
          <h1>Zaloguj</h1>
          <form>
            <input type="text" placeholder="Nazwa użytkownika" name="username" onChange={handleChange}/>
            <input type="password" placeholder="Hasło" name="password" onChange={handleChange}/>
            {err && err}
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
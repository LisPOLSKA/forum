import { useRef, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SignIn from "../../components/googleLogin/googleLogin";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
      console.log(currentUser);
    } catch {
      setError("Nie udało się zalogować");
    } finally {
      setLoading(false); // Ustawienie loading na false po zakończeniu procesu
    }
  }

  return (
    <div className="login">
      <div className="card">
        <div className="mid">
          <h1>Zaloguj</h1>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="email" name="email" ref={emailRef} required />
            <input type="password" placeholder="Hasło" name="password" ref={passwordRef} required />
            {error && <div className="error">{error}</div>}
            <button disabled={loading}>{loading ? "Ładowanie..." : "Zaloguj"}</button>
          </form>
          <Link to="/forgot-password">Zapomniałeś hasła?</Link>
          <SignIn />
          <Link to="/signup">
            <span>Rejestracja</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

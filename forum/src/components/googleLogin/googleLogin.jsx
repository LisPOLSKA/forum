import { signInWithGooglePopup } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./googleLogin.scss";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
    const navigate = useNavigate();

    const logGoogleUser = async () => {
        try {
            const response = await signInWithGooglePopup();
            console.log(response);
            navigate("/");
        } catch (error) {
            console.error('Google login failed:', error);
            // Możesz dodać tu wyświetlenie błędu lub alert
        }
    };

    return (
        <div>
            <button onClick={logGoogleUser}><FcGoogle size={25}/> Zaloguj się z Google</button>
        </div>
    );
};

export default SignIn;

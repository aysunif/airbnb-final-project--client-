import { useEffect, useState } from "react";
import styles from "../../assets/styles/login.module.scss";
import { setLogin } from "../../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { saveUserToStorage } from "../../utils/localStorage";
// import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { token, user } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      console.log(response);
      /* Get data after fetching */
      // const loggedIn = await response.json();

      if (response.data) {
        dispatch(
          setLogin({
            user: response.data.user,
            token: response.data.token,
          })
        );
        saveUserToStorage(response.data.token);
        // toast.success("Giriş uğurlu oldu!");
        navigate("/");
      }
    } catch (err) {
      console.log("Login failed", err.message);
      // toast.error("Giriş zamanı xəta baş verdi!");
    }
  };

  useEffect(() => {
    if (token && user) {
      const parsedUser = JSON.parse(decodeURIComponent(user)); 
      saveUserToStorage(token);
      dispatch(setLogin({ user: parsedUser, token }));
      // toast.success("Successfully signed in with Google!");
  
      setTimeout(() => {
        navigate("/");
      }, 300);
    }
  }, [token, user, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:5000/api/auth-user/google`; // Redirect to Google OAuth
  };
  console.log(window.location.href);

  return (
    <>
      <div className={styles["login"]}>
        <div className={styles["login_content"]}>
          <form
            className={styles["login_content_form"]}
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">LOG IN</button>
            <button onClick={handleGoogleLogin} type="button">
              {/* <GoogleIcon /> */}
              <span>Login</span>
              <span>With</span>
              <span>Google</span>
            </button>
          </form>
          <a href="/register">Don't have an account? Sign In Here</a>
        </div>
      </div>
    </>
  );
};

export default Login;

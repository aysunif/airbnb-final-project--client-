import { useEffect, useState } from "react";
import styles from "../../assets/styles/login.module.scss";
import { setLogin } from "../../redux/state";
import { useDispatch } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { saveUserToStorage } from "../../utils/localStorage";
import { Helmet } from "react-helmet-async";
import { message } from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const tokenCookies = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenCookies) {
      navigate("/");
    }
  }, []);

  const { token, user } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      console.log(response);

      if (response.data) {
        dispatch(
          setLogin({
            user: response.data.user,
            token: response.data.token,
          })
        );
        // navigate("/");
        saveUserToStorage(response.data.token);
        Cookies.set("token", response.data.token);
        // toast.success("Giriş uğurlu oldu!");
        message.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      console.log("Login failed", err.message);
      message.error("Login failed! Please check your credentials and try again.");
      // toast.error("Giriş zamanı xəta baş verdi!");
    }
  };

  const getTokenFromQuery = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("token");
  };

  useEffect(() => {
    const token = getTokenFromQuery();
    if (token) {
      saveUserToStorage(token);
      localStorage.setItem("userauth", "true");
      dispatch(
        setLogin({
          token: token,
        })
      );

      // toast.success("Successfully signed in with Google!");
      message.success("Successfully signed in with Google!");
      setTimeout(() => {
        navigate("/");
      }, 300);
    }
  }, [location.search, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:5000/api/auth-user/google`;
  };
  console.log(window.location.href);

  return (
    <>
      <Helmet>
        <title>Airbnb | Login</title>
        <meta name="description" content="login page" />
      </Helmet>
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

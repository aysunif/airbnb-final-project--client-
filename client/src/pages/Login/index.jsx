import { useEffect, useState } from "react";
import styles from "../../assets/styles/login.module.scss";
import { setLogin } from "../../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const token = Cookies.get('token')
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      /* Get data after fetching */
      // const loggedIn = await response.json();

      if (response.data) {
        dispatch(
          setLogin({
            user: response.data.user,
            token: response.data.token,
          })
        );
        navigate("/");
      }
      Cookies.set("token", response.data.token)
    } catch (err) {
      console.log("Login failed", err.message);
    }
  };
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
          </form>
          <a href="/register">Don't have an account? Sign In Here</a>
        </div>
      </div>
    </>
  );
};

export default Login;

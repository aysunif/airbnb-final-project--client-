import { useState } from "react";
import styles from "../../assets/styles/login.module.scss";
import { setLogin } from "../../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      /* Get data after fetching */
      const loggedIn = await response.json();

      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/");
      }
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

import styles from "../../assets/styles/login.module.scss";

const Login = () => {
  return (
    <>
    <div className={styles["login"]}>
      <div className={styles["login_content"]}>
        <form className={styles["login_content_form"]}>
          <input
            type="email"
            placeholder="Email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">LOG IN</button>
        </form>
        <a href="/register">Don't have an account? Sign In Here</a>
      </div>
    </div>
    </>
  )
}

export default Login
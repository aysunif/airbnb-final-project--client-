import { useEffect, useState } from "react";
import styles from "../../assets/styles/login.module.scss";
import { setLogin } from "../../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = Cookies.get('token')

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

            if (response.data) {
                const { user, token } = response.data;

                if (user.role === "admin") {
                    dispatch(
                        setLogin({
                            user: user,
                            token: token,
                        })
                    );
                    Cookies.set("token", token);
                    toast.success("Login successful! Redirecting to admin panel...");
                    navigate("/admin/dashboard");
                } else {
                    toast.error("Access denied. You are not an admin.");
                }
            }
        } catch (err) {
            console.log("Login failed", err.message);
            toast.error("Login failed. Please check your credentials.");
        }
    };

    return (
        <>
            <div className={styles["login"]}>
                <div className={styles["login_content"]}>
                    <div>
                        <h1 style={{ margin: '0 auto', width: 'full', textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }}>Admin Login</h1>
                    </div>
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
            <ToastContainer />
        </>
    );
};

export default AdminLogin;
import styles from "../../assets/styles/register.module.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  // console.log(formData)

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const register_form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        register_form.append(key, value);
      });
      
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        register_form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      console.log("Registration failed", err.response?.data || err.message);
    }
  };

  return (
    <>
      <div className={styles["register"]}>
        <div className={styles["register_content"]}>
          <form
            className={styles["register_content_form"]}
            onSubmit={handleSubmit}
          >
            <input
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              required
            />
            <input
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              required
            />
            {!passwordMatch && (
              <p style={{ color: "red" }}>Passwords do not match!</p>
            )}
            <input
              id="image"
              type="file"
              name="profileImage"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChange}
              required
            />
            <label htmlFor="image">
              <img src="/images/uploadPhoto.png" alt="add profile photo" />
              <p>Upload Your Photo</p>
            </label>

            {formData.profileImage && (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="profile photo"
                style={{ maxWidth: "80px" }}
              />
            )}

            <button type="submit" disabled={!passwordMatch}>
              REGISTER
            </button>
          </form>
          <a href="/login">Already have an account? Log In Here</a>
        </div>
      </div>
    </>
  );
};

export default Register;

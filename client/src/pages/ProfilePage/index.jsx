import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Button, Input, Upload, message, Spin } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import { setLogin } from "../../redux/state";
import styles from "../../assets/styles/profilePage.module.scss";
import { Helmet } from "react-helmet-async";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user._id);
  const userData = useSelector((state) => state.user);
  const [updatedData, setUpdatedData] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setUpdatedData(userData);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (info) => {
    const file = info.file.originFileObj;
    setUpdatedData((prevData) => ({
      ...prevData,
      profileImage: file,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (let key in updatedData) {
      // console.log("Appending:", key, updatedData[key])
      // console.log(key);
      if (updatedData[key]) {
        formData.append(key, updatedData[key]);
      }
    }
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    // formData.append("test", "test")
    // console.log(formData.entries());


    try {
      // console.log(formData);
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        formData
      );

      message.success("Profile updated successfully!");
      dispatch(setLogin({ user: response.data.user, token: userData.token }));
      setIsEditing(false);
      console.log(response);
    } catch (err) {
      console.error("Error updating user", err.message);
      message.error("Failed to update profile");
    }
  };

  if (loading) {
    return <Spin tip="Loading..." className={styles.loading} />;
  }

  return (
    <>
      <Helmet>
        <title>Airbnb | Profile</title>
        <meta name="description" content="profile page" />
      </Helmet>
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          {/* Profile Picture */}
          <div className={styles.profileImageWrapper}>
            <Upload
              accept="image/*"
              showUploadList={false}
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              <div className={styles.profileImage}>
                <img
                  src={
                    updatedData.profileImage
                      ? URL.createObjectURL(updatedData.profileImage)
                      : updatedData.profileImagePath
                  }
                  alt="Profile"
                />
                {isEditing && (
                  <div className={styles.uploadIcon}>
                    <CameraOutlined />
                  </div>
                )}
              </div>
            </Upload>
          </div>

          {/* User Info */}
          <div className={styles.userInfo}>
            <div className={styles.inputGroup}>
              <Input
                prefix={<UserOutlined />}
                placeholder="First Name"
                value={updatedData.firstName}
                name="firstName"
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                prefix={<UserOutlined />}
                placeholder="Last Name"
                value={updatedData.lastName}
                name="lastName"
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              value={updatedData.email}
              name="email"
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {/* Buttons */}
          <div className={styles.buttonContainer}>
            {isEditing ? (
              <Button onClick={handleSubmit} className={styles.saveButton}>
                Save Changes
              </Button>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className={styles["editButton"]}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

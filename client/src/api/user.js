import axios from "axios";

export const uploadProfileImage = async (formData) => {
  const response = await axios.post(
    "https://airbnb-final-project-server.onrender.com/api/users/uploadProfileImage",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

import axios from "axios";

export const uploadProfileImage = async (formData) => {
  const response = await axios.post(
    "http://localhost:5000/api/users/uploadProfileImage",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

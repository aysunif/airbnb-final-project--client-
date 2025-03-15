import axios from "axios";

const API_URL = "https://airbnb-final-project-server.onrender.com/api";

export const getAllUsers = async () => {
  return await axios.get(`${API_URL}/users`);
};

export const getUserById = async (userId) => {
  return await axios.get(`${API_URL}/users/${userId}`);
};

export const banUser = async (userId) => {
  return await axios.put(`${API_URL}/users/${userId}/ban`);
};

export const updateUser = async (userId, data) => {
  return await axios.put(`${API_URL}/users/${userId}`, data);
};

export const deleteUser = async (userId) => {
  return await axios.delete(`${API_URL}/users/${userId}`);
};

export const getAllListings = async () => {
  return await axios.get(`${API_URL}/listings`);
};

export const getListingDetails = async (listingId) => {
  return await axios.get(`${API_URL}/listings/${listingId}`);
};

export const getListingById = async (listingId) => {
  return await axios.get(`${API_URL}/listings/${listingId}`);
};

export const approveListing = async (listingId) => {
  return await axios.put(`${API_URL}/listings/${listingId}/approve`);
};

export const updateListing = async (listingId, data) => {
  return await axios.put(`${API_URL}/listings/${listingId}`, data);
};

export const deleteListing = async (listingId) => {
  return await axios.delete(`${API_URL}/listings/${listingId}`);
};
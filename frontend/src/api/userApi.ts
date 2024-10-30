import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // backend URL

export const saveUserToDb = async (userDetails: any) => {
  const response = await axios.post(`${API_URL}/users`, userDetails);
  return response.data;
};

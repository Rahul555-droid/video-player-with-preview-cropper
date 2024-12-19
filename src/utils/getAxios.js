import axios from "axios";
// API Wrapper for GET requests
export const getAxios = async ({ url, token, params }) => {
  const response = await axios.get(`${API_BASE_URL}/${url}`, {
    headers: { token },
    params,
  });
  return response.data;
};

export const API_BASE_URL = 'https://prices.algotest.xyz';

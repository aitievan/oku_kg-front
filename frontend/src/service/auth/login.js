import { api } from "../axios";
import Cookies from 'js-cookie'; 

export const Login = async (data) => {
  try {
    const response = await api.post(`/auth/login`, data);
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 7 });
    }
    return response;
  } catch (error) {
    return error;
  }
};
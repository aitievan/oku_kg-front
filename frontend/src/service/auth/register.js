import { api } from "../axios";

export const Register = async (data) => {
  try {
    return await api.post(`/auth/register`, data);
  } catch (error) {
    return error;
  }
};

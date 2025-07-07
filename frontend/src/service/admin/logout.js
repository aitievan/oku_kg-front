import Cookies from "js-cookie";

export const logout = () => {
  Cookies.remove("token");
  Cookies.remove("role");
  window.location.href = "/login"; 
};

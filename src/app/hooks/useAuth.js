import { verifyToken } from "../modules/lib/authUtils";
import { jwtDecode } from "jwt-decode";
import { TOKEN } from "../../settings/localVar";

export const useAuth = (navigate) => {
  return {
    verifyAuth: () => verifyToken(navigate),
    getUser: () => {
      const token = localStorage.getItem(TOKEN);
      return token ? jwtDecode(token) : null;
    },
    getRole: () => {
      const token = localStorage.getItem(TOKEN);
      const user = token ? jwtDecode(token) : null;
      return user ? user.role : null;
    }
  };
}; 
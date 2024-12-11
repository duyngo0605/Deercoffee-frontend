import { verifyToken } from "../modules/lib/authUtils";
import { jwtDecode } from "jwt-decode";
import { TOKEN } from "../../settings/localVar";

// Tạo thêm một custom hook để dễ sử dụng
export const useAuth = (navigate) => {
    return {
      verifyAuth: () => verifyToken(navigate),
      getUser: () => {
        const token = localStorage.getItem(TOKEN);
        return token ? jwtDecode(token) : null;
      }
    };
  };
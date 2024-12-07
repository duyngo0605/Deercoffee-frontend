import { signify } from "react-signify";
import { TOKEN } from "../../../settings/localVar";
// State cho loading
export const sLogin = signify(false);

// State cho user info
export const sUserInfo = signify({
    username: '',
    role: '',
    token: ''
});

// Actions
export const setUserInfo = (username, role, token) => {
    sUserInfo.set({
        username,
        role,
        token
    });
    localStorage.setItem(TOKEN, token);
};

export const clearUserInfo = () => {
    sUserInfo.set({
        username: '',
        role: '',
        token: ''
    });
    localStorage.removeItem(TOKEN);
};

// Khởi tạo state từ localStorage (nếu có)
const savedUserInfo = localStorage.getItem('userInfo');
if (savedUserInfo) {
    const { username, role, token } = JSON.parse(savedUserInfo);
    setUserInfo(username, role, token);
}

import { post } from "../../../modules/lib/httpHandle";
import { TOKEN } from "../../../../settings/localVar";
import { sLogin } from "../loginStore";

const USER = 'user';

export const loginService = (data, nav) => {
    return new Promise((resolve, reject) => {
        post(
            `${USER}/log-in`,
            data,
            (response) => {
                localStorage.setItem(TOKEN, response.access_token);
                sLogin.set(false);
                nav("/");
                resolve(response);
            },
            (error) => {
                sLogin.set(false);
                reject(error || 'Đăng nhập thất bại');
            }
        );
    });
};

export const logoutService = (nav) => {
    return new Promise((resolve, reject) => {
        post(
            `${USER}/log-out`,
            {},
            (response) => {
                localStorage.removeItem(TOKEN);
                sLogin.set(false);
                nav("/login");
                resolve(response);
            },
            (error) => {
                sLogin.set(false);
                reject(error || 'Đăng xuất thất bại');
            }
        );
    });
};
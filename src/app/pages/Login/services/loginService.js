import { post } from "../../../modules/lib/httpHandle";
import { BE_ENDPOINT, USERNAME } from "../../../../settings/localVar";
import { sLogin } from "../loginStore";
import { clearUserInfo } from "../loginStore";

const USER = 'user';

export const loginService = (data, nav) => {
    return new Promise((resolve, reject) => {
        post(
            `${USER}/log-in`,
            data,
            (response) => {
                // success
                localStorage.setItem(USERNAME, data.username);
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
                // success
                localStorage.removeItem(USERNAME);
                clearUserInfo();
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
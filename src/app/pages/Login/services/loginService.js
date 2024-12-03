import { post } from "../../../modules/lib/httpHandle";
import { BE_ENDPOINT } from "../../../../settings/localVar";

const USER = 'user';

export const loginService = (data) => {
    return new Promise((resolve, reject) => {
        post(
            `${USER}/log-in`,
            data,
            (response) => {
                resolve(response);
            },
            (error) => {
                reject(error || 'Đăng nhập thất bại');
            }
        );
    });
};
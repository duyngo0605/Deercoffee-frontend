import { post, get, put, del } from "../../../modules/lib/httpHandle";

const USER = 'user';

export const getUser = (id = ' ') => {
    return new Promise((resolve, reject) => {
        get(
            `${USER}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy danh sách tài khoản thất bại');
            }
        );
    });
};

export const createUser = (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
        post(
            USER,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Tạo tài khoản thất bại');
            }
        );
    });
};

export const updateUser = (id, data) => {
    return new Promise((resolve, reject) => {
        put(
            `${USER}/${id}`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Cập nhật tài khoản thất bại');
            }
        );
    });
};

export const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        del(
            `${USER}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.message);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Xóa tài khoản thất bại');
            }
        );
    });
}; 
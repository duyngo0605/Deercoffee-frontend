import { post, get, put, del } from "../../../modules/lib/httpHandle";

const ORDER = 'order';

export const getOrder = (id = ' ') => {
    return new Promise((resolve, reject) => {
        get(
            `${ORDER}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy danh sách đơn hàng thất bại');
            }
        );
    });
};

export const createOrder = (data) => {
    return new Promise((resolve, reject) => {
        post(
            ORDER,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Tạo đơn hàng thất bại');
            }
        );
    });
};

export const updateOrder = (id, data) => {
    return new Promise((resolve, reject) => {
        put(
            `${ORDER}/${id}`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Cập nhật đơn hàng thất bại');
            }
        );
    });
};

export const deleteOrder = (id) => {
    return new Promise((resolve, reject) => {
        del(
            `${ORDER}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.message);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Xóa đơn hàng thất bại');
            }
        );
    });
}; 
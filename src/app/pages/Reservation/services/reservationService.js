import { post, get, put, del } from "../../../modules/lib/httpHandle";

const RESERVATION = 'reservation';

export const getReservation = (id = ' ') => {
    return new Promise((resolve, reject) => {
        get(
            `${RESERVATION}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy danh sách đặt chỗ thất bại');
            }
        );
    });
};

export const createReversation = (data) => {
    return new Promise((resolve, reject) => {
        post(
            RESERVATION,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Tạo đặt chỗ thất bại');
            }
        );
    });
};

export const updateReversation = (id, data) => {
    return new Promise((resolve, reject) => {
        put(
            `${RESERVATION}/${id}`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Cập nhật đặt chỗ thất bại');
            }
        );
    });
};

export const deleteReversation = (id) => {
    return new Promise((resolve, reject) => {
        del(
            `${RESERVATION}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.message);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Xóa đặt chỗ thất bại');
            }
        );
    });
}; 
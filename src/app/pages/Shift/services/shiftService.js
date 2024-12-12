import { post, get, put, del } from "../../../modules/lib/httpHandle";

const SHIFT = 'shift';

export const getShift = (id = ' ') => {
    return new Promise((resolve, reject) => {
        get(
            `${SHIFT}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy danh sách ca làm việc thất bại');
            }
        );
    });
};

export const createShift = (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
        post(
            SHIFT,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Tạo ca làm việc thất bại');
            }
        );
    });
};

export const updateShift = (id, data) => {
    return new Promise((resolve, reject) => {
        put(
            `${SHIFT}/${id}`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Cập nhật ca làm việc thất bại');
            }
        );
    });
};

export const deleteShift = (id) => {
    return new Promise((resolve, reject) => {
        del(
            `${SHIFT}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.message);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Xóa ca làm việc thất bại');
            }
        );
    });
}; 
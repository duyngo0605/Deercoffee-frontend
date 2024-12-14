import { post, get, put, del } from "../../../modules/lib/httpHandle";

const VOUCHER = 'voucher';

export const getVoucher = (id = ' ') => {
    return new Promise((resolve, reject) => {
        get(
            `${VOUCHER}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy danh sách voucher thất bại');
            }
        );
    });
};

export const createVoucher = (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
        post(
            VOUCHER,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Tạo voucher thất bại');
            }
        );
    });
};

export const updateVoucher = (id, data) => {
    return new Promise((resolve, reject) => {
        put(
            `${VOUCHER}/${id}`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Cập nhật voucher thất bại');
            }
        );
    });
};

export const deleteVoucher = (id) => {
    return new Promise((resolve, reject) => {
        del(
            `${VOUCHER}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.message);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Xóa voucher thất bại');
            }
        );
    });
}; 
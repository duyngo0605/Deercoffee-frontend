import { post, get, put, del } from "../../../modules/lib/httpHandle";

const ITEM_TYPE = 'item-type';

export const getItemTypes = () => {
    return new Promise((resolve, reject) => {
        get(
            ITEM_TYPE,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy danh sách loại món thất bại');
            }
        );
    });
};

export const createItemType = (data) => {
    return new Promise((resolve, reject) => {
        post(
            ITEM_TYPE,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Tạo loại món thất bại');
            }
        );
    });
};

export const updateItemType = (id, data) => {
    return new Promise((resolve, reject) => {
        put(
            `${ITEM_TYPE}/${id}`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Cập nhật loại món thất bại');
            }
        );
    });
};

export const deleteItemType = (id) => {
    return new Promise((resolve, reject) => {
        del(
            `${ITEM_TYPE}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.message);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Xóa loại món thất bại');
            }
        );
    });
}; 
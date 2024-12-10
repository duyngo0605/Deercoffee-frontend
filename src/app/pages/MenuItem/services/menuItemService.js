import { post, get, put, del } from "../../../modules/lib/httpHandle";

const MENU_ITEM = 'menu-item';

export const getMenuItem = (id = ' ') => {
    return new Promise((resolve, reject) => {
        get(
            `${MENU_ITEM}/${id}`,
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

export const createMenuItem = (data) => {
    return new Promise((resolve, reject) => {
        post(
            MENU_ITEM,
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

export const updateMenuItem = (id, data) => {
    return new Promise((resolve, reject) => {
        put(
            `${MENU_ITEM}/${id}`,
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

export const deleteMenuItem = (id) => {
    return new Promise((resolve, reject) => {
        del(
            `${MENU_ITEM}/${id}`,
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
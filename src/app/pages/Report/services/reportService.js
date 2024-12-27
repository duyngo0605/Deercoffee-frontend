import { post, get } from "../../../modules/lib/httpHandle";

const REPORT = 'report';
const REVENUE = 'revenue';
const MENUITEM = 'menu-item'

export const getRevenueByDay = (data) => {
    return new Promise((resolve, reject) => {
        post(
            `${REPORT}/${REVENUE}/by-day`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy doanh thu thất bại');
            }
        );
    });
};


export const getRevenueByMonth = (data) => {
    return new Promise((resolve, reject) => {
        post(
            `${REPORT}/${REVENUE}/by-month`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy doanh thu thất bại');
            }
        );
    });
};

export const getRevenueByYear = (data) => {
    return new Promise((resolve, reject) => {
        post(
            `${REPORT}/${REVENUE}/by-year`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy doanh thu thất bại');
            }
        );
    });
};

export const getMostOrderedMenuItemsByDay = (data) => {
    return new Promise((resolve, reject) => {
        post(
            `${REPORT}/${MENUITEM}/by-day`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy doanh thu thất bại');
            }
        );
    });
};

export const getMostOrderedMenuItemsByMonth = (data) => {
    return new Promise((resolve, reject) => {
        post(
            `${REPORT}/${MENUITEM}/by-month`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy doanh thu thất bại');
            }
        );
    });
};

export const getMostOrderedMenuItemsByYear = (data) => {
    return new Promise((resolve, reject) => {
        post(
            `${REPORT}/${MENUITEM}/by-year`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy doanh thu thất bại');
            }
        );
    });
};
import { post, get } from "../../../modules/lib/httpHandle";

const REPORT = 'report';
const REVENUE = 'revenue';

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

export const getMonthlyDetail = (data) => {
    return new Promise((resolve, reject) => {
        post(
            `${REPORT}/${REVENUE}/month-detail`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy chi tiết doanh thu tháng thất bại');
            }
        );
    });
};

export const getYearlyDetail = (data) => {
    return new Promise((resolve, reject) => {
        post(
            `${REPORT}/${REVENUE}/year-detail`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy chi tiết doanh thu năm thất bại');
            }
        );
    });
};
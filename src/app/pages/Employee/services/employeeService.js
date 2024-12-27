import { post, get, put, del } from "../../../modules/lib/httpHandle";
import { BE_ENDPOINT } from "../../../../settings/localVar";

const EMPLOYEE = 'employee';

// Lấy danh sách nhân viên hoặc thông tin một nhân viên cụ thể
export const getEmployee = (id = '') => {
    return new Promise((resolve, reject) => {
        get(
            `${EMPLOYEE}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy thông tin nhân viên thất bại');
            }
        );
    });
};

// Tạo nhân viên mới
export const createEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        post(
            `${EMPLOYEE}`,
            employeeData,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Tạo nhân viên thất bại');
            }
        );
    });
};

// Cập nhật thông tin nhân viên
export const updateEmployee = (id, employeeData) => {
    return new Promise((resolve, reject) => {
        put(
            `${EMPLOYEE}/${id}`,
            employeeData,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Cập nhật thông tin nhân viên thất bại');
            }
        );
    });
};

// Xóa nhân viên
export const deleteEmployee = (id) => {
    return new Promise((resolve, reject) => {
        del(
            `${EMPLOYEE}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.message);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Xóa nhân viên thất bại');
            }
        );
    });
};

// Tính Lương Nhân Viên
export const calculateSalary = (id, data) => {
    return new Promise((resolve, reject) => {
        post(
            `${EMPLOYEE}/salary/${id}`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Tính lương nhân viên thất bại');
            }
        );
    });
};
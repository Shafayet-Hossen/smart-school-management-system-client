// src/services/schoolAdminFeeService.js

import api from "./api"; // Change this to your existing Axios instance path.

export const getSchoolAdminFees = async (params = {}) => {
    const { data } = await api.get("/school-admin/fees", { params });
    return data;
};

export const getSchoolAdminFeeSummary = async (params = {}) => {
    const { data } = await api.get("/school-admin/fees/summary", { params });
    return data;
};

export const getSchoolAdminFeeOptions = async () => {
    const { data } = await api.get("/school-admin/fees/options");
    return data;
};

export const recordStudentFeePayment = async (payload) => {
    const { data } = await api.post(
        "/school-admin/fees/payments",
        payload
    );
    return data;
};
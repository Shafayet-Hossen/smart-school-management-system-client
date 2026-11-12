import api from "./api.js";

const BASE_URL = "/student/fees";

export const getStudentFeeSummary = async () => {
    const { data } = await api.get(`${BASE_URL}/summary`);
    return data;
};

export const getStudentFeePayments = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/payments`, {
        params,
    });

    return data;
};

export const getStudentFeeRecords = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/records`, {
        params,
    });

    return data;
};

export const getStudentDueFees = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/due`, {
        params,
    });

    return data;
};


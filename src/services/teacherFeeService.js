import api from "./api.js";

const BASE_URL = "/teacher/fees";

export const getTeacherFeeSummary = async () => {
    const { data } = await api.get(`${BASE_URL}/summary`);
    return data;
};

export const getTeacherFeeStudents = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/students`, {
        params,
    });
    return data;
};

export const getTeacherDueFees = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/due`, {
        params,
    });
    return data;
};

export const getTeacherFeePayments = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/payments`, {
        params,
    });
    return data;
};

export const getTeacherStudentFeeDetails = async (studentId) => {
    const { data } = await api.get(
        `${BASE_URL}/student/${studentId}`
    );
    return data;
};
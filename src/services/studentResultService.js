import api from "./api.js";

// Get student result dashboard
export const getStudentResultOverview = async (params = {}) => {
    const response = await api.get(
        "/student/results/overview",
        { params }
    );

    return response.data.data;
};

export const getStudentResultList = async (params = {}) => {
    const response = await api.get(
        "/student/results/list",
        { params }
    );

    return response.data.data;
};

// Get all published results
export const getStudentResults = async (params = {}) => {
    const { data } = await api.get(
        "/student/results",
        { params }
    );

    return data;
};

// Get result history
export const getStudentResultHistory = async (params = {}) => {
    const { data } = await api.get(
        "/student/results/history",
        { params }
    );

    return data;
};

// Get individual result details
export const getStudentResultDetails = async (resultId) => {
    const { data } = await api.get(
        `/student/results/${resultId}`
    );

    return data;
};
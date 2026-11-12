
import api from "./api.js";

// Parent Result Dashboard
export const getParentResultDashboard = async (params = {}) => {
    const response = await api.get(
        "/parent/results/dashboard",
        { params }
    );

    return response.data.data;
};


export const getParentExaminationResults = async (params = {}) => {
    const response = await api.get(
        "/parent/results/examination-results",
        { params }
    );

    return response.data.data;
};

export const getParentSubjectWiseResults = async (params = {}) => {
    const response = await api.get(
        "/parent/results/subject-wise",
        { params }
    );

    return response.data.data;
};
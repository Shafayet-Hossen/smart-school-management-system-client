import api from "./api.js";

const BASE_URL = "/teacher/exams";

export const getTeacherExamDashboard = async () => {
    const { data } = await api.get(`${BASE_URL}/dashboard`);
    return data;
};

export const getTeacherExamSchedule = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/schedule`, { params });
    return data;
};

export const getTeacherUpcomingExams = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/upcoming`, { params });
    return data;
};

export const getTeacherCompletedExams = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/completed`, { params });
    return data;
};

export const getTeacherExamDetails = async (examId) => {
    const { data } = await api.get(`${BASE_URL}/${examId}`);
    return data;
};
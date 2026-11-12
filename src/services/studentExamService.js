import api from "./api.js";

const BASE_URL = "/student/exams";

// Student exam dashboard
export const getStudentExamDashboard = async (params = {}) => {
    const response = await api.get(
        "/student/exams/dashboard",
        { params }
    );

    return response.data.data;
};


// Student examination schedule
export const getStudentExamSchedule = async (params = {}) => {
    const response = await api.get(
        "/student/exams/schedule",
        { params }
    );

    return response.data.data;
};

// Upcoming examinations
export const getStudentUpcomingExams = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/upcoming`, {
        params,
    });

    return data;
};

// Completed examinations
export const getStudentCompletedExams = async (params = {}) => {
    const { data } = await api.get(`${BASE_URL}/completed`, {
        params,
    });

    return data;
};

// Examination details
export const getStudentExamDetails = async (examId) => {
    const { data } = await api.get(`${BASE_URL}/${examId}`);
    return data;
};
import api from "./api.js";

// Get parent's linked children
export const getParentChildren = async () => {
    const { data } = await api.get("/parent/all-child");
    return data;
};

// Get exam dashboard
export const getParentExamDashboard = async (params = {}) => {
    const response = await api.get(
        "/parent/exams/dashboard",
        { params }
    );

    return response.data.data;
};

// Get exam schedule
export const getParentExamSchedule = async (params = {}) => {
    const response = await api.get(
        "/parent/exams/schedule",
        { params }
    );

    return response.data.data;
};

// Get upcoming examinations
export const getParentUpcomingExams = async (studentId) => {
    const { data } = await api.get("/parent/exams/upcoming", {
        params: { student_id: studentId },
    });

    return data;
};

// Get completed examinations
export const getParentCompletedExams = async (studentId) => {
    const { data } = await api.get("/parent/exams/completed", {
        params: { student_id: studentId },
    });

    return data;
};

// Get examination details
export const getParentExamDetails = async (examId, studentId) => {
    const { data } = await api.get(`/parent/exams/${examId}`, {
        params: { student_id: studentId },
    });

    return data;
};
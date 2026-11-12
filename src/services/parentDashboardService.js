import api from "./api.js";

export const getParentDashboard = async (studentId) => {
    const { data } = await api.get("/parent/dashboard", {
        params: studentId ? { student_id: studentId } : {},
    });

    return data;
};
import api from "./api.js";

export const getStudentDashboard = async () => {
    const { data } = await api.get("/student/dashboard");
    return data;
};
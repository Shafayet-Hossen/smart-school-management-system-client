import api from "./api.js";

export const getTeacherDashboard = async () => {
    const { data } = await api.get("/teacher/dashboard");
    return data;
};
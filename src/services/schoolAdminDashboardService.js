import api from "./api.js";

export const getSchoolAdminDashboard = async () => {
    const response = await api.get(
        "/school-admin/dashboard"
    );

    return response.data;
};
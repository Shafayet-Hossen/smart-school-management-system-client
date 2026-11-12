
import api from "../services/api.js";

export const getStudentAttendance = async () => {
    const response = await api.get("/student/attendance");

    // Supports the standard { success, data } API response.
    return response.data?.data ?? response.data;
};

import api from "./api.js";

// Get all classes
export const getAttendanceClasses = async () => {
    const { data } = await api.get("/classes");
    return data;
};

// Get sections of a selected class
export const getAttendanceSections = async (classCode) => {
    // console.log("Fetching sections for classCode:", classCode);
    const { data } = await api.get(
        `/sections/classes/${classCode}`
    );

    return data;
};

// Get attendance records
export const getAttendanceDetails = async (params) => {
    const { data } = await api.get("/attendance", {
        params,
    });

    return data;
};

// Get attendance summary
export const getAttendanceDetailsSummary = async (params) => {
    const { data } = await api.get("/attendance/summary", {
        params,
    });

    return data;
};
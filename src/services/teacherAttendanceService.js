import api from "./api.js";

/**
 * Get classes/sections assigned to the logged-in teacher
 */
export const getTeacherClasses = async () => {
    const response = await api.get("/teachers/classes");
    // console.log("TeacherClasses:",response)
    return response.data.data;
};

/**
 * Get students for a specific section
 */
export const getTeacherStudents = async (sectionId) => {
    const response = await api.get(
        `/teachers/students?section_id=${sectionId}`
    );
    // console.log("students:",response)
    return response.data.data;
};

/**
 * Submit attendance
 */
export const  markTeacherAttendance = async (attendanceData) => {
    // console.log("attendanceData:",attendanceData);
    const response = await api.post(
        "/teachers/attendance/mark",
        attendanceData
    );
    
    return response.data;
};

// Get attendance history for the logged-in teacher

export const getTeacherAttendanceHistory = async ({
  section_id,
  date,
}) => {
  const response = await api.get(
    "/teachers/attendance/history",
    {
      params: {
        section_id,
        date,
      },
    }
  );

  return response.data.data;
};

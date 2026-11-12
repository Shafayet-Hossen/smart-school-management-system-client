import api from "./api.js";

export const getTeacherStudents = async () => {
  const response = await api.get("/teachers/all/students");

  return response.data.data;
};
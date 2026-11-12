import api from "./api.js";

export const getTeacherClasses = async () => {
  const response = await api.get("/teachers/assign/classes");
    // console.log("Classes : ",response.data.data)
  return response.data.data;
};
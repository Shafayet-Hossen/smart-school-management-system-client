
import api from "./api.js";

export const getSchoolAdminAssignmentOverview = async (params = {}) => {
    const response = await api.get(
        "/school-admin/assignments/overview",
        { params }
    );

    return response.data.data;
};

export const getSchoolAdminAssignments = async (params = {}) => {
    const response = await api.get(
        "/school-admin/assignments",
        { params }
    );

    return response.data.data;
};

export const getAssignmentFormOptions = async () => {
  const response = await api.get(
    "/school-admin/assignments/form-options"
  );

  return response.data.data;
};

export const createSchoolAdminAssignment = async (formData) => {
  const response = await api.post(
    "/school-admin/assignments",
    formData
  );

  return response.data.data;
};

export const getSchoolAdminAssignmentSubmissions = async (
  assignmentId,
  params = {}
) => {
  const response = await api.get(
    `/school-admin/assignments/${assignmentId}/submissions`,
    { params }
  );

  return response.data.data;
};
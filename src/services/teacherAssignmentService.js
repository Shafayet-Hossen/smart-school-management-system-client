
import api from "./api.js";

// Get assignments belonging to the authenticated teacher.
export const getTeacherAssignments = async (params = {}) => {
  const response = await api.get("/teacher/assignments", {
    params,
  });

  const result = response.data?.data ?? response.data;
  // console.log("getTeacherAssignments result:", result);

  // Supports either { records: [...] } or { assignments: [...] }.
  if (Array.isArray(result)) return result;

  return result?.assignments ?? result?.records ?? [];
};

// Create a new assignment.
export const createTeacherAssignment = async (assignmentData) => {
  // console.log("createTeacherAssignment called with:", assignmentData);
  const response = await api.post(
    "/teacher/assignments",
    assignmentData
  );

  return response.data?.data ?? response.data;
};

// Update an existing assignment.
export const updateTeacherAssignment = async ({
  assignmentId,
  assignmentData,
}) => {
  const response = await api.patch(
    `/teacher/assignments/${encodeURIComponent(assignmentId)}`,
    assignmentData
  );

  return response.data?.data ?? response.data;
};

// Delete an assignment.
export const deleteTeacherAssignment = async (assignmentId) => {
  const response = await api.delete(
    `/teacher/assignments/${encodeURIComponent(assignmentId)}`
  );

  return response.data?.data ?? response.data;
};

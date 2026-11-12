import api from "./api.js";

/**
 * Get all active teachers available for assignment.
 */
export const getTeachersForAssignment = async () => {
  const response = await api.get("/teachers/classes/teachers");
  // console.log("teachers Response", response.data.data)
  return response.data.data;
};

/**
 * Get classes with their sections and current teacher assignments.
 */
export const getClassesForAssignment = async () => {
  const response = await api.get("/teachers/classes");

  return response.data.data;
};

/**
 * Assign a teacher to a section.
 */
export const assignTeacherToSection = async ({
  teacher_id,
  section_id,
}) => {
  const response = await api.post("/teachers/classes/assign", {
    teacher_id,
    section_id,
  });
  

  return response.data;
};

/**
 * Remove teacher from a section.
 */
export const removeTeacherFromSection = async (sectionId) => {
  const response = await api.delete(
    `/teachers/classes/${sectionId}`
  );

  return response.data;
};
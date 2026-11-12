import api from "./api";

const BASE_URL = "/school-admin/exams";

export const getSchoolAdminExams = async (params = {}) => {
  const { data } = await api.get(BASE_URL, { params });

  return data;
};

export const getSchoolAdminExamOptions = async (params = {}) => {
  const { data } = await api.get(`${BASE_URL}/options`, { params });

  return data;
};

export const createSchoolAdminExam = async (payload) => {
  const { data } = await api.post(BASE_URL, payload);

  return data;
};

export const updateSchoolAdminExam = async ({
  examId,
  ...payload
}) => {
  if (!examId) {
    throw new Error("Exam ID is required to update an examination.");
  }

  const { data } = await api.patch(
    `${BASE_URL}/${encodeURIComponent(examId)}`,
    payload
  );

  return data;
};

export const deleteSchoolAdminExam = async (examId) => {
  if (!examId) {
    throw new Error("Exam ID is required to delete an examination.");
  }

  const { data } = await api.delete(
    `${BASE_URL}/${encodeURIComponent(examId)}`
  );

  return data;
};

export const getExamDetails = async (examId) => {
    const response = await api.get(
        `/school-admin/exams/${examId}`
    );

    return response.data;
};
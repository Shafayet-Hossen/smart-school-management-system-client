import api from "./api.js";

export const getTeacherAssignedExaminations = async () => {
    const response = await api.get("/teacher/results/exams");
    return response.data;
};

// Get students belonging to the selected examination section.
export const getStudentsForMarksEntry = async ({
    examId,
    sectionId,
    subjectId,
}) => {
    const response = await api.get(
        `/teacher/results/${examId}/students`,
        {
            params: { sectionId, subjectId },
        }
    );

    return response.data;
};

// Get previously saved marks.
export const getExaminationMarks = async ({
    examId,
    sectionId,
    subjectId,
}) => {
    const response = await api.get(
        `/teacher/results/${examId}/marks`,
        {
            params: { sectionId, subjectId },
        }
    );

    return response.data;
};

// Save marks as draft.
export const saveExaminationMarks = async (payload) => {
    const response = await api.post(
        "/teacher/results/marks/save",
        payload
    );

    return response.data;
};

// Submit marks for review.
export const submitExaminationResults = async (payload) => {
    const response = await api.post(
        "/teacher/results/submissions/submit",
        payload
    );

    return response.data;
};


export const getResultsHistory = async (params = {}) => {
    const response = await api.get("/teacher/results/history", {
        params,
    });

    return response.data.data;
};

export const getResultHistoryDetails = async (submissionId) => {
    const response = await api.get(
        `/teacher/results/history/${submissionId}`
    );

    return response.data.data;
};


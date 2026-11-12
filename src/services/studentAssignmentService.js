
import api from "../services/api.js";

export const getStudentAssignments = async () => {
    const response = await api.get("/student/assignments");

    return response.data?.data ?? response.data;
};

export const submitStudentAssignment = async ({
    assignmentId,
    answer,
    submissionUrl,
}) => {
    const response = await api.post(
        `/student/assignments/${assignmentId}/submit`,
        {
            answer,
            submission_url: submissionUrl || "",
        }
    );

    return response.data?.data ?? response.data;
};

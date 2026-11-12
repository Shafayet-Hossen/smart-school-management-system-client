
import api from "./api.js";

// Fetch all submissions for one assignment
export const getAssignmentSubmissions = async (assignmentId) => {
  // console.log("assignmentId: ",assignmentId)
  const response = await api.get(
    `/teacher/assignments/${encodeURIComponent(assignmentId)}/submissions`
  );

  const result = response.data?.data ?? response.data;
  // console.log("Fetched submissions:", result);
  if (Array.isArray(result)) {
    return result;
  }

  return result?.submissions ?? result?.records ?? [];
};

// Fetch one student's submission
export const getAssignmentSubmissionById = async ({
  assignmentId,
  submissionId,
}) => {
  const response = await api.get(
    `/teacher/assignments/${encodeURIComponent(assignmentId)}/submissions/${encodeURIComponent(submissionId)}`
  );

  return response.data?.data ?? response.data;
};

// Save marks and feedback
export const gradeAssignmentSubmission = async ({
  assignmentId,
  submissionId,
  marks,
  feedback,
}) => {
  // console.log("assignmentId: ",assignmentId);
  // console.log("submissionId: ",submissionId);
  // console.log("marks: ",marks);
  // console.log("feedback: ",feedback);
  
  const response = await api.patch(
    `/teacher/assignments/${encodeURIComponent(assignmentId)}/submissions/${encodeURIComponent(submissionId)}/grade`,
    {
      marks: Number(marks),
      feedback: feedback?.trim() ?? "",
    }
  );

  return response.data?.data ?? response.data;
};

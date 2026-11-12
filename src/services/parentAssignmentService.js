
import api from "./api.js";

export const getParentChildren = async () => {
    const response = await api.get("/parent/children");

    return response.data?.data ?? response.data;
};

export const getChildrenAssignments = async (studentId) => {
    if (!studentId) {
        throw new Error("Please select a child.");
    }
    // console.log(
    //     "student Id", studentId
    // )

    const response = await api.get(
        "/parent/children-assignments",
        {
            params: {
                student_id: studentId,
            },
        }
    );

    return response.data?.data ?? response.data;
};

import api from "./api";

// Get all academic subjects with optional filters.
export const getSchoolAdminSubjects = async (params = {}) => {
    const { data } = await api.get("/school-admin/academic-subjects", {
        params,
    });

    return data;
};

// Get dropdown options, such as classes.
export const getSchoolAdminSubjectOptions = async () => {
    const { data } = await api.get(
        "/school-admin/academic-subjects/options"
    );

    return data;
};

// Create a new academic subject.
export const createSchoolAdminSubject = async (payload) => {
    const { data } = await api.post(
        "/school-admin/academic-subjects",
        payload
    );

    return data;
};

// Update an existing academic subject.
export const updateSchoolAdminSubject = async ({
    subjectId,
    ...payload
}) => {
    const { data } = await api.patch(
        `/school-admin/academic-subjects/${subjectId}`,
        payload
    );

    return data;
};

// Delete an academic subject.
export const deleteSchoolAdminSubject = async (subjectId) => {
    const { data } = await api.delete(
        `/school-admin/academic-subjects/${subjectId}`
    );

    return data;
};
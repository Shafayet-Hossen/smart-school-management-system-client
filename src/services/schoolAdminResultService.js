
// src/services/schoolAdminResultService.js

import api from "./api.js";

const BASE_URL = "/school-admin/results";

export const getSchoolAdminResults = async (params = {}) => {
    const response = await api.get(BASE_URL, { params });
    return response.data;
};

export const getSchoolAdminResultSummary = async (params = {}) => {
    const response = await api.get(`${BASE_URL}/summary`, {
        params,
    });

    return response.data;
};

export const getSchoolAdminResultOptions = async (params = {}) => {
    const response = await api.get(`${BASE_URL}/options`, {
        params,
    });

    return response.data;
};

export const createSchoolAdminResult = async (payload) => {
    const response = await api.post(BASE_URL, payload);
    return response.data;
};

export const updateSchoolAdminResult = async ({
    resultId,
    ...payload
}) => {
    const response = await api.patch(
        `${BASE_URL}/${resultId}`,
        payload
    );

    return response.data;
};

export const publishSchoolAdminResult = async (resultId) => {
    const response = await api.patch(
        `${BASE_URL}/${resultId}/publish`
    );

    return response.data;
};

export const deleteSchoolAdminResult = async (resultId) => {
    const response = await api.delete(`${BASE_URL}/${resultId}`);
    return response.data;
};


import { apiRequest } from "./api.service.js";

export const exchangeFirebaseToken =
  async (firebaseIdToken) => {
    return apiRequest(firebaseIdToken,
      "/auth/login",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${firebaseIdToken}`,
        },
      }
    );
  };

export const getCurrentUser =
  async (accessToken) => {
    return apiRequest(
      "/auth/jwt-test",
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      }
    );
  };
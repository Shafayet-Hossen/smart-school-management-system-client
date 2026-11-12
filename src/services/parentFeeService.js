
import api from "./api.js";

const BASE_URL = "/parent/fees";

// Get fee dashboard summary
export const getParentFeeSummary = async (params = {}) => {
  const { data } = await api.get(`${BASE_URL}/summary`, {
    params,
  });

  return data;
};

// Get children linked to the authenticated parent
export const getParentChildren = async () => {
  const { data } = await api.get(`${BASE_URL}/children`);

  // console.log("children",data);
  return data;
};

// Get fee records
export const getParentFees = async (params = {}) => {
  const { data } = await api.get(BASE_URL, {
    params,
  });

  return data;
};

// Get outstanding fees
export const getParentDueFees = async (params = {}) => {
  const { data } = await api.get(`${BASE_URL}/due`, {
    params,
  });

  return data;
};

// Get payment history
export const getParentFeePayments = async (params = {}) => {
  const { data } = await api.get(`${BASE_URL}/payments`, {
    params,
  });

  return data;
};

// Get individual fee details
export const getParentFeeDetails = async (feeId) => {
  const { data } = await api.get(`${BASE_URL}/${feeId}`);

  return data;
};

// Get payment receipts
export const getParentFeeReceipts = async (params = {}) => {
  const { data } = await api.get(`${BASE_URL}/receipts`, {
    params,
  });

  return data;
};

// Create Stripe Checkout Session
export const createParentCheckoutSession = async ({
    feeId,
    amount,
}) => {
    const { data } = await api.post(
        `${BASE_URL}/create-checkout-session`,
        {
            feeId,
            amount,
        }
    );

    return data;
};

// Verify Stripe Checkout payment
export const verifyParentCheckoutSession = async (sessionId) => {
    const { data } = await api.get(
        `${BASE_URL}/payment-status/${encodeURIComponent(sessionId)}`
    );

    return data;
};
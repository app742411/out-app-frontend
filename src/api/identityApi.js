import apiClient from "./apiClient";

export const getPendingIdentities = async (params = {}) => {
  try {
    const response = await apiClient.get("/api/admin/identity/pending", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getIdentityDetails = async (userId) => {
  try {
    const response = await apiClient.get(`/api/admin/identity/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const approveIdentity = async (userId) => {
  try {
    const response = await apiClient.patch(`/api/admin/identity/${userId}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const rejectIdentity = async (userId, reason) => {
  try {
    const response = await apiClient.patch(`/api/admin/identity/${userId}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

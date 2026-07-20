import apiClient from "./apiClient";

export const getPendingIdentities = async (params = {}) => {
  const response = await apiClient.get("/api/admin/identity/pending", { params });
  return response.data;
};

export const getIdentityDetails = async (userId) => {
  const response = await apiClient.get(`/api/admin/identity/${userId}`);
  return response.data;
};

export const approveIdentity = async (userId) => {
  const response = await apiClient.patch(`/api/admin/identity/${userId}/approve`);
  return response.data;
};

export const rejectIdentity = async (userId, reason) => {
  const response = await apiClient.patch(`/api/admin/identity/${userId}/reject`, { reason });
  return response.data;
};

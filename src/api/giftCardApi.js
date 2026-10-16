import apiClient from "./apiClient";

// 1. Create a gift card
export const createGiftCard = async (payload) => {
  try {
    const res = await apiClient.post("/api/admin/createGiftCard", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 2. Get all gift cards with pagination and filters
export const getAllGiftCards = async ({
  page = 1,
  limit = 10,
  search = "",
  targetType = "",
  status = "",
} = {}) => {
  try {
    const params = { page, limit };
    if (search && search.trim()) params.search = search.trim();
    if (targetType) params.targetType = targetType;
    if (status) params.status = status;

    const res = await apiClient.get("/api/admin/getAllGiftCards", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 3. Get gift card by ID
export const getGiftCardById = async (id) => {
  try {
    const res = await apiClient.get(`/api/admin/getGiftCardById/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 4. Update gift card (title, description, startDate, expiryDate, usageLimit, isActive)
export const updateGiftCard = async (id, payload) => {
  try {
    const res = await apiClient.patch(`/api/admin/updateGiftCard/${id}`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 5. Delete gift card (Soft-delete)
export const deleteGiftCard = async (id) => {
  try {
    const res = await apiClient.delete(`/api/admin/deleteGiftCard/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 6. Get user wallet and transactions
export const getUserWallet = async (userId) => {
  try {
    const res = await apiClient.get(`/api/admin/getUserWallet/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

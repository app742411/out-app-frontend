// src/api/authApi.js
import apiClient from "./apiClient";

// ADMIN DASHBOARD
export const getAdminDashboard = async () => {
  try {
    const res = await apiClient.get("/api/admin/dashboard");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// UPDATE ADMIN PROFILE
export const updateAdminProfile = async (formData) => {
  try {
    const res = await apiClient.put("/api/admin/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) => {
  try {
    const res = await apiClient.get("/api/admin/get-all-users", {
      params: {
        page,
        limit,
        search,
        status, // 'active' or 'inactive'
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllServiceUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) => {
  try {
    const res = await apiClient.get("/api/admin/get-all-service-users", {
      params: {
        page,
        limit,
        search,
        status, // 'active' or 'inactive'
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllProperties = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) => {
  try {
    const res = await apiClient.get("/api/admin/properties", {
      params: {
        page,
        limit,
        search,
        status, // 'active' or 'inactive'
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getServiceUserDetails = async (id) => {
  try {
    const res = await apiClient.get(`/api/admin/get-service-user/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const approveRejectServiceUser = async (id, payload) => {
  try {
    const res = await apiClient.put(
      `/api/admin/approved-rejected/${id}`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUser = async (id) => {
  try {
    const res = await apiClient.get(`/api/admin/get-user/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const blockUnblockUser = async (userId, type, isActive) => {
  try {
    const res = await apiClient.put(
      `/api/admin/block-unblock/${userId}/${type}`,
      { isActive }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPropertyDetailsForAdmin = async (id) => {
  try {
    const res = await apiClient.get(`/api/admin/getPropertyDetailsForAdmin/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPendingProperties = async () => {
  try {
    const res = await apiClient.get("/api/admin/getPendingProperties");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePropertyApproval = async (id, action, reason) => {
  try {
    const payload = { action };
    if (reason) payload.reason = reason;
    const res = await apiClient.put(`/api/admin/updatePropertyApproval/${id}`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPendingServices = async () => {
  try {
    const res = await apiClient.get("/api/admin/getPendingServices");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateServiceApproval = async (id, action, reason) => {
  try {
    const payload = { action };
    if (reason) payload.reason = reason;
    const res = await apiClient.put(`/api/admin/updateServiceApproval/${id}`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserProperties = async (userId) => {
  try {
    const res = await apiClient.get(`/api/admin/userAllProperties/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// COUPONS API
export const createCoupon = async (payload) => {
  try {
    const res = await apiClient.post("/api/admin/createCoupon", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCoupons = async ({ page = 1, limit = 10, search = "" } = {}) => {
  try {
    const res = await apiClient.get("/api/admin/getAllCoupons", {
      params: { page, limit, search }
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateCoupon = async (id, payload) => {
  try {
    const res = await apiClient.patch(`/api/admin/updateCoupon/${id}`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteCoupon = async (id) => {
  try {
    const res = await apiClient.delete(`/api/admin/deleteCoupon/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getFeatures = async (page = 1, limit = 10, search = "") => {
  try {
    const res = await apiClient.get(`/api/admin/get-features?page=${page}&limit=${limit}&search=${search}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addFeature = async (featureName) => {
  try {
    const res = await apiClient.post("/api/admin/add-feature", { feature: featureName });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateFeature = async (id, feature) => {
  try {
    const res = await apiClient.post(`/api/admin/add-feature`, { feature, id });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteFeature = async (id) => {
  try {
    const res = await apiClient.delete(`/api/admin/deleteFeature/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// RESTROOM AMENITIES API
export const getRestrooms = async (page = 1, limit = 10, search = "") => {
  try {
    const res = await apiClient.get(`/api/admin/get-restrooms`, {
      params: { page, limit, search }
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addRestroom = async (name) => {
  try {
    const res = await apiClient.post("/api/admin/add-restroom", { name });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateRestroom = async (id, name) => {
  const res = await apiClient.put(`/api/admin/updateRestRoom/${id}`, { name });
  return res.data;
};

export const deleteRestroom = async (id) => {
  const res = await apiClient.delete(`/api/admin/deleteRestRoom/${id}`);
  return res.data;
};

// Change Password API
export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  const res = await apiClient.post("/api/admin/change-password", {
    oldPassword,
    newPassword,
    confirmPassword
  });
  return res.data;
};

// Login API
export const loginUser = async (email, password) => {
  const res = await apiClient.post("/api/admin/sign-in", { email, password });
  return res.data;
};

// Forgot Password OTP API
export const sendForgotPasswordOTP = async (email) => {
  const res = await apiClient.post("/api/admin/forget-password", { email });
  return res.data;
};


export const verifyOTP = async (email, otp) => {
  const res = await apiClient.post(`/api/admin/validate-otp?email=${encodeURIComponent(email)}`, {
    otp,
  });
  return res.data;
};


export const resetPassword = async (token, newPassword, confirmPassword) => {
  const res = await apiClient.post(
    `/api/admin/reset-password?token=${encodeURIComponent(token)}`,
    { newPassword, confirmPassword }
  );
  return res.data;
};

export const addCategory = async (formData) => {
  try {
    const res = await apiClient.post("api/admin/add-category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCategories = async ({
  page = 1,
  limit = 5,
  search = "",
  status = "",
  sortBy = "",

} = {}) => {
  try {
    const res = await apiClient.get("/api/admin/get-categories", {
      params: {
        page,
        limit,
        search,
        status,
        sortBy,

      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

//  EDIT / UPDATE CATEGORY
export const updateCategory = async (id, formData) => {
  const res = await apiClient.put(`api/admin/edit-category/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

//  DELETE CATEGORY
export const deleteCategory = async (id) => {
  const res = await apiClient.delete(`api/admin/delete-category/${id}`);
  return res.data;
};

// SERVICE CATEGORY API
export const createServiceCategory = async (formData) => {
  try {
    const res = await apiClient.post("/api/admin/createServiceCategory", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateServiceCategory = async (id, formData) => {
  try {
    const res = await apiClient.put(`/api/admin/updateServiceCategory/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const toggleServiceCategoryStatus = async (id) => {
  try {
    const res = await apiClient.patch(`/api/admin/toggleServiceCategoryStatus/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllServiceCategories = async (params = {}) => {
  try {
    const res = await apiClient.get("/api/admin/getAllServiceCategories", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteServiceCategory = async (id) => {
  try {
    const res = await apiClient.delete(`/api/admin/deleteServiceCategory/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// SERVICE MANAGEMENT API
export const getAllServicesAdmin = async (params = {}) => {
  try {
    const res = await apiClient.get("/api/admin/getAllServicesAdmin", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSingleServiceAdmin = async (id) => {
  try {
    const res = await apiClient.get(`/api/admin/getSingleServiceAdmin/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getServicesByUserAdmin = async (userId) => {
  try {
    const res = await apiClient.get(`/api/admin/getServicesByUserAdmin/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getVendorStatsAdmin = async (userId) => {
  try {
    const res = await apiClient.get(`/api/admin/getVendorStatsAdmin/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
// PACKAGE MANAGEMENT
export const getAllPackagesAdmin = async (params = {}) => {
  try {
    const res = await apiClient.get("/api/admin/getAllPackagesAdmin", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSinglePackageAdmin = async (id) => {
  try {
    const res = await apiClient.get(`/api/admin/getSinglePackageAdmin/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPackagesByUserAdmin = async (userId) => {
  try {
    const res = await apiClient.get(`/api/admin/getPackagesByUserAdmin/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addAmenities = async (amenities) => {
  const res = await apiClient.post("api/admin/add-amenities", { amenities });
  return res.data;
};


//  ADD MULTIPLE AMENITIES
export const listAmenities = async (page = 1, limit = 5, search = "") => {
  try {
    const res = await apiClient.get(
      `/api/admin/get-amenities?page=${page}&limit=${limit}&search=${search}`
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


//  UPDATE SINGLE AMENITY
export const updateAmenities = async (id, { name, icon }) => {
  const res = await apiClient.put(`/api/admin/update-amenity/${id}`, {
    name,
    icon
  });
  return res.data;
};

//  DELETE ONE AMENITY
export const deleteAmenity = async (id) => {
  const res = await apiClient.delete(`/api/admin/delete-amenities/${id}`);
  return res.data;
};

// COMMISSION API
export const createCommission = async (payload) => {
  try {
    const res = await apiClient.post("/api/admin/createCommission", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCommissions = async () => {
  try {
    const res = await apiClient.get("/api/admin/getAllCommissions");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateCommission = async (id, payload) => {
  try {
    const res = await apiClient.put(`/api/admin/updateCommission/${id}`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteCommission = async (id) => {
  try {
    const res = await apiClient.delete(`/api/admin/deleteCommission/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// BANNERS API
export const createBanner = async (formData) => {
  try {
    const res = await apiClient.post("/api/admin/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getBanners = async () => {
  try {
    const res = await apiClient.get("/api/admin/bannerList");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateBanner = async (id, formData) => {
  try {
    const res = await apiClient.put(`/api/admin/updateBanner/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteBanner = async (id) => {
  try {
    const res = await apiClient.delete(`/api/admin/deleteBanner/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const getAdminConversations = async (chatType, page = 1) => {
  try {
    const res = await apiClient.get(`/api/chat/admin-conversations`, {
      params: { chatType, page }
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const res = await apiClient.get(`/api/chat/messages/${conversationId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const closeTicket = async (ticketId) => {
  try {
    const res = await apiClient.put(`/api/chat/closeTicket/${ticketId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const reopenTicket = async (ticketId) => {
  try {
    const res = await apiClient.put(`/api/chat/reopenTicket/${ticketId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// BOOKINGS API
export const getAllBookings = async () => {
  try {
    const res = await apiClient.get("/api/admin/allBookings");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getBookingDetails = async (id) => {
  try {
    const res = await apiClient.get(`/api/admin/bookingDetail/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPropertyBookings = async (propertyId, { page = 1, limit = 10 } = {}) => {
  try {
    const res = await apiClient.get(`/api/admin/property-bookings/${propertyId}`, {
      params: { page, limit }
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAdminUpcomingBookings = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const res = await apiClient.get("/api/admin/getAdminUpcomingBookings", {
      params: { page, limit }
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// FINANCE CONFIGURATION API
export const updatePlatformFee = async (payload) => {
  try {
    const res = await apiClient.post("/api/admin/platform-fee", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateTax = async (payload) => {
  try {
    const res = await apiClient.post("/api/admin/tax", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPlatformConfig = async () => {
  try {
    const res = await apiClient.get("/api/admin/platform-config");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// TRANSACTIONS API
export const getAllPaymentTransactions = async () => {
  try {
    const res = await apiClient.get("/api/admin/getAllPaymentTransactions");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllWalletTransactions = async () => {
  try {
    const res = await apiClient.get("/api/admin/getAllWalletTransactions");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getTransactionDetails = async (id) => {
  try {
    const res = await apiClient.get(`/api/admin/getTransactionDetails/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// SYSTEM SETTINGS API (Toggles & Info)
export const getSystemSettings = async () => {
  try {
    const res = await apiClient.get("/api/admin/system-settings");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateSystemToggle = async (key, value) => {
  try {
    const res = await apiClient.patch("/api/admin/system-toggle", { key, value });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAdminBookingCalendar = async (propertyId) => {
  try {
    const res = await apiClient.get("/api/admin/getAdminBookingCalendar", {
      params: { propertyId },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// WITHDRAW REQUESTS API
export const getWithdrawRequests = async (params = {}) => {
  try {
    const res = await apiClient.get("/api/admin/getWithdrawRequests", { params });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateWithdrawStatus = async (id, payload) => {
  try {
    const res = await apiClient.put(`/api/admin/updateWithdrawStatus/${id}`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllUserBookingsAdmin = async (userId, { page = 1, limit = 5 } = {}) => {
  try {
    const res = await apiClient.get(`/api/admin/getAllUserBookingsAdmin/${userId}`, {
      params: { page, limit }
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// CANCELLATION POLICIES API
export const getCancellationPolicies = async () => {
  try {
    const res = await apiClient.get("/api/admin/getCancellationPolicies");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const upsertCancellationPolicies = async (payload) => {
  try {
    const res = await apiClient.post("/api/admin/upsertCancellationPolicies", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

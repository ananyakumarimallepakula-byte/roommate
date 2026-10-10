import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('roommate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(customMessage));
  }
);

// 1. Auth API
export const authApi = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data)
};

// 2. User API
export const userApi = {
  getMe: () => apiClient.get('/users/me'),
  updateMe: (data) => apiClient.put('/users/me', data),
  getUserById: (id) => apiClient.get(`/users/${id}`)
};

// 3. Profile API
export const profileApi = {
  getStudentProfile: () => apiClient.get('/profiles/student/me'),
  updateStudentProfile: (data) => apiClient.put('/profiles/student/me', data),
  getStudentById: (userId) => apiClient.get(`/profiles/student/${userId}`),
  getOwnerProfile: () => apiClient.get('/profiles/owner/me'),
  updateOwnerProfile: (data) => apiClient.put('/profiles/owner/me', data),
  getPreferences: () => apiClient.get('/profiles/preferences/me'),
  updatePreferences: (data) => apiClient.put('/profiles/preferences/me', data)
};

// 4. Accommodation API
export const accommodationApi = {
  search: (params) => apiClient.get('/accommodations/search', { params }),
  getFeatured: () => apiClient.get('/accommodations/featured'),
  getCities: () => apiClient.get('/accommodations/cities'),
  getAmenities: () => apiClient.get('/accommodations/amenities'),
  getById: (id) => apiClient.get(`/accommodations/${id}`),
  create: (data) => apiClient.post('/accommodations', data),
  update: (id, data) => apiClient.put(`/accommodations/${id}`, data),
  delete: (id) => apiClient.delete(`/accommodations/${id}`),
  updateAvailability: (id, status) => apiClient.patch(`/accommodations/${id}/availability`, null, { params: { status } }),
  toggleSave: (id) => apiClient.post(`/accommodations/${id}/save`),
  getSavedListings: (params) => apiClient.get('/accommodations/saved', { params }),
  getMyListings: (params) => apiClient.get('/accommodations/my-listings', { params })
};

// 5. Matching Engine API
export const matchingApi = {
  getMatches: () => apiClient.get('/matches')
};

// 6. Roommate Connection Requests API
export const requestApi = {
  sendRequest: (data) => apiClient.post('/roommate-requests', data),
  getSent: (params) => apiClient.get('/roommate-requests/sent', { params }),
  getReceived: (params) => apiClient.get('/roommate-requests/received', { params }),
  updateStatus: (id, status) => apiClient.patch(`/roommate-requests/${id}/status`, null, { params: { status } })
};

// 7. Property Enquiries API
export const enquiryApi = {
  createEnquiry: (data) => apiClient.post('/enquiries', data),
  getStudentEnquiries: (params) => apiClient.get('/enquiries/student', { params }),
  getOwnerEnquiries: (params) => apiClient.get('/enquiries/owner', { params }),
  respondEnquiry: (id, data) => apiClient.post(`/enquiries/${id}/respond`, data)
};

// 8. Chat API
export const chatApi = {
  getConversations: (params) => apiClient.get('/chat/conversations', { params }),
  getMessages: (conversationId) => apiClient.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (data) => apiClient.post('/chat/messages', data)
};

// 9. Notifications API
export const notificationApi = {
  getNotifications: (params) => apiClient.get('/notifications', { params }),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/notifications/read-all')
};

// 10. Reports API
export const reportApi = {
  createReport: (data) => apiClient.post('/reports', data)
};

// 11. Admin API
export const adminApi = {
  getStats: () => apiClient.get('/admin/stats'),
  searchUsers: (params) => apiClient.get('/admin/users', { params }),
  updateUserStatus: (id, data) => apiClient.patch(`/admin/users/${id}/status`, data),
  getAccommodations: (params) => apiClient.get('/admin/accommodations', { params }),
  moderateAccommodation: (id, data) => apiClient.post(`/admin/accommodations/${id}/moderate`, data),
  getReports: (params) => apiClient.get('/admin/reports', { params }),
  resolveReport: (id, data) => apiClient.post(`/admin/reports/${id}/resolve`, data),
  getAuditLogs: (params) => apiClient.get('/admin/audit-logs', { params })
};

// 12. File Upload API
export const uploadApi = {
  uploadPropertyImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload/property-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

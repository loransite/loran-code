import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle rate limiting
    if (error.response?.status === 429) {
      const message = error.response?.data?.message || 'Too many requests. Please try again later.';
      if (typeof window !== 'undefined') {
        alert(message);
      }
      return Promise.reject(error);
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || 'Session expired';
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('availableRoles');
      
      if (typeof window !== 'undefined') {
        alert(`${message}. Please log in again.`);
        window.location.href = '/login';
      }
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      if (typeof window !== 'undefined') {
        alert('Server error. Please try again later.');
      }
    }

    return Promise.reject(error);
  }
);

// API endpoint functions
export const authAPI = {
  signup: (data: { fullName: string; email: string; password: string; role: string }) =>
    apiClient.post('/api/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/api/auth/login', data),
};

export const catalogueAPI = {
  getAll: () => apiClient.get('/api/catalogue'),
  getById: (id: string) => apiClient.get(`/api/catalogue/${id}`),
};

export const designAPI = {
  getAll: () => apiClient.get('/api/designs'),
  getByDesigner: (designerId: string) => apiClient.get(`/api/designs/designer/${designerId}`),
  create: (data: FormData) =>
    apiClient.post('/api/designs', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const orderAPI = {
  getClientOrders: (catalogueId?: string) => {
    const query = catalogueId ? `?catalogueId=${catalogueId}` : '';
    return apiClient.get(`/api/orders/client${query}`);
  },
  create: (data: { catalogueId: string; total: number; measurements?: any; measurementMethod?: string; shipping?: any }) =>
    apiClient.post('/api/orders', data),
  delete: (orderId: string) => apiClient.delete(`/api/orders/${orderId}`),
  getAdminOrders: () => apiClient.get('/api/orders'),
  getDesignerOrders: () => apiClient.get('/api/orders/designer'),
  updateStatus: (orderId: string, status: string) => apiClient.put(`/api/orders/${orderId}/status`, { status }),
};

export const paymentAPI = {
  initialize: (data: { email: string; amount: number; orderId: string }) =>
    apiClient.post('/api/payments/initialize', data),
  verify: (reference: string) =>
    apiClient.get(`/api/payments/verify?reference=${reference}`),
};

export const aiAPI = {
  uploadPhoto: (formData: FormData) =>
    apiClient.post('/api/ai/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  generateDesign: (prompt: string) =>
    apiClient.post('/api/ai/generate', { prompt }),
};

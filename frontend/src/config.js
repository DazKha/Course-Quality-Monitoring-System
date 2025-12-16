// API Configuration
// Tự động detect môi trường: development (localhost) hoặc production (deployed)
const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? '' // Development: dùng proxy hoặc same-origin (localhost:8000)
  : (import.meta.env.VITE_API_URL || 'https://course-quality-monitoring-system.onrender.com');

// Helper function to build API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Log config khi development để debug
if (isDevelopment) {
  console.log('🔧 Development Mode');
  console.log('API Base URL:', API_BASE_URL || 'localhost (proxy)');
} else {
  console.log('🚀 Production Mode');
  console.log('API Base URL:', API_BASE_URL);
}


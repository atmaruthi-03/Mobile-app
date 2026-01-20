import api from './api';

// Define types for your requests and responses in src/types/
// For now using ‘any’ placeholders

export const login = async (credentials: any) => {
  const response = await api.post('/auth/token', credentials);
  return response.data;
};

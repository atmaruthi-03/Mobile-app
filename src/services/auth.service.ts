import axios from 'axios';
import { ENV } from '../constants/env';

export async function login(username: string, password: string) {
  // Manual string construction to ensure compatibility
  const body = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&scope=&client_id=&client_secret=`;

  // Use a fresh axios call to bypass interceptors
  const response = await axios.post(`${ENV.API_URL}/auth/login`, body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 15000,
  });

  return response.data;
}

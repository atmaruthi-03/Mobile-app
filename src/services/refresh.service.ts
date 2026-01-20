import axios from 'axios';

const BASE_URL = 'https://purelight-afb.pathsetter.ai';

export async function refreshAccessToken(refreshToken: string) {
  const response = await axios.post(`${BASE_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  });
  return response.data; // Expected { access_token, refresh_token }
}

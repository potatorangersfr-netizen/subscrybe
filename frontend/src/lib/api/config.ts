// frontend/src/lib/api/config.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://subscrybe-backend.railway.app';

export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 10000,
};

export function getApiUrl(endpoint: string): string {
  return `${apiConfig.baseUrl}${endpoint}`;
}
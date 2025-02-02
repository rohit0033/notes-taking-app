declare global {
  interface Window {
    ENV_API_URL?: string;
  }
}

export const API_BASE_URL = 
  (typeof window !== "undefined" ? window.ENV_API_URL : undefined) ?? 
  'http://localhost:5000/api';

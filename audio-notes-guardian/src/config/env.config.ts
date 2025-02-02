declare global {
  interface Window {
    __ENV?: {
      NEXT_PUBLIC_API_URL: string;
    };
  }
}

const env = {
  apiUrl: 
    typeof window !== 'undefined' 
      ? window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api'
        : process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  isProduction: process.env.NODE_ENV === 'production',
};

export default env;

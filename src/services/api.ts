import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  userName: string;
  roleId: string;
  roleName: string;
  organizationUuid: string;
  multiTenant: string;
  ".issued": string;
  ".expires": string;
  logo: string | null;
  avatar: string | null;
}

const API_BASE_URL = 'http://test-titantdrapi.minisisinc.com';
const TOKEN_ENDPOINT = '/token';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Token handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  token?: string;
}> = [];

// Default login credentials for automatic login
const defaultCredentials = {
  username: 'camstesttdr',
  password: 'Demo_Account1',
  grant_type: 'password',
};

// Process the queue of failed requests
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  failedQueue.push({
    resolve: (token: unknown) => callback(token as string),
    reject: (error: Error) => console.error('Token refresh failed:', error),
  });
};

// User login function
export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('grant_type', 'password');

  try {
    const response = await api.post<AuthResponse>(TOKEN_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Store token in session storage
    const { access_token, expires_in } = response.data;
    sessionStorage.setItem('auth_token', access_token);
    
    // Store expiration time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);
    sessionStorage.setItem('auth_expires', expiresAt.toISOString());
    
    // Store full auth data
    sessionStorage.setItem('auth_data', JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Auto login function
export const autoLogin = async (): Promise<AuthResponse> => {
  return loginUser(defaultCredentials.username, defaultCredentials.password);
};

// Get token from session storage
const getToken = (): string | null => {
  return sessionStorage.getItem('auth_token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken() && !isTokenExpired();
};

// Check if token is expired
export const isTokenExpired = (): boolean => {
  const expiresString = sessionStorage.getItem('auth_expires');
  if (!expiresString) return true;
  
  const expires = new Date(expiresString);
  // Return true if token expires in less than 5 minutes
  return expires.getTime() - Date.now() < 5 * 60 * 1000;
};

// Refresh token function
const refreshToken = async (): Promise<string> => {
  try {
    // For this implementation, we'll just get a new token using the default credentials
    const formData = new URLSearchParams();
    formData.append('username', defaultCredentials.username);
    formData.append('password', defaultCredentials.password);
    formData.append('grant_type', 'password');
    
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}${TOKEN_ENDPOINT}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Store new token in session storage
    const { access_token, expires_in } = response.data;
    sessionStorage.setItem('auth_token', access_token);
    
    // Store new expiration time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);
    sessionStorage.setItem('auth_expires', expiresAt.toISOString());
    
    return access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token for token endpoint
    if (config.url === TOKEN_ENDPOINT) {
      return config;
    }
    
    const token = getToken();
    
    // If we have a token and it's not expired, use it
    if (token && !isTokenExpired()) {
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    }
    
    // If we're already refreshing, wait for the new token
    if (isRefreshing) {
      return new Promise<InternalAxiosRequestConfig>((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          config.headers['Authorization'] = `Bearer ${token}`;
          resolve(config);
        });
        reject(new Error('Token refresh failed'));
      });
    }
    
    // Otherwise, refresh the token
    isRefreshing = true;
    
    try {
      const newToken = await refreshToken();
      config.headers['Authorization'] = `Bearer ${newToken}`;
      
      // Process any queued requests
      processQueue(null, newToken);
      
      return config;
    } catch (error) {
      processQueue(error as Error, null);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Skip token refresh for token endpoint
    if (originalRequest?.url === TOKEN_ENDPOINT) {
      return Promise.reject(error);
    }
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && originalRequest && !originalRequest.headers['X-Retry']) {
      // If we're already refreshing, wait for the new token
      if (isRefreshing) {
        try {
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                originalRequest.headers['X-Retry'] = 'true';
              }
              resolve(api(originalRequest));
            });
          });
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      
      // Otherwise, refresh the token
      isRefreshing = true;
      
      try {
        const newToken = await refreshToken();
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['X-Retry'] = 'true';
        }
        
        // Process any queued requests
        processQueue(null, newToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

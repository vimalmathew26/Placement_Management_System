import Cookies from 'js-cookie';

interface ApiOptions {
  headers?: Record<string, string>;
  body?: unknown;
}

export function useApi() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const getHeaders = () => {
    const token = Cookies.get('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({} as Record<string, unknown>));
      throw new Error(error.message as string || 'An error occurred');
    }
    return response.json() as Promise<T>;
  };

  const get = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });
    return handleResponse<T>(response);
  };

  const post = async <T, D extends Record<string, unknown>>(
    endpoint: string, 
    data: D, 
    options: ApiOptions = {}
  ): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  };

  const put = async <T, D extends Record<string, unknown>>(
    endpoint: string, 
    data: D, 
    options: ApiOptions = {}
  ): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  };

  const del = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });
    return handleResponse<T>(response);
  };

  return {
    get,
    post,
    put,
    delete: del,
  };
}
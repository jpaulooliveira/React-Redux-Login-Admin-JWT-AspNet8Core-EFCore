import { store, authActions } from '../store';
import { baseUrl } from '../constants/URLConstants';

export const httpModule = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
};

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function request(method: RequestMethod) {
  return (url: string, body?: any) => {
    const requestOptions: RequestInit | any = {
      method,
      headers: authHeader(url)
    };

    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }

    return fetch(`${baseUrl+url}`, requestOptions).then(handleResponse);
  };
}

// helper functions

function authHeader(url: string): Record<string, string> {
  // return auth header with jwt if the user is logged in and the request is to the API url
  const token = authToken();
  const isLoggedIn = !!token;
  const isApiUrl = (baseUrl + url).startsWith(baseUrl || '');
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

function authToken(): string | any {
  return store.getState().auth.user?.token;
}

function handleResponse(response: Response): Promise<any> {
  return response.text().then(text => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].includes(response.status) && authToken()) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from API
        const logout = () => store.dispatch(authActions.logout());
        logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

export default { httpModule, request, authHeader, authToken, handleResponse  };
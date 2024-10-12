import axios from 'axios';

const makeRequest = axios.create({
  baseURL: 'http://localhost:8800/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dodanie interceptorów
makeRequest.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access Token:', accessToken); // Debugging log
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log('Authorization header set:', config.headers.Authorization); // Sprawdź nagłówek
      } else {
        console.log('No access token found.'); // Gdy nie ma tokena
      }
      console.log('Config before request:', config); // Loguj konfigurację
      return config; // Zwróć zmodyfikowaną konfigurację
    },
    (error) => {
      console.error('Request error:', error); // Loguj błąd
      return Promise.reject(error);
    }
);
  
makeRequest.interceptors.response.use(
    (response) => {
      console.log('Response received:', response); // Zapisz odpowiedź
      return response;
    },
    (error) => {
      console.error('API Error:', error.response ? error.response.data : error.message);
      return Promise.reject(error);
    }
);

export { makeRequest };

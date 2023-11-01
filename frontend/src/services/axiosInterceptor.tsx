/**
 * @description either before hitting or response from api we can change either request or response object...
 * @created 06/01/2023
 */
import axios from 'axios';
//import { ErrorHandler, Error_service } from "./ErrorHandler";
const axiosApiInstance = axios.create();

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config: any) => {
    const value = localStorage.getItem('accessToken') || "";
    const keys = JSON.parse(value)
    config.headers = {
      'Authorization': `Bearer ${keys.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config;
  },
  error => {
    Promise.reject(error)
   // return Error_service.errorHandle;
  });

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use((response) => {
  return response
}, async (error) => {

  const originalRequest = error.config;
  if (error.response.status === 403 && !originalRequest._retry) {
    // Error_service.ErrorHandle
    originalRequest._retry = true;
    const access_token = await refreshAccessToken();
    //AccessToken into localstorage...        
    localStorage.setItem('accessToken', access_token);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
   return axiosApiInstance(originalRequest);
   //return Error_service.errorHandle;
  }
   //return Error_service.errorHandle;
  
});

const refreshAccessToken = () => {
  return "";
}

const clientPost = async (url: string, reqBody: any) => {
  try {
    return await axios.post(url);
  } catch (err) {

  }
}

const clientGet = async (url: string, queryString: string) => {
  try {
    return await axios.get(url);
  } catch (err) {

  }
}

const clientPut = async (url: string, reqBody: any) => {
  try {
    return await axios.put(url);
  } catch (err) {

  }
}


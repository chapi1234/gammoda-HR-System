import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { apiConfig } from "../config/apiConfig";
import { mockApi } from "./mockApi";

class ApiClient {
  private client: AxiosInstance;
  private useMockMode: boolean;

  constructor() {
    this.useMockMode = apiConfig.useMockMode;
    this.client = axios.create({
      baseURL: apiConfig.baseURL,
      timeout: apiConfig.timeout,
      headers: apiConfig.headers,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (this.useMockMode) {
      return mockApi.get<T>(url, config);
    }
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (this.useMockMode) {
      return mockApi.post<T>(url, data, config);
    }
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (this.useMockMode) {
      return mockApi.patch<T>(url, data, config);
    }
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (this.useMockMode) {
      return mockApi.delete<T>(url, config);
    }
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  setMockMode(enabled: boolean) {
    this.useMockMode = enabled;
  }
}

export const apiClient = new ApiClient();

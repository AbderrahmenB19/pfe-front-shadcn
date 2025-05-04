import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  
  FormSchemaDTO,

  ProcessInstanceDTO,
  
  ReportDTO,
  SubmissionDTO
} from '../api'; // Assuming you have these types exported from your OpenAPI definitions
import { ProcessDefinitionDTO } from '@/types/process';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8090',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Form API
export const formApi = {
  /**
   * Get all form schemas
   * @returns Promise with array of FormSchemaDTO
   */
  getAllFormSchemas: (): Promise<AxiosResponse<Array<FormSchemaDTO>>> => 
    apiClient.get('/form/form-schema'),

  /**
   * Get a specific form schema by ID
   * @param id Form schema ID
   * @returns Promise with FormSchemaDTO
   */
  getFormSchema: (id: number): Promise<AxiosResponse<FormSchemaDTO>> => 
    apiClient.get(`/form/form-schema/${id}`),

  /**
   * Save a new form schema
   * @param data FormSchemaDTO to save
   * @returns Promise with success message
   */
  saveFormSchema: (data: FormSchemaDTO): Promise<AxiosResponse<string>> => 
    apiClient.post('/form/form-schema', data),

  /**
   * Update an existing form schema
   * @param data FormSchemaDTO to update
   * @returns Promise with success message
   */
  updateFormSchema: (data: FormSchemaDTO): Promise<AxiosResponse<string>> => 
    apiClient.put('/form/form-schema', data),
  
  
  deleteFormSchemaById: (id: number): Promise<AxiosResponse<string>> => 
    apiClient.delete(`/form/form-schema/${id}`),

  /**
   * Submit a form
   * @param data SubmissionDTO with form data
   * @returns Promise with success message
   */
  submitForm: (data: SubmissionDTO): Promise<AxiosResponse<string>> => 
    apiClient.post('/form', data),
};

// Process API
export const processApi = {
  /**
   * Cancel a process request
   * @param id Process instance ID
   * @returns Promise with success message
   */
  cancelRequest: (id: number): Promise<AxiosResponse<string>> => 
    apiClient.patch(`/processes/cancel-request/${id}`),

  /**
   * Clear all processes
   * @returns Promise with success message
   */
  clearProcesses: (): Promise<AxiosResponse<string>> => 
    apiClient.put('/processes/clear'),

  /**
   * Get all process definitions
   * @returns Promise with array of ProcessDefinitionDTO
   */
  getProcessDefinitions: (): Promise<AxiosResponse<Array<ProcessDefinitionDTO>>> => 
    apiClient.get('/processes/process-definition'),
  getProcessDefinitionById: (id: number ): Promise<AxiosResponse<ProcessDefinitionDTO>> => 
    apiClient.get(`/processes/process-definition/${id}`),

  /**
   * Get all reports for current user
   * @returns Promise with array of ReportDTO
   */
  getUserReports: (): Promise<AxiosResponse<Array<ReportDTO>>> => 
    apiClient.get('/processes'),

  /**
   * Get all reports (admin)
   * @returns Promise with array of ReportDTO
   */
  getAllReports: (): Promise<AxiosResponse<Array<ReportDTO>>> => 
    apiClient.get('/processes/all'),

  /**
   * Save a process definition
   * @param data ProcessDefinitionDTO to save
   * @returns Promise with success message
   */
  saveProcessDefinition: (data: ProcessDefinitionDTO): Promise<AxiosResponse<string>> => 
    apiClient.post('/processes/process-definition', data),

  /**
   * Save multiple process definitions
   * @param data Array of ProcessDefinitionDTO to save
   * @returns Promise with success message
   */
  saveAllProcessDefinitions: (data: Array<ProcessDefinitionDTO>): Promise<AxiosResponse<string>> => 
    apiClient.post('/processes/process-definition/all', data),

  /**
   * Update a process definition
   * @param data ProcessDefinitionDTO to update
   * @returns Promise with success message
   */
  updateProcessDefinition: (data: ProcessDefinitionDTO): Promise<AxiosResponse<string>> => 
    apiClient.put('/processes/process-definition', data),

  /**
   * Update multiple process definitions
   * @param data Array of ProcessDefinitionDTO to update
   * @returns Promise with success message
   */
  updateAllProcessDefinitions: (data: Array<ProcessDefinitionDTO>): Promise<AxiosResponse<string>> => 
    apiClient.put('/processes/process-definition/all', data),


  getProcessInstanceById: (id:number): Promise<AxiosResponse<ProcessInstanceDTO>> => 
    apiClient.get(`/processes/request/${id}`),

};

// Validator API
export const validatorApi = {
  /**
   * Approve a request
   * @param id Process instance ID
   * @returns Promise with success message
   */
  approveRequest: (id: number): Promise<AxiosResponse<string>> => 
    apiClient.post(`/requests/${id}/approve`),

  /**
   * Get requests by status
   * @param status Status to filter by
   * @returns Promise with array of ProcessInstanceDTO
   */
  getRequestsByStatus: (status: string): Promise<AxiosResponse<Array<ProcessInstanceDTO>>> => 
    apiClient.get(`/requests/${status}`),

  /**
   * Reject a request
   * @param id Process instance ID
   * @param comment Rejection comment
   * @returns Promise with success message
   */
  rejectRequest: (id: number, comment:string): Promise<AxiosResponse<string>> => 
    apiClient.post(`/requests/${id}/reject`, { comment: comment }),
};

// Add interceptors for request/response handling
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access - please login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
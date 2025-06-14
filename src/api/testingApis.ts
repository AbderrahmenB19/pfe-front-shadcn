import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  
  FormSchemaDTO,

  ProcessInstanceDTO,
  
  ReportDTO,
  SubmissionDTO
} from '../Models';
import { ProcessDefinitionDTO } from '@/types/process';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8090',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const formApi = {
 
  getAllFormSchemas: (): Promise<AxiosResponse<Array<FormSchemaDTO>>> => 
    apiClient.get('/form/form-schema'),

  
  getFormSchema: (id: number): Promise<AxiosResponse<FormSchemaDTO>> => 
    apiClient.get(`/form/form-schema/${id}`),

  
  saveFormSchema: (data: FormSchemaDTO): Promise<AxiosResponse<string>> => 
    apiClient.post('/form/form-schema', data),

 
  updateFormSchema: (data: FormSchemaDTO): Promise<AxiosResponse<string>> => 
    apiClient.put('/form/form-schema', data),
  
  
  deleteFormSchemaById: (id: number): Promise<AxiosResponse<string>> => 
    apiClient.delete(`/form/form-schema/${id}`),

 
  submitForm: (data: SubmissionDTO): Promise<AxiosResponse<string>> => 
    apiClient.post('/form', data),
};


export const processApi = {

  cancelRequest: (id: number): Promise<AxiosResponse<string>> => 
    apiClient.patch(`/processes/cancel-request/${id}`),

  
  clearProcesses: (): Promise<AxiosResponse<string>> => 
    apiClient.put('/processes/clear'),

  
  getProcessDefinitions: (): Promise<AxiosResponse<Array<ProcessDefinitionDTO>>> => 
    apiClient.get('/processes/process-definition'),
  getProcessDefinitionById: (id: number ): Promise<AxiosResponse<ProcessDefinitionDTO>> => 
    apiClient.get(`/processes/process-definition/${id}`),


  getUserReports: (): Promise<AxiosResponse<Array<ReportDTO>>> => 
    apiClient.get('/processes'),

 
  getAllReports: (): Promise<AxiosResponse<Array<ReportDTO>>> => 
    apiClient.get('/processes/all'),

  saveProcessDefinition: (data: ProcessDefinitionDTO): Promise<AxiosResponse<string>> => 
    apiClient.post('/processes/process-definition', data),

  
  saveAllProcessDefinitions: (data: Array<ProcessDefinitionDTO>): Promise<AxiosResponse<string>> => 
    apiClient.post('/processes/process-definition/all', data),

 
  updateProcessDefinition: (data: ProcessDefinitionDTO): Promise<AxiosResponse<string>> => 
    apiClient.put('/processes/process-definition', data),

  updateAllProcessDefinitions: (data: Array<ProcessDefinitionDTO>): Promise<AxiosResponse<string>> => 
    apiClient.put('/processes/process-definition/all', data),


  getProcessInstanceById: (id:number): Promise<AxiosResponse<ProcessInstanceDTO>> => 
    apiClient.get(`/processes/request/${id}`),

};

export const validatorApi = {
 
  approveRequest: (id: number): Promise<AxiosResponse<string>> => 
    apiClient.post(`/requests/${id}/approve`),

  
  getRequestsByStatus: (status: string): Promise<AxiosResponse<Array<ProcessInstanceDTO>>> => 
    apiClient.get(`/requests/${status}`),

 
  rejectRequest: (id: number, comment:string): Promise<AxiosResponse<string>> => 
    apiClient.post(`/requests/${id}/reject`, { comment: comment }),
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const rolesApi =   (): Promise<AxiosResponse<Array<string>>> => 
  apiClient.get(`/roles`)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - please login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
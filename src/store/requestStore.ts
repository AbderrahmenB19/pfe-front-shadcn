import { create } from 'zustand';
import {  SubmissionDTO } from '../Models';
import { formApi } from '../api/testingApis';


interface RequestStore {
    selectedSubmission: SubmissionDTO | null;
    isLoading: boolean;
    error: string | null;
    setSelectedSubmission: (form: SubmissionDTO) => void;
    updateFormData: (formData: string) => void;
    updateProcessDefenitionId: (processDefenitionId: number) => void;
    submitForm: () => Promise<void>;
    resetSubmission: () => void;
  }
  
  export const useSubmissionStore = create<RequestStore>((set, get) => ({
    selectedSubmission: null,
    isLoading: false,
    error: null,
    
    setSelectedSubmission: (submissionDTO: SubmissionDTO) => set({ selectedSubmission: submissionDTO }),
    
    updateFormData: (formData: string) => set((state) => ({
      selectedSubmission: state.selectedSubmission ? 
        { ...state.selectedSubmission, formData } : 
        { formData } as SubmissionDTO
    })),
    
    updateProcessDefenitionId: (processDefenitionId: number) => set((state) => ({
      selectedSubmission: state.selectedSubmission ? 
        { ...state.selectedSubmission, processDefenitionId } : 
        { processDefenitionId } as SubmissionDTO
    })),
    
    submitForm: async () => {
      
      try {
        set({ isLoading: true, error: null });
        const { selectedSubmission } = get();
        
        if (!selectedSubmission) {
          throw new Error("No form data to submit");
        }
        
        await formApi.submitForm(selectedSubmission);
       
        

        
        
        set({ selectedSubmission: null });
      } catch (error) {
        console.error("Error submitting form:", error);
           
        set({ error: "Failed to submit form. Please try again later." });
        throw error; 
      } finally {
        set({ isLoading: false });
      }
    },
    
    resetSubmission: () => set({ 
      selectedSubmission: null,
      error: null
    })
  }));
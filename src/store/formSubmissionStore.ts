import { create } from 'zustand';

interface FormSubmissionState {
  isSubmitting: boolean;
  hasSubmitted: boolean;
  error: string | null;
  setSubmitting: (value: boolean) => void;
  setHasSubmitted: (value: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useFormSubmissionStore = create<FormSubmissionState>((set) => ({
  isSubmitting: false,
  hasSubmitted: false,
  error: null,
  setSubmitting: (value) => set({ isSubmitting: value }),
  setHasSubmitted: (value) => set({ hasSubmitted: value }),
  setError: (error) => set({ error }),
  reset: () => set({ isSubmitting: false, hasSubmitted: false, error: null }),
}));
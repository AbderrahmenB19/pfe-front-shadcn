import { create } from 'zustand';
import { FormSchemaDTO } from '../Models';

interface FormStore {
  selectedForm: FormSchemaDTO | null;
  setSelectedForm: (form: FormSchemaDTO) => void;
 
}

export const useFormStore = create<FormStore>((set) => ({
  selectedForm: null,
  setSelectedForm: (formSchemaDTO) => set({ selectedForm: formSchemaDTO }),
 
}));

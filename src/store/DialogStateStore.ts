import { create } from "zustand"

interface DialogStateStore{
    submissionDialog: boolean,
    validationDialog:boolean,
    setSubmissionDialog:(value: boolean)=> void ,
    setValidationDialog:(value: boolean)=> void 
}
export const useDialogStateStore = create<DialogStateStore>((set)=>({
    submissionDialog : false,
    validationDialog : false,
    setSubmissionDialog : (value)=> set({submissionDialog: value}),
    setValidationDialog : (value)=> set({validationDialog: value})
})
   
 
)
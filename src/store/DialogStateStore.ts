import { create } from "zustand"

interface DialogStateStore{
    submissionDialog: boolean,
    validationDialog:boolean,
    toastState:{open:boolean, message: string|undefined, status: "success" | "error" | undefined},
    setToastState:(value: {open:boolean, message: string|undefined,status: "success" | "error" | undefined})=> void,
    setSubmissionDialog:(value: boolean)=> void ,
    setValidationDialog:(value: boolean)=> void 

}
export const useDialogStateStore = create<DialogStateStore>((set)=>({
    submissionDialog : false,
    validationDialog : false,
    toastState : {open:false ,  message:undefined, status: undefined},
    setToastState : (value)=> set({toastState: value}),
    setSubmissionDialog : (value)=> set({submissionDialog: value}),
    setValidationDialog : (value)=> set({validationDialog: value})
})
   
 
)
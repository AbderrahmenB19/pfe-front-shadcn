export interface ConditionDTO {
  condition: string
  targetStep: string
}

export interface FormTemplateDTO {
  id: number
  name: string
  jsonSchema?: string
}

export interface BaseStepDTO {
  name: string
  stepType: "NOTIFY" | "APPROVAL" | "CONDITION"
  id?: number 
}

export interface ApprovalStepDTO extends BaseStepDTO {
  stepType: "APPROVAL"
  validatorRoles: string[]
  requiredApproval: string 
  formTemplate?: FormTemplateDTO
}

export interface NotifyStepDTO extends BaseStepDTO {
  stepType: "NOTIFY"
  recipients: string[]
  message: string
}

export interface ConditionStepDTO extends BaseStepDTO {
  stepType: "CONDITION"
  condition: ConditionDTO[]
}

export type ProcessStepDTO = ApprovalStepDTO | NotifyStepDTO | ConditionStepDTO

export interface ProcessDefinitionDTO {
  id?: number 
  name: string
  formTemplate?: FormTemplateDTO
  steps: ProcessStepDTO[]
}

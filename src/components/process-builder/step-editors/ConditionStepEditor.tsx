

import { useState, useEffect } from "react"
import type { ConditionStepDTO, ConditionDTO, ProcessStepDTO, ProcessDefinitionDTO } from "../../../types/process"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { PlusCircle, Trash2, Pencil, Check, X } from "lucide-react"
import { formApi } from "@/api/testingApis"

interface ConditionStepEditorProps {
  step: ConditionStepDTO
  allSteps: ProcessStepDTO[]
  onUpdateStep: (updatedStep: ConditionStepDTO) => void
  processDefinition: ProcessDefinitionDTO
}

export default function ConditionStepEditor({ step, allSteps, onUpdateStep, processDefinition }: ConditionStepEditorProps) {
  const [newField, setNewField] = useState<string>("");
  const [newOperator, setNewOperator] = useState<string>("==");
  const [newValue, setNewValue] = useState<string>("");
  const [newTargetStep, setNewTargetStep] = useState<string>("");
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string>("");
  const [editingOperator, setEditingOperator] = useState<string>("==");
  const [editingValue, setEditingValue] = useState<string>("");
  const [editingTargetStep, setEditingTargetStep] = useState<string>("");
  const [selectedFormProcess, setSelectedFormProcess]= useState<string>("");
  
  const [formFields, setFormFields] = useState<{id: string, label: string}[]>([]);
  
  const operators = [
    { value: "==", label: "Equals (==)" },
    { value: "!=", label: "Not Equals (!=)" },
    { value: ">", label: "Greater Than (>)" },
    { value: "<", label: "Less Than (<)" },
    { value: ">=", label: "Greater Than or Equal (>=)" },
    { value: "<=", label: "Less Than or Equal (<=)" },
    { value: "includes", label: "Includes" },
    { value: "!includes", label: "Not Includes" }
  ];
  const fetchJsonSchemTemplate = async (id :number)=>{
    try{
      const response =  await formApi.getFormSchema(id);
     setSelectedFormProcess(response.data.jsonSchema!)
    }catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    const fetchAndExtractFields = async () => {
      if (processDefinition.formTemplate?.id) {
        try {
          await fetchJsonSchemTemplate(processDefinition.formTemplate.id);
          
          if (selectedFormProcess) {
            const schema = JSON.parse(selectedFormProcess);
            const extractedFields: {id: string, label: string}[] = [];
            
            const extractFields = (components: any[]) => {
              components.forEach((component: any) => {
                // Skip submit buttons and columns containers
                if (component.type !== 'submit' && component.type !== 'columns' && component.key && component.label) {
                  extractedFields.push({
                    id: component.key,
                    label: component.label
                  });
                }
                if (component.components && Array.isArray(component.components)) {
                  extractFields(component.components);
                }
                if (component.columns && Array.isArray(component.columns)) {
                  component.columns.forEach((column: any) => {
                    if (column.components && Array.isArray(column.components)) {
                      extractFields(column.components);
                    }
                  });
                }
                if (component.rows && Array.isArray(component.rows)) {
                  component.rows.forEach((row: any) => {
                    row.forEach((cell: any) => {
                      if (cell.components && Array.isArray(cell.components)) {
                        extractFields(cell.components);
                      }
                    });
                  });
                }
              });
            }

            if (schema.components && Array.isArray(schema.components)) {
              extractFields(schema.components);
            }
            
            setFormFields(extractedFields);
          }
        } catch (error) {
          console.error("Error fetching or parsing form schema:", error);
        }
      }
    };

    fetchAndExtractFields();
  }, [processDefinition.formTemplate?.id, selectedFormProcess]);

  const formatCondition = (field: string, operator: string, value: string): string => {
    return `#${field} ${operator} ${value}`;
  }

  const parseCondition = (conditionStr: string): { field: string, operator: string, value: string } => {
    let field = "";
    let operator = "==";
    let value = "";

    try {
      if (conditionStr.startsWith("#")) {
        const parts = conditionStr.substring(1).split(" ");
        if (parts.length >= 3) {
          field = parts[0];
          operator = parts[1];
          value = parts.slice(2).join(" "); // Join the rest as value in case it contains spaces
        }
      }
    } catch (error) {
      console.error("Error parsing condition:", error);
    }

    return { field, operator, value };
  }

  const addCondition = () => {
    if (!newField.trim() || !newValue.trim() || !newTargetStep.trim()) return;

    const conditionStr = formatCondition(newField, newOperator, newValue);

    onUpdateStep({
      ...step,
      condition: [...step.condition, { condition: conditionStr, targetStep: newTargetStep }],
    });

    // Reset form
    setNewField("");
    setNewOperator("==");
    setNewValue("");
    setNewTargetStep("");
  }

  const removeCondition = (index: number) => {
    const updatedConditions = [...step.condition];
    updatedConditions.splice(index, 1);

    onUpdateStep({
      ...step,
      condition: updatedConditions,
    });
  }

  const startEditingCondition = (index: number) => {
    setEditingIndex(index);
    
    const { field, operator, value } = parseCondition(step.condition[index].condition);
    
    setEditingField(field);
    setEditingOperator(operator);
    setEditingValue(value);
    setEditingTargetStep(step.condition[index].targetStep);
  }

  const saveEditedCondition = () => {
    if (!editingField.trim() || !editingValue.trim() || !editingTargetStep.trim() || editingIndex === null) return;

    const conditionStr = formatCondition(editingField, editingOperator, editingValue);
    
    const updatedConditions = [...step.condition];
    updatedConditions[editingIndex] = { 
      condition: conditionStr, 
      targetStep: editingTargetStep 
    };

    onUpdateStep({
      ...step,
      condition: updatedConditions,
    });
    
    cancelEditing();
  }

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingField("");
    setEditingOperator("==");
    setEditingValue("");
    setEditingTargetStep("");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Conditions</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="field">Field</Label>
            <Select
              value={newField}
              onValueChange={setNewField}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {formFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="operator">Operator</Label>
            <Select
              value={newOperator}
              onValueChange={setNewOperator}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              placeholder="Enter value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="target-step">Target Step</Label>
          <Select
            value={newTargetStep}
            onValueChange={setNewTargetStep}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target step" />
            </SelectTrigger>
            <SelectContent>
              {allSteps.map((step, index) => (
                <SelectItem key={index} value={step.name}>
                  {step.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={addCondition}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Condition
        </Button>

        <div className="space-y-2 mt-4">
          {step.condition.map((cond, index) => (
            <div key={index} className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-md">
              {editingIndex === index ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Select
                      value={editingField}
                      onValueChange={setEditingField}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {formFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={editingOperator}
                      onValueChange={setEditingOperator}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      placeholder="Enter value"
                    />
                  </div>
                  <div>
                    <Select
                      value={editingTargetStep}
                      onValueChange={setEditingTargetStep}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target step" />
                      </SelectTrigger>
                      <SelectContent>
                        {allSteps.map((step, idx) => (
                          <SelectItem key={idx} value={step.name}>
                            {step.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button size="sm" onClick={saveEditedCondition}>
                      <Check className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">If:</span> {cond.condition}
                    <br />
                    <span className="font-medium">Then go to:</span> {cond.targetStep}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEditingCondition(index)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeCondition(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {step.condition.length === 0 && <p className="text-muted-foreground">No conditions added yet</p>}
        </div>
      </div>
    </div>
  )
}

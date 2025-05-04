"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link, useLocation } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import type { ProcessDefinitionDTO } from "@/types/process"
import ProcessDefinitionForm from "@/components/process-builder/ProcessDefinitionForm"
import StepsList from "@/components/process-builder/StepsList"
import AvailableStepsList from "@/components/process-builder/AvailableStepsList"
import StepEditor from "@/components/process-builder/StepEditor"
import JsonViewer from "@/components/process-builder/JsonViewer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { processApi } from "@/apisTesting/testingApis"
import { useProcessDefinitionStore } from "@/store/processDefinitionStore"





export default function ProcessBuilder() {
  const location = useLocation();
  const id = location.state?.id;
  const processId = id ? Number.parseInt(id) : 0

  const [processDefinition, setProcessDefinition] = useState<ProcessDefinitionDTO>(
    {
      id: processId,
      name: "New Process",
      steps: [],
    }
  )

  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)
  const [jsonOutput, setJsonOutput] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate();
  const selectedNewProcessdefintion= useProcessDefinitionStore((state)=> state.selectedNewProcess)


  const selectedStep = selectedStepIndex !== null ? processDefinition.steps[selectedStepIndex] : null


  useEffect(() => {
    console.log("holaaaaaaaaaaaaaaaaaaa")
    const fetchProcess= async()=>{
      try{
        const res = await processApi.getProcessDefinitionById(processId);
      setProcessDefinition(res.data)
      }catch(error){
        console.log(error )
      }
    }
    if (processId != 0){
      fetchProcess()
      console.log("holaaaaaaaaaaaaaaaaaaa2222222222")

      

    }else{

    
      setProcessDefinition(selectedNewProcessdefintion)
      console.log(selectedNewProcessdefintion)
    }
  }, [])

  
  const updateProcessDefinition = (updatedProcess: ProcessDefinitionDTO) => {
    setProcessDefinition(updatedProcess)
  }

  
  const updateStep = (updatedStep: any, index: number) => {
    const newSteps = [...processDefinition.steps]
    newSteps[index] = updatedStep
    setProcessDefinition({
      ...processDefinition,
      steps: newSteps,
    })
  }

 
  const deleteStep = (index: number) => {
    const newSteps = [...processDefinition.steps]
    newSteps.splice(index, 1)
    setProcessDefinition({
      ...processDefinition,
      steps: newSteps,
    })
    if (selectedStepIndex === index) {
      setSelectedStepIndex(null)
    } else if (selectedStepIndex !== null && selectedStepIndex > index) {
      setSelectedStepIndex(selectedStepIndex - 1)
    }
  }

 
  const addStep = (step: any) => {
    setProcessDefinition({
      ...processDefinition,
      steps: [...processDefinition.steps, step],
    })
  }


  const reorderSteps = (steps: any[]) => {
    setProcessDefinition({
      ...processDefinition,
      steps,
    })
  }

  // Generate JSON output
  const generateJson = () => {
    const json = JSON.stringify(processDefinition, null, 2)
    setJsonOutput(json)
    return json
  }

  // Import JSON
  const importJson = (json: string) => {
    try {
      const parsed = JSON.parse(json)
      setProcessDefinition(parsed)
      setSelectedStepIndex(null)
    } catch (error) {
      console.error("Failed to parse JSON:", error)
      alert("Invalid JSON format")
    }
  }
  const handleSaveUpdate = async (processDefinition: ProcessDefinitionDTO) => {
    try {
      let response;
      console.log("----------",processDefinition)
      
      if (processDefinition.id) {
        response = await processApi.updateProcessDefinition(processDefinition);
      } else {
        response = await processApi.saveProcessDefinition(processDefinition);
      }
      
      console.log("Process saved !!", response);
    } catch (err) {
      console.error("Invalid JSON or save failed:", err);
    }
  }

  // Save process definition
  const saveProcessDefinition = () => {
    setIsSaving(true)
    handleSaveUpdate(processDefinition)

    
    setTimeout(() => {
      setIsSaving(false)
      navigate("/process-defenition")
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            {processDefinition.id ? `Edit: ${processDefinition.name}` : "New Process Definition"}
          </h1>
        </div>
        <Button onClick={saveProcessDefinition} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Process Definition Properties */}
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>Process Definition</CardTitle>
          </CardHeader>
          <CardContent>
            <ProcessDefinitionForm
              processDefinition={processDefinition}
              updateProcessDefinition={updateProcessDefinition}
            />
          </CardContent>
        </Card>

        {/* Available Steps */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Available Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <AvailableStepsList onAddStep={addStep} />
          </CardContent>
        </Card>

        {/* Process Flow */}
        <Card className="md:col-span-9">
          <CardHeader>
            <CardTitle>Process Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <StepsList
              steps={processDefinition.steps}
              selectedStepIndex={selectedStepIndex}
              onSelectStep={setSelectedStepIndex}
              onDeleteStep={deleteStep}
              onReorderSteps={reorderSteps}
            />
          </CardContent>
        </Card>

        {/* Step Properties */}
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>{selectedStep ? `Edit Step: ${selectedStep.name}` : "Step Properties"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedStep && selectedStepIndex !== null ? (
              <StepEditor
                step={selectedStep}
                allSteps={processDefinition.steps}
                onUpdateStep={(updatedStep) => updateStep(updatedStep, selectedStepIndex)}
              />
            ) : (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-muted-foreground">Select a step to edit its properties</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* JSON Output */}
        <Card className="md:col-span-12">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>JSON Output</CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => generateJson()}>Generate JSON</Button>
              <JsonViewer json={jsonOutput} onImport={importJson} />
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
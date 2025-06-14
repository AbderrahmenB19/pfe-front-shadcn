
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link, useLocation } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import type { ProcessDefinitionDTO } from "@/types/process"
import ProcessDefinitionForm from "@/components/process-builder/ProcessDefinitionForm"
import StepsList from "@/components/process-builder/StepsList"
import AvailableStepsList from "@/components/process-builder/AvailableStepsList"
import StepEditor from "@/components/process-builder/StepEditor"
import JsonViewer from "@/components/process-builder/JsonViewer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { processApi } from "@/api/testingApis"
import { useProcessDefinitionStore } from "@/store/processDefinitionStore"
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary"





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
  const [eror, setError]= useState<string|null>("");
  const navigate = useNavigate();
  const selectedNewProcessdefintion= useProcessDefinitionStore((state)=> state.selectedNewProcess)


  const selectedStep = selectedStepIndex !== null ? processDefinition.steps[selectedStepIndex] : null


  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const res = await processApi.getProcessDefinitionById(processId);
        setProcessDefinition(res.data);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching process:', error);
        setError(error.message || 'Failed to load process definition');
      }
    };

    if (processId !== 0) {
      fetchProcess();
    } else {
      setProcessDefinition(selectedNewProcessdefintion);
    }
  }, [processId, selectedNewProcessdefintion])

  
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

  useEffect(() => {
    const json = JSON.stringify(processDefinition, null, 2)
    setJsonOutput(json)
  }, [processDefinition])

  const importJson = (json: string) => {
    try {
      const parsed = JSON.parse(json)
      
      if (!parsed.name || !Array.isArray(parsed.steps)) {
        alert("Invalid process definition format. JSON must include 'name' and 'steps' properties.")
        return
      }
      
      setProcessDefinition(parsed)
      setSelectedStepIndex(null)
    } catch (error) {
      console.error("Failed to parse JSON:", error)
      alert("Invalid JSON format. Please check your JSON syntax and try again.")
    }
  }
  const handleSaveUpdate = async (processDefinition: ProcessDefinitionDTO) => {
    try {
      let response;
      
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

  const saveProcessDefinition = () => {
    setIsSaving(true)
    handleSaveUpdate(processDefinition)

    
    setTimeout(() => {
      setIsSaving(false)
      navigate("/process-defenition")
    }, 1000)
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/process-definition">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {processDefinition.id ? `Edit: ${processDefinition.name}` : "New Process Definition"}
          </h1>
        </div>
        <Button onClick={saveProcessDefinition} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Process"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-12 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Process Definition</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ProcessDefinitionForm
              processDefinition={processDefinition}
              updateProcessDefinition={updateProcessDefinition}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Available Steps</CardTitle>
            <CardDescription className="text-sm">
              Drag steps to add to your process
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <AvailableStepsList onAddStep={addStep} />
          </CardContent>
        </Card>

        <Card className="md:col-span-9 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Process Flow</CardTitle>
            <CardDescription className="text-sm">
              Build your process by adding and arranging steps
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <StepsList
              steps={processDefinition.steps}
              selectedStepIndex={selectedStepIndex}
              onSelectStep={setSelectedStepIndex}
              onDeleteStep={deleteStep}
              onReorderSteps={reorderSteps}
            />
          </CardContent>
        </Card>

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
                processDefinition={processDefinition}
              />
            ) : (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-muted-foreground">Select a step to edit its properties</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-12">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>JSON Output</CardTitle>
            <div className="flex gap-2">
              <JsonViewer json={jsonOutput} onImport={importJson} />
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
    </ErrorBoundary>
  )
}
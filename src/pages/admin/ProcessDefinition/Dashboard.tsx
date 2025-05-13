
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Plus, Edit, Trash2, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormTemplateDTO, ProcessDefinitionDTO } from "@/types/process"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formApi, processApi } from "@/apisTesting/testingApis"
import { FormSchemaDTO } from "@/api"
import { useProcessDefinitionStore } from "@/store/processDefinitionStore"
import { PageHeader } from "@/components/ui/PageHeader"






export default function Dashboard() {
  const navigate = useNavigate()

  const [newProcessName, setNewProcessName] = useState("")
  const [newProcessFormTemplate, setNewProcessFormTemplate] = useState<number | null>(null)
  const [deleteProcessId, setDeleteProcessId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [FormTemplates, setFormTemplates] = useState<FormSchemaDTO[]>([])
  const [processDefitions, setProcessDefinions] = useState<ProcessDefinitionDTO[]>([]);
  const setSelectedNewProcessDefinition = useProcessDefinitionStore((state)=> state.setSelectedNewProcessDefinition)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await processApi.getProcessDefinitions()
        setProcessDefinions(res.data);

      } catch (error) {
        console.log(error)

      }
    }
    const fetchFromTemplates = async () => {
      try {
        const res = await formApi.getAllFormSchemas()
        setFormTemplates(res.data);

      } catch (error) {
        console.log(error)

      }
    }
    fetchData()
    fetchFromTemplates()

  },[])

  // Create a new process
  const createProcess = () => {
    if (!newProcessName.trim()) return

    const selectedTemplate = newProcessFormTemplate
      ? FormTemplates.find((t) => t.id === newProcessFormTemplate)
      : undefined
    const temp: FormTemplateDTO = {
      name: selectedTemplate?.name!,
      id: selectedTemplate?.id!
    };
    const newProcess: ProcessDefinitionDTO = {
      id: 0,
      name: newProcessName,
      formTemplate: temp,
      steps: [],
    }
    setSelectedNewProcessDefinition(newProcess)
    
    

    setProcessDefinions([...processDefitions, newProcess])
    setNewProcessName("")
    setNewProcessFormTemplate(null)
    setIsCreateDialogOpen(false)


    navigate("/builder" , {state:{id: 0}})
  }

  // Delete a process
  const deleteProcess = () => {
    if (deleteProcessId === null) return

    setProcessDefinions(processDefitions.filter((process) => process.id !== deleteProcessId))
    setDeleteProcessId(null)
    setIsDeleteDialogOpen(false)
  }

  // Open delete confirmation dialog
  const openDeleteDialog = (id: number) => {
    setDeleteProcessId(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 space-y-2">
       
        <PageHeader title="Process Dashboard" description="Manage and create your process definitions" icon = {<GitBranch className="h-8 w-8" />} />
      </div>
      <div className="flex justify-between items-center mb-6">
      
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Process
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Process</DialogTitle>
              <DialogDescription>Enter a name for your new process definition.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Process Name</Label>
                <Input
                  id="name"
                  placeholder="Enter process name"
                  value={newProcessName}
                  onChange={(e) => setNewProcessName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-template">Form Template</Label>
                <Select
                  value={newProcessFormTemplate?.toString() || ""}
                  onValueChange={(value) => setNewProcessFormTemplate(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a form template" />
                  </SelectTrigger>
                  <SelectContent>
                    {FormTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id!.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createProcess}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Process Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processDefitions.map((process) => (
          <Card key={process.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle>{process.name}</CardTitle>
              <CardDescription>
                {process.formTemplate ? `Form: ${process.formTemplate.name}` : "No form template"} •{" "}
                {process.steps.length} steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {process.steps.slice(0, 3).map((step) => (
                  <div key={step.id} className="text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span>{step.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{step.stepType}</span>
                  </div>
                ))}
                {process.steps.length > 3 && (
                  <div className="text-sm text-muted-foreground">+{process.steps.length - 3} more steps</div>
                )}
                {process.steps.length === 0 && (
                  <div className="text-sm text-muted-foreground">No steps defined yet</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link
                  to="/builder"
                  state={{ id: process.id }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => openDeleteDialog(process.id!)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Process</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this process? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteProcess}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

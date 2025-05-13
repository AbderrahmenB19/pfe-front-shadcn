import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Clock, Edit2, Eye, Trash, FileText, LayoutGrid, BookTemplate, File, Badge } from "lucide-react"
import { useFormStore } from "../../store/formStore"
import type { FormSchemaDTO } from "../../api"
import NewTemplate from "./NewTemplate"
import { formApi } from "../../apisTesting/testingApis"
import { RenderForm } from "../renderForm/renderForm"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Toaster, toast } from "sonner"
import { PageHeader } from "../ui/PageHeader"
import { cn } from "@/lib/utils"

function FormTemplatesDashboard() {
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "create">("view")
  const [selectedTemplate, setSelectedTemplate] = useState<FormSchemaDTO>({})
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<FormSchemaDTO | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const setSelectedForm = useFormStore((state) => state.setSelectedForm)
  const [templates, setTemplates] = useState<FormSchemaDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await formApi.getAllFormSchemas()
        setTemplates(response.data)
      } catch (error) {
        toast.error("Failed to fetch templates")
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  const handleOpenView = (template: FormSchemaDTO) => {
    setSelectedTemplate(template)
    setDialogMode("view")
    setOpenDialog(true)
  }

  const handleOpenCreate = () => {
    setDialogMode("create")
    setOpenDialog(true)
  }

  const handleEdit = (template: FormSchemaDTO) => {
    setSelectedForm(template)
  }

  const confirmDelete = (template: FormSchemaDTO) => {
    setTemplateToDelete(template)
    setDeleteConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!templateToDelete?.id) return

    try {
      await formApi.deleteFormSchemaById(templateToDelete.id)
      setTemplates(templates.filter((temp) => temp.id !== templateToDelete.id))
      toast.success("Template deleted successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete template")
    } finally {
      setDeleteConfirmOpen(false)
      setTemplateToDelete(null)
    }
  }

  const renderTemplateCards = () => {
    if (loading) {
      return [...Array(6)].map((_, i) => (
        <Card key={i} className="h-[220px] overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="pb-0">
            <Skeleton className="h-4 w-1/3 mb-6" />
            <Skeleton className="h-20 w-full rounded-md" />
          </CardContent>
          <CardFooter className="flex gap-2 pt-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))
    }

    if (templates.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-5 rounded-full mb-5 shadow-sm">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">No templates yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md text-lg">
            Create your first form template to get started with building customized forms
          </p>
          <Button onClick={handleOpenCreate} className="gap-2 h-11 px-6 text-lg">
            <Plus className="w-5 h-5" />
            Create Template
          </Button>
        </div>
      )
    }

    return templates.map((template) => (
      <Card

      key={template.id}
        className={cn(
          "flex flex-col justify-between group overflow-hidden transition-all duration-300",
          "hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 shadow-sm",
          "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
        )}
      >
        <CardHeader className="pb-3 group-hover:bg-muted/20 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-semibold mb-1 bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent transform transition-all duration-300 group-hover:scale-[1.02]">
                {template.name || "Untitled Template"}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-muted-foreground/90 line-clamp-2 mt-1 transition-colors group-hover:text-muted-foreground">
                {template.description || "No description provided"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow py-1">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>
              {template.lastUpdate
                ? new Date(template.lastUpdate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "No date available"}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-3 pb-4 border-t bg-muted/10">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5 h-9" onClick={() => handleOpenView(template)}>
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button asChild size="sm" className="flex-1 gap-1.5 h-9" variant="outline">
            <Link to="/form-Builder" state={{ template }} onClick={() => handleEdit(template)}>
              <Edit2 className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation()
              confirmDelete(template)
            }}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </CardFooter>
      </Card>
    ))
  }

  const renderTemplateList = () => {
    if (loading) {
      return [...Array(5)].map((_, i) => (
        <Card key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 shadow-sm">
          <div className="bg-primary/5 rounded-lg p-3 flex-shrink-0">
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9" />
          </div>
        </Card>
      ))
    }

    if (templates.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted/50 p-4 rounded-full mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No templates yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first form template to get started with building customized forms
          </p>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </div>
      )
    }

    return templates.map((template) => (
      <Card
        key={template.id}
        className={cn(
          "flex flex-col sm:flex-row sm:items-center gap-4 p-4",
          "hover:border-primary/50 hover:shadow-md transition-all duration-300",
          "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
        )}
      >
        <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
          <FileText className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-sm">{template.name || "Untitled Template"}</h3>
            <Badge  className="text-xs font-normal">Form</Badge>

          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground line-clamp-1">
              {template.description || "No description provided"}
            </p>
            <div className="text-xs text-muted-foreground/80 flex items-center gap-1.5 hidden sm:flex">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {template.lastUpdate
                  ? new Date(template.lastUpdate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "No date"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={() => handleOpenView(template)}>
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View</span>
          </Button>
          <Button asChild size="sm" className="gap-1.5 h-8">
            <Link to="/form-Builder" state={{ template }} onClick={() => handleEdit(template)}>
              <Edit2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation()
              confirmDelete(template)
            }}
          >
            <Trash className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
        </Card>
    ))
  }

  return (
    <div className="container py-8 space-y-6 max-w-7xl mx-auto">
      <Toaster position="top-right" richColors />
      
      <PageHeader title="Form Templates" description="create Templates" icon={<File className="h-8 w-8"/>}/>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden md:flex border rounded-md p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <FileText className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>

          <Button onClick={handleOpenCreate} className="gap-2 w-full md:w-auto">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      <div className="border-b" />

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            : "flex flex-col gap-3"
        }
      >
        {viewMode === "grid" ? renderTemplateCards() : renderTemplateList()}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {dialogMode === "view" ? selectedTemplate?.name || "View Template" : "Create New Template"}
            </DialogTitle>
            {dialogMode === "view" && selectedTemplate?.description && (
              <DialogDescription>{selectedTemplate.description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4">
            {dialogMode === "create" && <NewTemplate />}
            {dialogMode === "view" && selectedTemplate?.jsonSchema && (
              <div className="border rounded-lg p-4 bg-muted/20">
                <RenderForm formSchema={selectedTemplate.jsonSchema} readOnly={true} loading={false} error={null} />
              </div>
            )}
          </div>
          {dialogMode === "view" && (
            <DialogFooter>
              <Button asChild className="gap-2" variant="outline">
                <Link
                  to="/form-Builder"
                  state={{ template: selectedTemplate }}
                  onClick={() => {
                    handleEdit(selectedTemplate)
                    setOpenDialog(false)
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Template
                </Link>
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the template "{templateToDelete?.name || "this template"}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default FormTemplatesDashboard

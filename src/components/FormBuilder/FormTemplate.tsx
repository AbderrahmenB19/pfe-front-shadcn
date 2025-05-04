import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Clock, Edit2, Eye, Delete, DeleteIcon, Trash } from "lucide-react";
import { useFormStore } from "../../store/formStore";
import { FormSchemaDTO } from "../../api";
import NewTemplate from "./NewTemplate";
import { formApi } from "../../apisTesting/testingApis";
import { RenderForm } from "../renderForm/renderForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";

function FormTemplatesDashboard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "create">("view");
  const [selectedTemplate, setSelectedTemplate] = useState<FormSchemaDTO>({});
  const setSelectedForm = useFormStore((state) => state.setSelectedForm);
  const [templates, setTemplates] = useState<FormSchemaDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await formApi.getAllFormSchemas();
        setTemplates(response.data);
      } catch (error) {
        toast.error("Failed to fetch templates");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleOpenView = (template: FormSchemaDTO) => {
    setSelectedTemplate(template);
    setDialogMode("view");
    setOpenDialog(true);
  };

  const handleOpenCreate = () => {
    setDialogMode("create");
    setOpenDialog(true);
  };

  const handleEdit = (template: FormSchemaDTO) => {
    setSelectedForm(template);
  };

  const handleDelete=async (template: FormSchemaDTO)=> {
    try{
      await formApi.deleteFormSchemaById(template.id!);
    }catch(error){
      console.log(error)

    }
    setTemplates(templates.filter(temp=> temp.id!=template.id))

    
  }

  return (
    <div className="container py-8 space-y-6">
      <Toaster position="top-right" richColors />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Form Templates</h1>
          <p className="text-muted-foreground text-sm">
            Choose from existing templates or create your own
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* New Template */}
        <Card
          onClick={handleOpenCreate}
          className="group flex flex-col items-center justify-center h-48 cursor-pointer hover:shadow-xl hover:border-primary transition-all duration-300"
        >
          <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition">
              <Plus className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-semibold">New Template</h3>
            <p className="text-xs text-muted-foreground">
              Start from scratch
            </p>
          </CardContent>
        </Card>

        {/* Existing Templates */}
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))
        ) : (
          templates.map((template) => (
            <Card key={template.id} className="flex flex-col justify-between h-52 hover:shadow-md transition">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base break-words line-clamp-2">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </CardDescription>
                </div>
                <button
                  onClick={() => handleDelete(template)}
                  className="text-red-500 hover:text-red-600 transition"
                  title="Delete"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
          
            <CardContent className="text-xs text-muted-foreground flex items-center gap-1 py-1">
              <Clock className="w-4 h-4" />
              {template.lastUpdate
                ? new Date(template.lastUpdate).toLocaleDateString()
                : "Unknown"}
            </CardContent>
          
            <CardFooter className="flex gap-2 pt-0">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => handleOpenView(template)}
              >
                <Eye className="h-4 w-4" />
                View
              </Button>
              <Button
                asChild
                className="flex-1 gap-2 bg-primary text-white hover:bg-primary/90"
              >
                <Link
                  to="/form-Builder"
                  state={{ template }}
                  style={{ textDecoration: "none" }}
                  onClick={() => handleEdit(template)}
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          ))
        )}
      </div>

      {/* Dialog for View/Create */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "view" ? selectedTemplate?.name : "Create New Template"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {dialogMode === "create" && <NewTemplate />}
            {dialogMode === "view" && selectedTemplate?.jsonSchema && (
              <RenderForm
                formSchema={selectedTemplate.jsonSchema}
                readOnly={true}
                loading={false}
                error={null}
                
                onSubmit={() => { }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FormTemplatesDashboard;

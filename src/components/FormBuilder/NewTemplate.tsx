import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormStore } from "../../store/formStore";
import { FormSchemaDTO } from "../../Models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

function NewTemplate() {
  const navigate = useNavigate();
  const setSelectedTemplate = useFormStore((state) => state.setSelectedForm);
  const [newTemplate, setNewTemplate] = useState<FormSchemaDTO>({
    id: undefined,
    jsonSchema: '',
    name: '',
    description: '',
    lastUpdate: ''
  });

  const handleContinue = (): void => {
    if (!newTemplate.name) {
      // Add validation if needed
      return;
    }
    setSelectedTemplate(newTemplate);
    navigate("/form-builder");
  };

  return (
    <div className="container py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Create New Template
            </h1>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Template Details</CardTitle>
              <CardDescription>
                Enter the basic information for your new form template
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="font-medium">
                  Template Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  placeholder="e.g. Employee Onboarding Form"
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Give your template a descriptive name
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  rows={3}
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  placeholder="Describe what this form template will be used for..."
                />
                <p className="text-sm text-muted-foreground">
                  Optional but recommended
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link to="/">Cancel</Link>
              </Button>
              <Button onClick={handleContinue}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue to Form Builder
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default NewTemplate;
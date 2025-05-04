"use client";

import { Form } from "@formio/react";
import { useSubmissionStore } from "../../store/requestStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import "formiojs/dist/formio.full.min.css";
import { useState } from "react";

interface RenderFormProps {
  formSchema: any;
  loading: boolean;
  error: string | null;
  onSubmit: (submission: any) => void;
  title?: string;
  readOnly: boolean;
  data?: any;
  onChange?: (data: any) => void;
  successMessage?: string;
}

export const RenderForm = ({
  formSchema,
  loading,
  error,
  onSubmit,
  title,
  readOnly,
  data,
  onChange,
  successMessage,
}: RenderFormProps) => {
  const parsedFormSchema =
    typeof formSchema === "string" ? JSON.parse(formSchema) : formSchema;
  const updateFormDataSubmission = useSubmissionStore(
    (state) => state.updateFormData
  );
  const saveRequest = useSubmissionStore((state) => state.submitForm);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (submission: any) => {
    updateFormDataSubmission(JSON.stringify(submission.data));
    saveRequest();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); }, 3000);
    onSubmit(submission);
  };

  return (
    <div className="flex justify-center my-8">
      <Card className="w-full max-w-6xl shadow-lg">
        {title && (
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {title}
            </CardTitle>
          </CardHeader>
        )}

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && submitted && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {loading && !parsedFormSchema ? (
            <div className="flex flex-col items-center py-6 space-y-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : parsedFormSchema ? (
            <div className="formio-wrapper [&_.form-control]:bg-white [&_.form-control]:border [&_.form-control]:rounded-md [&_.form-control]:px-3 [&_.form-control]:py-2 [&_.form-control]:text-sm [&_.form-control]:shadow-sm [&_.form-control:focus]:border-primary [&_.form-control:focus]:ring-2 [&_.form-control:focus]:ring-primary">
              <Form
                form={parsedFormSchema}
                onSubmit={handleSubmit}
                onChange={onChange}
                submission={{
                  data: data ? JSON.parse(data) :{}
                }}
                options={{
                  readOnly: readOnly,
                  noAlerts: true,
                  i18n: {
                    en: {
                      error:
                        "Please fix the following errors before submitting.",
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No form schema available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

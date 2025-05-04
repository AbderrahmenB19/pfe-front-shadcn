import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Save, AlignLeft, Copy, Eye, EyeOff } from "lucide-react";

interface JSONEditorProps {
  initialJson: string;
  onSave: (json: string) => void;
  isSaving: boolean;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
  timestamp: number;
}

export const JSONEditor = ({
  initialJson,
  onSave,
  isSaving,
}: JSONEditorProps) => {
  const [jsonInput, setJsonInput] = useState(initialJson || "");
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auto-dismiss toasts after 3 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prev => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const newToast = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
      timestamp: Date.now()
    };
    setToasts(prev => [...prev, newToast]);
  };

  useEffect(() => {
    setJsonInput(initialJson || "");
  }, [initialJson]);

  const validateJSON = (input: string) => {
    try {
      if (input.trim()) JSON.parse(input);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setJsonInput(inputValue);
    validateJSON(inputValue);
  };

  const formatJSON = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsedJson, null, 2));
      setError(null);
      showToast("JSON formatted successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonInput);
    showToast("JSON copied to clipboard");
  };

  return (
    <div className="p-6 relative">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-lg ${
              toast.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              <span>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-background p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">JSON Editor</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewMode(!previewMode)}
              title={previewMode ? "Edit" : "Preview"}
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!previewMode ? (
          <Textarea
            value={jsonInput}
            onChange={handleInputChange}
            placeholder="Enter JSON here..."
            rows={10}
            className="font-mono mb-4 min-h-[300px]"
          />
        ) : (
          <pre className="p-4 bg-muted rounded-md mb-4 font-mono text-sm overflow-auto max-h-[300px]">
            {jsonInput}
          </pre>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>Invalid JSON: {error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={formatJSON}>
            <AlignLeft className="mr-2 h-4 w-4" />
            Format
          </Button>
          <Button
            onClick={() => setOpenDialog(true)}
            disabled={!!error || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to save this JSON?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpenDialog(false);
                onSave(jsonInput);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
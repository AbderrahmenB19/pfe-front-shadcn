import { useState, useEffect } from "react";
import { Button as ShadButton } from "../ui/button"; 
import Button from "@mui/material/Button"; 
import { Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from "@mui/material"
import { TextField } from "@mui/material";
import { Upload, Save, FileJson, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface JsonViewerProps {
  json: string;
  onImport: (json: string) => void;
}

export default function JsonViewer({ json, onImport }: JsonViewerProps) {
  const [importJson, setImportJson] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [viewJsonDialogOpen, setViewJsonDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleImport = () => {
    if (!importJson.trim()) {
      setImportError("JSON input cannot be empty.");
      return;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      
      JSON.parse(importJson);
      onImport(importJson); 
      setIsImportDialogOpen(false); 
      setImportJson(""); 
    } catch (e) {
      console.error("Invalid JSON format during import attempt:", e);
      setImportError("Invalid JSON format. Please check the structure.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleCloseViewer = () => {
    setViewJsonDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ShadButton variant="outline" className="gap-2">
            <FileJson className="h-4 w-4" />
            JSON Options
            <ChevronDown className="h-4 w-4" />
          </ShadButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <button
              className="flex items-center w-full"
              type="button"
              onClick={() => setViewJsonDialogOpen(true)}
            >
              <Save className="h-4 w-4 mr-2" />
              View JSON
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              className="flex items-center w-full"
              type="button"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import JSON
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={viewJsonDialogOpen} onClose={() => setViewJsonDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Process Definition JSON</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            This dialog displays the current process definition in JSON format. You can copy the content from here.
          </DialogContentText>
          <div style={{ background: '#f0f0f0', padding: '16px', borderRadius: '4px', maxHeight: '500px', overflow: 'auto' }}>
            <pre style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap', margin: 0 }}>{json}</pre>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewJsonDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={isImportDialogOpen} onClose={() => setIsImportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Process Definition</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Paste your process definition JSON into the text area below to import it. Ensure the JSON is valid and follows the expected format.
          </DialogContentText>
          <TextField
            placeholder="Paste JSON here..."
            multiline
            rows={8}
            fullWidth
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            disabled={isImporting}
            error={!!importError}
            helperText={importError}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsImportDialogOpen(false)} disabled={isImporting} variant="outlined">Cancel</Button>
          <Button onClick={handleImport} disabled={isImporting} variant="contained">
            {isImporting ? "Importing..." : "Import"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
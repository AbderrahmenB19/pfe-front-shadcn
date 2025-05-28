

import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Upload, Save, FileJson, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface JsonViewerProps {
  json: string
  onImport: (json: string) => void
}

export default function JsonViewer({ json, onImport }: JsonViewerProps) {
  const [importJson, setImportJson] = useState("")
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [viewJsonDialogOpen, setViewJsonDialogOpen] = useState(false)

  const handleImport = () => {
    onImport(importJson)
    setIsImportDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileJson className="h-4 w-4" />
            JSON Options
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewJsonDialogOpen(true)}>
            <Save className="h-4 w-4 mr-2" />
            View JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View JSON Dialog */}
      <Dialog open={viewJsonDialogOpen} onOpenChange={setViewJsonDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Process Definition JSON</DialogTitle>
          </DialogHeader>
          <div className="bg-secondary p-4 rounded-md overflow-auto max-h-[500px]">
            <pre className="text-sm">{json}</pre>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import JSON Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Process Definition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste JSON here..."
              className="min-h-[200px]"
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
            />
            <Button onClick={handleImport}>Import</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

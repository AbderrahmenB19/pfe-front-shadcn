import { ProcessDefinitionDTO } from "@/types/process";
import { create } from "zustand";


interface ProcessDefenitionStore{
    selectedNewProcess: ProcessDefinitionDTO,
    setSelectedNewProcessDefinition: (process:ProcessDefinitionDTO)=> void 
}

export const useProcessDefinitionStore= create<ProcessDefenitionStore>((set) => ({
    selectedNewProcess: {
        id: undefined,
        name: "New Process",
        steps: [],
      },
    setSelectedNewProcessDefinition: (process) => set({ selectedNewProcess: process })}))
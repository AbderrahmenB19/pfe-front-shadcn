import { useEffect, useState } from 'react';
import { JSONEditor } from '../../../components/JsonInput/ProcessDefinition';
import { ProcessDefinitionDTO } from '../../../api';
import { processApi } from '../../../apisTesting/testingApis';

const ProcessDefinition = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [initialProcessDefinition, setProcessDefinition] = useState<ProcessDefinitionDTO[]>([]);

  useEffect(() => {
    const fetchProcessDefinition = async () => {
      try {
        const response = await processApi.getProcessDefinitions();
        setProcessDefinition(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessDefinition();
  }, []);

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
  };

  const handleSave = (jsonString: string) => {
    try {
      const parsedData = JSON.parse(jsonString);
      
      // Handle both cases - single object or array
      if (Array.isArray(parsedData)) {
        parsedData.forEach((processDefinition) => {
          handleSaveUpdate(processDefinition);
        });
      } else {
        handleSaveUpdate(parsedData);
      }
    } catch (err) {
      console.error("Invalid JSON:", err);
    }
  };

  return (
    <div>
      {error && (
        <div className="alert alert-danger">
          {error?.response?.data?.message || error?.message || "Something went wrong"}
        </div>
      )}
      {loading && <div className="text-center">Loading...</div>}
      {!loading && (
        <JSONEditor
          initialJson={JSON.stringify(initialProcessDefinition || [], null, 2)}
          onSave={handleSave}
          isSaving={loading}
        />
      )}
    </div>
  );
};

export default ProcessDefinition;
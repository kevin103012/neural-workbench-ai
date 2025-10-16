import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/analysis/FileUpload";
import DataPreview from "@/components/analysis/DataPreview";
import VisualizationPanel from "@/components/analysis/VisualizationPanel";
import ModelingPanel from "@/components/analysis/ModelingPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface DatasetInfo {
  name: string;
  rows: number;
  columns: string[];
  data: any[];
  uploadedAt: Date;
}

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState<DatasetInfo | null>(location.state?.dataset || null);
  const projectId = location.state?.projectId as string | undefined;
  const projectName = location.state?.projectName as string | undefined;
  const projectDescription = location.state?.projectDescription as string | undefined;

  useEffect(() => {
    if (location.state?.dataset) {
      setDataset(location.state.dataset);
    } else if (!dataset) {
      navigate("/dashboard");
    }
  }, [location.state, dataset, navigate]);

  const handleDatasetLoaded = (newDataset: DatasetInfo) => {
    navigate("/cleaning", { state: { dataset: newDataset } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Análisis de Datos
            </h1>
            {projectName && (
              <p className="text-lg font-semibold mb-1">
                {projectName}
              </p>
            )}
            {projectDescription && (
              <p className="text-sm text-muted-foreground mb-2">
                {projectDescription}
              </p>
            )}
            <p className="text-muted-foreground">
              Obtén análisis estadísticos, visualizaciones y predicciones
            </p>
          </div>

          {!dataset ? (
            <FileUpload onDatasetLoaded={handleDatasetLoaded} />
          ) : (
            <div className="space-y-6">
              <DataPreview dataset={dataset} onClear={() => setDataset(null)} />
              
              <Tabs defaultValue="visualization" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="visualization">Visualizaciones</TabsTrigger>
                  <TabsTrigger value="modeling">Modelado</TabsTrigger>
                </TabsList>
                
                <TabsContent value="visualization" className="mt-6">
                  <VisualizationPanel dataset={dataset} />
                </TabsContent>
                
                <TabsContent value="modeling" className="mt-6">
                  <ModelingPanel dataset={dataset} projectId={projectId} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;

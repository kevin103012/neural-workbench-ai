import { useState } from "react";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/analysis/FileUpload";
import DataPreview from "@/components/analysis/DataPreview";
import DataCleaningPanel from "@/components/analysis/DataCleaningPanel";
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
  const [dataset, setDataset] = useState<DatasetInfo | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Análisis de Datos
            </h1>
            <p className="text-muted-foreground">
              Importa tu dataset y obtén análisis estadísticos, visualizaciones y predicciones
            </p>
          </div>

          {!dataset ? (
            <FileUpload onDatasetLoaded={setDataset} />
          ) : (
            <div className="space-y-6">
              <DataPreview dataset={dataset} onClear={() => setDataset(null)} />
              
              <Tabs defaultValue="cleaning" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="cleaning">Limpieza</TabsTrigger>
                  <TabsTrigger value="visualization">Visualizaciones</TabsTrigger>
                  <TabsTrigger value="modeling">Modelado</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cleaning" className="mt-6">
                  <DataCleaningPanel dataset={dataset} />
                </TabsContent>
                
                <TabsContent value="visualization" className="mt-6">
                  <VisualizationPanel dataset={dataset} />
                </TabsContent>
                
                <TabsContent value="modeling" className="mt-6">
                  <ModelingPanel dataset={dataset} />
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

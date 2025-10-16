import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import DataCleaningPanel from "@/components/analysis/DataCleaningPanel";
import { DatasetInfo } from "@/pages/Analysis";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

const DataCleaning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dataset = location.state?.dataset as DatasetInfo | null;
  const projectName = location.state?.projectName as string | undefined;
  const projectDescription = location.state?.projectDescription as string | undefined;

  useEffect(() => {
    if (!dataset) {
      navigate("/dashboard");
    }
  }, [dataset, navigate]);

  if (!dataset) {
    return null;
  }

  const handleContinueToAnalysis = () => {
    navigate("/analysis", { 
      state: { 
        dataset,
        projectName,
        projectDescription
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Limpieza de Datos
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
                Dataset: <span className="font-semibold">{dataset.name}</span> • {dataset.rows} filas • {dataset.columns.length} columnas
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
          </div>

          <div className="space-y-6">
            <DataCleaningPanel dataset={dataset} />

            <div className="flex justify-end">
              <Button
                variant="hero"
                size="lg"
                onClick={handleContinueToAnalysis}
                className="group"
              >
                Continuar al análisis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCleaning;

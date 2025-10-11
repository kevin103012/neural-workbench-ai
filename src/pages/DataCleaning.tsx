import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import DataPreview from "@/components/analysis/DataPreview";
import DataCleaningPanel from "@/components/analysis/DataCleaningPanel";
import { DatasetInfo } from "@/pages/Analysis";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const DataCleaning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dataset = location.state?.dataset as DatasetInfo | null;

  useEffect(() => {
    if (!dataset) {
      navigate("/analysis");
    }
  }, [dataset, navigate]);

  if (!dataset) {
    return null;
  }

  const handleContinueToAnalysis = () => {
    navigate("/analysis", { state: { dataset } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Limpieza de Datos
            </h1>
            <p className="text-muted-foreground">
              Prepara y limpia tu dataset antes del análisis y modelado
            </p>
          </div>

          <div className="space-y-6">
            <DataPreview dataset={dataset} onClear={() => navigate("/analysis")} />
            
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

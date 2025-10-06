import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatasetInfo } from "@/pages/Analysis";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Play, CheckCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ModelingPanelProps {
  dataset: DatasetInfo;
}

const ModelingPanel = ({ dataset }: ModelingPanelProps) => {
  const [modelType, setModelType] = useState<string>("linear_regression");
  const [targetColumn, setTargetColumn] = useState<string>(dataset.columns[0]);
  const [isTraining, setIsTraining] = useState(false);
  const [results, setResults] = useState<any>(null);

  const models = [
    { value: "linear_regression", label: "Regresión Lineal", type: "Scikit-Learn" },
    { value: "random_forest", label: "Random Forest", type: "Scikit-Learn" },
    { value: "svm", label: "SVM", type: "Scikit-Learn" },
    { value: "neural_network", label: "Red Neuronal", type: "PyTorch" },
  ];

  const simulateTraining = () => {
    setIsTraining(true);
    setResults(null);

    setTimeout(() => {
      const simulatedResults = {
        model: models.find(m => m.value === modelType)?.label,
        framework: models.find(m => m.value === modelType)?.type,
        accuracy: (85 + Math.random() * 12).toFixed(2),
        precision: (82 + Math.random() * 15).toFixed(2),
        recall: (80 + Math.random() * 17).toFixed(2),
        f1Score: (83 + Math.random() * 14).toFixed(2),
        trainTime: (0.5 + Math.random() * 2).toFixed(2),
        epochs: modelType === "neural_network" ? Math.floor(50 + Math.random() * 50) : null,
        features: dataset.columns.length - 1,
        samples: dataset.rows,
      };

      setResults(simulatedResults);
      setIsTraining(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Configuración del modelo
        </h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Tipo de modelo</label>
            <Select value={modelType} onValueChange={setModelType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex items-center gap-2">
                      <span>{model.label}</span>
                      <Badge variant="outline" className="text-xs">{model.type}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Variable objetivo</label>
            <Select value={targetColumn} onValueChange={setTargetColumn}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataset.columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={simulateTraining} 
          disabled={isTraining}
          className="w-full md:w-auto"
          variant="hero"
        >
          <Play className="h-4 w-4 mr-2" />
          {isTraining ? "Entrenando modelo..." : "Entrenar modelo"}
        </Button>

        {isTraining && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">Entrenando con {dataset.rows} muestras...</p>
            <Progress value={66} className="h-2" />
          </div>
        )}
      </Card>

      {results && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/50">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold">Resultados del entrenamiento</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-4">Configuración</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Modelo</span>
                  <Badge>{results.model}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Framework</span>
                  <Badge variant="outline">{results.framework}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Features</span>
                  <span className="font-semibold">{results.features}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Muestras</span>
                  <span className="font-semibold">{results.samples}</span>
                </div>
                {results.epochs && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Epochs</span>
                    <span className="font-semibold">{results.epochs}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tiempo</span>
                  <span className="font-semibold">{results.trainTime}s</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Métricas de rendimiento
              </h4>
              <div className="space-y-4">
                {[
                  { label: "Accuracy", value: results.accuracy },
                  { label: "Precision", value: results.precision },
                  { label: "Recall", value: results.recall },
                  { label: "F1-Score", value: results.f1Score },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{metric.label}</span>
                      <span className="font-semibold text-primary">{metric.value}%</span>
                    </div>
                    <Progress value={parseFloat(metric.value)} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> Estos son resultados simulados. Conecta con el backend de FastAPI para entrenar modelos reales con Scikit-Learn y PyTorch.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ModelingPanel;

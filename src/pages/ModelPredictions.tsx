import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, BarChart3, Download } from "lucide-react";

interface Prediction {
  id: number;
  input: string;
  actualValue: number;
  predictedValue: number;
  confidence: number;
}

interface SavedModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  createdAt: string;
}

const ModelPredictions = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<SavedModel | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const savedModels = JSON.parse(localStorage.getItem("savedModels") || "[]");
    const currentModel = savedModels.find((m: SavedModel) => m.id === id);
    
    if (!currentModel) {
      navigate("/dashboard");
      return;
    }

    setModel(currentModel);

    // Generate simulated predictions
    const mockPredictions: Prediction[] = Array.from({ length: 15 }, (_, i) => {
      const actual = Math.floor(Math.random() * 100);
      const variance = Math.floor(Math.random() * 10) - 5;
      return {
        id: i + 1,
        input: `Muestra ${i + 1}`,
        actualValue: actual,
        predictedValue: Math.max(0, Math.min(100, actual + variance)),
        confidence: Math.floor(Math.random() * 30) + 70,
      };
    });
    
    setPredictions(mockPredictions);
  }, [id, navigate]);

  const handleDownloadPredictions = () => {
    const dataStr = JSON.stringify({ model, predictions }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `predicciones_${model?.name.replace(/\s+/g, "_")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!model) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{model.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {model.type} - Precisión: {model.accuracy}%
                </p>
              </div>
            </div>
            <Button onClick={handleDownloadPredictions}>
              <Download className="mr-2 h-4 w-4" />
              Descargar Predicciones
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Predicciones del Modelo</CardTitle>
            <CardDescription>
              Resultados de predicción generados por el modelo entrenado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead className="text-right">Valor Real</TableHead>
                    <TableHead className="text-right">Predicción</TableHead>
                    <TableHead className="text-right">Confianza</TableHead>
                    <TableHead className="text-right">Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictions.map((pred) => {
                    const error = Math.abs(pred.actualValue - pred.predictedValue);
                    const errorPercent = ((error / pred.actualValue) * 100).toFixed(1);
                    return (
                      <TableRow key={pred.id}>
                        <TableCell className="font-medium">{pred.id}</TableCell>
                        <TableCell>{pred.input}</TableCell>
                        <TableCell className="text-right">{pred.actualValue}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {pred.predictedValue}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={pred.confidence >= 85 ? "default" : "secondary"}>
                            {pred.confidence}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={error < 5 ? "text-green-600" : error < 10 ? "text-yellow-600" : "text-red-600"}>
                            ±{error} ({errorPercent}%)
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelPredictions;

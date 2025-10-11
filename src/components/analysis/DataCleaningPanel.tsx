import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatasetInfo } from "@/pages/Analysis";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DataCleaningPanelProps {
  dataset: DatasetInfo;
}

interface CleaningOperation {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const DataCleaningPanel = ({ dataset }: DataCleaningPanelProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleaningResults, setCleaningResults] = useState<any>(null);
  
  const [operations, setOperations] = useState<CleaningOperation[]>([
    {
      id: "remove_duplicates",
      label: "Eliminar duplicados",
      description: "Remover filas duplicadas del dataset",
      enabled: true,
    },
    {
      id: "handle_nulls",
      label: "Manejar valores nulos",
      description: "Rellenar o eliminar valores faltantes",
      enabled: true,
    },
    {
      id: "normalize",
      label: "Normalizar datos",
      description: "Escalar valores numéricos entre 0 y 1",
      enabled: false,
    },
    {
      id: "remove_outliers",
      label: "Eliminar outliers",
      description: "Detectar y remover valores atípicos",
      enabled: false,
    },
    {
      id: "encode_categorical",
      label: "Codificar categóricos",
      description: "Convertir variables categóricas a numéricas",
      enabled: false,
    },
  ]);

  const toggleOperation = (id: string) => {
    setOperations(ops => ops.map(op => 
      op.id === id ? { ...op, enabled: !op.enabled } : op
    ));
  };

  const simulateCleaning = () => {
    setIsProcessing(true);
    setCleaningResults(null);

    setTimeout(() => {
      const enabledOps = operations.filter(op => op.enabled);
      const removedDuplicates = operations.find(op => op.id === "remove_duplicates")?.enabled 
        ? Math.floor(dataset.rows * 0.05) 
        : 0;
      const handledNulls = operations.find(op => op.id === "handle_nulls")?.enabled 
        ? Math.floor(dataset.rows * 0.08) 
        : 0;
      const removedOutliers = operations.find(op => op.id === "remove_outliers")?.enabled 
        ? Math.floor(dataset.rows * 0.03) 
        : 0;
      
      const totalRowsRemoved = removedDuplicates + removedOutliers;
      const newRowCount = dataset.rows - totalRowsRemoved;

      setCleaningResults({
        originalRows: dataset.rows,
        newRows: newRowCount,
        rowsRemoved: totalRowsRemoved,
        duplicatesRemoved: removedDuplicates,
        nullsHandled: handledNulls,
        outliersRemoved: removedOutliers,
        operationsApplied: enabledOps.length,
        operations: enabledOps.map(op => op.label),
      });
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Operaciones de limpieza
        </h3>

        <div className="space-y-4 mb-6">
          {operations.map((operation) => (
            <div
              key={operation.id}
              className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <Checkbox
                id={operation.id}
                checked={operation.enabled}
                onCheckedChange={() => toggleOperation(operation.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <label
                  htmlFor={operation.id}
                  className="font-medium cursor-pointer block mb-1"
                >
                  {operation.label}
                </label>
                <p className="text-sm text-muted-foreground">
                  {operation.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={simulateCleaning}
          disabled={isProcessing || !operations.some(op => op.enabled)}
          className="w-full md:w-auto"
          variant="hero"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isProcessing ? "Procesando..." : "Aplicar limpieza"}
        </Button>

        {isProcessing && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Procesando {dataset.rows} filas...
            </p>
            <Progress value={66} className="h-2" />
          </div>
        )}
      </Card>

      {cleaningResults && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/50">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold">Resultados de limpieza</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" />
                Resumen de cambios
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Filas originales</span>
                  <span className="font-semibold">{cleaningResults.originalRows}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Filas finales</span>
                  <Badge variant="outline">{cleaningResults.newRows}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Filas eliminadas</span>
                  <Badge>{cleaningResults.rowsRemoved}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duplicados eliminados</span>
                  <span className="font-semibold">{cleaningResults.duplicatesRemoved}</span>
                </div>
                {cleaningResults.nullsHandled > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nulos manejados</span>
                    <span className="font-semibold">{cleaningResults.nullsHandled}</span>
                  </div>
                )}
                {cleaningResults.outliersRemoved > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Outliers removidos</span>
                    <span className="font-semibold">{cleaningResults.outliersRemoved}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Operaciones aplicadas</h4>
              <div className="space-y-2">
                {cleaningResults.operations.map((op: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded bg-primary/10"
                  >
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">{op}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border mt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> Estos son resultados simulados. El backend real con Pandas procesará los datos efectivamente.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DataCleaningPanel;

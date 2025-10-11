import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatasetInfo } from "@/pages/Analysis";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataCleaningPanelProps {
  dataset: DatasetInfo;
}

interface CleaningOperation {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface CellChange {
  rowIndex: number;
  column: string;
  oldValue: any;
  newValue: any;
}

const DataCleaningPanel = ({ dataset }: DataCleaningPanelProps) => {
  const [appliedCleaning, setAppliedCleaning] = useState(false);
  const [changes, setChanges] = useState<CellChange[]>([]);
  
  const [operations, setOperations] = useState<CleaningOperation[]>([
    {
      id: "remove_duplicates",
      label: "Eliminar duplicados",
      description: "Remover filas duplicadas",
      enabled: true,
    },
    {
      id: "handle_nulls",
      label: "Manejar valores nulos",
      description: "Rellenar valores faltantes",
      enabled: true,
    },
    {
      id: "normalize",
      label: "Normalizar datos",
      description: "Escalar valores numéricos",
      enabled: false,
    },
    {
      id: "remove_outliers",
      label: "Eliminar outliers",
      description: "Remover valores atípicos",
      enabled: false,
    },
  ]);

  const toggleOperation = (id: string) => {
    setOperations(ops => ops.map(op => 
      op.id === id ? { ...op, enabled: !op.enabled } : op
    ));
  };

  const displayData = useMemo(() => {
    return dataset.data.slice(0, 50);
  }, [dataset]);

  const isNull = (value: any) => {
    return value === null || value === undefined || value === '' || 
           (typeof value === 'string' && value.toLowerCase() === 'null') ||
           (typeof value === 'number' && isNaN(value));
  };

  const getCellStatus = (rowIndex: number, column: string, value: any) => {
    const change = changes.find(c => c.rowIndex === rowIndex && c.column === column);
    
    if (change) {
      return 'changed';
    }
    
    if (isNull(value)) {
      return 'null';
    }
    
    return 'normal';
  };

  const getCellClassName = (status: string) => {
    switch (status) {
      case 'null':
        return 'bg-red-500/10 border-red-500/20';
      case 'changed':
        return 'bg-green-500/10 border-green-500/20';
      default:
        return '';
    }
  };

  const applyCleaning = () => {
    const newChanges: CellChange[] = [];
    
    // Simular limpieza de valores nulos si está habilitado
    if (operations.find(op => op.id === "handle_nulls")?.enabled) {
      displayData.forEach((row, rowIndex) => {
        dataset.columns.forEach(column => {
          const value = row[column];
          if (isNull(value)) {
            // Simular rellenado con media para números o "N/A" para strings
            const columnValues = dataset.data.map(r => r[column]).filter(v => !isNull(v));
            let newValue;
            
            if (typeof columnValues[0] === 'number') {
              const sum = columnValues.reduce((acc: number, val: number) => acc + val, 0);
              newValue = Math.round(sum / columnValues.length);
            } else {
              newValue = 'N/A';
            }
            
            newChanges.push({
              rowIndex,
              column,
              oldValue: value,
              newValue
            });
          }
        });
      });
    }
    
    setChanges(newChanges);
    setAppliedCleaning(true);
  };

  const resetCleaning = () => {
    setChanges([]);
    setAppliedCleaning(false);
  };

  const getCellValue = (rowIndex: number, column: string, originalValue: any) => {
    const change = changes.find(c => c.rowIndex === rowIndex && c.column === column);
    return change ? change.newValue : originalValue;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Operaciones de limpieza</h3>
          </div>
          {appliedCleaning && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              {changes.length} cambios aplicados
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {operations.map((operation) => (
            <div
              key={operation.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                operation.enabled 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-border hover:border-primary/30'
              }`}
              onClick={() => toggleOperation(operation.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={operation.id}
                  checked={operation.enabled}
                  onCheckedChange={() => toggleOperation(operation.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label
                    htmlFor={operation.id}
                    className="font-medium cursor-pointer block text-sm mb-1"
                  >
                    {operation.label}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {operation.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={applyCleaning}
            disabled={!operations.some(op => op.enabled) || appliedCleaning}
            variant="hero"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Aplicar limpieza
          </Button>
          
          {appliedCleaning && (
            <Button onClick={resetCleaning} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetear cambios
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Vista previa de datos</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500/10 border border-red-500/20" />
              <span className="text-muted-foreground">Valores nulos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500/10 border border-green-500/20" />
              <span className="text-muted-foreground">Valores corregidos</span>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[500px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 sticky left-0 bg-background z-10">#</TableHead>
                {dataset.columns.map((column) => (
                  <TableHead key={column} className="min-w-[150px]">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="font-medium sticky left-0 bg-background z-10">
                    {rowIndex + 1}
                  </TableCell>
                  {dataset.columns.map((column) => {
                    const originalValue = row[column];
                    const displayValue = getCellValue(rowIndex, column, originalValue);
                    const status = getCellStatus(rowIndex, column, originalValue);
                    
                    return (
                      <TableCell 
                        key={column}
                        className={`border ${getCellClassName(status)}`}
                      >
                        {displayValue !== null && displayValue !== undefined 
                          ? String(displayValue) 
                          : <span className="text-muted-foreground italic">null</span>
                        }
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <p className="text-sm text-muted-foreground mt-4">
          Mostrando las primeras 50 filas de {dataset.rows} totales
        </p>
      </Card>
    </div>
  );
};

export default DataCleaningPanel;

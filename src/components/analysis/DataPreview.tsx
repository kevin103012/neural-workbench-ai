import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Database, Calendar, Columns3 } from "lucide-react";
import { DatasetInfo } from "@/pages/Analysis";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataPreviewProps {
  dataset: DatasetInfo;
  onClear: () => void;
}

const DataPreview = ({ dataset, onClear }: DataPreviewProps) => {
  const previewRows = dataset.data.slice(0, 5);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{dataset.name}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              {dataset.rows.toLocaleString()} filas
            </div>
            <div className="flex items-center gap-2">
              <Columns3 className="h-4 w-4" />
              {dataset.columns.length} columnas
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {dataset.uploadedAt.toLocaleDateString()}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClear}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {dataset.columns.map((col) => (
                  <TableHead key={col} className="font-semibold">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row, i) => (
                <TableRow key={i}>
                  {dataset.columns.map((col) => (
                    <TableCell key={col}>
                      {row[col] !== null && row[col] !== undefined
                        ? String(row[col])
                        : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {dataset.rows > 5 && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Mostrando 5 de {dataset.rows.toLocaleString()} filas
        </p>
      )}
    </Card>
  );
};

export default DataPreview;

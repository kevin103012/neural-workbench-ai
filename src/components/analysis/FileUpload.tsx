import { useCallback } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { Card } from "@/components/ui/card";
import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import { DatasetInfo } from "@/pages/Analysis";

interface FileUploadProps {
  onDatasetLoaded: (dataset: DatasetInfo) => void;
}

const FileUpload = ({ onDatasetLoaded }: FileUploadProps) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Formato incorrecto",
        description: "Por favor, sube un archivo CSV",
        variant: "destructive",
      });
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast({
            title: "Error al procesar CSV",
            description: "Revisa el formato de tu archivo",
            variant: "destructive",
          });
          return;
        }

        const data = results.data as any[];
        const columns = results.meta.fields || [];

        if (data.length === 0 || columns.length === 0) {
          toast({
            title: "Archivo vacío",
            description: "El CSV no contiene datos válidos",
            variant: "destructive",
          });
          return;
        }

        onDatasetLoaded({
          name: file.name,
          rows: data.length,
          columns,
          data,
          uploadedAt: new Date(),
        });

        toast({
          title: "Dataset cargado",
          description: `${data.length} filas y ${columns.length} columnas procesadas`,
        });
      },
      error: (error) => {
        toast({
          title: "Error al leer archivo",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }, [onDatasetLoaded]);

  return (
    <Card className="p-12 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
          <FileSpreadsheet className="h-10 w-10 text-primary-foreground" />
        </div>
        
        <h3 className="text-2xl font-semibold mb-2">Importa tu dataset</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Sube un archivo CSV para comenzar el análisis. Soportamos archivos con encabezados.
        </p>
        
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground font-semibold hover:shadow-[var(--shadow-glow)] transition-all">
            <Upload className="h-5 w-5" />
            Seleccionar archivo CSV
          </div>
        </label>
        
        <p className="text-xs text-muted-foreground mt-4">
          Máximo 20MB • Formato CSV con encabezados
        </p>
      </div>
    </Card>
  );
};

export default FileUpload;

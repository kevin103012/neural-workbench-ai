import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { DatasetInfo } from "@/pages/Analysis";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatisticsPanelProps {
  dataset: DatasetInfo;
}

const StatisticsPanel = ({ dataset }: StatisticsPanelProps) => {
  const statistics = useMemo(() => {
    const numericColumns = dataset.columns.filter((col) => {
      const sampleValues = dataset.data.slice(0, 10).map((row) => row[col]);
      return sampleValues.some((val) => typeof val === "number");
    });

    return numericColumns.map((col) => {
      const values = dataset.data
        .map((row) => row[col])
        .filter((val) => typeof val === "number" && !isNaN(val)) as number[];

      if (values.length === 0) return null;

      const sorted = [...values].sort((a, b) => a - b);
      const sum = values.reduce((a, b) => a + b, 0);
      const mean = sum / values.length;
      const median = sorted[Math.floor(sorted.length / 2)] || 0;
      const min = sorted[0] || 0;
      const max = sorted[sorted.length - 1] || 0;
      const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      return { col, mean, median, min, max, stdDev, count: values.length };
    }).filter(Boolean);
  }, [dataset]);

  const categoricalStats = useMemo(() => {
    return dataset.columns.map((col) => {
      const values = dataset.data.map((row) => row[col]);
      const unique = new Set(values.filter(v => v !== null && v !== undefined));
      const mode = values.reduce((acc, val) => {
        const key = String(val);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const sortedMode = Object.entries(mode).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
      const topValue = sortedMode[0];

      return {
        col,
        unique: unique.size,
        total: values.length,
        nullCount: values.filter(v => v === null || v === undefined).length,
        mostCommon: topValue ? { value: topValue[0], count: topValue[1] } : null,
      };
    });
  }, [dataset]);

  return (
    <div className="space-y-6">
      {/* Numeric Statistics */}
      {statistics.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Estadísticas Numéricas
          </h3>
          <div className="grid gap-4">
            {statistics.map((stat) => (
              <Card key={stat!.col} className="p-6 bg-card/50 backdrop-blur-sm">
                <h4 className="font-semibold text-lg mb-4">{stat!.col}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Media</p>
                    <p className="text-xl font-semibold">{stat!.mean.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mediana</p>
                    <p className="text-xl font-semibold">{stat!.median.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mínimo</p>
                    <p className="text-xl font-semibold text-accent">{stat!.min.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Máximo</p>
                    <p className="text-xl font-semibold text-secondary">{stat!.max.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Desv. Est.</p>
                    <p className="text-xl font-semibold">{stat!.stdDev.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Valores</p>
                    <p className="text-xl font-semibold">{stat!.count}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Categorical Statistics */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Minus className="h-5 w-5 text-secondary" />
          Análisis de Columnas
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {categoricalStats.map((stat) => (
            <Card key={stat.col} className="p-6 bg-card/50 backdrop-blur-sm">
              <h4 className="font-semibold mb-4">{stat.col}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valores únicos</span>
                  <Badge variant="outline">{stat.unique}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total valores</span>
                  <Badge variant="outline">{stat.total}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valores nulos</span>
                  <Badge variant={stat.nullCount > 0 ? "destructive" : "outline"}>
                    {stat.nullCount}
                  </Badge>
                </div>
                {stat.mostCommon && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Más frecuente</p>
                    <p className="font-semibold truncate">{String(stat.mostCommon.value)}</p>
                    <p className="text-xs text-muted-foreground">
                      {Number(stat.mostCommon.count)} ocurrencias ({((Number(stat.mostCommon.count) / Number(stat.total)) * 100).toFixed(1)}%)
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;

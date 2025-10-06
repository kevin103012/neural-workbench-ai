import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { DatasetInfo } from "@/pages/Analysis";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface VisualizationPanelProps {
  dataset: DatasetInfo;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(220 70% 60%)', 'hsl(180 70% 60%)', 'hsl(270 60% 65%)'];

const VisualizationPanel = ({ dataset }: VisualizationPanelProps) => {
  const [selectedColumn, setSelectedColumn] = useState<string>(dataset.columns[0]);

  const numericColumns = useMemo(() => {
    return dataset.columns.filter((col) => {
      const sampleValues = dataset.data.slice(0, 10).map((row) => row[col]);
      return sampleValues.some((val) => typeof val === "number");
    });
  }, [dataset]);

  const chartData = useMemo(() => {
    if (!selectedColumn) return [];
    
    const values = dataset.data.map((row) => row[selectedColumn]);
    const isNumeric = typeof values[0] === "number";

    if (isNumeric) {
      // For numeric data, create histogram bins
      const numericValues = values.filter(v => typeof v === "number") as number[];
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const binCount = Math.min(10, Math.ceil(Math.sqrt(numericValues.length)));
      const binSize = (max - min) / binCount || 1;

      const bins = Array.from({ length: binCount }, (_, i) => ({
        range: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
        count: 0,
        value: min + i * binSize,
      }));

      numericValues.forEach((val) => {
        const binIndex = Math.min(Math.floor((val - min) / binSize), binCount - 1);
        if (binIndex >= 0 && binIndex < bins.length) {
          bins[binIndex].count++;
        }
      });

      return bins;
    } else {
      // For categorical data, count occurrences
      const counts = values.reduce((acc, val) => {
        const key = String(val);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(counts)
        .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({ name, value }));
    }
  }, [dataset, selectedColumn]);

  const lineChartData = useMemo(() => {
    if (numericColumns.length === 0) return [];
    
    return dataset.data.slice(0, 50).map((row, index) => ({
      index: index + 1,
      ...numericColumns.reduce((acc, col) => {
        acc[col] = row[col];
        return acc;
      }, {} as Record<string, any>),
    }));
  }, [dataset, numericColumns]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Distribución de datos</h3>
          <Select value={selectedColumn} onValueChange={setSelectedColumn}>
            <SelectTrigger className="w-64">
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

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={'range' in chartData[0] ? "range" : "name"} 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey={'count' in chartData[0] ? "count" : "value"} fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {numericColumns.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-6">Tendencias temporales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="index" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                {numericColumns.slice(0, 3).map((col, i) => (
                  <Line 
                    key={col} 
                    type="monotone" 
                    dataKey={col} 
                    stroke={COLORS[i]} 
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-6">Proporción de categorías</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey={'count' in chartData[0] ? "count" : "value"}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VisualizationPanel;

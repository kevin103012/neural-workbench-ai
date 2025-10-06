import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Upload, Settings, Play } from "lucide-react";

const DashboardPreview = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-accent/50 text-accent">
            Dashboard
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Interfaz profesional e intuitiva
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gestiona proyectos, entrena modelos y visualiza resultados desde un solo lugar
          </p>
        </div>
        
        <div className="relative">
          {/* Main dashboard mockup */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <div>
                <h3 className="text-2xl font-bold mb-1">Mi Proyecto</h3>
                <p className="text-sm text-muted-foreground">Último análisis: Hace 2 horas</p>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Play className="h-5 w-5 text-secondary" />
                </div>
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-accent" />
                </div>
              </div>
            </div>
            
            {/* Stats grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Datasets cargados", value: "12", change: "+3 este mes", icon: Activity },
                { label: "Modelos entrenados", value: "8", change: "2 activos", icon: Activity },
                { label: "Precisión promedio", value: "94.2%", change: "+2.1% mejor", icon: Activity }
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs text-accent">{stat.change}</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Chart mockup */}
            <div className="relative h-64 rounded-xl bg-muted/30 border border-border overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-around p-6">
                {[65, 45, 80, 55, 90, 70, 85, 60].map((height, i) => (
                  <div 
                    key={i}
                    className="w-12 rounded-t-lg bg-gradient-to-t from-primary to-accent transition-all duration-500 hover:scale-110"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="absolute top-4 left-4">
                <div className="text-sm font-semibold mb-1">Rendimiento del modelo</div>
                <div className="text-xs text-muted-foreground">Últimas 8 ejecuciones</div>
              </div>
            </div>
          </Card>
          
          {/* Decorative glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-3xl -z-10 opacity-50" />
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;

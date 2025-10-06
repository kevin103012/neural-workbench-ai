import { FileSpreadsheet, Sparkles, TrendingUp, Zap, Code, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: FileSpreadsheet,
      title: "Carga y transformación",
      description: "Importa CSV, Excel y procesa datos con Pandas. Limpieza, normalización y transformación avanzada."
    },
    {
      icon: BarChart3,
      title: "Análisis estadístico",
      description: "Calcula métricas, distribuciones y estadísticas descriptivas con NumPy de forma eficiente."
    },
    {
      icon: TrendingUp,
      title: "Machine Learning",
      description: "Entrena modelos de regresión, clasificación y clustering con Scikit-Learn en minutos."
    },
    {
      icon: Sparkles,
      title: "Deep Learning",
      description: "Crea y entrena redes neuronales personalizadas con PyTorch para problemas complejos."
    },
    {
      icon: Zap,
      title: "API REST rápida",
      description: "Expone tus modelos a través de endpoints FastAPI escalables y de alto rendimiento."
    },
    {
      icon: Code,
      title: "Interfaz interactiva",
      description: "Visualiza resultados, ajusta parámetros y explora datos desde una UI moderna y profesional."
    }
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Todo lo que necesitas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Una plataforma completa para cada etapa de tu proyecto de ciencia de datos
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card 
              key={i}
              className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-elegant)] group"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

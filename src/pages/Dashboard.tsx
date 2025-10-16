import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, LogOut, Plus, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/analysis/FileUpload";
import { DatasetInfo } from "@/pages/Analysis";

interface SavedModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [models, setModels] = useState<SavedModel[]>([]);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(currentUser));

    const savedModels = JSON.parse(localStorage.getItem("savedModels") || "[]");
    setModels(savedModels);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/login");
  };

  const handleDeleteModel = (modelId: string) => {
    const updatedModels = models.filter(m => m.id !== modelId);
    setModels(updatedModels);
    localStorage.setItem("savedModels", JSON.stringify(updatedModels));
    toast({
      title: "Modelo eliminado",
      description: "El modelo ha sido eliminado correctamente",
    });
  };

  const handleDownloadModel = (model: SavedModel) => {
    const dataStr = JSON.stringify(model, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${model.name.replace(/\s+/g, "_")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDatasetLoaded = (dataset: DatasetInfo) => {
    setIsNewProjectOpen(false);
    navigate("/cleaning", { 
      state: { 
        dataset,
        projectName,
        projectDescription
      } 
    });
    setProjectName("");
    setProjectDescription("");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Bienvenido, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button onClick={() => setIsNewProjectOpen(true)} size="lg" className="w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Crear un nuevo proyecto
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Mis Proyectos</h2>
          {models.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Aún no tienes proyectos guardados.<br />
                  ¡Comienza creando tu primer proyecto!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {models.map((model) => (
                <Card 
                  key={model.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                  onClick={() => navigate(`/project/${model.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>
                      Creado: {new Date(model.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tipo:</span>
                      <Badge variant="secondary">{model.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Precisión:</span>
                      <span className="font-semibold">{model.accuracy}%</span>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownloadModel(model)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteModel(model.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear nuevo proyecto</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Nombre del proyecto</Label>
                  <Input
                    id="projectName"
                    placeholder="Ej: Análisis de ventas 2024"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="projectDescription">Descripción</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Describe brevemente tu proyecto..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            <FileUpload onDatasetLoaded={handleDatasetLoaded} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

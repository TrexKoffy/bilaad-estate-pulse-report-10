import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchProjects } from '@/lib/supabaseService';
import { type Project } from '@/lib/projectData';
import AdminProjectCard from '@/components/AdminProjectCard';
import ProjectForm from '@/components/ProjectForm';
import UnitCard from '@/components/UnitCard';
import { Plus, LogOut, Users, Building2, RefreshCw } from 'lucide-react';

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [showUnits, setShowUnits] = useState<Project | null>(null);
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const loadProjects = async () => {
    setLoading(true);
    const data = await fetchProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully.',
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleDelete = () => {
    loadProjects();
  };

  const handleViewUnits = (project: Project) => {
    setShowUnits(project);
  };

  const handleProjectFormClose = () => {
    setShowProjectForm(false);
    setEditingProject(undefined);
  };

  const handleProjectFormSave = () => {
    loadProjects();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={loadProjects} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.reduce((sum, project) => sum + project.totalUnits, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.length > 0 
                  ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Projects</h2>
          <Button onClick={() => setShowProjectForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-8">Loading projects...</div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first project.</p>
              <Button onClick={() => setShowProjectForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <AdminProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewUnits={handleViewUnits}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Form Dialog */}
      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <ProjectForm
            project={editingProject}
            onClose={handleProjectFormClose}
            onSave={handleProjectFormSave}
          />
        </DialogContent>
      </Dialog>

      {/* Units Dialog */}
      <Dialog open={!!showUnits} onOpenChange={() => setShowUnits(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Units for {showUnits?.name}
              </h3>
              <Button variant="outline" onClick={() => setShowUnits(null)}>
                Close
              </Button>
            </div>
            
            {showUnits?.units && showUnits.units.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {showUnits.units.map((unit) => (
                  <UnitCard key={unit.id} unit={unit} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No units found for this project.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchProjects, deleteUnit } from '@/lib/supabaseService';
import { type Project, type Unit } from '@/lib/projectData';
import AdminProjectCard from '@/components/AdminProjectCard';
import ProjectForm from '@/components/ProjectForm';
import AdminUnitCard from '@/components/AdminUnitCard';
import UnitForm from '@/components/UnitForm';
import { Plus, LogOut, Users, Building2, RefreshCw, Filter } from 'lucide-react';
import BilaadLogo from '@/assets/bilaad-logo.png';

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [showUnits, setShowUnits] = useState<Project | null>(null);
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | undefined>();
  const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setShowUnitForm(true);
  };

  const handleDeleteUnit = (unit: Unit) => {
    setDeletingUnit(unit);
  };

  const confirmDeleteUnit = async () => {
    if (!deletingUnit) return;

    try {
      const { error } = await deleteUnit(deletingUnit.id);
      if (error) throw error;

      toast({
        title: 'Unit Deleted',
        description: `Unit ${deletingUnit.unitNumber} has been deleted successfully.`
      });

      setDeletingUnit(null);
      loadProjects();
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete unit. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleUnitFormClose = () => {
    setShowUnitForm(false);
    setEditingUnit(undefined);
  };

  const handleUnitFormSave = () => {
    loadProjects();
    handleUnitFormClose();
  };

  const handleCreateUnit = () => {
    setEditingUnit(undefined);
    setShowUnitForm(true);
  };

  const filteredProjects = projects.filter(project => {
    if (statusFilter === 'all') return true;
    return project.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
             {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <img
            src={BilaadLogo}
            alt="Bilaad Logo"
            className="w-32 object-contain"
          />
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

        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold">Project Portfolio</h2>
            <div className="flex items-center gap-4">
              {/* Status Filter */}
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
                <TabsList className="grid grid-cols-5 w-fit">
                  <TabsTrigger value="all" className="text-xs px-3">All</TabsTrigger>
                  <TabsTrigger value="planning" className="text-xs px-3">Planning</TabsTrigger>
                  <TabsTrigger value="in-progress" className="text-xs px-3">In Progress</TabsTrigger>
                  <TabsTrigger value="near-completion" className="text-xs px-3">Near Completion</TabsTrigger>
                  <TabsTrigger value="completed" className="text-xs px-3">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button onClick={() => setShowProjectForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-8">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {statusFilter === 'all' ? 'No Projects Found' : `No ${statusFilter.replace('-', ' ')} Projects`}
              </h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter === 'all' 
                  ? 'Get started by creating your first project.' 
                  : `No projects with ${statusFilter.replace('-', ' ')} status found.`}
              </p>
              {statusFilter === 'all' && (
                <Button onClick={() => setShowProjectForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
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
              <div className="flex gap-2">
                <Button onClick={handleCreateUnit}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unit
                </Button>
                <Button variant="outline" onClick={() => setShowUnits(null)}>
                  Close
                </Button>
              </div>
            </div>
            
            {showUnits?.units && showUnits.units.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {showUnits.units.map((unit) => (
                  <AdminUnitCard 
                    key={unit.id} 
                    unit={unit} 
                    onEdit={handleEditUnit}
                    onDelete={handleDeleteUnit}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Units Found</h3>
                <p className="text-muted-foreground mb-4">Get started by creating the first unit for this project.</p>
                <Button onClick={handleCreateUnit}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Unit
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Unit Form Dialog */}
      <UnitForm
        unit={editingUnit}
        projectId={showUnits?.id || ''}
        open={showUnitForm}
        onOpenChange={setShowUnitForm}
        onSave={handleUnitFormSave}
      />

      {/* Delete Unit Confirmation */}
      <AlertDialog open={!!deletingUnit} onOpenChange={() => setDeletingUnit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Unit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete unit "{deletingUnit?.unitNumber}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUnit} className="bg-danger text-danger-foreground hover:bg-danger/90">
              Delete Unit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
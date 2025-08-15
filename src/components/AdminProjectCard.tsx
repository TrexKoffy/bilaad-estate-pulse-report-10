import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Project } from '@/lib/projectData';
import { deleteProject } from '@/lib/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Eye, Building2, Calendar, Users } from 'lucide-react';

interface AdminProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: () => void;
  onViewUnits: (project: Project) => void;
}

export default function AdminProjectCard({ project, onEdit, onDelete, onViewUnits }: AdminProjectCardProps) {
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await deleteProject(project.id);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      onDelete();
    }
    
    setDeleting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'near-completion': return 'bg-orange-500';
      case 'planning': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status.replace('-', ' ').toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">{project.location}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewUnits(project)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{project.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{project.totalUnits} units</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{project.targetCompletion}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{project.manager}</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Phase:</strong> {project.currentPhase}</p>
            <p><strong>Budget:</strong> {project.budget}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
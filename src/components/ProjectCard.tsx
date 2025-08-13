import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, Calendar, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    status: 'planning' | 'in-progress' | 'near-completion' | 'completed';
    progress: number;
    totalUnits: number;
    completedUnits: number;
    targetCompletion: string;
    currentPhase: string;
    manager: string;
  };
}

const statusColors = {
  'planning': 'bg-warning',
  'in-progress': 'bg-primary',
  'near-completion': 'bg-secondary',
  'completed': 'bg-success'
};

const statusLabels = {
  'planning': 'Planning',
  'in-progress': 'In Progress',
  'near-completion': 'Near Completion',
  'completed': 'Completed'
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-elevation transition-all duration-300 border-0 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {project.name}
          </CardTitle>
          <Badge className={`${statusColors[project.status]} text-white border-0`}>
            {statusLabels[project.status]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              Units Progress
            </div>
            <p className="text-sm font-medium">
              {project.completedUnits}/{project.totalUnits} units
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Target Date
            </div>
            <p className="text-sm font-medium">{project.targetCompletion}</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            Current Phase
          </div>
          <p className="text-sm font-medium">{project.currentPhase}</p>
        </div>

        <div className="pt-2">
          <Link to={`/project/${project.id}`}>
            <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface DashboardStatsProps {
  projects: Array<{
    id: string;
    name: string;
    status: 'planning' | 'in-progress' | 'near-completion' | 'completed';
    progress: number;
    totalUnits: number;
    completedUnits: number;
  }>;
}

export function DashboardStats({ projects }: DashboardStatsProps) {
  const totalProjects = projects.length;
  const totalUnits = projects.reduce((sum, p) => sum + p.totalUnits, 0);
  const completedUnits = projects.reduce((sum, p) => sum + p.completedUnits, 0);
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects);
  
  const statusCounts = {
    planning: projects.filter(p => p.status === 'planning').length,
    'in-progress': projects.filter(p => p.status === 'in-progress').length,
    'near-completion': projects.filter(p => p.status === 'near-completion').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Total Housing Units",
      value: totalUnits.toLocaleString(),
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      title: "Completed Units",
      value: completedUnits.toLocaleString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Average Progress",
      value: `${avgProgress}%`,
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent" />
            Project Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              Planning: {statusCounts.planning}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              In Progress: {statusCounts['in-progress']}
            </Badge>
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
              Near Completion: {statusCounts['near-completion']}
            </Badge>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              Completed: {statusCounts.completed}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
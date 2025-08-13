import { useState } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/lib/projectData";
import { FileText, Calendar, Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import bilaadHeader from "@/assets/bilaad-header.jpg";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const generateReport = (type: 'weekly' | 'monthly') => {
    // In a real app, this would generate and download a report
    console.log(`Generating ${type} report...`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="relative h-32 bg-gradient-primary overflow-hidden">
        <img 
          src={bilaadHeader} 
          alt="BILAAD Real Estate" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">BILAAD</h1>
              <p className="text-white/90 text-lg">Project Management Dashboard</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => generateReport('weekly')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Weekly Report
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => generateReport('monthly')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Monthly Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <DashboardStats projects={mockProjects} />

        {/* Filters and Search */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Project Portfolio
              </CardTitle>
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "planning" ? "warning" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("planning")}
                  >
                    Planning
                  </Button>
                  <Button
                    variant={statusFilter === "in-progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("in-progress")}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={statusFilter === "near-completion" ? "success" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("near-completion")}
                  >
                    Near Completion
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="border-0 shadow-card">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="premium" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Export All Reports
              </Button>
              <Button variant="outline" size="lg">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Review Meeting
              </Button>
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Create Custom Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
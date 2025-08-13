import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProjects } from "@/lib/projectData";
import UnitCard from "@/components/UnitCard";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  DollarSign, 
  MapPin, 
  User, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Camera,
  FileText,
  Edit3,
  Save,
  Home
} from "lucide-react";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const project = mockProjects.find(p => p.id === projectId);
  const [isEditing, setIsEditing] = useState(false);
  const [editableNotes, setEditableNotes] = useState({
    weekly: project?.weeklyNotes || "",
    monthly: project?.monthlyNotes || "",
    targetMilestone: project?.targetMilestone || ""
  });

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="border-0 shadow-card">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <Link to="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors = {
    'planning': 'bg-warning text-warning-foreground',
    'in-progress': 'bg-primary text-primary-foreground',
    'near-completion': 'bg-secondary text-secondary-foreground',
    'completed': 'bg-success text-success-foreground'
  };

  const statusLabels = {
    'planning': 'Planning',
    'in-progress': 'In Progress',
    'near-completion': 'Near Completion',
    'completed': 'Completed'
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    console.log("Saving changes:", editableNotes);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-secondary">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" className="bg-primary/10 border-primary/20 text-white hover:bg-primary/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Building2 className="h-8 w-8" />
                  {project.name} Estate
                </h1>
                <p className="text-white/90 text-lg">Project Management Details</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`${statusColors[project.status]} border-0 text-base px-4 py-2`}>
                {statusLabels[project.status]}
              </Badge>
              <Button 
                variant={isEditing ? "default" : "outline"}
                className={isEditing ? "bg-primary text-primary-foreground" : "bg-primary/10 border-primary/20 text-white hover:bg-primary/20"}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                {isEditing ? "Save Changes" : "Edit Report"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <p className="text-3xl font-bold text-primary">{project.progress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <Progress value={project.progress} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Units</p>
                  <p className="text-3xl font-bold text-secondary">{project.completedUnits}/{project.totalUnits}</p>
                </div>
                <Building2 className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget</p>
                  <p className="text-3xl font-bold text-accent">{project.budget}</p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Target Date</p>
                  <p className="text-2xl font-bold">{project.targetCompletion}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                    <p className="font-medium">{project.location}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <User className="h-4 w-4" />
                      Project Manager
                    </div>
                    <p className="font-medium">{project.manager}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Start Date
                    </div>
                    <p className="font-medium">{project.startDate}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4" />
                      Current Phase
                    </div>
                    <p className="font-medium">{project.currentPhase}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <Building2 className="h-4 w-4" />
                      Total Units
                    </div>
                    <p className="font-medium">{project.totalUnits} residential units</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4" />
                      Project Budget
                    </div>
                    <p className="font-medium">{project.budget}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Target Milestone
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editableNotes.targetMilestone}
                  onChange={(e) => setEditableNotes(prev => ({ ...prev, targetMilestone: e.target.value }))}
                  placeholder="Enter target milestone for this month..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm leading-relaxed">{project.targetMilestone}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="units" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="units">Units</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="space-y-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Individual Unit Reports
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Detailed progress tracking for each residential unit
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.units.map((unit) => (
                    <UnitCard key={unit.id} unit={unit} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-secondary">
                    <CheckCircle className="h-5 w-5" />
                    Completed Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.completedActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{activity}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Clock className="h-5 w-5" />
                    Activities in Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.activitiesInProgress.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{activity}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="challenges">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  Project Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.challenges.length > 0 ? (
                    project.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-warning/5 border border-warning/20 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{challenge}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No current challenges reported.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-accent" />
                  Progress Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No progress photos uploaded yet.</p>
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Weekly Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editableNotes.weekly}
                      onChange={(e) => setEditableNotes(prev => ({ ...prev, weekly: e.target.value }))}
                      placeholder="Enter weekly progress notes..."
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{project.weeklyNotes}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editableNotes.monthly}
                      onChange={(e) => setEditableNotes(prev => ({ ...prev, monthly: e.target.value }))}
                      placeholder="Enter monthly summary notes..."
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{project.monthlyNotes}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
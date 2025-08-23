import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProject, type Project } from "@/lib/projectData";
import UnitCard from "@/components/UnitCard";
import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";
import { exportProjectToCSV, exportProjectToPDF, exportUnitsToCSV, exportUnitsToPDF } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Coins, 
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
  Home,
  Loader2,
  Download,
  FileSpreadsheet
} from "lucide-react";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [editableNotes, setEditableNotes] = useState({
    weekly: "",
    monthly: "",
    targetMilestone: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const projectData = await getProject(projectId);
      setProject(projectData);
      if (projectData) {
        setEditableNotes({
          weekly: projectData.weeklyNotes || "",
          monthly: projectData.monthlyNotes || "",
          targetMilestone: projectData.targetMilestone || ""
        });
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="border-0 shadow-card">
          <CardContent className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading project details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="border-0 shadow-card">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <Link to="/dashboard">
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

  const handleExportCSV = async () => {
    if (!project) return;
    setExportLoading(true);
    try {
      exportProjectToCSV(project);
      toast({
        title: "Export Successful",
        description: "Project data exported as CSV"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export project data",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!project) return;
    setExportLoading(true);
    try {
      exportProjectToPDF(project);
      toast({
        title: "Export Successful",
        description: "Project report exported as PDF"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export project report",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportUnitsCSV = async () => {
    if (!project) return;
    setExportLoading(true);
    try {
      exportUnitsToCSV(project.units, project.name);
      toast({
        title: "Export Successful",
        description: "Units data exported as CSV"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export units data",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportUnitsPDF = async () => {
    if (!project) return;
    setExportLoading(true);
    try {
      exportUnitsToPDF(project.units, project.name);
      toast({
        title: "Export Successful",
        description: "Units report exported as PDF"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export units report",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="relative bg-[#1a1a1a] text-white">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/src/assets/real-estate-header-bg.jpg')`
          }}
        />
        
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                    <Building2 className="h-6 lg:h-8 w-6 lg:w-8" />
                    {project.name} Estate
                  </h1>
                  <p className="text-white/90 text-base lg:text-lg">Project Management Details</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Badge className={`${statusColors[project.status]} border-0 text-sm lg:text-base px-3 lg:px-4 py-1 lg:py-2`}>
                  {statusLabels[project.status]}
                </Badge>
                
                {/* Export Buttons */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 sm:flex-initial"
                    onClick={handleExportCSV}
                    disabled={exportLoading}
                  >
                    <FileSpreadsheet className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    <span className="text-xs lg:text-sm">CSV</span>
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 sm:flex-initial"
                    onClick={handleExportPDF}
                    disabled={exportLoading}
                  >
                    <Download className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    <span className="text-xs lg:text-sm">PDF</span>
                  </Button>
                </div>
              </div>
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
                <Coins className="h-8 w-8 text-accent" />
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
                      <Coins className="h-4 w-4" />
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      Individual Unit Reports
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Detailed progress tracking for each residential unit
                    </p>
                  </div>
                  
                  {/* Units Export Buttons */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleExportUnitsCSV}
                      disabled={exportLoading}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleExportUnitsPDF}
                      disabled={exportLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
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
                <PhotoGallery 
                  photos={project.progressImages || []} 
                  title="Project Progress Photos"
                />
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
      
      <Footer />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Project } from '@/lib/projectData';
import { createProject, updateProject } from '@/lib/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { X, Save } from 'lucide-react';
import PhotoUpload from './PhotoUpload';

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
  onSave: () => void;
}

export default function ProjectForm({ project, onClose, onSave }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'planning' as 'planning' | 'in-progress' | 'near-completion' | 'completed',
    progress: 0,
    totalUnits: 0,
    completedUnits: 0,
    targetCompletion: '',
    currentPhase: '',
    manager: '',
    location: '',
    startDate: '',
    budget: '',
    targetMilestone: '',
    activitiesInProgress: [] as string[],
    completedActivities: [] as string[],
    challenges: [] as string[],
    progressImages: [] as string[],
    weeklyNotes: '',
    monthlyNotes: '',
  });
  
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        status: project.status,
        progress: project.progress,
        totalUnits: project.totalUnits,
        completedUnits: project.completedUnits,
        targetCompletion: project.targetCompletion,
        currentPhase: project.currentPhase,
        manager: project.manager,
        location: project.location,
        startDate: project.startDate,
        budget: project.budget,
        targetMilestone: project.targetMilestone,
        activitiesInProgress: project.activitiesInProgress,
        completedActivities: project.completedActivities,
        challenges: project.challenges,
        progressImages: project.progressImages,
        weeklyNotes: project.weeklyNotes,
        monthlyNotes: project.monthlyNotes,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (project) {
        const { error } = await updateProject(project.id, formData);
        if (error) throw error;
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        const { error } = await createProject(formData);
        if (error) throw error;
        toast({ title: 'Success', description: 'Project created successfully' });
      }
      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save project',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleArrayInput = (field: 'activitiesInProgress' | 'completedActivities' | 'challenges' | 'progressImages', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split('\n').filter(item => item.trim())
    }));
  };

  return (
    <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{project ? 'Edit Project' : 'Create New Project'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="near-completion">Near Completion</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Progress: {formData.progress}%</Label>
            <Slider
              value={[formData.progress]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, progress: value[0] }))}
              max={100}
              step={1}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalUnits">Total Units</Label>
              <Input
                id="totalUnits"
                type="number"
                value={formData.totalUnits}
                onChange={(e) => setFormData(prev => ({ ...prev, totalUnits: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="completedUnits">Completed Units</Label>
              <Input
                id="completedUnits"
                type="number"
                value={formData.completedUnits}
                onChange={(e) => setFormData(prev => ({ ...prev, completedUnits: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetCompletion">Target Completion</Label>
              <Input
                id="targetCompletion"
                value={formData.targetCompletion}
                onChange={(e) => setFormData(prev => ({ ...prev, targetCompletion: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentPhase">Current Phase</Label>
              <Input
                id="currentPhase"
                value={formData.currentPhase}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPhase: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetMilestone">Target Milestone</Label>
            <Input
              id="targetMilestone"
              value={formData.targetMilestone}
              onChange={(e) => setFormData(prev => ({ ...prev, targetMilestone: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activitiesInProgress">Activities in Progress (one per line)</Label>
              <Textarea
                id="activitiesInProgress"
                rows={4}
                value={formData.activitiesInProgress.join('\n')}
                onChange={(e) => handleArrayInput('activitiesInProgress', e.target.value)}
                placeholder="Enter each activity on a new line"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="completedActivities">Completed Activities (one per line)</Label>
              <Textarea
                id="completedActivities"
                rows={4}
                value={formData.completedActivities.join('\n')}
                onChange={(e) => handleArrayInput('completedActivities', e.target.value)}
                placeholder="Enter each activity on a new line"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">Challenges (one per line)</Label>
            <Textarea
              id="challenges"
              rows={3}
              value={formData.challenges.join('\n')}
              onChange={(e) => handleArrayInput('challenges', e.target.value)}
              placeholder="Enter each challenge on a new line"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weeklyNotes">Weekly Notes</Label>
              <Textarea
                id="weeklyNotes"
                rows={3}
                value={formData.weeklyNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, weeklyNotes: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyNotes">Monthly Notes</Label>
              <Textarea
                id="monthlyNotes"
                rows={3}
                value={formData.monthlyNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyNotes: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="progressImages">Progress Photos</Label>
            <PhotoUpload
              photos={formData.progressImages}
              onPhotosUpdate={(photos) => setFormData(prev => ({ ...prev, progressImages: photos }))}
              projectId={project?.id || 'temp'}
              maxFiles={20}
              maxSize={1}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
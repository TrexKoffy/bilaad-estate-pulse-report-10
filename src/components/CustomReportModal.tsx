import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { exportProjectToCSV, exportProjectToPDF } from '@/lib/exportUtils';
import { FileText, Download, X, Loader2 } from 'lucide-react';
import { type Project } from '@/lib/projectData';

interface CustomReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
}

export default function CustomReportModal({ open, onOpenChange, projects }: CustomReportModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [reportFormat, setReportFormat] = useState<'csv' | 'pdf'>('pdf');
  const { toast } = useToast();

  const handleProjectToggle = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(p => p.id));
    }
  };

  const handleGenerateReport = async () => {
    if (selectedProjects.length === 0) {
      toast({
        title: 'No Projects Selected',
        description: 'Please select at least one project to generate a report.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const selectedProjectData = projects.filter(p => selectedProjects.includes(p.id));
      
      if (reportFormat === 'pdf') {
        // For multiple projects, we'll create a combined report
        selectedProjectData.forEach(project => {
          exportProjectToPDF(project);
        });
      } else {
        // For CSV, export each project separately
        selectedProjectData.forEach(project => {
          exportProjectToCSV(project);
        });
      }

      toast({
        title: 'Reports Generated',
        description: `${selectedProjectData.length} project report(s) have been downloaded.`
      });

      onOpenChange(false);
      setSelectedProjects([]);
    } catch (error) {
      console.error('Error generating custom report:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to generate custom report. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Custom Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Report Format</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={reportFormat === 'pdf'}
                  onChange={(e) => setReportFormat(e.target.value as 'pdf')}
                  className="w-4 h-4"
                />
                <span>PDF</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={reportFormat === 'csv'}
                  onChange={(e) => setReportFormat(e.target.value as 'csv')}
                  className="w-4 h-4"
                />
                <span>CSV</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium">Select Projects</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                type="button"
              >
                {selectedProjects.length === projects.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={project.id}
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() => handleProjectToggle(project.id)}
                  />
                  <Label
                    htmlFor={project.id}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {project.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Selected: {selectedProjects.length} of {projects.length} projects
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateReport} 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
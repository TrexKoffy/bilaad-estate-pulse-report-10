import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Save, X, Loader2 } from 'lucide-react';
import { type Project } from '@/lib/projectData';

interface MeetingScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
}

export default function MeetingScheduleModal({ open, onOpenChange, projects }: MeetingScheduleModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    meetingDate: '',
    meetingTime: '',
    attendees: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find the project name
      const selectedProject = projects.find(p => p.id === formData.projectId);
      const projectName = selectedProject?.name || 'Unknown Project';

      // Insert meeting into database
      const { error: insertError } = await supabase
        .from('meetings')
        .insert({
          project_id: formData.projectId,
          meeting_date: formData.meetingDate,
          meeting_time: formData.meetingTime,
          attendees: formData.attendees
        });

      if (insertError) {
        throw insertError;
      }

      // Send email notification
      try {
        const { error: emailError } = await supabase.functions.invoke('send-meeting-email', {
          body: {
            projectName,
            meetingDate: formData.meetingDate,
            meetingTime: formData.meetingTime,
            attendees: formData.attendees
          }
        });

        if (emailError) {
          console.error('Email send error:', emailError);
          // Don't throw here - meeting was saved successfully
          toast({
            title: 'Meeting Scheduled',
            description: 'Meeting was scheduled but email notification failed. Please inform manually.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Meeting Scheduled',
            description: 'Meeting has been scheduled and email notification sent successfully.'
          });
        }
      } catch (emailError) {
        console.error('Email function error:', emailError);
        toast({
          title: 'Meeting Scheduled',
          description: 'Meeting was scheduled but email notification failed. Please inform manually.',
          variant: 'destructive'
        });
      }

      // Reset form and close modal
      setFormData({
        projectId: '',
        meetingDate: '',
        meetingTime: '',
        attendees: ''
      });
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule meeting. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Review Meeting
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="project">Project</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) => setFormData({ ...formData, projectId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="meetingDate">Meeting Date</Label>
            <Input
              id="meetingDate"
              type="date"
              value={formData.meetingDate}
              onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="meetingTime">Meeting Time</Label>
            <Input
              id="meetingTime"
              type="time"
              value={formData.meetingTime}
              onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="attendees">Attendees</Label>
            <Textarea
              id="attendees"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
              placeholder="List the meeting attendees..."
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
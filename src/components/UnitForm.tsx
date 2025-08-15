import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { createUnit, updateUnit } from '@/lib/supabaseService';
import { Unit } from '@/lib/projectData';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface UnitFormProps {
  unit?: Unit;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function UnitForm({ unit, projectId, open, onOpenChange, onSave }: UnitFormProps) {
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<Date | undefined>(
    unit?.targetCompletion ? new Date(unit.targetCompletion) : undefined
  );
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    unitNumber: unit?.unitNumber || '',
    type: unit?.type || 'Villa',
    subType: unit?.subType || '',
    bedrooms: unit?.bedrooms || 3,
    status: unit?.status || 'in-progress',
    progress: unit?.progress || 0,
    currentPhase: unit?.currentPhase || 'Foundation',
    activities: JSON.stringify(unit?.activities || {
      foundation: 'in-progress',
      structure: 'in-progress',
      roofing: 'in-progress',
      mep: 'in-progress',
      interior: 'in-progress',
      finishing: 'in-progress'
    }, null, 2),
    challenges: JSON.stringify(unit?.challenges || [], null, 2),
    photos: JSON.stringify(unit?.photos || [], null, 2)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let activities, challenges, photos;
      
      try {
        activities = JSON.parse(formData.activities);
        challenges = JSON.parse(formData.challenges);
        photos = JSON.parse(formData.photos);
      } catch (parseError) {
        toast({
          title: 'Invalid JSON',
          description: 'Please check your JSON format in activities, challenges, or photos fields.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      const unitData = {
        unitNumber: formData.unitNumber,
        type: formData.type as Unit['type'],
        subType: (formData.subType || undefined) as Unit['subType'],
        bedrooms: formData.bedrooms,
        status: formData.status as Unit['status'],
        progress: formData.progress,
        targetCompletion: targetDate ? format(targetDate, 'PPP') : format(new Date(), 'PPP'),
        currentPhase: formData.currentPhase,
        activities,
        challenges,
        photos,
        lastUpdated: format(new Date(), 'PPP')
      };

      let result;
      if (unit) {
        result = await updateUnit(unit.id, unitData);
      } else {
        result = await createUnit({ ...unitData, projectId });
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: unit ? 'Unit Updated' : 'Unit Created',
        description: `Unit ${formData.unitNumber} has been ${unit ? 'updated' : 'created'} successfully.`
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving unit:', error);
      toast({
        title: 'Error',
        description: `Failed to ${unit ? 'update' : 'create'} unit. Please try again.`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{unit ? 'Edit Unit' : 'Create New Unit'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="unitNumber">Unit Number</Label>
                  <Input
                    id="unitNumber"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    placeholder="e.g., A-101"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as Unit['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Luxury Villa">Luxury Villa</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subType">Sub Type</Label>
                  <Input
                    id="subType"
                    value={formData.subType}
                    onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                    placeholder="e.g., Gym & Facility Office"
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status & Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Unit['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="behind-schedule">Behind Schedule</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="progress">Progress: {formData.progress}%</Label>
                  <Slider
                    value={[formData.progress]}
                    onValueChange={(value) => setFormData({ ...formData, progress: value[0] })}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="currentPhase">Current Phase</Label>
                  <Input
                    id="currentPhase"
                    value={formData.currentPhase}
                    onChange={(e) => setFormData({ ...formData, currentPhase: e.target.value })}
                    placeholder="e.g., Foundation"
                    required
                  />
                </div>

                <div>
                  <Label>Target Completion</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !targetDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={targetDate}
                        onSelect={setTargetDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">JSON Data Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="activities">Activities (JSON)</Label>
                <Textarea
                  id="activities"
                  value={formData.activities}
                  onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                  placeholder='{"foundation": "completed", "structure": "in-progress", ...}'
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="challenges">Challenges (JSON Array)</Label>
                <Textarea
                  id="challenges"
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  placeholder='["Weather delays", "Material shortage"]'
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="photos">Photos (JSON Array)</Label>
                <Textarea
                  id="photos"
                  value={formData.photos}
                  onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
                  placeholder='["photo1.jpg", "photo2.jpg"]'
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

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
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : unit ? 'Update Unit' : 'Create Unit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
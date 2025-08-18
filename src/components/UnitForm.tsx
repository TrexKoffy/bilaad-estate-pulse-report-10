import { useState, useEffect } from 'react';
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
import PhotoUpload from './PhotoUpload';

interface UnitFormProps {
  unit?: Unit;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function UnitForm({ unit, projectId, open, onOpenChange, onSave }: UnitFormProps) {
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<Date | undefined>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    unitNumber: '',
    type: '',
    subType: '',
    bedrooms: 3,
    status: 'in-progress' as Unit['status'],
    progress: 0,
    currentPhase: 'Foundation',
    activities: JSON.stringify({
      foundation: 'in-progress',
      structure: 'in-progress',
      roofing: 'in-progress',
      mep: 'in-progress',
      interior: 'in-progress',
      finishing: 'in-progress'
    }, null, 2),
    challenges: JSON.stringify([], null, 2),
    photos: JSON.stringify([], null, 2)
  });

  // Helper function to parse various date formats
  const parseFlexibleDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    
    console.log('Parsing date string:', dateString);
    
    // Try parsing as-is first
    let date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      console.log('Parsed successfully as-is:', date);
      return date;
    }
    
    // Handle "Month DDth, YYYY" format (e.g., "August 30th, 2025")
    const verboseMatch = dateString.match(/^(\w+)\s+(\d+)(?:st|nd|rd|th),?\s+(\d{4})$/);
    if (verboseMatch) {
      const [, month, day, year] = verboseMatch;
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      const monthIndex = monthNames.indexOf(month);
      if (monthIndex !== -1) {
        date = new Date(parseInt(year), monthIndex, parseInt(day));
        console.log('Parsed verbose format:', date);
        return date;
      }
    }
    
    // Handle MM/DD/YYYY format
    const shortMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (shortMatch) {
      const [, month, day, year] = shortMatch;
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      console.log('Parsed MM/DD/YYYY format:', date);
      return date;
    }
    
    console.warn('Could not parse date:', dateString);
    return undefined;
  };

  // Effect to populate form data when unit prop changes
  useEffect(() => {
    if (unit) {
      console.log('Loading unit for edit:', unit);
      
      setFormData({
        unitNumber: unit.unitNumber || '',
        type: unit.type || '',
        subType: unit.subType || '',
        bedrooms: unit.bedrooms || 3,
        status: unit.status || 'in-progress',
        progress: unit.progress || 0,
        currentPhase: unit.currentPhase || 'Foundation',
        activities: JSON.stringify(unit.activities || {
          foundation: 'in-progress',
          structure: 'in-progress',
          roofing: 'in-progress',
          mep: 'in-progress',
          interior: 'in-progress',
          finishing: 'in-progress'
        }, null, 2),
        challenges: JSON.stringify(unit.challenges || [], null, 2),
        photos: JSON.stringify(unit.photos || [], null, 2)
      });
      
      // Parse target completion date safely
      const parsedDate = parseFlexibleDate(unit.targetCompletion);
      setTargetDate(parsedDate);
      console.log('Set target date:', parsedDate);
    } else {
      // Reset form for new unit
      setFormData({
        unitNumber: '',
        type: '',
        subType: '',
        bedrooms: 3,
        status: 'in-progress',
        progress: 0,
        currentPhase: 'Foundation',
        activities: JSON.stringify({
          foundation: 'in-progress',
          structure: 'in-progress',
          roofing: 'in-progress',
          mep: 'in-progress',
          interior: 'in-progress',
          finishing: 'in-progress'
        }, null, 2),
        challenges: JSON.stringify([], null, 2),
        photos: JSON.stringify([], null, 2)
      });
      setTargetDate(undefined);
    }
  }, [unit]);

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

      // Validate required fields
      if (!formData.unitNumber.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Unit Number is required.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      if (!formData.type.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Type is required.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      if (!projectId) {
        toast({
          title: 'Validation Error',
          description: 'Project ID is missing. Please try again.',
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
        targetCompletion: targetDate ? format(targetDate, 'M/d/yyyy') : format(new Date(), 'M/d/yyyy'),
        currentPhase: formData.currentPhase,
        activities,
        challenges,
        photos,
        lastUpdated: format(new Date(), 'M/d/yyyy')
      };

      console.log('Submitting unit data:', { unitData, projectId, isEdit: !!unit });

      let result;
      if (unit) {
        console.log('Updating unit with ID:', unit.id);
        result = await updateUnit(unit.id, unitData);
      } else {
        console.log('Creating new unit with project ID:', projectId);
        result = await createUnit({ ...unitData, projectId });
      }

      console.log('Supabase result:', result);

      if (result.error) {
        console.error('Supabase error details:', {
          error: result.error,
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code
        });
        
        // Provide specific error messages based on error type
        let errorMessage = `Failed to ${unit ? 'update' : 'create'} unit.`;
        
        if (result.error.code === '23505') {
          errorMessage = 'A unit with this number already exists in the project.';
        } else if (result.error.code === '23503') {
          errorMessage = 'Invalid project reference. Please refresh and try again.';
        } else if (result.error.code === '23514') {
          errorMessage = 'Data validation failed. Please check your input values.';
        } else if (result.error.message) {
          errorMessage = result.error.message;
        }
        
        toast({
          title: 'Database Error',
          description: errorMessage,
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      console.log('Unit saved successfully:', result.data);

      toast({
        title: unit ? 'Unit Updated' : 'Unit Created',
        description: `Unit ${formData.unitNumber} has been ${unit ? 'updated' : 'created'} successfully.`
      });

      onSave();
      // Keep the form open for multiple photo uploads unless it's a new unit creation
      if (!unit) {
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Unexpected error saving unit:', {
        error,
        message: error?.message,
        stack: error?.stack,
        unitData: formData,
        projectId
      });
      
      let errorMessage = `Failed to ${unit ? 'update' : 'create'} unit. `;
      
      if (error?.message) {
        errorMessage += `Error: ${error.message}`;
      } else {
        errorMessage += 'Please check the console for details and try again.';
      }
      
      toast({
        title: 'Unexpected Error',
        description: errorMessage,
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
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Villa, Townhouse, Custom Building, Office Space"
                    required
                  />
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
                <Label>Photos</Label>
                <PhotoUpload
                  photos={JSON.parse(formData.photos)}
                  onPhotosUpdate={(photos) => setFormData({ ...formData, photos: JSON.stringify(photos) })}
                  projectId={projectId}
                  unitId={unit?.id}
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
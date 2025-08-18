-- Create meetings table for scheduling functionality
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  attendees TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create policies for meetings access
CREATE POLICY "Meetings are viewable by everyone" 
ON public.meetings 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
ON public.meetings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON public.meetings 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
ON public.meetings 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON public.meetings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
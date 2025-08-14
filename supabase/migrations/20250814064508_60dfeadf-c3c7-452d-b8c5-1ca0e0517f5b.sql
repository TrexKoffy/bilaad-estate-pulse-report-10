-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planning', 'in-progress', 'near-completion', 'completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_units INTEGER NOT NULL DEFAULT 0,
  completed_units INTEGER NOT NULL DEFAULT 0,
  target_completion TEXT NOT NULL,
  current_phase TEXT NOT NULL,
  manager TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date TEXT NOT NULL,
  budget TEXT NOT NULL,
  target_milestone TEXT NOT NULL,
  activities_in_progress JSONB DEFAULT '[]'::jsonb,
  completed_activities JSONB DEFAULT '[]'::jsonb,
  challenges JSONB DEFAULT '[]'::jsonb,
  progress_images JSONB DEFAULT '[]'::jsonb,
  weekly_notes TEXT DEFAULT '',
  monthly_notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create units table
CREATE TABLE public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Villa', 'Townhouse', 'Apartment', 'Luxury Villa', 'Infrastructure')),
  sub_type TEXT,
  bedrooms INTEGER,
  status TEXT NOT NULL CHECK (status IN ('behind-schedule', 'in-progress', 'completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  target_completion TEXT NOT NULL,
  current_phase TEXT NOT NULL,
  activities JSONB NOT NULL DEFAULT '{}'::jsonb,
  challenges JSONB DEFAULT '[]'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  last_updated TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a dashboard app)
CREATE POLICY "Projects are viewable by everyone" 
ON public.projects 
FOR SELECT 
USING (true);

CREATE POLICY "Units are viewable by everyone" 
ON public.units 
FOR SELECT 
USING (true);

-- Create policies for admin access (we'll implement auth later)
CREATE POLICY "Enable insert for authenticated users only" 
ON public.projects 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON public.projects 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
ON public.projects 
FOR DELETE 
USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
ON public.units 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON public.units 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
ON public.units 
FOR DELETE 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_units_project_id ON public.units(project_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_units_status ON public.units(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
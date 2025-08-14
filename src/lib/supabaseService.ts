import { supabase } from '@/integrations/supabase/client';
import type { Project, Unit } from './projectData';

// Database types matching our Supabase schema
interface DatabaseProject {
  id: string;
  name: string;
  status: 'planning' | 'in-progress' | 'near-completion' | 'completed';
  progress: number;
  total_units: number;
  completed_units: number;
  target_completion: string;
  current_phase: string;
  manager: string;
  location: string;
  start_date: string;
  budget: string;
  target_milestone: string;
  activities_in_progress: string[];
  completed_activities: string[];
  challenges: string[];
  progress_images: string[];
  weekly_notes: string;
  monthly_notes: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseUnit {
  id: string;
  project_id: string;
  unit_number: string;
  type: 'Villa' | 'Townhouse' | 'Apartment' | 'Luxury Villa' | 'Infrastructure';
  sub_type?: string;
  bedrooms?: number;
  status: 'behind-schedule' | 'in-progress' | 'completed';
  progress: number;
  target_completion: string;
  current_phase: string;
  activities: {
    foundation: 'behind-schedule' | 'in-progress' | 'completed';
    structure: 'behind-schedule' | 'in-progress' | 'completed';
    roofing: 'behind-schedule' | 'in-progress' | 'completed';
    mep: 'behind-schedule' | 'in-progress' | 'completed';
    interior: 'behind-schedule' | 'in-progress' | 'completed';
    finishing: 'behind-schedule' | 'in-progress' | 'completed';
  };
  challenges: string[];
  photos: string[];
  last_updated: string;
  created_at: string;
  updated_at: string;
}

// Transform database project to app project
function transformProject(dbProject: DatabaseProject, units: Unit[]): Project {
  return {
    id: dbProject.id,
    name: dbProject.name,
    status: dbProject.status,
    progress: dbProject.progress,
    totalUnits: dbProject.total_units,
    completedUnits: dbProject.completed_units,
    targetCompletion: dbProject.target_completion,
    currentPhase: dbProject.current_phase,
    manager: dbProject.manager,
    location: dbProject.location,
    startDate: dbProject.start_date,
    budget: dbProject.budget,
    targetMilestone: dbProject.target_milestone,
    activitiesInProgress: dbProject.activities_in_progress,
    completedActivities: dbProject.completed_activities,
    challenges: dbProject.challenges,
    progressImages: dbProject.progress_images,
    weeklyNotes: dbProject.weekly_notes,
    monthlyNotes: dbProject.monthly_notes,
    units
  };
}

// Transform database unit to app unit
function transformUnit(dbUnit: DatabaseUnit): Unit {
  return {
    id: dbUnit.id,
    unitNumber: dbUnit.unit_number,
    type: dbUnit.type,
    subType: dbUnit.sub_type as any,
    bedrooms: dbUnit.bedrooms,
    status: dbUnit.status,
    progress: dbUnit.progress,
    targetCompletion: dbUnit.target_completion,
    currentPhase: dbUnit.current_phase,
    activities: dbUnit.activities,
    challenges: dbUnit.challenges,
    photos: dbUnit.photos,
    lastUpdated: dbUnit.last_updated
  };
}

// Fetch all projects with their units
export async function fetchProjects(): Promise<Project[]> {
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });

  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
    return [];
  }

  const { data: units, error: unitsError } = await supabase
    .from('units')
    .select('*')
    .order('unit_number');

  if (unitsError) {
    console.error('Error fetching units:', unitsError);
    return [];
  }

  // Group units by project
  const unitsByProject: Record<string, Unit[]> = {};
  units?.forEach(unit => {
    const transformedUnit = transformUnit(unit as DatabaseUnit);
    if (!unitsByProject[unit.project_id]) {
      unitsByProject[unit.project_id] = [];
    }
    unitsByProject[unit.project_id].push(transformedUnit);
  });

  return projects?.map(project => 
    transformProject(
      project as DatabaseProject, 
      unitsByProject[project.id] || []
    )
  ) || [];
}

// Fetch a single project with its units
export async function fetchProject(id: string): Promise<Project | null> {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (projectError) {
    console.error('Error fetching project:', projectError);
    return null;
  }

  const { data: units, error: unitsError } = await supabase
    .from('units')
    .select('*')
    .eq('project_id', id)
    .order('unit_number');

  if (unitsError) {
    console.error('Error fetching units:', unitsError);
    return null;
  }

  const transformedUnits = units?.map(unit => transformUnit(unit as DatabaseUnit)) || [];
  
  return transformProject(project as DatabaseProject, transformedUnits);
}

// CRUD operations for projects
export async function createProject(project: Omit<Project, 'id' | 'units'>): Promise<{ data: any; error: any }> {
  const { units, ...projectData } = project as any;
  
  const dbProject = {
    name: projectData.name,
    status: projectData.status,
    progress: projectData.progress,
    total_units: projectData.totalUnits,
    completed_units: projectData.completedUnits,
    target_completion: projectData.targetCompletion,
    current_phase: projectData.currentPhase,
    manager: projectData.manager,
    location: projectData.location,
    start_date: projectData.startDate,
    budget: projectData.budget,
    target_milestone: projectData.targetMilestone,
    activities_in_progress: projectData.activitiesInProgress || [],
    completed_activities: projectData.completedActivities || [],
    challenges: projectData.challenges || [],
    progress_images: projectData.progressImages || [],
    weekly_notes: projectData.weeklyNotes || '',
    monthly_notes: projectData.monthlyNotes || ''
  };

  return await supabase
    .from('projects')
    .insert([dbProject])
    .select()
    .single();
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<{ data: any; error: any }> {
  const { units, ...projectData } = updates as any;
  
  const dbUpdates: Partial<DatabaseProject> = {};
  
  if (projectData.name !== undefined) dbUpdates.name = projectData.name;
  if (projectData.status !== undefined) dbUpdates.status = projectData.status;
  if (projectData.progress !== undefined) dbUpdates.progress = projectData.progress;
  if (projectData.totalUnits !== undefined) dbUpdates.total_units = projectData.totalUnits;
  if (projectData.completedUnits !== undefined) dbUpdates.completed_units = projectData.completedUnits;
  if (projectData.targetCompletion !== undefined) dbUpdates.target_completion = projectData.targetCompletion;
  if (projectData.currentPhase !== undefined) dbUpdates.current_phase = projectData.currentPhase;
  if (projectData.manager !== undefined) dbUpdates.manager = projectData.manager;
  if (projectData.location !== undefined) dbUpdates.location = projectData.location;
  if (projectData.startDate !== undefined) dbUpdates.start_date = projectData.startDate;
  if (projectData.budget !== undefined) dbUpdates.budget = projectData.budget;
  if (projectData.targetMilestone !== undefined) dbUpdates.target_milestone = projectData.targetMilestone;
  if (projectData.activitiesInProgress !== undefined) dbUpdates.activities_in_progress = projectData.activitiesInProgress;
  if (projectData.completedActivities !== undefined) dbUpdates.completed_activities = projectData.completedActivities;
  if (projectData.challenges !== undefined) dbUpdates.challenges = projectData.challenges;
  if (projectData.progressImages !== undefined) dbUpdates.progress_images = projectData.progressImages;
  if (projectData.weeklyNotes !== undefined) dbUpdates.weekly_notes = projectData.weeklyNotes;
  if (projectData.monthlyNotes !== undefined) dbUpdates.monthly_notes = projectData.monthlyNotes;

  return await supabase
    .from('projects')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteProject(id: string): Promise<{ error: any }> {
  return await supabase
    .from('projects')
    .delete()
    .eq('id', id);
}

// CRUD operations for units
export async function createUnit(unit: Omit<Unit, 'id'> & { projectId: string }): Promise<{ data: any; error: any }> {
  const dbUnit = {
    project_id: unit.projectId,
    unit_number: unit.unitNumber,
    type: unit.type,
    sub_type: unit.subType,
    bedrooms: unit.bedrooms,
    status: unit.status,
    progress: unit.progress,
    target_completion: unit.targetCompletion,
    current_phase: unit.currentPhase,
    activities: unit.activities,
    challenges: unit.challenges || [],
    photos: unit.photos || [],
    last_updated: unit.lastUpdated
  };

  return await supabase
    .from('units')
    .insert([dbUnit])
    .select()
    .single();
}

export async function updateUnit(id: string, updates: Partial<Unit>): Promise<{ data: any; error: any }> {
  const dbUpdates: Partial<DatabaseUnit> = {};
  
  if (updates.unitNumber !== undefined) dbUpdates.unit_number = updates.unitNumber;
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.subType !== undefined) dbUpdates.sub_type = updates.subType;
  if (updates.bedrooms !== undefined) dbUpdates.bedrooms = updates.bedrooms;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
  if (updates.targetCompletion !== undefined) dbUpdates.target_completion = updates.targetCompletion;
  if (updates.currentPhase !== undefined) dbUpdates.current_phase = updates.currentPhase;
  if (updates.activities !== undefined) dbUpdates.activities = updates.activities;
  if (updates.challenges !== undefined) dbUpdates.challenges = updates.challenges;
  if (updates.photos !== undefined) dbUpdates.photos = updates.photos;
  if (updates.lastUpdated !== undefined) dbUpdates.last_updated = updates.lastUpdated;

  return await supabase
    .from('units')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteUnit(id: string): Promise<{ error: any }> {
  return await supabase
    .from('units')
    .delete()
    .eq('id', id);
}
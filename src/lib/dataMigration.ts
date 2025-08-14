import { supabase } from '@/integrations/supabase/client';
import { mockProjects } from './projectData';

// Migration script to populate the database with existing static data
export async function migrateStaticData(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Starting data migration...');

    // Check if data already exists to avoid duplicates
    const { data: existingProjects, error: checkError } = await supabase
      .from('projects')
      .select('id, name')
      .limit(1);

    if (checkError) {
      throw new Error(`Error checking existing data: ${checkError.message}`);
    }

    if (existingProjects && existingProjects.length > 0) {
      return {
        success: true,
        message: 'Data already exists in database. Migration skipped.'
      };
    }

    // Insert projects
    for (const project of mockProjects) {
      const dbProject = {
        id: project.id, // Use existing ID to maintain references
        name: project.name,
        status: project.status,
        progress: project.progress,
        total_units: project.totalUnits,
        completed_units: project.completedUnits,
        target_completion: project.targetCompletion,
        current_phase: project.currentPhase,
        manager: project.manager,
        location: project.location,
        start_date: project.startDate,
        budget: project.budget,
        target_milestone: project.targetMilestone,
        activities_in_progress: project.activitiesInProgress,
        completed_activities: project.completedActivities,
        challenges: project.challenges,
        progress_images: project.progressImages,
        weekly_notes: project.weeklyNotes,
        monthly_notes: project.monthlyNotes
      };

      const { error: projectError } = await supabase
        .from('projects')
        .insert([dbProject]);

      if (projectError) {
        throw new Error(`Error inserting project ${project.name}: ${projectError.message}`);
      }

      // Insert units for this project
      const unitsToInsert = project.units.map(unit => ({
        id: unit.id, // Use existing ID
        project_id: project.id,
        unit_number: unit.unitNumber,
        type: unit.type,
        sub_type: unit.subType,
        bedrooms: unit.bedrooms,
        status: unit.status,
        progress: unit.progress,
        target_completion: unit.targetCompletion,
        current_phase: unit.currentPhase,
        activities: unit.activities,
        challenges: unit.challenges,
        photos: unit.photos,
        last_updated: unit.lastUpdated
      }));

      if (unitsToInsert.length > 0) {
        const { error: unitsError } = await supabase
          .from('units')
          .insert(unitsToInsert);

        if (unitsError) {
          throw new Error(`Error inserting units for project ${project.name}: ${unitsError.message}`);
        }
      }

      console.log(`✓ Migrated project: ${project.name} with ${project.units.length} units`);
    }

    console.log('Data migration completed successfully!');
    return {
      success: true,
      message: `Successfully migrated ${mockProjects.length} projects with their units to the database.`
    };

  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Function to check migration status
export async function checkMigrationStatus(): Promise<{ migrated: boolean; projectCount: number; unitCount: number }> {
  try {
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id', { count: 'exact' });

    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('id', { count: 'exact' });

    if (projectsError || unitsError) {
      return { migrated: false, projectCount: 0, unitCount: 0 };
    }

    return {
      migrated: (projects?.length || 0) > 0,
      projectCount: projects?.length || 0,
      unitCount: units?.length || 0
    };
  } catch (error) {
    console.error('Error checking migration status:', error);
    return { migrated: false, projectCount: 0, unitCount: 0 };
  }
}
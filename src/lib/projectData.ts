export interface Unit {
  id: string;
  unitNumber: string;
  type: 'Villa' | 'Townhouse' | 'Apartment' | 'Luxury Villa' | 'Infrastructure';
  subType?: 'Gym & Facility Office' | 'Swimming Pool' | 'Mosque' | 'Gate House' | 'Road & Landscaping' | 'Commercial Building' | 'Mini Golf Course';
  bedrooms?: number;
  status: 'behind-schedule' | 'in-progress' | 'completed';
  progress: number;
  targetCompletion: string;
  currentPhase: string;
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
  lastUpdated: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'planning' | 'in-progress' | 'near-completion' | 'completed';
  progress: number;
  totalUnits: number;
  completedUnits: number;
  targetCompletion: string;
  currentPhase: string;
  manager: string;
  location: string;
  startDate: string;
  budget: string;
  targetMilestone: string;
  activitiesInProgress: string[];
  completedActivities: string[];
  challenges: string[];
  progressImages: string[];
  weeklyNotes: string;
  monthlyNotes: string;
  units: Unit[];
}

const generateUnitsForProject = (projectId: string, residentialUnits: number, infrastructure: string[], isLuxury: boolean = false): Unit[] => {
  const units: Unit[] = [];
  const types: Array<'Villa' | 'Townhouse' | 'Apartment' | 'Luxury Villa'> = isLuxury ? ['Luxury Villa'] : ['Villa', 'Townhouse', 'Apartment'];
  const statuses: Array<'behind-schedule' | 'in-progress' | 'completed'> = ['behind-schedule', 'in-progress', 'completed'];
  const phases = ['Foundation', 'Structure', 'Roofing', 'MEP', 'Interior', 'Finishing'];
  
  // Add residential units
  for (let i = 1; i <= residentialUnits; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const unitProgress = randomStatus === 'completed' ? 100 : 
                        randomStatus === 'in-progress' ? Math.floor(Math.random() * 80) + 20 :
                        Math.floor(Math.random() * 30);
    
    units.push({
      id: `${projectId}-unit-${i}`,
      unitNumber: `${projectId.toUpperCase()}-RES-${i.toString().padStart(3, '0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      bedrooms: Math.floor(Math.random() * 4) + 2,
      status: randomStatus,
      progress: unitProgress,
      targetCompletion: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      currentPhase: phases[Math.floor(Math.random() * phases.length)],
      activities: {
        foundation: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.3 ? 'completed' : 'in-progress',
        structure: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.4 ? 'completed' : 'in-progress',
        roofing: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.5 ? 'completed' : 'in-progress',
        mep: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.6 ? 'completed' : 'in-progress',
        interior: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.7 ? 'completed' : 'in-progress',
        finishing: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.8 ? 'completed' : 'in-progress',
      },
      challenges: randomStatus === 'behind-schedule' ? ['Material delivery delays', 'Weather impact'] : [],
      photos: [],
      lastUpdated: new Date().toLocaleDateString()
    });
  }
  
  // Add infrastructure units
  infrastructure.forEach((infra, index) => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const unitProgress = randomStatus === 'completed' ? 100 : 
                        randomStatus === 'in-progress' ? Math.floor(Math.random() * 80) + 20 :
                        Math.floor(Math.random() * 30);
    
    units.push({
      id: `${projectId}-infra-${index + 1}`,
      unitNumber: `${projectId.toUpperCase()}-INF-${(index + 1).toString().padStart(3, '0')}`,
      type: 'Infrastructure',
      subType: infra as any,
      status: randomStatus,
      progress: unitProgress,
      targetCompletion: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      currentPhase: phases[Math.floor(Math.random() * phases.length)],
      activities: {
        foundation: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.3 ? 'completed' : 'in-progress',
        structure: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.4 ? 'completed' : 'in-progress',
        roofing: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.5 ? 'completed' : 'in-progress',
        mep: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.6 ? 'completed' : 'in-progress',
        interior: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.7 ? 'completed' : 'in-progress',
        finishing: Math.random() > 0.8 ? 'behind-schedule' : Math.random() > 0.8 ? 'completed' : 'in-progress',
      },
      challenges: randomStatus === 'behind-schedule' ? ['Material delivery delays', 'Weather impact'] : [],
      photos: [],
      lastUpdated: new Date().toLocaleDateString()
    });
  });
  
  return units;
};

const baseInfrastructure = ['Gym & Facility Office', 'Swimming Pool', 'Mosque', 'Gate House', 'Road & Landscaping'];

export const mockProjects: Project[] = [
  {
    id: 'amazon',
    name: 'AMAZON',
    status: 'in-progress',
    progress: 75,
    totalUnits: 26,
    completedUnits: 18,
    targetCompletion: 'Dec 2024',
    currentPhase: 'Finishing Works',
    manager: 'Ahmed Hassan',
    location: 'Gwarinpa District, Abuja, Nigeria',
    startDate: 'Jan 2023',
    budget: '₦2.5B',
    targetMilestone: 'Complete luxury unit finishing and infrastructure development',
    activitiesInProgress: [
      'Interior finishing for luxury units',
      'Swimming pool installation',
      'Mosque construction',
      'Landscaping and external works'
    ],
    completedActivities: [
      'Foundation work completed',
      'Structural framework - 100%',
      'Gym & Facility Office completed',
      'Gate House construction finished',
      'Road infrastructure completed'
    ],
    challenges: [
      'Weather delays affecting exterior work',
      'Premium material delivery delays',
      'Skilled labor shortage for luxury finishes'
    ],
    progressImages: [],
    weeklyNotes: 'Luxury unit finishing progressing well. Swimming pool excavation completed.',
    monthlyNotes: 'High-end project tracking well. Quality standards maintained for luxury development.',
    units: generateUnitsForProject('amazon', 20, baseInfrastructure, true)
  },
  {
    id: 'bahamas',
    name: 'BAHAMAS',
    status: 'near-completion',
    progress: 92,
    totalUnits: 235,
    completedUnits: 215,
    targetCompletion: 'Oct 2024',
    currentPhase: 'Final Inspections',
    manager: 'Fatima Al-Zahra',
    location: 'Maitama District, Abuja, Nigeria',
    startDate: 'Mar 2022',
    budget: '₦8.5B',
    targetMilestone: 'Complete Phase 1 units and obtain occupancy certificates',
    activitiesInProgress: [
      'Final quality inspections on remaining units',
      'Swimming pool finishing touches',
      'Mosque interior completion',
      'Final landscaping and external works'
    ],
    completedActivities: [
      'All 230 residential units structural work completed',
      'Gym & Facility Office operational',
      'Gate House and security systems installed',
      'Road infrastructure completed',
      'Utility connections established'
    ],
    challenges: [
      'Minor punch list items in completed units',
      'Permit approval delays for occupancy'
    ],
    progressImages: [],
    weeklyNotes: 'Phase 1 nearing completion. Final inspections underway.',
    monthlyNotes: 'Excellent progress on large-scale development. Ready for phased handover.',
    units: generateUnitsForProject('bahamas', 230, baseInfrastructure)
  },
  {
    id: 'bali',
    name: 'BALI',
    status: 'in-progress',
    progress: 45,
    totalUnits: 406,
    completedUnits: 180,
    targetCompletion: 'Jun 2025',
    currentPhase: 'Structural Works',
    manager: 'Omar Khalil',
    location: 'Asokoro District, Abuja, Nigeria',
    startDate: 'Aug 2023',
    budget: '₦25.0B',
    targetMilestone: 'Complete Phase 2 structural framework and commercial building',
    activitiesInProgress: [
      'Phase 2 foundation work for remaining 220 units',
      'Commercial building structural framework',
      'Structural steel installation',
      'Site preparation for Phase 3'
    ],
    completedActivities: [
      'Phase 1 - 180 units structural complete',
      'Site clearing and preparation',
      'Main access roads',
      'Gym & Facility Office foundation'
    ],
    challenges: [
      'Ground conditions requiring additional foundation work',
      'Supply chain delays for structural steel'
    ],
    progressImages: [],
    weeklyNotes: 'Large-scale development progressing well. Commercial building started.',
    monthlyNotes: 'Major project on track. Commercial component adds complexity but manageable.',
    units: generateUnitsForProject('bali', 400, [...baseInfrastructure, 'Commercial Building'])
  },
  {
    id: 'barbados',
    name: 'BARBADOS',
    status: 'planning',
    progress: 15,
    totalUnits: 36,
    completedUnits: 0,
    targetCompletion: 'Dec 2025',
    currentPhase: 'Design Development',
    manager: 'Layla Mansour',
    location: 'Garki District, Abuja, Nigeria',
    startDate: 'Oct 2024',
    budget: '₦4.8B',
    targetMilestone: 'Finalize master plan and obtain building permits',
    activitiesInProgress: [
      'Architectural design finalization for 31 units',
      'Environmental impact assessment',
      'Infrastructure utility planning',
      'Swimming pool and mosque design'
    ],
    completedActivities: [
      'Land acquisition completed',
      'Preliminary site surveys',
      'Initial concept design approved'
    ],
    challenges: [
      'Complex approval process for development',
      'Environmental compliance requirements'
    ],
    progressImages: [],
    weeklyNotes: 'Design team working on final architectural plans.',
    monthlyNotes: 'Planning phase progressing. Infrastructure design underway.',
    units: generateUnitsForProject('barbados', 31, baseInfrastructure)
  },
  {
    id: 'bimini',
    name: 'BIMINI',
    status: 'in-progress',
    progress: 60,
    totalUnits: 13,
    completedUnits: 8,
    targetCompletion: 'Mar 2025',
    currentPhase: 'MEP Installation',
    manager: 'Rashid Al-Mansouri',
    location: 'Wuse District, Abuja, Nigeria',
    startDate: 'May 2023',
    budget: '₦1.5B',
    targetMilestone: 'Complete MEP installation for all 8 units',
    activitiesInProgress: [
      'Electrical installation for remaining units',
      'Swimming pool construction',
      'Mosque MEP systems',
      'Landscaping preparation'
    ],
    completedActivities: [
      'All 8 residential units structural work complete',
      'Gym & Facility Office completed',
      'Gate House operational',
      'Road infrastructure finished'
    ],
    challenges: [
      'MEP equipment delivery delays',
      'Coordination between specialized trades'
    ],
    progressImages: [],
    weeklyNotes: 'Small-scale development progressing well. MEP nearly complete.',
    monthlyNotes: 'Compact project on schedule. High-quality finishes being installed.',
    units: generateUnitsForProject('bimini', 8, baseInfrastructure)
  },
  {
    id: 'capri',
    name: 'CAPRI',
    status: 'completed',
    progress: 100,
    totalUnits: 195,
    completedUnits: 195,
    targetCompletion: 'Aug 2024',
    currentPhase: 'Project Closed',
    manager: 'Nadia Qasemi',
    location: 'Wuye District, Abuja, Nigeria',
    startDate: 'Jan 2022',
    budget: '₦18.5B',
    targetMilestone: 'Project successfully delivered',
    activitiesInProgress: [],
    completedActivities: [
      'All 190 residential units completed and handed over',
      'Full infrastructure delivered',
      'Swimming pool and recreational facilities operational',
      'Mosque blessed and operational',
      'All inspections passed and certificates obtained'
    ],
    challenges: [],
    progressImages: [],
    weeklyNotes: 'Project successfully completed and handed over.',
    monthlyNotes: 'Excellent project delivery. All residents satisfied with quality.',
    units: generateUnitsForProject('capri', 190, baseInfrastructure)
  },
  {
    id: 'langkawi',
    name: 'LANGKAWI',
    status: 'in-progress',
    progress: 35,
    totalUnits: 135,
    completedUnits: 47,
    targetCompletion: 'Sep 2025',
    currentPhase: 'Foundation & Structure',
    manager: 'Khalid Al-Rashid',
    location: 'Jabi District, Abuja, Nigeria',
    startDate: 'Dec 2023',
    budget: '₦12.8B',
    targetMilestone: 'Complete foundation work for all 130 units',
    activitiesInProgress: [
      'Foundation work for remaining 83 units',
      'Gym & Facility Office construction',
      'Site utilities installation',
      'Swimming pool excavation'
    ],
    completedActivities: [
      'Site preparation complete',
      'Phase 1 - 47 units foundation complete',
      'Gate House construction finished',
      'Access roads completed'
    ],
    challenges: [
      'Seasonal weather affecting concrete work',
      'Steel delivery scheduling coordination'
    ],
    progressImages: [],
    weeklyNotes: 'Foundation work proceeding well. Weather has been favorable.',
    monthlyNotes: 'Good progress on structural phase. No major issues reported.',
    units: generateUnitsForProject('langkawi', 130, baseInfrastructure)
  },
  {
    id: 'maldives',
    name: 'MALDIVES',
    status: 'in-progress',
    progress: 80,
    totalUnits: 24,
    completedUnits: 19,
    targetCompletion: 'Nov 2024',
    currentPhase: 'Interior Finishing',
    manager: 'Aisha Rahman',
    location: 'Utako District, Abuja, Nigeria',
    startDate: 'Feb 2023',
    budget: '₦2.8B',
    targetMilestone: 'Complete interior finishing for all 19 units',
    activitiesInProgress: [
      'Interior finishing final 5 units',
      'Swimming pool finishing touches',
      'Mosque interior completion',
      'Final landscaping works'
    ],
    completedActivities: [
      'All 19 residential units structural work complete',
      'Gym & Facility Office operational',
      'Gate House completed',
      'Road infrastructure finished',
      'First 14 units handed over'
    ],
    challenges: [
      'Premium fixture delivery delays',
      'Skilled finishing crew scheduling'
    ],
    progressImages: [],
    weeklyNotes: 'Interior work progressing well. Premium fixtures being installed.',
    monthlyNotes: 'Small development on track. Quality standards maintained.',
    units: generateUnitsForProject('maldives', 19, baseInfrastructure)
  },
  {
    id: 'mauritius',
    name: 'MAURITIUS',
    status: 'planning',
    progress: 25,
    totalUnits: 33,
    completedUnits: 0,
    targetCompletion: 'Aug 2026',
    currentPhase: 'Permits & Approvals',
    manager: 'Hassan Al-Mahmoud',
    location: 'Katampe Extension, Abuja, Nigeria',
    startDate: 'Sep 2024',
    budget: '₦5.2B',
    targetMilestone: 'Obtain permits and finalize luxury development design',
    activitiesInProgress: [
      'Building permit applications for 27 luxury units',
      'Mini golf course design approvals',
      'Environmental clearance process',
      'Luxury infrastructure detailed design'
    ],
    completedActivities: [
      'Land acquisition complete',
      'Master planning approved',
      'Soil investigation completed',
      'Preliminary luxury design approved'
    ],
    challenges: [
      'Complex regulatory approval for luxury development',
      'Mini golf course environmental compliance'
    ],
    progressImages: [],
    weeklyNotes: 'Luxury development permits under review. Mini golf design progressing.',
    monthlyNotes: 'High-end planning phase on schedule. Premium specifications finalized.',
    units: generateUnitsForProject('mauritius', 27, [...baseInfrastructure, 'Mini Golf Course'], true)
  },
  {
    id: 'seychelles',
    name: 'SEYCHELLES',
    status: 'in-progress',
    progress: 55,
    totalUnits: 13,
    completedUnits: 7,
    targetCompletion: 'Apr 2025',
    currentPhase: 'Envelope & MEP',
    manager: 'Maryam Al-Zahra',
    location: 'Gudu District, Abuja, Nigeria',
    startDate: 'Jun 2023',
    budget: '₦1.2B',
    targetMilestone: 'Complete building envelope for all 8 units',
    activitiesInProgress: [
      'MEP installation for remaining units',
      'Swimming pool construction',
      'Mosque MEP systems',
      'Landscaping preparation'
    ],
    completedActivities: [
      'All 8 residential units foundation complete',
      'Structural framework complete',
      'Gym & Facility Office envelope finished',
      'Gate House operational'
    ],
    challenges: [
      'Specialized trades coordination',
      'Equipment delivery scheduling'
    ],
    progressImages: [],
    weeklyNotes: 'Small development progressing steadily. MEP installation underway.',
    monthlyNotes: 'Compact project timeline achievable. Quality focus maintained.',
    units: generateUnitsForProject('seychelles', 8, baseInfrastructure)
  },
  {
    id: 'zanzibar',
    name: 'ZANZIBAR',
    status: 'near-completion',
    progress: 88,
    totalUnits: 32,
    completedUnits: 28,
    targetCompletion: 'Dec 2024',
    currentPhase: 'Final Phase Completion',
    manager: 'Abdullah Al-Rashid',
    location: 'Kado District, Abuja, Nigeria',
    startDate: 'Apr 2022',
    budget: '₦4.5B',
    targetMilestone: 'Complete final 4 luxury units and amenities',
    activitiesInProgress: [
      'Final 4 luxury units interior completion',
      'Swimming pool final commissioning',
      'Mosque blessing preparations',
      'Final landscaping phase'
    ],
    completedActivities: [
      'All 27 luxury units main construction completed',
      'Gym & Facility Office operational',
      'Gate House and security systems installed',
      'Road infrastructure and parking complete',
      'First 23 luxury units handed over'
    ],
    challenges: [
      'Final luxury finishes scheduling',
      'Premium landscape material availability'
    ],
    progressImages: [],
    weeklyNotes: 'Luxury development final phase. High-end finishes being completed.',
    monthlyNotes: 'Excellent luxury project nearing completion. Client expectations exceeded.',
    units: generateUnitsForProject('zanzibar', 27, baseInfrastructure, true)
  }
];
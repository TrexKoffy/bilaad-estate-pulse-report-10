import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { Project, Unit } from './projectData';

// Export project data as CSV
export const exportProjectToCSV = (project: Project): void => {
  const projectData = [
    {
      'Project Name': project.name,
      'Status': project.status,
      'Progress': `${project.progress}%`,
      'Location': project.location,
      'Manager': project.manager,
      'Start Date': project.startDate,
      'Target Completion': project.targetCompletion,
      'Current Phase': project.currentPhase,
      'Budget': project.budget,
      'Total Units': project.totalUnits,
      'Completed Units': project.completedUnits,
      'Target Milestone': project.targetMilestone,
      'Weekly Notes': project.weeklyNotes || '',
      'Monthly Notes': project.monthlyNotes || '',
      'Challenges': project.challenges?.join('; ') || '',
      'Completed Activities': project.completedActivities?.join('; ') || '',
      'Activities in Progress': project.activitiesInProgress?.join('; ') || ''
    }
  ];

  const csv = Papa.unparse(projectData);
  downloadFile(csv, `${project.name}_project_data.csv`, 'text/csv');
};

// Export units data as CSV
export const exportUnitsToCSV = (units: Unit[], projectName: string): void => {
  const unitsData = units.map(unit => ({
    'Unit Number': unit.unitNumber,
    'Type': unit.type,
    'Sub Type': unit.subType || '',
    'Bedrooms': unit.bedrooms || '',
    'Status': unit.status,
    'Progress': `${unit.progress}%`,
    'Target Completion': unit.targetCompletion,
    'Current Phase': unit.currentPhase,
    'Last Updated': unit.lastUpdated,
    'Activities': JSON.stringify(unit.activities),
    'Challenges': unit.challenges?.join('; ') || '',
    'Photos Count': unit.photos?.length || 0
  }));

  const csv = Papa.unparse(unitsData);
  downloadFile(csv, `${projectName}_units_data.csv`, 'text/csv');
};

// Export project data as PDF
export const exportProjectToPDF = (project: Project): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let y = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${project.name} Estate - Project Report`, pageWidth / 2, y, { align: 'center' });
  y += 20;

  // Project Information
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Information', 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const projectInfo = [
    `Status: ${project.status}`,
    `Progress: ${project.progress}%`,
    `Location: ${project.location}`,
    `Manager: ${project.manager}`,
    `Start Date: ${project.startDate}`,
    `Target Completion: ${project.targetCompletion}`,
    `Current Phase: ${project.currentPhase}`,
    `Budget: ${project.budget}`,
    `Total Units: ${project.totalUnits}`,
    `Completed Units: ${project.completedUnits}`
  ];

  projectInfo.forEach(info => {
    doc.text(info, 20, y);
    y += 7;
  });

  y += 10;

  // Target Milestone
  if (project.targetMilestone) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Target Milestone', 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const milestone = doc.splitTextToSize(project.targetMilestone, pageWidth - 40);
    doc.text(milestone, 20, y);
    y += milestone.length * 5 + 10;
  }

  // Weekly Notes
  if (project.weeklyNotes) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Notes', 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const weekly = doc.splitTextToSize(project.weeklyNotes, pageWidth - 40);
    doc.text(weekly, 20, y);
    y += weekly.length * 5 + 10;
  }

  // Check if we need a new page
  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  // Monthly Notes
  if (project.monthlyNotes) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Monthly Summary', 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const monthly = doc.splitTextToSize(project.monthlyNotes, pageWidth - 40);
    doc.text(monthly, 20, y);
    y += monthly.length * 5 + 10;
  }

  // Challenges
  if (project.challenges?.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Project Challenges', 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    project.challenges.forEach(challenge => {
      const challengeText = doc.splitTextToSize(`• ${challenge}`, pageWidth - 30);
      doc.text(challengeText, 25, y);
      y += challengeText.length * 5 + 3;
    });
  }

  doc.save(`${project.name}_project_report.pdf`);
};

// Export units data as PDF
export const exportUnitsToPDF = (units: Unit[], projectName: string): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let y = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${projectName} - Units Report`, pageWidth / 2, y, { align: 'center' });
  y += 20;

  units.forEach((unit, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Unit header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Unit ${unit.unitNumber} - ${unit.type}`, 20, y);
    y += 10;

    // Unit details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const unitInfo = [
      `Sub Type: ${unit.subType || 'N/A'}`,
      `Bedrooms: ${unit.bedrooms || 'N/A'}`,
      `Status: ${unit.status}`,
      `Progress: ${unit.progress}%`,
      `Target Completion: ${unit.targetCompletion}`,
      `Current Phase: ${unit.currentPhase}`,
      `Last Updated: ${unit.lastUpdated}`
    ];

    unitInfo.forEach(info => {
      doc.text(info, 25, y);
      y += 6;
    });

    // Challenges
    if (unit.challenges?.length > 0) {
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Challenges:', 25, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      unit.challenges.forEach(challenge => {
        const challengeText = doc.splitTextToSize(`• ${challenge}`, pageWidth - 40);
        doc.text(challengeText, 30, y);
        y += challengeText.length * 5;
      });
    }

    y += 10;
  });

  doc.save(`${projectName}_units_report.pdf`);
};

// Helper function to download files
const downloadFile = (content: string, filename: string, contentType: string): void => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
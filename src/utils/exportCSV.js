import Papa from 'papaparse';

/**
 * Export a single analysis to CSV
 * @param {Object} analysis - Analysis data with courseName and analysisResult
 * @param {string} fileName - Optional custom file name
 */
export const exportAnalysisToCSV = (analysis, fileName = null) => {
  if (!analysis || !analysis.analysisResult) {
    throw new Error('Invalid analysis data provided');
  }

  const { courseName, analysisResult, createdAt } = analysis;
  const finalFileName = fileName || `${courseName.replace(/\s+/g, '_')}_analysis.csv`;

  try {
    // Convert analysis to flat CSV structure
    const csvData = [
      ['Course Analysis Report'],
      ['Course Name', courseName],
      ['Generated Date', new Date(createdAt).toLocaleDateString()],
      ['Generated Time', new Date(createdAt).toLocaleTimeString()],
      [],
      ['METRICS'],
      ['Metric', 'Value'],
      ['Popularity Score', `${analysisResult.popularityScore || 'N/A'}/100`],
      ['Trending Score', `${analysisResult.trendingScore || 'N/A'}/100`],
      ['Market Demand', analysisResult.marketDemand || 'N/A'],
      ['Learning Difficulty', analysisResult.learningDifficulty || 'N/A'],
      ['Estimated Learning Time', analysisResult.estimatedLearningTime || 'N/A'],
      [],
      ['SALARY POTENTIAL'],
      ['Level', 'Annual Salary (USD)'],
      ['Entry Level', analysisResult.salaryPotential?.entry || 'N/A'],
      ['Mid Level', analysisResult.salaryPotential?.mid || 'N/A'],
      ['Experienced', analysisResult.salaryPotential?.experienced || 'N/A'],
      [],
      ['SUMMARY'],
      [analysisResult.summary || 'N/A'],
      [],
      ['REQUIRED SKILLS'],
      [
        Array.isArray(analysisResult.requiredSkills)
          ? analysisResult.requiredSkills.join('; ')
          : analysisResult.requiredSkills || 'N/A'
      ],
      [],
      ['JOB OPPORTUNITIES'],
      [analysisResult.jobOpportunities || 'N/A']
    ];

    const csv = Papa.unparse(csvData);
    downloadCSV(csv, finalFileName);

    return { success: true, fileName: finalFileName };
  } catch (error) {
    console.error('CSV export error:', error);
    throw new Error(`Failed to export CSV: ${error.message}`);
  }
};

/**
 * Export full history as CSV (tabular format)
 * @param {Array} history - Array of history items
 * @param {string} fileName - Optional custom file name
 */
export const exportHistoryToCSV = (history, fileName = 'course_history.csv') => {
  if (!Array.isArray(history) || history.length === 0) {
    throw new Error('Invalid history data provided');
  }

  try {
    // Create tabular CSV with one row per analysis
    const csvData = history.map((item) => ({
      'Course Name': item.courseName || 'N/A',
      'Date': new Date(item.createdAt).toLocaleDateString() || 'N/A',
      'Time': new Date(item.createdAt).toLocaleTimeString() || 'N/A',
      'Popularity Score': item.analysisResult?.popularityScore || 'N/A',
      'Trending Score': item.analysisResult?.trendingScore || 'N/A',
      'Market Demand': item.analysisResult?.marketDemand || 'N/A',
      'Difficulty': item.analysisResult?.learningDifficulty || 'N/A',
      'Entry Salary': item.analysisResult?.salaryPotential?.entry || 'N/A',
      'Mid Salary': item.analysisResult?.salaryPotential?.mid || 'N/A',
      'Experienced Salary': item.analysisResult?.salaryPotential?.experienced || 'N/A',
      'Learning Time': item.analysisResult?.estimatedLearningTime || 'N/A'
    }));

    const csv = Papa.unparse(csvData, {
      header: true,
      columns: [
        'Course Name',
        'Date',
        'Time',
        'Popularity Score',
        'Trending Score',
        'Market Demand',
        'Difficulty',
        'Entry Salary',
        'Mid Salary',
        'Experienced Salary',
        'Learning Time'
      ]
    });

    downloadCSV(csv, fileName);

    return { success: true, fileName, rowCount: history.length };
  } catch (error) {
    console.error('History CSV export error:', error);
    throw new Error(`Failed to export history: ${error.message}`);
  }
};

/**
 * Comparison CSV export
 * Used when exporting course comparisons
 * @param {Array} courses - Array of courses to compare
 * @param {string} fileName - Optional custom file name
 */
export const exportComparisonToCSV = (courses, fileName = 'course_comparison.csv') => {
  if (!Array.isArray(courses) || courses.length === 0) {
    throw new Error('Invalid courses data provided');
  }

  try {
    const csvData = courses.map((course) => ({
      'Course Name': course.name || 'N/A',
      'Rank': course.rank || 'N/A',
      'Score': course.overallScore || 'N/A',
      'Popularity': course.popularityScore || 'N/A',
      'Demand': course.marketDemand || 'N/A',
      'Trending': course.trendingScore || 'N/A',
      'Entry Salary': course.entryLevelSalary || 'N/A',
      'Mid Salary': course.midLevelSalary || 'N/A',
      'Experienced Salary': course.experiencedLevelSalary || 'N/A',
      'Difficulty': course.difficulty || 'N/A'
    }));

    const csv = Papa.unparse(csvData, {
      header: true,
      columns: [
        'Course Name',
        'Rank',
        'Score',
        'Popularity',
        'Demand',
        'Trending',
        'Entry Salary',
        'Mid Salary',
        'Experienced Salary',
        'Difficulty'
      ]
    });

    downloadCSV(csv, fileName);

    return { success: true, fileName, courseCount: courses.length };
  } catch (error) {
    console.error('Comparison CSV export error:', error);
    throw new Error(`Failed to export comparison: ${error.message}`);
  }
};

/**
 * Helper function to trigger CSV download
 * @param {string} csv - CSV content
 * @param {string} fileName - File name for download
 */
const downloadCSV = (csv, fileName) => {
  const element = document.createElement('a');
  const file = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
};

/**
 * Export utility info for debugging
 */
export const getExportInfo = () => {
  return {
    formats: ['CSV', 'PDF'],
    csvTypes: ['Individual Analysis', 'Full History', 'Comparison'],
    pdfTypes: ['Individual Analysis', 'Multiple Analyses'],
    library: 'papaparse v5.5.3 (CSV), jspdf v4.2.0 & html2canvas v1.4.1 (PDF)'
  };
};

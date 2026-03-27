/**
 * Utility functions for transforming and validating analysis data
 * for the AnalysisDashboard component
 */

/**
 * Transforms various data formats into the standard dashboard format
 * @param {any} data - Raw API response or analysis data
 * @returns {Object} Standardized analysis object
 */
export const transformAnalysisData = (data) => {
  if (!data) {
    return getDefaultAnalysis();
  }

  // If it's a string, try to parse as JSON
  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      console.warn('Could not parse data as JSON:', e);
      return getDefaultAnalysis();
    }
  }

  // Extract analysis object if wrapped
  const analysisObj = parsedData.analysis || parsedData;

  // Return with all fields, using defaults where missing
  return {
    courseName: analysisObj.courseName || 'Unknown Course',
    popularityScore: normalizeScore(analysisObj.popularityScore),
    marketDemand: normalizeMarketDemand(analysisObj.marketDemand),
    learningDifficulty: analysisObj.learningDifficulty || 'Intermediate',
    estimatedLearningTime: analysisObj.estimatedLearningTime || '3-6 months',
    summary: analysisObj.summary || '',
    salaryPotential: normalizeSalary(analysisObj.salaryPotential),
    source: parsedData.source || 'unknown',
    isCached: parsedData.isCached || false,
  };
};

/**
 * Gets default analysis object with sensible defaults
 * @returns {Object} Default analysis object
 */
export const getDefaultAnalysis = () => {
  return {
    courseName: 'Course Analysis',
    popularityScore: 50,
    marketDemand: 'Moderate',
    learningDifficulty: 'Intermediate',
    estimatedLearningTime: '3-6 months',
    summary: 'No analysis data available',
    salaryPotential: {
      entryLevel: 45,
      experienced: 100,
    },
    source: 'unknown',
    isCached: false,
  };
};

/**
 * Normalizes popularity score to 0-100 range
 * @param {any} score - Raw score value
 * @returns {number} Normalized score 0-100
 */
export const normalizeScore = (score) => {
  if (typeof score !== 'number') {
    return 50; // Default middle value
  }

  // If score is between 0-100, return as is
  if (score >= 0 && score <= 100) {
    return Math.round(score);
  }

  // If score > 100, assume it's a percentage (e.g., 8.5 = 85%)
  if (score > 0 && score < 10) {
    return Math.round(score * 10);
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, score));
};

/**
 * Normalizes market demand to standard values
 * @param {string} demand - Raw demand value
 * @returns {string} One of "High", "Moderate", "Low"
 */
export const normalizeMarketDemand = (demand) => {
  if (!demand) return 'Moderate';

  const str = String(demand).toLowerCase().trim();

  if (str.includes('high') || str === 'h') {
    return 'High';
  }
  if (str.includes('low') || str === 'l') {
    return 'Low';
  }

  return 'Moderate';
};

/**
 * Normalizes salary data
 * @param {Object} salary - Raw salary object
 * @returns {Object} Normalized salary with entryLevel and experienced
 */
export const normalizeSalary = (salary) => {
  const defaultSalary = {
    entryLevel: 45,
    experienced: 100,
  };

  if (!salary || typeof salary !== 'object') {
    return defaultSalary;
  }

  return {
    entryLevel: normalizeSalaryValue(salary.entryLevel, 45),
    experienced: normalizeSalaryValue(salary.experienced, 100),
  };
};

/**
 * Normalizes a single salary value to thousands (USD)
 * @param {any} value - Raw salary value
 * @param {number} defaultValue - Default if parsing fails
 * @returns {number} Salary in thousands
 */
export const normalizeSalaryValue = (value, defaultValue = 50) => {
  if (typeof value !== 'number') {
    return defaultValue;
  }

  // If value is very large (e.g., 65000), convert to thousands
  if (value > 1000) {
    return Math.round(value / 1000);
  }

  // If value is already in thousands, return as is
  return Math.round(value);
};

/**
 * Extracts learning difficulty from various formats
 * @param {any} difficulty - Raw difficulty value
 * @returns {string} Normalized difficulty level
 */
export const normalizeDifficulty = (difficulty) => {
  if (!difficulty) return 'Intermediate';

  const str = String(difficulty).toLowerCase().trim();

  if (str.includes('beginner') || str.includes('easy') || str === 'b') {
    return 'Beginner';
  }
  if (str.includes('advanced') || str.includes('expert') || str === 'a') {
    return 'Advanced';
  }
  if (str.includes('intermediate') || str === 'i') {
    return 'Intermediate';
  }

  // Default to what's provided if recognizable
  const formatted = str.charAt(0).toUpperCase() + str.slice(1);
  return ['Beginner', 'Intermediate', 'Advanced'].includes(formatted)
    ? formatted
    : 'Intermediate';
};

/**
 * Validates if analysis data has required fields for display
 * @param {Object} analysis - Analysis object
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateAnalysisData = (analysis) => {
  const errors = [];

  if (typeof analysis !== 'object') {
    errors.push('Analysis data must be an object');
    return { isValid: false, errors };
  }

  // Check for at least one meaningful field
  const hasScore = typeof analysis.popularityScore === 'number';
  const hasMarket = analysis.marketDemand !== undefined;
  const hasSummary = analysis.summary !== undefined;

  if (!hasScore && !hasMarket && !hasSummary) {
    errors.push('Analysis data missing required fields');
    return { isValid: false, errors };
  }

  return { isValid: true, errors: [] };
};

/**
 * Creates a color code based on popularity score
 * @param {number} score - Popularity score 0-100
 * @returns {string} Color category: 'excellent', 'good', 'moderate', 'low'
 */
export const getPopularityColorCategory = (score) => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'moderate';
  return 'low';
};

/**
 * Generates a brief interpretation of the popularity score
 * @param {number} score - Popularity score 0-100
 * @returns {string} Human-readable interpretation
 */
export const getPopularityInterpretation = (score) => {
  if (score >= 80) return '🟢 Excellent - Highly Popular';
  if (score >= 60) return '🟡 Good - Strong Interest';
  if (score >= 40) return '🟠 Moderate - Growing';
  return '🔴 Emerging - Niche Opportunity';
};

/**
 * Formats salary values for display
 * @param {number} salary - Salary in thousands
 * @returns {string} Formatted salary string
 */
export const formatSalary = (salary) => {
  if (!salary) return '$45k';
  return `$${Math.round(salary)}k`;
};

/**
 * Calculates salary growth percentage
 * @param {number} entry - Entry level salary in thousands
 * @param {number} senior - Senior level salary in thousands
 * @returns {number} Growth percentage
 */
export const calculateGrowthPercentage = (entry = 0, senior = 0) => {
  if (!entry || entry === 0) return 0;
  return Math.round(((senior - entry) / entry) * 100);
};

export default {
  transformAnalysisData,
  getDefaultAnalysis,
  normalizeScore,
  normalizeMarketDemand,
  normalizeSalary,
  normalizeSalaryValue,
  normalizeDifficulty,
  validateAnalysisData,
  getPopularityColorCategory,
  getPopularityInterpretation,
  formatSalary,
  calculateGrowthPercentage,
};

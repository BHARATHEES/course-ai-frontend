import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export a single course analysis to PDF
 * @param {Object} analysis - Analysis data with courseName and analysisResult
 * @param {string} fileName - Optional custom file name
 */
export const exportAnalysisToPDF = async (analysis, fileName = null) => {
  if (!analysis || !analysis.analysisResult) {
    throw new Error('Invalid analysis data provided');
  }

  const { courseName, analysisResult, createdAt } = analysis;
  const finalFileName = fileName || `${courseName.replace(/\s+/g, '_')}_analysis.pdf`;

  try {
    // Create a temporary div with analysis content
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.width = '210mm'; // A4 width
    element.style.background = 'white';
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.lineHeight = '1.6';
    element.style.color = '#333';

    // Build HTML content
    element.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h1 style="color: #1e293b; margin: 0 0 5px 0; font-size: 28px;">${courseName}</h1>
        <p style="color: #64748b; margin: 0; font-size: 12px;">
          Generated on ${new Date(createdAt).toLocaleDateString()} at ${new Date(createdAt).toLocaleTimeString()}
        </p>
      </div>

      <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 20px 0;" />

      <div style="margin: 20px 0;">
        <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 10px;">Analysis Metrics</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight: bold;">Popularity Score</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px;">${analysisResult.popularityScore || 'N/A'}/100</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight: bold;">Market Demand</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px;">${analysisResult.marketDemand || 'N/A'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight: bold;">Trending Score</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px;">${analysisResult.trendingScore || 'N/A'}/100</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight: bold;">Learning Difficulty</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px;">${analysisResult.learningDifficulty || 'N/A'}</td>
          </tr>
        </table>
      </div>

      <div style="margin: 20px 0;">
        <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 10px;">Salary Potential</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight: bold;">Entry Level</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px;">$${analysisResult.salaryPotential?.entry?.toLocaleString() || 'N/A'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight: bold;">Mid Level</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px;">$${analysisResult.salaryPotential?.mid?.toLocaleString() || 'N/A'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight: bold;">Experienced</td>
            <td style="border: 1px solid #e2e8f0; padding: 10px;">$${analysisResult.salaryPotential?.experienced?.toLocaleString() || 'N/A'}</td>
          </tr>
        </table>
      </div>

      <div style="margin: 20px 0;">
        <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 10px;">Summary</h2>
        <p style="font-size: 13px; white-space: pre-wrap;">${analysisResult.summary || 'No summary available'}</p>
      </div>

      <div style="margin: 20px 0;">
        <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 10px;">Required Skills</h2>
        <p style="font-size: 13px; white-space: pre-wrap;">${
          Array.isArray(analysisResult.requiredSkills)
            ? analysisResult.requiredSkills.join(', ')
            : analysisResult.requiredSkills || 'N/A'
        }</p>
      </div>

      <div style="margin: 20px 0;">
        <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 10px;">Job Opportunities</h2>
        <p style="font-size: 13px; white-space: pre-wrap;">${analysisResult.jobOpportunities || 'N/A'}</p>
      </div>

      <div style="margin: 20px 0;">
        <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 10px;">Estimated Learning Time</h2>
        <p style="font-size: 13px;">${analysisResult.estimatedLearningTime || 'N/A'}</p>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0; padding-top: 20px;">
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">
        Generated by AI-Driven Course Popularity Analyzer
      </p>
    `;

    document.body.appendChild(element);

    // Convert to canvas and then PDF
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // Add pages if content exceeds one page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // Save PDF
    pdf.save(finalFileName);

    // Cleanup
    document.body.removeChild(element);

    return { success: true, fileName: finalFileName };
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error(`Failed to export PDF: ${error.message}`);
  }
};

/**
 * Export multiple analyses as separate PDFs (zip recommended but not implemented)
 * @param {Array} analyses - Array of analysis objects
 */
export const exportMultipleAnalysesPDF = async (analyses) => {
  if (!Array.isArray(analyses) || analyses.length === 0) {
    throw new Error('Invalid analyses data provided');
  }

  try {
    for (const analysis of analyses) {
      await exportAnalysisToPDF(analysis);
      // Add delay between exports to prevent browser issues
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return { success: true, count: analyses.length };
  } catch (error) {
    console.error('Multiple PDF export error:', error);
    throw new Error(`Failed to export multiple PDFs: ${error.message}`);
  }
};

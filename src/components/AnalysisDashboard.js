import React, { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, DollarSign, Clock,
  CheckCircle, Zap, Settings2, AlertCircle, Rocket,
} from "lucide-react";
import {
  transformAnalysisData,
  getPopularityColorCategory,
  calculateGrowthPercentage,
} from "../utils/analysisTransform";
import "./AnalysisDashboard.css";

const LOADING_MESSAGES = [
  "🤖 Connecting to AI model…",
  "🔍 Analysing global job market trends…",
  "📊 Calculating popularity percentile…",
  "💰 Estimating salary trajectories…",
  "✨ Finalising your report…",
];

export default function AnalysisDashboard({ data, courseName, isLoading = false }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length), 2000);
    return () => clearInterval(t);
  }, [isLoading]);

  // ── Loading state ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="analysis-loading-container">
        <div className="loading-spinner">
          <Rocket size={48} className="loading-icon" />
        </div>
        <h3 className="loading-title">Real-Time AI Analysis</h3>
        <div className="loading-messages">
          {LOADING_MESSAGES.map((msg, i) => (
            <p key={i} className={`loading-message ${i === msgIdx ? "active" : ""}`}>{msg}</p>
          ))}
        </div>
        <div className="loading-dots">
          <span /><span /><span />
        </div>
      </div>
    );
  }

  if (!data) return null;

  // ── Extract the analysis object from various response shapes ────────────────
  const raw = data?.analysis || data;
  const analysis = transformAnalysisData(typeof raw === "object" ? raw : data);

  const {
    popularityScore = 0,
    marketDemand    = "Moderate",
    learningDifficulty    = "Intermediate",
    estimatedLearningTime = "3–6 months",
    summary = "",
    salaryPotential,
  } = analysis;

  const entry   = salaryPotential?.entryLevel  || 45;
  const senior  = salaryPotential?.experienced || 100;
  const growth  = calculateGrowthPercentage(entry, senior);
  const popColor = getPopularityColorCategory(popularityScore);
  const source   = data?.source   || "";
  const isCached = data?.isCached || false;

  return (
    <div className="analysis-dashboard">
      {/* Header */}
      <div className="analysis-header">
        <div className="header-content">
          <h2 className="course-title">{courseName}</h2>
          <div className="badge-group">
            <span className="ai-badge">
              <CheckCircle size={14} /> Real-Time AI Insights
            </span>
            {source && source !== "cache" && source !== "demo" && (
              <span className="source-badge huggingface">🔥 Live AI</span>
            )}
            {isCached && <span className="source-badge cached">⚡ Cached</span>}
            {source === "demo" && <span className="source-badge" style={{ background: "rgba(245,158,11,0.12)", border: "1.5px solid #f59e0b", color: "#d97706" }}>📊 Sample</span>}
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="metrics-grid">
        {/* Popularity */}
        <div className={`stat-card popularity-card ${popColor}`}>
          <div className="card-header">
            <BarChart3 size={24} className="card-icon" />
            <h3>Popularity Score</h3>
          </div>
          <div className="circular-gauge-container">
            <div className="circular-gauge" style={{
              background: `conic-gradient(from 0deg,var(--gauge-accent) 0deg,var(--gauge-accent) ${(popularityScore / 100) * 360}deg,#e5e7eb ${(popularityScore / 100) * 360}deg,#e5e7eb 360deg)`,
            }}>
              <div className="gauge-inner">
                <div className="gauge-value">{popularityScore}%</div>
                <div className="gauge-label">Score</div>
              </div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${popularityScore}%` }} />
          </div>
          <p className="score-interpretation">
            {popularityScore >= 80 && "🟢 Excellent – Highly Popular"}
            {popularityScore >= 60 && popularityScore < 80 && "🟡 Good – Strong Interest"}
            {popularityScore >= 40 && popularityScore < 60 && "🟠 Moderate – Growing"}
            {popularityScore < 40  && "🔴 Emerging – Niche Opportunity"}
          </p>
        </div>

        {/* Market demand */}
        <div className="stat-card demand-card">
          <div className="card-header">
            <TrendingUp size={24} className="card-icon" />
            <h3>Market Demand</h3>
          </div>
          <div className="demand-badge">
            {marketDemand === "High" && (
              <><Zap size={32} className="demand-icon high" />
                <div className="demand-text"><div className="demand-value">HIGH</div><div className="demand-subtitle">Strong Growth</div></div></>
            )}
            {marketDemand === "Moderate" && (
              <><TrendingUp size={32} className="demand-icon moderate" />
                <div className="demand-text"><div className="demand-value">MODERATE</div><div className="demand-subtitle">Stable Interest</div></div></>
            )}
            {(marketDemand === "Low" || (marketDemand !== "High" && marketDemand !== "Moderate")) && (
              <><AlertCircle size={32} className="demand-icon low" />
                <div className="demand-text"><div className="demand-value">LOW</div><div className="demand-subtitle">Niche Market</div></div></>
            )}
          </div>
        </div>

        {/* Salary */}
        <div className="stat-card salary-card">
          <div className="card-header">
            <DollarSign size={24} className="card-icon" />
            <h3>Salary Potential</h3>
          </div>
          <div className="salary-comparison">
            <div className="salary-level">
              <div className="salary-label">Entry Level</div>
              <div className="salary-amount">${entry}k</div>
              <div className="salary-description">Year 1–2</div>
            </div>
            <div className="salary-divider">→</div>
            <div className="salary-level">
              <div className="salary-label">Senior Level</div>
              <div className="salary-amount">${senior}k</div>
              <div className="salary-description">5+ Years</div>
            </div>
          </div>
          <div className="salary-range-bar">
            <div className="range-track"><div className="range-fill" /></div>
            <p className="salary-growth"><strong>Growth Potential:</strong> +{growth}%</p>
          </div>
        </div>
      </div>

      {/* Key insights */}
      <div className="insights-section">
        <h3 className="insights-title"><Settings2 size={20} /> Key Insights</h3>
        <div className="insights-badges">
          <div className="insight-badge difficulty">
            <span className="badge-icon">📚</span>
            <div className="badge-content">
              <div className="badge-label">Learning Difficulty</div>
              <div className="badge-value">{learningDifficulty}</div>
            </div>
          </div>
          <div className="insight-badge time">
            <span className="badge-icon">⏱️</span>
            <div className="badge-content">
              <div className="badge-label">Learning Time</div>
              <div className="badge-value">{estimatedLearningTime}</div>
            </div>
          </div>
          <div className="insight-badge demand">
            <span className="badge-icon">📈</span>
            <div className="badge-content">
              <div className="badge-label">Market Trend</div>
              <div className="badge-value">{marketDemand}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="summary-section">
          <h3 className="summary-title"><Clock size={20} /> Analysis Summary</h3>
          <p className="summary-text">{summary}</p>
        </div>
      )}
    </div>
  );
}

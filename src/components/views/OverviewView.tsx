import React, { useState } from "react";
import {
  FileSpreadsheet,
  Printer,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Bot,
  Layers,
  FileText,
  Mic,
  Trash2,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Activity,
  ArrowDownRight,
  Volume2,
  Download,
  Loader2,
} from "lucide-react";
import { MetricCards } from "../MetricCards";
import { GrowthHeatmap } from "../GrowthHeatmap";
import { SEOTrendRadar } from "../SEOTrendRadar";
import { KeywordVolumeHeatmap } from "../KeywordVolumeHeatmap";
import { CampaignImpactTrendChart } from "../CampaignImpactTrendChart";
import { PredictiveImpactForecast } from "../PredictiveImpactForecast";
import { KeywordItem, CompetitorItem, CampaignLogItem, NavigationTab } from "../../types";
import { exportElementToPdf } from "../../services/pdfExportService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface OverviewViewProps {
  keywords: KeywordItem[];
  competitors: CompetitorItem[];
  campaignLogs: CampaignLogItem[];
  onDeleteLog: (id: string) => void;
  onOpenAddModal: () => void;
  onExportCsv: () => void;
  onDownloadPdf: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

const TRAFFIC_DATA = [
  { month: "Mar 2026", organic: 82000, aiOverviews: 12000 },
  { month: "Apr 2026", organic: 96000, aiOverviews: 24000 },
  { month: "May 2026", organic: 112000, aiOverviews: 45000 },
  { month: "Jun 2026", organic: 124000, aiOverviews: 68000 },
  { month: "Jul 2026", organic: 135000, aiOverviews: 92000 },
  { month: "Aug 2026", organic: 148650, aiOverviews: 118400 },
];

const INTENT_DISTRIBUTION = [
  { intent: "Informational", count: 16 },
  { intent: "Commercial", count: 11 },
  { intent: "Transactional", count: 6 },
  { intent: "Navigational", count: 2 },
];

export const OverviewView: React.FC<OverviewViewProps> = ({
  keywords,
  competitors,
  campaignLogs,
  onDeleteLog,
  onOpenAddModal,
  onExportCsv,
  onDownloadPdf,
  onNavigate,
}) => {
  const [isExportingDirectPdf, setIsExportingDirectPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);

  const topRankingsCount = keywords.filter((k) => k.currentRank <= 3).length;

  const topKeywordNodes = [
    { keyword: "AI Marketing Future", rank: "#1", trend: "Stable", trendType: "stable", intent: "INFORMATIONAL", intentClass: "bg-blue-50 text-blue-700" },
    { keyword: "Best SEO Agency 2026", rank: "#3", trend: "↑ 2", trendType: "up", intent: "TRANSACTIONAL", intentClass: "bg-purple-50 text-purple-700" },
    { keyword: "Natural Language Search", rank: "#2", trend: "↓ 1", trendType: "down", intent: "INFORMATIONAL", intentClass: "bg-blue-50 text-blue-700" },
    { keyword: "Google AI Update Logs", rank: "#5", trend: "↑ 12", trendType: "up", intent: "NAVIGATIONAL", intentClass: "bg-green-50 text-green-700" },
    { keyword: "Voice Search Optimization", rank: "#1", trend: "↑ 4", trendType: "up", intent: "COMMERCIAL", intentClass: "bg-amber-50 text-amber-700" },
  ];

  // Direct export of current Overview dashboard to PDF via jsPDF & html2canvas
  const handleSaveDashboardAsPdf = async () => {
    setIsExportingDirectPdf(true);
    setPdfStatus("Rendering high-res dashboard snapshot...");
    try {
      const result = await exportElementToPdf("overview-dashboard-view", {
        filename: `OmniRank_SEO_Overview_Dashboard_${new Date().toISOString().slice(0, 10)}.pdf`,
        onProgress: (msg) => setPdfStatus(msg),
      });
      if (result.success) {
        setPdfStatus("Downloaded successfully!");
        setTimeout(() => setPdfStatus(null), 3000);
      } else {
        setPdfStatus(`Export failed: ${result.error}`);
        setTimeout(() => setPdfStatus(null), 4000);
      }
    } catch (err: any) {
      setPdfStatus(`Export error: ${err.message}`);
      setTimeout(() => setPdfStatus(null), 4000);
    } finally {
      setIsExportingDirectPdf(false);
    }
  };

  return (
    <div id="overview-dashboard-view" className="space-y-6">
      {/* Top Quick Actions Bar */}
      <div className="bg-white dark:bg-[#0b170b] p-4 rounded-xl border border-gray-200 dark:border-green-950/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#004d00]/10 dark:bg-[#004d00]/40 text-[#004d00] dark:text-[#ffa500]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Executive Overview & SGE Intelligence</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Live 2026 Q3 Sync
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {pdfStatus || "Instant vector analytics, ranking momentum, and compound impact trajectory."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Direct PDF Download using jsPDF-html2canvas */}
          <button
            id="overview-save-pdf-btn"
            onClick={handleSaveDashboardAsPdf}
            disabled={isExportingDirectPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#ffa500] hover:brightness-110 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95"
            title="Save the current Overview dashboard view directly as a formatted PDF"
          >
            {isExportingDirectPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
            ) : (
              <Download className="w-3.5 h-3.5 text-slate-950" />
            )}
            <span>{isExportingDirectPdf ? "Generating PDF..." : "Save Overview as PDF"}</span>
          </button>

          {/* Printable Report Snapshot Modal */}
          <button
            id="overview-printable-snapshot-btn"
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-green-950/80 bg-gray-50 dark:bg-[#060e06] hover:bg-gray-100 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Executive Report</span>
          </button>

          {/* CSV Export */}
          <button
            id="overview-export-csv-btn"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-green-950/80 bg-gray-50 dark:bg-[#060e06] hover:bg-gray-100 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      {/* 4 Metric Cards */}
      <MetricCards
        onDownloadPdf={onDownloadPdf}
        totalKeywords={keywords.length}
        topRankingsCount={topRankingsCount}
      />

      {/* D3 SEO Trend & Ranking Volatility Radar */}
      <SEOTrendRadar
        keywords={keywords}
        competitors={competitors}
        onSelectKeyword={() => onNavigate("keywords")}
      />

      {/* Main Analysis Grid: 2 cols Table + 1 col Audio Transcription */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SEO Strategy Node Analysis Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
              <svg width="18" height="18" fill="#004d00" viewBox="0 0 24 24">
                <path d="M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z" />
              </svg>
              SEO Strategy Node Analysis
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={onExportCsv}
                className="text-[#004d00] text-[11px] font-bold uppercase hover:underline"
              >
                Export CSV
              </button>
              <button
                onClick={() => onNavigate("keywords")}
                className="text-xs text-gray-500 hover:text-gray-900 font-medium"
              >
                View all 35 →
              </button>
            </div>
          </div>

          <div className="flex-1 p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 shadow-sm">
                <tr className="text-[11px] text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-3 font-semibold">Keyword Focus</th>
                  <th className="px-6 py-3 font-semibold">Rank</th>
                  <th className="px-6 py-3 font-semibold">Trend</th>
                  <th className="px-6 py-3 font-semibold">NLP Intent</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {topKeywordNodes.map((node, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900">{node.keyword}</td>
                    <td className="px-6 py-3.5 font-bold text-gray-800">{node.rank}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`font-semibold text-xs ${
                          node.trendType === "up" || node.trend === "Stable"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {node.trend}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${node.intentClass}`}>
                        {node.intent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Live Audio Transcription Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-[#004d00]">
            <h3 className="font-bold text-white flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#ffa500]" />
                Live Audio Transcription
              </span>
              <span className="w-2 h-2 rounded-full bg-[#ffa500] animate-pulse" />
            </h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 min-h-[220px]">
            <div className="flex gap-2.5 items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-[10px] text-white flex items-center justify-center font-bold shrink-0">
                01
              </div>
              <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-lg shadow-sm border border-gray-200 italic">
                "We need to pivot the Q4 strategy to focus on Featured Snippets for our local citations..."
              </p>
            </div>

            <div className="flex gap-2.5 items-start">
              <div className="w-6 h-6 rounded-full bg-green-600 text-[10px] text-white flex items-center justify-center font-bold shrink-0">
                02
              </div>
              <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-lg shadow-sm border border-gray-200 italic">
                "Agreed. The Google SGE update is prioritizing the EEAT content nodes more heavily now."
              </p>
            </div>

            <div className="flex gap-2.5 items-start opacity-60">
              <div className="w-6 h-6 rounded-full bg-gray-400 text-[10px] text-white flex items-center justify-center font-bold shrink-0">
                ..
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 w-full space-y-1.5">
                <div className="h-2 w-32 bg-gray-300 rounded animate-pulse" />
                <div className="h-2 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <button
              onClick={() => onNavigate("audio-transcriber")}
              className="w-full border-2 border-dashed border-gray-300 py-2.5 rounded-lg text-xs font-bold text-gray-500 hover:border-[#ffa500] hover:text-[#ffa500] transition-colors"
            >
              JUMP TO TIMESTAMP
            </button>
          </div>
        </div>
      </div>

      {/* Visual Growth Heatmap & Algorithm Update Impact Matrix */}
      <GrowthHeatmap />

      {/* Recharts Keyword Search Volume Heatmap & 30-Day Traffic Trajectory */}
      <KeywordVolumeHeatmap
        keywords={keywords}
        onNavigateToKeywords={() => onNavigate("keywords")}
      />

      {/* Traffic Charts & Intent Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organic vs AI Overviews Traffic Growth Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#004d00]" />
                Organic Traffic & Google AI Overviews Capture (2026)
              </h3>
              <p className="text-xs text-gray-500">
                Monthly trajectory showing traditional organic sessions vs direct AI Overview citations.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#004d00]">
                <span className="w-3 h-3 rounded-full bg-[#004d00] inline-block" /> Total Organic
              </span>
              <span className="flex items-center gap-1.5 text-[#ffa500]">
                <span className="w-3 h-3 rounded-full bg-[#ffa500] inline-block" /> AI Overviews
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004d00" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#004d00" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffa500" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#ffa500" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#003300",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #004d00",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="organic"
                  stroke="#004d00"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorOrganic)"
                />
                <Area
                  type="monotone"
                  dataKey="aiOverviews"
                  stroke="#ffa500"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAi)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 35-Keyword Intent Distribution Bar Chart */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#ffa500]" />
              Keyword Intent Distribution
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Intent-mapped across all 35 tracked target phrases.
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INTENT_DISTRIBUTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="intent" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#003300",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="count" fill="#004d00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-green-50 text-[#004d00] font-semibold flex items-center justify-between">
              <span>Top 3 Ranks</span>
              <strong className="text-amber-700 font-mono text-sm">{topRankingsCount}</strong>
            </div>
            <div className="p-2 rounded bg-gray-50 text-gray-800 font-semibold flex items-center justify-between">
              <span>Total Tracked</span>
              <strong className="font-mono text-sm">{keywords.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Deliverable Pillars Grid & Direct Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate("keywords")}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#004d00] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#004d00] bg-green-50 px-2 py-0.5 rounded">
              Keyword Research
            </span>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#ffa500] transition-colors" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-1">35 Target Keywords</div>
          <p className="text-xs text-gray-500">
            Natural language processing, voice search, and predictive search intent mapping.
          </p>
        </div>

        <div
          onClick={() => onNavigate("initial-audit")}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#004d00] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Audit & Setup
            </span>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#ffa500] transition-colors" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-1">10-Competitor Matrix</div>
          <p className="text-xs text-gray-500">
            Website analysis, backlink health, Google Analytics 4, and conversion tracking.
          </p>
        </div>

        <div
          onClick={() => onNavigate("content-marketing")}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#004d00] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#004d00] bg-green-50 px-2 py-0.5 rounded">
              Content Strategy & PR
            </span>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#ffa500] transition-colors" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-1">4 Blogs / 2 PRs</div>
          <p className="text-xs text-gray-500">
            4 guest posts, 8 info pieces, GBP optimization, citations, and 7 business profiles.
          </p>
        </div>

        <div
          onClick={() => onNavigate("a2a-judge")}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-[#004d00] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              A2A Judge Agent
            </span>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#ffa500] transition-colors" />
          </div>
          <div className="text-lg font-bold text-gray-900 mb-1">Dual Agent Core</div>
          <p className="text-xs text-gray-500">
            Adversarial prompt generator, EEAT scoring, self-maintenance, and automated error removal.
          </p>
        </div>
      </div>

      {/* Recharts Campaign Impact Trend Analysis Line Chart */}
      <CampaignImpactTrendChart
        campaignLogs={campaignLogs}
        onOpenAddModal={onOpenAddModal}
      />

      {/* Predictive AI Forecasting Model (30-Day Regression Analysis) */}
      <PredictiveImpactForecast
        campaignLogs={campaignLogs}
        currentOverallScore={91}
      />

      {/* Campaign Event Logs & Activity Ledger */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#004d00]" />
              Live Campaign Event Ledger & Execution Logs
            </h3>
            <p className="text-xs text-gray-500">
              Synchronized events with timestamp tracking and impact evaluations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950" />
              <span>+ Add Event Log</span>
            </button>
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors border border-gray-200"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#004d00]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Category</th>
                <th className="p-3">Event Description</th>
                <th className="p-3">Impact</th>
                <th className="p-3">Executor</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {campaignLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-green-50 text-[#004d00]">
                      {log.category}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-900">{log.event}</td>
                  <td className="p-3">
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                      {log.impactScore}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">{log.user}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete log record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom System Status Bar */}
      <div className="h-12 flex items-center justify-between px-6 bg-white border border-gray-200 rounded-lg shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <span className="text-[11px] font-bold text-gray-400">
            SYSTEM STATUS: <span className="text-green-600 font-bold">OPTIMIZED</span>
          </span>
          <span className="text-[11px] font-bold text-gray-400">
            DATE: <span className="text-gray-700 uppercase">Oct 24, 2026</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Encryption Active: AES-256
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  TrendingUp,
  Download,
  Filter,
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  BarChart3,
  SlidersHorizontal,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Building2,
  FileSpreadsheet,
  Archive,
  ArchiveRestore,
  Activity,
  ExternalLink,
  Loader2,
  X,
  Radio,
  Flame,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { KeywordItem, GoogleTrendsResult, GroundingSource } from "../../types";
import {
  executeKeywordResearch,
  analyzeCompetitorKeywords,
  fetchGoogleTrends,
  PredictiveKeywordItem,
  CompetitorKeywordAnalysis,
} from "../../services/api";
import { calculateTrafficProjection } from "../../services/marketShiftService";
import {
  BulkOperationConfirmModal,
  BulkActionType,
} from "../common/BulkOperationConfirmModal";

interface KeywordMatrixViewProps {
  keywords: KeywordItem[];
  onAddKeyword: (kw: KeywordItem) => void;
  onDeleteKeyword: (id: string) => void;
  onToggleArchiveKeyword?: (id: string) => void;
  onOpenAddModal: () => void;
}

// Sparkline helper to generate a visually representative 12-month curve
function generateKeywordSparklineData(keyword: KeywordItem) {
  const baseScore = Math.max(25, Math.min(85, Math.round(keyword.searchVolume / 180) + (100 - keyword.currentRank * 7)));
  const points = [];
  for (let i = 0; i < 12; i++) {
    const progress = i / 11;
    const noise = Math.sin(i * 1.3) * 6;
    // upward growth bias matching 2026 AI SEO expansion
    const val = Math.min(100, Math.max(15, Math.round(baseScore * (0.55 + progress * 0.55) + noise)));
    points.push({ idx: i, val });
  }
  return points;
}

export const KeywordMatrixView: React.FC<KeywordMatrixViewProps> = ({
  keywords,
  onAddKeyword,
  onDeleteKeyword,
  onToggleArchiveKeyword,
  onOpenAddModal,
}) => {
  const [activeTab, setActiveTab] = useState<"matrix" | "trends" | "research" | "competitor">("matrix");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<string>("All");
  const [selectedIntent, setSelectedIntent] = useState<string>("All");
  const [archiveFilter, setArchiveFilter] = useState<"active" | "archived" | "all">("active");
  const [copiedData, setCopiedData] = useState(false);

  // Google Trends Grounding States
  const [trendSearchTerm, setTrendSearchTerm] = useState("AI Search Optimization");
  const [selectedTrendResult, setSelectedTrendResult] = useState<GoogleTrendsResult | null>(null);
  const [trendSources, setTrendSources] = useState<GroundingSource[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [isTrendsModalOpen, setIsTrendsModalOpen] = useState(false);
  const [copiedTrendsReport, setCopiedTrendsReport] = useState(false);

  // AI Keyword Research States
  const [seedKeyword, setSeedKeyword] = useState("AI Search Optimization");
  const [industryNiche, setIndustryNiche] = useState("B2B SaaS & Digital Marketing Agency");
  const [targetIntent, setTargetIntent] = useState("All");
  const [targetCountry, setTargetCountry] = useState("United States (Global)");
  const [isResearching, setIsResearching] = useState(false);
  const [researchKeywords, setResearchKeywords] = useState<PredictiveKeywordItem[]>([]);
  const [addedKeywordIds, setAddedKeywordIds] = useState<Set<string>>(new Set());

  // Competitor Keyword Strategy States
  const [competitorDomain, setCompetitorDomain] = useState("omnirank-digital.com");
  const [isAnalyzingCompetitor, setIsAnalyzingCompetitor] = useState(false);
  const [competitorResult, setCompetitorResult] = useState<CompetitorKeywordAnalysis | null>(null);

  // Bulk Operations State & Modal Safeguard
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<Set<string>>(new Set());
  const [bulkModalState, setBulkModalState] = useState<{
    isOpen: boolean;
    actionType: BulkActionType;
    ids: string[];
  }>({
    isOpen: false,
    actionType: "delete",
    ids: [],
  });
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Toggle selection for a single keyword
  const handleToggleSelectKeyword = (id: string) => {
    setSelectedKeywordIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle select all filtered keywords
  const handleToggleSelectAllFiltered = () => {
    if (selectedKeywordIds.size === filteredKeywords.length && filteredKeywords.length > 0) {
      setSelectedKeywordIds(new Set());
    } else {
      setSelectedKeywordIds(new Set(filteredKeywords.map((k) => k.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedKeywordIds(new Set());
  };

  // Open Bulk Delete Dialog
  const handlePromptBulkDelete = (customIds?: string[]) => {
    const idsToTarget = customIds || Array.from(selectedKeywordIds);
    if (idsToTarget.length === 0) return;
    setBulkModalState({
      isOpen: true,
      actionType: "delete",
      ids: idsToTarget,
    });
  };

  // Open Bulk Archive Dialog
  const handlePromptBulkArchive = (actionType: "archive" | "unarchive", customIds?: string[]) => {
    const idsToTarget = customIds || Array.from(selectedKeywordIds);
    if (idsToTarget.length === 0) return;
    setBulkModalState({
      isOpen: true,
      actionType,
      ids: idsToTarget,
    });
  };

  // Execute confirmed bulk operation
  const handleConfirmBulkAction = () => {
    setIsBulkProcessing(true);
    const { actionType, ids } = bulkModalState;

    try {
      if (actionType === "delete") {
        ids.forEach((id) => {
          onDeleteKeyword(id);
        });
      } else if (actionType === "archive" || actionType === "unarchive") {
        if (onToggleArchiveKeyword) {
          ids.forEach((id) => {
            onToggleArchiveKeyword(id);
          });
        }
      }
      setSelectedKeywordIds(new Set());
      setBulkModalState({ isOpen: false, actionType: "delete", ids: [] });
    } catch (err) {
      console.error("Bulk action failed:", err);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Bulk Export Selected to CSV
  const handleExportSelectedCSV = () => {
    const targetKeywords = filteredKeywords.filter((k) => selectedKeywordIds.has(k.id));
    if (targetKeywords.length === 0) return;

    const headers = [
      "Keyword",
      "Cluster",
      "Intent",
      "Search Volume",
      "Difficulty",
      "CPC",
      "Current Rank",
      "Traffic Projection (vis/mo)",
      "Previous Rank",
      "AI Overview Prob",
      "Status",
      "Archived",
    ];
    const rows = targetKeywords.map((k) => [
      `"${k.keyword.replace(/"/g, '""')}"`,
      `"${k.cluster}"`,
      `"${k.intent}"`,
      k.searchVolume,
      k.difficulty,
      k.cpc,
      k.currentRank,
      calculateTrafficProjection(k.searchVolume, k.currentRank, k.aiOverviewProbability),
      k.previousRank,
      `${k.aiOverviewProbability}%`,
      `"${k.status}"`,
      k.archived ? "Yes" : "No",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Keywords_Selected_${targetKeywords.length}_Terms_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clusters list
  const clusters = Array.from(new Set(keywords.map((k) => k.cluster)));

  // Counts
  const activeCount = keywords.filter((k) => !k.archived).length;
  const archivedCount = keywords.filter((k) => !!k.archived).length;

  // Filtered Matrix Keywords
  const filteredKeywords = keywords.filter((k) => {
    const isArchived = !!k.archived;
    if (archiveFilter === "active" && isArchived) return false;
    if (archiveFilter === "archived" && !isArchived) return false;

    const matchesSearch =
      k.keyword.toLowerCase().includes(searchFilter.toLowerCase()) ||
      k.cluster.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCluster =
      selectedCluster === "All" || k.cluster === selectedCluster;
    const matchesIntent =
      selectedIntent === "All" || k.intent === selectedIntent;
    return matchesSearch && matchesCluster && matchesIntent;
  });

  // Calculate Metrics
  const totalVolume = keywords.reduce((sum, k) => sum + k.searchVolume, 0);
  const totalProjectedTraffic = keywords
    .filter((k) => !k.archived)
    .reduce((sum, kw) => sum + calculateTrafficProjection(kw.searchVolume, kw.currentRank, kw.aiOverviewProbability), 0);
  const avgDifficulty = Math.round(
    keywords.reduce((sum, k) => sum + k.difficulty, 0) / (keywords.length || 1)
  );
  const avgAiOverviewProb = Math.round(
    keywords.reduce((sum, k) => sum + k.aiOverviewProbability, 0) / (keywords.length || 1)
  );
  const top3Rankings = keywords.filter((k) => k.currentRank <= 3).length;

  // Fetch Google Trends with Google Search Grounding
  const handleFetchTrends = async (keywordQuery: string, openModal = true) => {
    const term = keywordQuery.trim() || trendSearchTerm;
    setTrendSearchTerm(term);
    setIsLoadingTrends(true);
    if (openModal) {
      setIsTrendsModalOpen(true);
    }

    try {
      const res = await fetchGoogleTrends({ keyword: term });
      setSelectedTrendResult(res.data);
      setTrendSources(res.sources);
    } catch (err) {
      console.error("Trends fetch failed:", err);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  // Run Keyword Research
  const handleExecuteResearch = async () => {
    setIsResearching(true);
    try {
      const res = await executeKeywordResearch({
        seedKeyword,
        industry: industryNiche,
        targetAudience: targetIntent,
      });
      setResearchKeywords(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsResearching(false);
    }
  };

  // Run Competitor Analysis
  const handleAnalyzeCompetitor = async () => {
    setIsAnalyzingCompetitor(true);
    try {
      const res = await analyzeCompetitorKeywords({
        competitorDomain,
        yourNiche: industryNiche,
      });
      setCompetitorResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingCompetitor(false);
    }
  };

  // Add individual research keyword to matrix
  const handleAddResearchKeyword = (kw: PredictiveKeywordItem) => {
    const newItem: KeywordItem = {
      id: `kw-gen-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      keyword: kw.keyword,
      searchVolume: kw.searchVolume,
      difficulty: kw.difficulty,
      cpc: kw.cpc,
      currentRank: Math.floor(Math.random() * 8) + 1,
      previousRank: Math.floor(Math.random() * 15) + 5,
      intent: kw.intent,
      aiOverviewProbability: kw.aiOverviewProbability,
      serpFeatures: ["AI Overview", "Featured Snippet"],
      cluster: kw.cluster,
      dateAdded: "2026-08-24",
      status: "Top 10",
    };
    onAddKeyword(newItem);
    setAddedKeywordIds((prev) => new Set(prev).add(kw.keyword));
  };

  // Copy Trends Report
  const handleCopyTrendsSummary = () => {
    if (!selectedTrendResult) return;
    const summary = `GOOGLE TRENDS SEARCH INTELLIGENCE REPORT: ${selectedTrendResult.keyword}
Interest Index: ${selectedTrendResult.currentInterestScore}/100 | Trajectory: ${selectedTrendResult.trendTrajectory} (${selectedTrendResult.growthRateYoY})
Peak Month: ${selectedTrendResult.peakMonth}
Breakout Queries: ${selectedTrendResult.breakoutQueries.map((b) => `${b.query} (${b.growth})`).join(", ")}
AI Search Context: ${selectedTrendResult.aiSearchContext}
Key Actionable Takeaway: ${selectedTrendResult.actionableTakeaway}`;
    navigator.clipboard.writeText(summary);
    setCopiedTrendsReport(true);
    setTimeout(() => setCopiedTrendsReport(false), 2000);
  };

  // Bulk add all research keywords
  const handleBulkAddResearch = () => {
    researchKeywords.forEach((kw) => {
      if (!addedKeywordIds.has(kw.keyword)) {
        handleAddResearchKeyword(kw);
      }
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Keyword", "Cluster", "Intent", "Search Volume", "Difficulty", "CPC", "Current Rank", "Traffic Projection (vis/mo)", "Previous Rank", "AI Overview Prob", "Status", "Archived"];
    const rows = filteredKeywords.map((k) => [
      `"${k.keyword.replace(/"/g, '""')}"`,
      `"${k.cluster}"`,
      `"${k.intent}"`,
      k.searchVolume,
      k.difficulty,
      k.cpc,
      k.currentRank,
      calculateTrafficProjection(k.searchVolume, k.currentRank, k.aiOverviewProbability),
      k.previousRank,
      `${k.aiOverviewProbability}%`,
      `"${k.status}"`,
      k.archived ? "Yes" : "No",
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Keywords_Matrix_35_Terms_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredKeywords, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Keywords_Matrix_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="keyword-matrix-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#004d00] rounded-xl p-6 text-white border border-[#003300] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#003300] text-[11px] text-[#ffa500] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#ffa500]" />
            AI Predictive Keyword Matrix & Google Search Trends Grounding
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI-Powered Keyword Research & Matrix ({keywords.length} Target Keywords)
          </h1>
          <p className="text-xs text-green-100 max-w-2xl">
            Track conversational search volume, difficulty, AI Overview probability, live Google Trends interest trajectories with Google Search Grounding powered by Gemini 3.7 Flash.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#003300] p-1.5 rounded-lg border border-[#002800] text-xs">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "matrix"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Core 35 Matrix ({keywords.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("trends");
              if (!selectedTrendResult) {
                handleFetchTrends(keywords[0]?.keyword || "AI Search Optimization", false);
              }
            }}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "trends"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Google Trends Intel</span>
            <span className="px-1.5 py-0.2 text-[9px] font-black rounded bg-orange-500/20 text-[#ffa500] border border-orange-400/30">
              Live
            </span>
          </button>
          <button
            onClick={() => setActiveTab("research")}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "research"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Predictive Generator</span>
          </button>
          <button
            onClick={() => setActiveTab("competitor")}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "competitor"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Competitor Strategy</span>
          </button>
        </div>
      </div>

      {/* KPI Ticker Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[11px] text-gray-500 font-semibold uppercase">Total Monthly Volume</div>
          <div className="text-2xl font-bold text-[#004d00] mt-0.5">{totalVolume.toLocaleString()}</div>
          <div className="text-[10px] text-green-700 font-bold mt-0.5">High-Intent Searches</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[11px] text-gray-500 font-semibold uppercase">Top 1-3 Rankings</div>
          <div className="text-2xl font-bold text-[#004d00] mt-0.5">{top3Rankings} / {keywords.length}</div>
          <div className="text-[10px] text-green-700 font-bold mt-0.5">Prime SERP Real Estate</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[11px] text-gray-500 font-semibold uppercase">Traffic Projection</div>
          <div className="text-2xl font-bold text-[#004d00] mt-0.5">~{totalProjectedTraffic.toLocaleString()}</div>
          <div className="text-[10px] text-green-700 font-bold mt-0.5">Est. Monthly Organic Traffic</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[11px] text-gray-500 font-semibold uppercase">Avg AI Overview Prob</div>
          <div className="text-2xl font-bold text-orange-600 mt-0.5">{avgAiOverviewProb}%</div>
          <div className="text-[10px] text-orange-700 font-bold mt-0.5">Google SGE Capture Rate</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[11px] text-gray-500 font-semibold uppercase">Avg Keyword Difficulty</div>
          <div className="text-2xl font-bold text-amber-800 mt-0.5">{avgDifficulty} / 100</div>
          <div className="text-[10px] text-amber-800 font-bold mt-0.5">Moderate / High Authority</div>
        </div>
      </div>

      {/* TAB 1: CORE 35 KEYWORDS MATRIX TABLE */}
      {activeTab === "matrix" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Filter & Action Toolbar */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search keywords or cluster..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
                />
              </div>

              {/* Archived Items Filter Toggle */}
              <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 p-0.5">
                <button
                  type="button"
                  onClick={() => setArchiveFilter("active")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                    archiveFilter === "active"
                      ? "bg-[#004d00] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  type="button"
                  onClick={() => setArchiveFilter("archived")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors ${
                    archiveFilter === "archived"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-amber-700"
                  }`}
                >
                  <Archive className="w-3 h-3" />
                  <span>Archived ({archivedCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setArchiveFilter("all")}
                  className={`px-2 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                    archiveFilter === "all"
                      ? "bg-gray-800 text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  All ({keywords.length})
                </button>
              </div>

              <select
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 bg-gray-50 font-medium text-gray-700 text-xs"
              >
                <option value="All">All Clusters ({clusters.length})</option>
                {clusters.map((cl) => (
                  <option key={cl} value={cl}>
                    {cl}
                  </option>
                ))}
              </select>

              <select
                value={selectedIntent}
                onChange={(e) => setSelectedIntent(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 bg-gray-50 font-medium text-gray-700 text-xs"
              >
                <option value="All">All Intent Types</option>
                <option value="Commercial">Commercial</option>
                <option value="Informational">Informational</option>
                <option value="Transactional">Transactional</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>

              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>+ Add Keyword</span>
              </button>
            </div>
          </div>

          {/* Keyword Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
            {/* Sticky Floating Bulk Operations Toolbar */}
            {selectedKeywordIds.size > 0 && (
              <div
                id="keyword-bulk-action-bar"
                className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2 duration-150 sticky top-0 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#ffa500] text-slate-950 font-black text-xs flex items-center justify-center">
                    {selectedKeywordIds.size}
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      {selectedKeywordIds.size} {selectedKeywordIds.size === 1 ? "Keyword" : "Keywords"} Selected
                    </div>
                    <div className="text-[11px] text-gray-300">
                      Bulk operations with accidental deletion prevention guard
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleExportSelectedCSV()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-[#ffa500]" />
                    <span>Export Selected</span>
                  </button>

                  {onToggleArchiveKeyword && (
                    <button
                      type="button"
                      onClick={() => handlePromptBulkArchive("archive")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-900/60 text-amber-300 font-semibold transition-colors border border-slate-700"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handlePromptBulkDelete()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Bulk Delete ({selectedKeywordIds.size})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredKeywords.length > 0 &&
                          selectedKeywordIds.size === filteredKeywords.length
                        }
                        onChange={handleToggleSelectAllFiltered}
                        title="Select/Deselect all filtered keywords"
                        className="rounded border-gray-300 text-[#004d00] focus:ring-[#ffa500] cursor-pointer"
                      />
                    </th>
                    <th className="p-3.5">Keyword & Intent</th>
                    <th className="p-3.5">Cluster Group</th>
                    <th className="p-3.5">Monthly Volume</th>
                    <th className="p-3.5">Difficulty</th>
                    <th className="p-3.5">Est. CPC</th>
                    <th className="p-3.5">Current Rank</th>
                    <th className="p-3.5">Traffic Projection</th>
                    <th className="p-3.5">12-Mo Trend (Sparkline)</th>
                    <th className="p-3.5">AI Overview Trigger</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredKeywords.map((kw) => {
                    const sparklineData = generateKeywordSparklineData(kw);
                    const projectedTraffic = calculateTrafficProjection(
                      kw.searchVolume,
                      kw.currentRank,
                      kw.aiOverviewProbability
                    );
                    const isSelected = selectedKeywordIds.has(kw.id);
                    return (
                      <tr
                        key={kw.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          isSelected
                            ? "bg-amber-50/70 dark:bg-[#1f190c]"
                            : kw.archived
                            ? "bg-amber-50/40"
                            : ""
                        }`}
                      >
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectKeyword(kw.id)}
                            className="rounded border-gray-300 text-[#004d00] focus:ring-[#ffa500] cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900">{kw.keyword}</span>
                            {kw.archived && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900">
                                Archived
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                kw.intent === "Commercial"
                                  ? "bg-amber-100 text-amber-900"
                                  : kw.intent === "Transactional"
                                  ? "bg-purple-100 text-purple-900"
                                  : "bg-blue-100 text-blue-900"
                              }`}
                            >
                              {kw.intent}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 font-medium text-gray-600">{kw.cluster}</td>
                        <td className="p-3.5 font-mono text-gray-900 font-semibold">
                          {kw.searchVolume.toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-bold ${
                              kw.difficulty > 65
                                ? "text-red-600"
                                : kw.difficulty > 45
                                ? "text-amber-800"
                                : "text-[#004d00]"
                            }`}
                          >
                            {kw.difficulty}/100
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-gray-700">${kw.cpc.toFixed(2)}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded font-black text-xs ${
                                kw.currentRank <= 3
                                  ? "bg-green-100 text-[#004d00]"
                                  : kw.currentRank <= 10
                                  ? "bg-blue-100 text-blue-900"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              #{kw.currentRank}
                            </span>
                            {kw.previousRank > kw.currentRank && (
                              <span className="text-[10px] text-green-600 font-bold flex items-center">
                                <ArrowUpRight className="w-3 h-3" />
                                +{kw.previousRank - kw.currentRank}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-col">
                            <span className="font-mono text-gray-900 font-bold text-xs">
                              ~{projectedTraffic.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">vis/mo</span>
                            </span>
                            <span className="text-[9px] text-green-700 font-semibold">
                              {kw.currentRank <= 3 ? "High Capture (CTR ~28%)" : kw.currentRank <= 10 ? "Page 1 (CTR ~8%)" : "Long-tail Lift"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 min-w-[130px]">
                          <div
                            onClick={() => handleFetchTrends(kw.keyword, true)}
                            className="cursor-pointer group flex items-center gap-2"
                            title="Click to view live Google Trends Search Grounding for this keyword"
                          >
                            <div className="w-20 h-7 bg-gray-50 rounded border border-gray-200 p-0.5 group-hover:border-[#ffa500] group-hover:bg-amber-50/50 transition-all">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sparklineData}>
                                  <Line
                                    type="monotone"
                                    dataKey="val"
                                    stroke="#004d00"
                                    strokeWidth={1.8}
                                    dot={false}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <button
                              type="button"
                              className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-900 border border-amber-200 hover:bg-[#ffa500] hover:text-slate-950 transition-colors flex items-center gap-0.5"
                            >
                              <Flame className="w-2.5 h-2.5 text-orange-500" />
                              <span>Trends</span>
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-[#ffa500] h-full rounded-full"
                                style={{ width: `${kw.aiOverviewProbability}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] font-bold text-gray-700">
                              {kw.aiOverviewProbability}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              kw.status.includes("#1-3")
                                ? "bg-green-50 text-[#004d00]"
                                : "bg-blue-50 text-blue-900"
                            }`}
                          >
                            {kw.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleFetchTrends(kw.keyword, true)}
                              className="p-1.5 rounded text-amber-700 hover:bg-amber-100 transition-colors"
                              title="Inspect in Google Trends Grounding"
                            >
                              <Flame className="w-3.5 h-3.5 text-orange-600" />
                            </button>
                            {onToggleArchiveKeyword && (
                              <button
                                onClick={() => handlePromptBulkArchive(kw.archived ? "unarchive" : "archive", [kw.id])}
                                className={`p-1.5 rounded transition-colors ${
                                  kw.archived
                                    ? "text-green-700 hover:bg-green-100"
                                    : "text-gray-400 hover:text-amber-700 hover:bg-amber-50"
                                }`}
                                title={kw.archived ? "Restore to active matrix" : "Archive keyword"}
                              >
                                {kw.archived ? (
                                  <ArchiveRestore className="w-3.5 h-3.5" />
                                ) : (
                                  <Archive className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handlePromptBulkDelete([kw.id])}
                              className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete keyword (with confirmation)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: GOOGLE TRENDS SEARCH GROUNDING INTELLIGENCE */}
      {activeTab === "trends" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Query Bar */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Google Trends Live Grounding Intelligence
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time 12-month search trajectories, breakout queries, and regional demand grounded in Google Search.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-[#004d00] border border-green-200">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Google Search Grounded
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={trendSearchTerm}
                  onChange={(e) => setTrendSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFetchTrends(trendSearchTerm, false)}
                  placeholder="Enter any keyword (e.g., AI Search Optimization, B2B SaaS SEO)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#ffa500] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleFetchTrends(trendSearchTerm, false)}
                disabled={isLoadingTrends}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#004d00] text-white hover:bg-[#003300] text-xs font-bold shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoadingTrends ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Grounding Trends...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#ffa500]" />
                    <span>Analyze Google Trends</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-gray-500">
              <span className="font-semibold text-gray-600 text-[11px]">Popular Tracked Terms:</span>
              {keywords.slice(0, 6).map((k) => (
                <button
                  key={k.id}
                  onClick={() => handleFetchTrends(k.keyword, false)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 hover:bg-amber-100 hover:text-amber-900 transition-colors"
                >
                  {k.keyword}
                </button>
              ))}
            </div>
          </div>

          {/* Trends Dashboard Result */}
          {selectedTrendResult && (
            <div className="space-y-6">
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase">Current Interest Index</div>
                  <div className="text-2xl font-bold text-[#004d00] mt-0.5">
                    {selectedTrendResult.currentInterestScore} / 100
                  </div>
                  <div className="text-[10px] text-green-700 font-bold mt-0.5">Peak Relative Demand</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase">12-Mo YoY Growth</div>
                  <div className="text-2xl font-bold text-[#ffa500] mt-0.5">
                    {selectedTrendResult.growthRateYoY}
                  </div>
                  <div className="text-[10px] text-amber-800 font-bold mt-0.5">Year-Over-Year Velocity</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase">Trajectory Status</div>
                  <div className="text-lg font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span>{selectedTrendResult.trendTrajectory}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Predicted High Momentum</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase">Peak Month Forecast</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">
                    {selectedTrendResult.peakMonth}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Seasonal High Engagement</div>
                </div>
              </div>

              {/* 12-Month Area Chart */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#004d00]" />
                      12-Month Search Interest Index: "{selectedTrendResult.keyword}"
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Grounded historical and predictive interest curve normalized 0-100 (Google Trends Index)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyTrendsSummary}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {copiedTrendsReport ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTrendsReport ? "Copied" : "Copy Report"}</span>
                    </button>
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={selectedTrendResult.monthlyTrend}
                      margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#004d00" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#004d00" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} />
                      <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={11} tickLine={false} />
                      <Tooltip
                        formatter={(value: any) => [`${value} / 100`, "Interest Index"]}
                        contentStyle={{
                          backgroundColor: "#003300",
                          borderRadius: "8px",
                          color: "#ffffff",
                          border: "none",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="interest"
                        stroke="#004d00"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#trendGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Breakout Queries & Regional Demand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Breakout Queries */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#ffa500]" />
                    Breakout & High-Growth Search Queries:
                  </h4>
                  <div className="space-y-2">
                    {selectedTrendResult.breakoutQueries.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80 flex items-center justify-between gap-2"
                      >
                        <span className="font-bold text-gray-900">{item.query}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#ffa500] text-slate-950 whitespace-nowrap">
                          {item.growth}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional Demand */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#004d00]" />
                    Regional Search Demand Index (US Hubs):
                  </h4>
                  <div className="space-y-2.5">
                    {selectedTrendResult.topRegions.map((reg, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-800">{reg.region}</span>
                          <span className="font-mono font-bold text-gray-600">{reg.index} / 100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#004d00] h-full rounded-full"
                            style={{ width: `${reg.index}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Search Dynamics & Takeaway */}
              <div className="bg-[#004d00] text-white p-6 rounded-xl border border-[#003300] space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#003300] text-[10px] font-bold text-[#ffa500]">
                    <Zap className="w-3 h-3 text-[#ffa500]" />
                    AI Search Dynamics Analysis
                  </div>
                  <h4 className="text-base font-bold text-white">
                    How Google AI Overviews Synthesizes This Keyword
                  </h4>
                  <p className="text-green-100 leading-relaxed text-xs">
                    {selectedTrendResult.aiSearchContext}
                  </p>
                </div>

                <div className="p-3.5 bg-[#003300] rounded-lg border border-green-800/60 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ffa500] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#ffa500] block text-xs mb-0.5">Actionable SEO Takeaway:</strong>
                    <span className="text-white text-xs">{selectedTrendResult.actionableTakeaway}</span>
                  </div>
                </div>

                {/* Grounding Sources */}
                {trendSources && trendSources.length > 0 && (
                  <div className="pt-2 border-t border-green-900/60 flex flex-wrap items-center gap-2 text-[11px] text-green-200">
                    <span className="font-bold text-[#ffa500]">Grounding Sources:</span>
                    {trendSources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 underline hover:text-white transition-colors"
                      >
                        <span>{src.title || src.uri}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FLOATING TRENDS INTELLIGENCE MODAL */}
      {isTrendsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 text-xs">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Google Trends Sparkline Intelligence: "{trendSearchTerm}"
                  </h3>
                  <p className="text-[11px] text-gray-500">Live Search Grounding Trajectory</p>
                </div>
              </div>
              <button
                onClick={() => setIsTrendsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {isLoadingTrends ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#004d00] animate-spin" />
                  <p className="font-bold text-gray-700 text-xs">Grounding live search trends via Google Search...</p>
                </div>
              ) : selectedTrendResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">Interest Index</div>
                      <div className="text-xl font-bold text-[#004d00]">
                        {selectedTrendResult.currentInterestScore}/100
                      </div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">Growth YoY</div>
                      <div className="text-xl font-bold text-[#ffa500]">
                        {selectedTrendResult.growthRateYoY}
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">Trajectory</div>
                      <div className="text-sm font-bold text-blue-900 mt-1">
                        {selectedTrendResult.trendTrajectory}
                      </div>
                    </div>
                  </div>

                  <div className="h-48 w-full bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedTrendResult.monthlyTrend}>
                        <defs>
                          <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ffa500" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#ffa500" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={10} tickLine={false} />
                        <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#003300",
                            borderRadius: "8px",
                            color: "#ffffff",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="interest"
                          stroke="#ffa500"
                          strokeWidth={2}
                          fill="url(#modalGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5">
                    <strong className="text-gray-900 block text-xs">AI Overview Search Dynamic:</strong>
                    <p className="text-gray-600 text-[11px] leading-relaxed">
                      {selectedTrendResult.aiSearchContext}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={handleCopyTrendsSummary}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      {copiedTrendsReport ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTrendsReport ? "Copied Report" : "Copy Report"}</span>
                    </button>

                    <button
                      onClick={() => setIsTrendsModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-[#004d00] text-white font-bold text-xs hover:bg-[#003300]"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI PREDICTIVE KEYWORD RESEARCH TOOL */}
      {activeTab === "research" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Configuration Box */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffa500]" />
                <h3 className="text-sm font-bold text-gray-900">
                  AI-Powered Predictive Keyword Generator
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-mono">12-Month Search Trend Forecasts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Seed Term / Topic:</label>
                <input
                  type="text"
                  value={seedKeyword}
                  onChange={(e) => setSeedKeyword(e.target.value)}
                  placeholder="e.g. AI Search Optimization"
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ffa500] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Industry / Niche:</label>
                <input
                  type="text"
                  value={industryNiche}
                  onChange={(e) => setIndustryNiche(e.target.value)}
                  placeholder="e.g. B2B Enterprise SaaS"
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ffa500] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Target Intent:</label>
                <select
                  value={targetIntent}
                  onChange={(e) => setTargetIntent(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 font-medium"
                >
                  <option value="All">All Intent Mix</option>
                  <option value="Commercial">Commercial (High ROI)</option>
                  <option value="Informational">Informational (AI Answers)</option>
                  <option value="Transactional">Transactional (Purchases)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Target Geography:</label>
                <input
                  type="text"
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  placeholder="e.g. United States (Global)"
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ffa500] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-500">
                Identifies high-growth conversational queries, predictive 12-month trajectory, and SGE trigger rates.
              </span>
              <button
                onClick={handleExecuteResearch}
                disabled={isResearching}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 text-[#ffa500] ${isResearching ? "animate-spin" : ""}`} />
                <span>{isResearching ? "Synthesizing AI Trends..." : "Generate Predictive Keywords"}</span>
              </button>
            </div>
          </div>

          {/* Research Results Table */}
          {researchKeywords.length > 0 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Generated {researchKeywords.length} High-Opportunity Keywords
                  </h4>
                  <p className="text-gray-500 text-xs">
                    Predictive growth models indicate strong upside for AI Overview citations.
                  </p>
                </div>

                <button
                  onClick={handleBulkAddResearch}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow transition-all active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>+ Bulk Add All to Core Matrix</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-3.5">Keyword & Intent</th>
                        <th className="p-3.5">Cluster Group</th>
                        <th className="p-3.5">Search Volume</th>
                        <th className="p-3.5">Est. CPC</th>
                        <th className="p-3.5">12-Mo Forecast</th>
                        <th className="p-3.5">AI Overview %</th>
                        <th className="p-3.5">Recommended Format</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {researchKeywords.map((kw, idx) => {
                        const isAdded = addedKeywordIds.has(kw.keyword);
                        return (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3.5 max-w-xs">
                              <div className="font-bold text-gray-900">{kw.keyword}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
                                  {kw.intent}
                                </span>
                                <span className="text-[10px] text-green-700 font-semibold">
                                  {kw.trendTrajectory}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5 font-medium text-gray-600">{kw.cluster}</td>
                            <td className="p-3.5 font-mono text-gray-900 font-semibold">
                              {kw.searchVolume.toLocaleString()}
                            </td>
                            <td className="p-3.5 font-mono text-gray-700">${kw.cpc.toFixed(2)}</td>
                            <td className="p-3.5">
                              <span className="font-bold text-[#004d00] flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3 text-[#004d00]" />
                                +{kw.predictedGrowthPercent}%
                              </span>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-orange-600">
                              {kw.aiOverviewProbability}%
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800">
                                {kw.recommendedContentFormat}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleAddResearchKeyword(kw)}
                                disabled={isAdded}
                                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                                  isAdded
                                    ? "bg-green-50 text-[#004d00] cursor-default"
                                    : "bg-[#004d00] hover:bg-[#003800] text-white shadow-sm"
                                }`}
                              >
                                {isAdded ? "Added ✓" : "+ Add"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPETITOR KEYWORD STRATEGY ANALYZER */}
      {activeTab === "competitor" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Competitor Input */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#ffa500]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Competitor Domain Keyword Strategy & Vulnerability Extractor
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-mono">Domain Authority & Gap Analysis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="md:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Competitor Domain:</label>
                <input
                  type="text"
                  value={competitorDomain}
                  onChange={(e) => setCompetitorDomain(e.target.value)}
                  placeholder="e.g. omnirank-digital.com or hubspot.com"
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ffa500] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Target Market Sector:</label>
                <input
                  type="text"
                  value={industryNiche}
                  onChange={(e) => setIndustryNiche(e.target.value)}
                  placeholder="e.g. AI SEO & Digital Agency"
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ffa500] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-500">
                Extracts competitor top rankings, lucrative content gaps, vulnerabilities, and counter-attack roadmap.
              </span>
              <button
                onClick={handleAnalyzeCompetitor}
                disabled={isAnalyzingCompetitor}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 text-[#ffa500] ${isAnalyzingCompetitor ? "animate-spin" : ""}`} />
                <span>{isAnalyzingCompetitor ? "Scanning Competitor..." : "Analyze Competitor Strategy"}</span>
              </button>
            </div>
          </div>

          {/* Competitor Analysis Output */}
          {competitorResult && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Overview Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                  <span className="text-[11px] text-gray-500 uppercase font-semibold">Competitor Domain</span>
                  <div className="text-sm font-bold text-gray-900 mt-1 truncate font-mono">
                    {competitorResult.domain}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                  <span className="text-[11px] text-gray-500 uppercase font-semibold">Domain Authority</span>
                  <div className="text-2xl font-black text-[#004d00] mt-0.5">
                    {competitorResult.estimatedDomainAuthority} / 100
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                  <span className="text-[11px] text-gray-500 uppercase font-semibold">Organic Keywords</span>
                  <div className="text-2xl font-black text-amber-800 mt-0.5">
                    {competitorResult.estimatedOrganicKeywords.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                  <span className="text-[11px] text-gray-500 uppercase font-semibold">AI Overview Presence</span>
                  <div className="text-2xl font-black text-orange-600 mt-0.5">
                    {competitorResult.aiOverviewDominanceScore}%
                  </div>
                </div>
              </div>

              {/* Top Winning Keywords & Content Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#004d00]" />
                    Competitor's Top Ranking Keywords:
                  </h4>
                  <div className="space-y-2">
                    {competitorResult.topKeywords.map((tk, idx) => (
                      <div key={idx} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-900">{tk.keyword}</div>
                          <span className="text-[10px] text-gray-500 font-mono">
                            Vol: {tk.searchVolume.toLocaleString()} • Intent: {tk.intent}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded font-black text-xs bg-green-100 text-[#004d00]">
                          #{tk.rank}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#ffa500]" />
                    High-Opportunity Content Gaps (They Aren't Ranking For):
                  </h4>
                  <div className="space-y-2">
                    {competitorResult.contentGaps.map((gap, idx) => (
                      <div key={idx} className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-200/60 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900">{gap.keyword}</strong>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                            {gap.opportunityScore} Score
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px] leading-snug">{gap.recommendedAngle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vulnerabilities & Counter-Attack Playbook */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-red-900 flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    Identified Competitor Vulnerabilities:
                  </h4>
                  <div className="space-y-2">
                    {competitorResult.vulnerabilities.map((vuln, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-red-50/50 rounded border border-red-100 text-gray-800">
                        <span className="text-red-600 font-bold">•</span>
                        <span>{vuln}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-[#004d00] flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#ffa500]" />
                    Counter-Attack Ranking Strategy:
                  </h4>
                  <div className="space-y-2">
                    {competitorResult.counterRankingPlaybook.map((strat, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-green-50/50 rounded border border-green-100 text-gray-800">
                        <span className="text-[#004d00] font-bold">{idx + 1}.</span>
                        <span>{strat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accidental Deletion / Bulk Action Safety Confirmation Modal */}
      <BulkOperationConfirmModal
        isOpen={bulkModalState.isOpen}
        actionType={bulkModalState.actionType}
        selectedItemCount={bulkModalState.ids.length}
        itemNames={keywords.filter((k) => bulkModalState.ids.includes(k.id)).map((k) => k.keyword)}
        totalSearchVolumeImpact={keywords
          .filter((k) => bulkModalState.ids.includes(k.id))
          .reduce((sum, k) => sum + k.searchVolume, 0)}
        onConfirm={handleConfirmBulkAction}
        onCancel={() => setBulkModalState({ isOpen: false, actionType: "delete", ids: [] })}
        isProcessing={isBulkProcessing}
      />
    </div>
  );
};

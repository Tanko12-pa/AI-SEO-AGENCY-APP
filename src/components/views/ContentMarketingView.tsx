import React, { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Building2,
  MessageSquare,
  Star,
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  Sliders,
  Layers,
  ArrowRight,
  Code,
  Smartphone,
  Eye,
  Download,
  BookOpen,
  Archive,
  ArchiveRestore,
  AlertTriangle,
  Clock,
  RotateCw,
  Search,
  ExternalLink,
  Heart,
} from "lucide-react";
import { ContentPieceItem, LocalCitationItem } from "../../types";
import {
  generateContentOutline,
  ContentOutlineResult,
} from "../../services/api";
import { AIContentOptimizer } from "../content/AIContentOptimizer";
import { SentimentEngagementGauge } from "../content/SentimentEngagementGauge";

interface ContentMarketingViewProps {
  contentPieces: ContentPieceItem[];
  citations: LocalCitationItem[];
  onAddContentPiece: (cnt: ContentPieceItem) => void;
  onUpdateContentPiece?: (cnt: ContentPieceItem) => void;
  onDeleteContentPiece: (id: string) => void;
  onToggleArchiveContentPiece?: (id: string) => void;
  onAddCitation: (cit: LocalCitationItem) => void;
  onDeleteCitation: (id: string) => void;
  onToggleArchiveCitation?: (id: string) => void;
  onOpenAddModal: () => void;
}

export const ContentMarketingView: React.FC<ContentMarketingViewProps> = ({
  contentPieces,
  citations,
  onAddContentPiece,
  onUpdateContentPiece,
  onDeleteContentPiece,
  onToggleArchiveContentPiece,
  onAddCitation,
  onDeleteCitation,
  onToggleArchiveCitation,
  onOpenAddModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    "optimizer" | "generator" | "sentiment" | "content" | "local-citations" | "gmb" | "qa"
  >("optimizer");
  const [selectedContentType, setSelectedContentType] = useState<string>("All");
  const [freshnessFilter, setFreshnessFilter] = useState<"all" | "fresh" | "stale">("all");
  const [contentArchiveFilter, setContentArchiveFilter] = useState<"active" | "archived" | "all">("active");
  const [citationArchiveFilter, setCitationArchiveFilter] = useState<"active" | "archived" | "all">("active");
  const [searchQuery, setSearchQuery] = useState("");

  // Outline & Draft Generator States
  const [outlineTopic, setOutlineTopic] = useState("Google AI Overviews Optimization & 45-Word Answer Strategy");
  const [outlineKeyword, setOutlineKeyword] = useState("Google AI Overviews ranking factors");
  const [outlineType, setOutlineType] = useState<"Blog Post" | "Guest Blog" | "Informational Piece" | "Press Release">("Blog Post");
  const [outlineTone, setOutlineTone] = useState("Authoritative & Data-Driven");
  const [outlineWordCount, setOutlineWordCount] = useState("2200");
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<ContentOutlineResult | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Reference Date is 2026-08-24
  const REFERENCE_DATE = new Date("2026-08-24");

  // Helper to determine staleness (>90 days without audit or update)
  const getContentAuditStatus = (piece: ContentPieceItem) => {
    const auditDateStr = piece.lastAuditedDate || piece.publishDate;
    const auditDate = new Date(auditDateStr);
    const diffTime = Math.max(0, REFERENCE_DATE.getTime() - auditDate.getTime());
    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const isStale = daysElapsed > 90;
    return {
      daysElapsed,
      auditDateStr,
      isStale,
    };
  };

  // Re-audit an individual content piece (resets its audit date to 2026-08-24)
  const handleReAuditPiece = (piece: ContentPieceItem) => {
    if (onUpdateContentPiece) {
      onUpdateContentPiece({
        ...piece,
        lastAuditedDate: "2026-08-24",
      });
    } else {
      // Fallback in-place if no handler supplied
      piece.lastAuditedDate = "2026-08-24";
    }
  };

  // Bulk re-audit all stale pieces
  const handleBulkReAuditStale = () => {
    contentPieces.forEach((piece) => {
      const status = getContentAuditStatus(piece);
      if (status.isStale && onUpdateContentPiece) {
        onUpdateContentPiece({
          ...piece,
          lastAuditedDate: "2026-08-24",
        });
      }
    });
  };

  // Counts
  const stalePieces = contentPieces.filter((c) => !c.archived && getContentAuditStatus(c).isStale);
  const freshPieces = contentPieces.filter((c) => !c.archived && !getContentAuditStatus(c).isStale);
  const activeContentCount = contentPieces.filter((c) => !c.archived).length;
  const archivedContentCount = contentPieces.filter((c) => !!c.archived).length;

  // Run Outline Generator
  const handleGenerateOutline = async () => {
    setIsGeneratingOutline(true);
    try {
      const res = await generateContentOutline({
        topic: outlineTopic,
        targetKeyword: outlineKeyword,
        contentType: outlineType,
        wordCount: outlineWordCount,
        tone: outlineTone,
      });
      setGeneratedOutline(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Insert generated piece into Deliverable Inventory
  const handleInsertToInventory = () => {
    if (!generatedOutline) return;
    const newPiece: ContentPieceItem = {
      id: `cnt-gen-${Date.now()}`,
      title: generatedOutline.title,
      type: outlineType,
      targetKeyword: outlineKeyword,
      wordCount: parseInt(outlineWordCount, 10) || 2000,
      status: "Published",
      eeatScore: 97,
      publishDate: "2026-08-24",
      lastAuditedDate: "2026-08-24",
      aiOptimized: true,
      author: "AI Content Architect (Dr. Alistair Vance)",
    };
    onAddContentPiece(newPiece);
    setActiveTab("content");
  };

  const filteredContent = contentPieces.filter((c) => {
    const isArchived = !!c.archived;
    if (contentArchiveFilter === "active" && isArchived) return false;
    if (contentArchiveFilter === "archived" && !isArchived) return false;
    
    if (selectedContentType !== "All" && c.type !== selectedContentType) return false;

    const auditStatus = getContentAuditStatus(c);
    if (freshnessFilter === "fresh" && auditStatus.isStale) return false;
    if (freshnessFilter === "stale" && !auditStatus.isStale) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(query) ||
        c.targetKeyword.toLowerCase().includes(query) ||
        c.type.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const filteredCitations = citations.filter((cit) => {
    const isArchived = !!cit.archived;
    if (citationArchiveFilter === "active" && isArchived) return false;
    if (citationArchiveFilter === "archived" && !isArchived) return false;
    return true;
  });

  const activeCitationCount = citations.filter((c) => !c.archived).length;
  const archivedCitationCount = citations.filter((c) => !!c.archived).length;

  return (
    <div id="content-marketing-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#004d00] rounded-xl p-6 text-white border border-[#003300] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#003300] text-[11px] text-[#ffa500] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#ffa500]" />
            AI Content Optimization Assistant & Multi-Channel Deliverables
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Content Optimization Assistant & Ecosystem
          </h1>
          <p className="text-xs text-green-100 max-w-2xl">
            Analyze website content and URLs for AI search performance. Optimize title tags, meta descriptions, readability, natural keywords, E-E-E-A-T signals, mobile readiness, and generate publication-ready outlines.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#003300] p-1.5 rounded-lg border border-[#002800] text-xs">
          <button
            id="tab-btn-optimizer"
            onClick={() => setActiveTab("optimizer")}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "optimizer"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Content Optimizer</span>
          </button>
          <button
            id="tab-btn-generator"
            onClick={() => setActiveTab("generator")}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "generator"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Outline & Drafts</span>
          </button>
          <button
            id="tab-btn-sentiment"
            onClick={() => setActiveTab("sentiment")}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "sentiment"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Sentiment & Engagement</span>
          </button>
          <button
            id="tab-btn-content"
            onClick={() => setActiveTab("content")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeTab === "content"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            Inventory ({contentPieces.length})
          </button>
          <button
            id="tab-btn-local-citations"
            onClick={() => setActiveTab("local-citations")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeTab === "local-citations"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            7 Profiles & Citations ({citations.length})
          </button>
          <button
            id="tab-btn-gmb"
            onClick={() => setActiveTab("gmb")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeTab === "gmb"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            Google Profile (GBP)
          </button>
          <button
            id="tab-btn-qa"
            onClick={() => setActiveTab("qa")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeTab === "qa"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            Q&A Hub
          </button>
        </div>
      </div>

      {/* TAB 1: DEDICATED AI CONTENT OPTIMIZER COMPONENT */}
      {activeTab === "optimizer" && (
        <AIContentOptimizer
          onInsertToDeliverables={(title, keyword, snippet) => {
            const newPiece: ContentPieceItem = {
              id: `cnt-opt-${Date.now()}`,
              title,
              type: "Informational Piece",
              targetKeyword: keyword,
              wordCount: 1850,
              status: "Published",
              eeatScore: 98,
              publishDate: "2026-08-24",
              aiOptimized: true,
              author: "AI SEO Content Architect",
            };
            onAddContentPiece(newPiece);
            setActiveTab("content");
          }}
        />
      )}

      {/* TAB 2: OUTLINE & DRAFT GENERATOR */}
      {activeTab === "generator" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0b170b] rounded-xl p-6 border border-gray-200 dark:border-[#163016] shadow-sm space-y-4 transition-colors">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#163016] pb-3">
              <Zap className="w-5 h-5 text-[#ffa500]" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  AI Content Outline & SGE Direct-Answer Generator
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Generates 45-word SGE direct answer blocks, structured H1/H2 blueprints, and full draft copy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Target Article Topic:</label>
                <input
                  type="text"
                  value={outlineTopic}
                  onChange={(e) => setOutlineTopic(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-[#1e461e] bg-white dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ffa500]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Target Focus Keyword:</label>
                <input
                  type="text"
                  value={outlineKeyword}
                  onChange={(e) => setOutlineKeyword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-[#1e461e] bg-white dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ffa500]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Deliverable Type:</label>
                <select
                  value={outlineType}
                  onChange={(e) => setOutlineType(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-[#1e461e] bg-white dark:bg-[#060e06] text-gray-900 dark:text-white"
                >
                  <option value="Blog Post">Blog Post (4 in package)</option>
                  <option value="Guest Blog">Guest Blog (4 in package)</option>
                  <option value="Informational Piece">Informational Piece (8 in package)</option>
                  <option value="Press Release">Press Release (2 in package)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Tone & Word Count:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={outlineTone}
                    onChange={(e) => setOutlineTone(e.target.value)}
                    className="w-2/3 p-2.5 rounded-lg border border-gray-300 dark:border-[#1e461e] bg-white dark:bg-[#060e06] text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={outlineWordCount}
                    onChange={(e) => setOutlineWordCount(e.target.value)}
                    className="w-1/3 p-2.5 rounded-lg border border-gray-300 dark:border-[#1e461e] bg-white dark:bg-[#060e06] text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                id="generate-ai-outline-btn"
                onClick={handleGenerateOutline}
                disabled={isGeneratingOutline}
                className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 text-[#ffa500] ${isGeneratingOutline ? "animate-spin" : ""}`} />
                <span>{isGeneratingOutline ? "Generating Outline with Gemini 3.7..." : "Generate AI Outline & SGE Blueprint"}</span>
              </button>
            </div>
          </div>

          {generatedOutline && (
            <div className="bg-white dark:bg-[#0b170b] rounded-xl p-6 border border-gray-200 dark:border-[#163016] shadow-sm space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#163016] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-green-700 dark:text-green-400">
                    Generated Blueprint
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{generatedOutline.title}</h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    Estimated Reading Time: {generatedOutline.estimatedReadingTime} • Keyword Density Target: {generatedOutline.targetKeywordDensity}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedOutline.fullDraftSection);
                      setCopiedDraft(true);
                      setTimeout(() => setCopiedDraft(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-[#122412] hover:bg-gray-200 dark:hover:bg-[#183618] text-xs font-semibold text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    {copiedDraft ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDraft ? "Draft Copied!" : "Copy Full Draft"}</span>
                  </button>
                  <button
                    onClick={handleInsertToInventory}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-950" />
                    <span>Save to Deliverables</span>
                  </button>
                </div>
              </div>

              {/* 45-Word SGE Block */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-[#1a1405] border border-amber-200 dark:border-[#40300a] space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300 block">
                  AI Overview Direct Answer Block (Place below H1):
                </span>
                <p className="text-xs text-gray-900 dark:text-gray-100 font-medium italic leading-relaxed">
                  "{generatedOutline.directAnswerBlock}"
                </p>
              </div>

              {/* Outline Sections Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Structured Heading Hierarchy & Section Blueprint:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {generatedOutline.outlineSections.map((sec, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-[#060e06] p-3.5 rounded-lg border border-gray-200 dark:border-[#163016] space-y-2 text-xs">
                      <div className="font-bold text-[#004d00] dark:text-[#ffa500]">{sec.heading}</div>
                      <p className="text-gray-600 dark:text-gray-400 text-[11px] leading-snug">{sec.purpose}</p>
                      <div className="space-y-1 pt-1 border-t border-gray-200 dark:border-[#163016]">
                        {sec.subheadings.map((sub, sIdx) => (
                          <div key={sIdx} className="text-gray-700 dark:text-gray-300 text-[11px] flex items-center gap-1.5">
                            <ArrowRight className="w-3 h-3 text-[#ffa500] flex-shrink-0" />
                            <span>{sub}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-[#1a1405] p-1.5 rounded border border-amber-100 dark:border-[#40300a]">
                        Takeaway: {sec.keyTakeaway}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Draft Section Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Draft Opening & Core Section Preview:
                </h4>
                <pre className="p-4 rounded-xl bg-gray-900 text-green-400 text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-60 leading-relaxed">
                  {generatedOutline.fullDraftSection}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2.5: REAL-TIME CONTENT SENTIMENT & READER ENGAGEMENT POTENTIAL GAUGE */}
      {activeTab === "sentiment" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <SentimentEngagementGauge contentPieces={contentPieces} />
        </div>
      )}

      {/* TAB 3: CONTENT INVENTORY TABLE (18 Deliverables) WITH REAL-TIME STALE CONTENT DETECTOR */}
      {activeTab === "content" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Real-time Sentiment & Engagement Gauge Assistant inside Inventory */}
          <SentimentEngagementGauge contentPieces={contentPieces} />

          {/* Real-time Content Stale Alert Banner */}
          {stalePieces.length > 0 && (
            <div
              id="content-stale-alert-banner"
              className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-400 dark:border-amber-700/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold mt-0.5 shrink-0 shadow-xs">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                      Real-Time Content Stale Detector: {stalePieces.length} Pieces Require Update (&gt;90 Days Inactive)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white font-extrabold text-[10px] uppercase tracking-wide">
                      Update Required
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mt-0.5 max-w-3xl">
                    Google AI Overviews and Search Quality Systems demote content un-audited for &gt;90 days. Refresh statistics, author credentials, and 45-word direct answer blocks to maintain entity authority.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setFreshnessFilter(freshnessFilter === "stale" ? "all" : "stale")}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all shadow-xs ${
                    freshnessFilter === "stale"
                      ? "bg-amber-700 text-white"
                      : "bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-200"
                  }`}
                >
                  {freshnessFilter === "stale" ? "Showing Stale Only" : "Filter Stale Pieces"}
                </button>
                <button
                  type="button"
                  onClick={handleBulkReAuditStale}
                  className="px-3 py-1.5 rounded-md bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all active:scale-[0.98]"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#ffa500]" />
                  <span>Mark All Audited Today</span>
                </button>
              </div>
            </div>
          )}

          {/* Controls Bar: Archive Filters, Freshness Filters, Content Type, Search & Add */}
          <div className="bg-white dark:bg-[#0b170b] rounded-xl p-4 border border-gray-200 dark:border-[#163016] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs transition-colors">
            <div className="flex flex-wrap items-center gap-2">
              {/* Freshness Toggle Filter */}
              <div className="flex items-center rounded-lg border border-gray-300 dark:border-[#1e461e] bg-gray-50 dark:bg-[#060e06] p-0.5">
                <button
                  type="button"
                  onClick={() => setFreshnessFilter("all")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                    freshnessFilter === "all"
                      ? "bg-[#004d00] text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                  }`}
                >
                  All Status ({contentPieces.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFreshnessFilter("fresh")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors ${
                    freshnessFilter === "fresh"
                      ? "bg-green-700 text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:text-green-700"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>Fresh ({freshPieces.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFreshnessFilter("stale")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors ${
                    freshnessFilter === "stale"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-amber-800 dark:text-amber-400 hover:text-amber-600"
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>Stale &gt;90d ({stalePieces.length})</span>
                </button>
              </div>

              {/* Archive Toggle Filter */}
              <div className="flex items-center rounded-lg border border-gray-300 dark:border-[#1e461e] bg-gray-50 dark:bg-[#060e06] p-0.5">
                <button
                  type="button"
                  onClick={() => setContentArchiveFilter("active")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                    contentArchiveFilter === "active"
                      ? "bg-[#004d00] text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Active ({activeContentCount})
                </button>
                <button
                  type="button"
                  onClick={() => setContentArchiveFilter("archived")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors ${
                    contentArchiveFilter === "archived"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:text-amber-600"
                  }`}
                >
                  <Archive className="w-3 h-3" />
                  <span>Archived ({archivedContentCount})</span>
                </button>
              </div>

              {/* Deliverable Type Select */}
              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 dark:border-[#1e461e] bg-gray-50 dark:bg-[#060e06] font-medium text-gray-700 dark:text-gray-200 text-xs"
              >
                <option value="All">All Content Types</option>
                <option value="Blog Post">Blog Posts</option>
                <option value="Guest Blog">Guest Blogs</option>
                <option value="Informational Piece">Informational Pieces</option>
                <option value="Press Release">Press Releases</option>
              </select>
            </div>

            {/* Search Input and Add Button */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deliverables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#1e461e] bg-gray-50 dark:bg-[#060e06] text-xs w-44 focus:w-56 transition-all text-gray-800 dark:text-gray-200"
                />
              </div>

              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>+ Add Deliverable</span>
              </button>
            </div>
          </div>

          {/* Deliverables Table with Freshness Column */}
          <div className="bg-white dark:bg-[#0b170b] rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm overflow-hidden transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 dark:bg-[#060e06] text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold border-b border-gray-200 dark:border-[#163016]">
                  <tr>
                    <th className="p-3.5">Content Title & Topic</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Target Keyword</th>
                    <th className="p-3.5">Word Count</th>
                    <th className="p-3.5">EEAT Score</th>
                    <th className="p-3.5">Freshness & Audit Status</th>
                    <th className="p-3.5">Last Audited</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#163016] text-gray-700 dark:text-gray-300">
                  {filteredContent.map((c) => {
                    const auditStatus = getContentAuditStatus(c);
                    const isStale = auditStatus.isStale;
                    return (
                      <tr
                        key={c.id}
                        className={`hover:bg-gray-50 dark:hover:bg-[#122412] transition-colors ${
                          c.archived
                            ? "bg-amber-50/40 dark:bg-amber-950/20"
                            : isStale
                            ? "bg-amber-50/50 dark:bg-amber-950/25 border-l-4 border-amber-500"
                            : ""
                        }`}
                      >
                        <td className="p-3.5 font-bold text-gray-900 dark:text-white max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span>{c.title}</span>
                            {c.archived && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                                Archived
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-normal text-gray-400 mt-0.5 line-clamp-1">
                            Author: {c.author}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                              c.type === "Blog Post"
                                ? "bg-green-50 dark:bg-green-950 text-[#004d00] dark:text-green-300"
                                : c.type === "Guest Blog"
                                ? "bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-300"
                                : c.type === "Press Release"
                                ? "bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-300"
                                : "bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {c.type}
                          </span>
                        </td>

                        <td className="p-3.5 font-medium text-gray-700 dark:text-gray-300 max-w-[160px] truncate">
                          {c.targetKeyword}
                        </td>

                        <td className="p-3.5 font-mono text-gray-800 dark:text-gray-200">
                          {c.wordCount.toLocaleString()} w
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#004d00] dark:text-[#10b981] font-mono">
                              {c.eeatScore}/100
                            </span>
                            {c.eeatScore >= 95 && (
                              <span className="p-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" title="Top 5% EEAT signals">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Real-time Content Stale Indicator Badge */}
                        <td className="p-3.5">
                          {isStale ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-extrabold text-[10px] border border-amber-300 dark:border-amber-700 shadow-2xs">
                              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>Update Required ({auditStatus.daysElapsed}d stale)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950 text-[#004d00] dark:text-green-300 font-bold text-[10px] border border-green-200 dark:border-green-900">
                              <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0" />
                              <span>Fresh ({auditStatus.daysElapsed}d ago)</span>
                            </span>
                          )}
                        </td>

                        {/* Date & Relative Days Column */}
                        <td className="p-3.5 font-mono text-gray-600 dark:text-gray-400 text-[11px] whitespace-nowrap">
                          <div>{auditStatus.auditDateStr}</div>
                          <span className={`text-[10px] ${isStale ? "text-amber-700 dark:text-amber-400 font-semibold" : "text-gray-400"}`}>
                            {auditStatus.daysElapsed === 0 ? "Today" : `${auditStatus.daysElapsed} days ago`}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Re-Audit Action Button */}
                            <button
                              onClick={() => handleReAuditPiece(c)}
                              className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                                isStale
                                  ? "bg-[#004d00] text-white hover:bg-[#003800] shadow-xs"
                                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                              title={isStale ? "Audit & refresh content now (resets 90-day timer)" : "Re-confirm audit date for today"}
                            >
                              <RotateCw className={`w-3 h-3 ${isStale ? "text-[#ffa500]" : ""}`} />
                              <span>{isStale ? "Audit Now" : "Re-Audit"}</span>
                            </button>

                            {onToggleArchiveContentPiece && (
                              <button
                                onClick={() => onToggleArchiveContentPiece(c.id)}
                                className={`p-1.5 rounded transition-colors ${
                                  c.archived
                                    ? "text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950"
                                    : "text-gray-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
                                }`}
                                title={c.archived ? "Restore deliverable" : "Archive deliverable"}
                              >
                                {c.archived ? (
                                  <ArchiveRestore className="w-3.5 h-3.5" />
                                ) : (
                                  <Archive className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            <button
                              onClick={() => onDeleteContentPiece(c.id)}
                              className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                              title="Delete content piece"
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

      {/* TAB 4: 7 Business Profiles & Citations */}
      {activeTab === "local-citations" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0b170b] rounded-xl p-4 border border-gray-200 dark:border-[#163016] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#004d00] dark:text-[#ffa500]" />
                7 High-Authority Business Profiles & Local Directory Citations
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                100% NAP (Name, Address, Phone) consistency verified across all primary authority networks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-gray-300 dark:border-[#1e461e] bg-gray-50 dark:bg-[#060e06] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setCitationArchiveFilter("active")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                    citationArchiveFilter === "active"
                      ? "bg-[#004d00] text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Active ({activeCitationCount})
                </button>
                <button
                  type="button"
                  onClick={() => setCitationArchiveFilter("archived")}
                  className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors ${
                    citationArchiveFilter === "archived"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:text-amber-600"
                  }`}
                >
                  <Archive className="w-3 h-3" />
                  <span>Archived ({archivedCitationCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCitationArchiveFilter("all")}
                  className={`px-2 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                    citationArchiveFilter === "all"
                      ? "bg-gray-800 text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  All ({citations.length})
                </button>
              </div>

              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>+ Add Profile / Citation</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCitations.map((cit) => (
              <div
                key={cit.id}
                className={`bg-white dark:bg-[#0b170b] p-5 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-3 relative hover:shadow-md transition-all ${
                  cit.archived ? "opacity-75 bg-amber-50/20 dark:bg-amber-950/20 border-amber-300" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{cit.platform}</h4>
                      {cit.archived && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                          Archived
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{cit.category}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950 text-[#004d00] dark:text-green-300 text-[10px] font-bold">
                    {cit.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-[#060e06] p-2.5 rounded-lg border border-gray-100 dark:border-[#163016]">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-[10px]">NAP Accuracy</span>
                    <div className="font-bold text-[#004d00] dark:text-[#10b981]">{cit.napConsistency}% Verified</div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-[10px]">Rating / Reviews</span>
                    <div className="font-bold text-orange-600 dark:text-[#ffa500] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#ffa500] text-[#ffa500]" />
                      <span>{cit.rating} ({cit.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-gray-400 font-mono">Updated: {cit.dateUpdated}</span>
                  <div className="flex items-center gap-1">
                    {onToggleArchiveCitation && (
                      <button
                        onClick={() => onToggleArchiveCitation(cit.id)}
                        className={`p-1.5 rounded transition-colors ${
                          cit.archived
                            ? "text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950"
                            : "text-gray-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
                        }`}
                        title={cit.archived ? "Restore citation" : "Archive citation"}
                      >
                        {cit.archived ? (
                          <ArchiveRestore className="w-3.5 h-3.5" />
                        ) : (
                          <Archive className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteCitation(cit.id)}
                      className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      title="Delete citation permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Google My Business (GBP) */}
      {activeTab === "gmb" && (
        <div className="bg-white dark:bg-[#0b170b] rounded-xl p-6 border border-gray-200 dark:border-[#163016] shadow-sm space-y-4 animate-in fade-in duration-200 transition-colors">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#163016] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-[#122412] text-[#004d00] dark:text-[#ffa500] flex items-center justify-center font-bold text-base">
                GBP
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Google Business Profile (GBP) Core Setup</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Primary category: AI SEO Agency & Marketing Consultant</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-[#004d00] dark:text-green-300 font-bold text-xs">
              Verified & Optimized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] space-y-1">
              <strong className="text-gray-900 dark:text-white block">Local Map Pack Rank:</strong>
              <div className="text-2xl font-bold text-[#004d00] dark:text-[#10b981]">Position #1</div>
              <p className="text-gray-500 dark:text-gray-400 text-[11px]">Ranked across 15-mile service radius.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] space-y-1">
              <strong className="text-gray-900 dark:text-white block">Customer Review Velocity:</strong>
              <div className="text-2xl font-bold text-orange-600 dark:text-[#ffa500]">4.9 / 5.0 ⭐</div>
              <p className="text-gray-500 dark:text-gray-400 text-[11px]">48 5-star verified customer reviews.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] space-y-1">
              <strong className="text-gray-900 dark:text-white block">Weekly GBP Direct Calls:</strong>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">62 Inquiries</div>
              <p className="text-gray-500 dark:text-gray-400 text-[11px]">Direction requests & website clicks.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Q&A Hub */}
      {activeTab === "qa" && (
        <div className="bg-white dark:bg-[#0b170b] rounded-xl p-6 border border-gray-200 dark:border-[#163016] shadow-sm space-y-4 animate-in fade-in duration-200 transition-colors">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#163016] pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#ffa500]" />
                Local Community & Platform Q&A Seed Strategy
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Seeding high-intent conversational FAQs directly on Quora, Reddit, and Google Q&A modules.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg bg-green-50 dark:bg-[#081f08] border border-green-200 dark:border-[#164016] space-y-1">
              <div className="font-bold text-green-950 dark:text-green-200">Q: "How will Google AI Overviews impact small business web traffic in 2026?"</div>
              <p className="text-gray-800 dark:text-gray-300">
                A: "AI Overviews prioritize high-EEAT answers with clear schema markup. Businesses that provide 45-word direct answer blocks capture top citation links inside the AI summary box."
              </p>
              <div className="text-[10px] text-[#004d00] dark:text-[#ffa500] font-semibold">Published on Google Q&A & Quora (14.2K views)</div>
            </div>

            <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] space-y-1">
              <div className="font-bold text-gray-900 dark:text-white">Q: "Is voice search optimization different from regular SEO?"</div>
              <p className="text-gray-700 dark:text-gray-300">
                A: "Yes. Voice queries use full conversational questions ('How do I...', 'What is the best...'). Optimizing requires natural speech syntax and FAQ JSON-LD schema."
              </p>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Published on Reddit r/SEO & Enterprise Tech Forum</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

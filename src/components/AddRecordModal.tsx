import React, { useState } from "react";
import {
  X,
  PlusCircle,
  Calendar,
  TrendingUp,
  Layers,
  FileText,
  Mic,
  ShieldCheck,
  Sparkles,
  Archive,
  ArchiveRestore,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
} from "lucide-react";
import {
  KeywordItem,
  CompetitorItem,
  ContentPieceItem,
  LocalCitationItem,
  AudioTranscriptItem,
  CampaignLogItem,
} from "../types";

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddKeyword: (kw: KeywordItem) => void;
  onAddCompetitor: (comp: CompetitorItem) => void;
  onAddContentPiece: (cnt: ContentPieceItem) => void;
  onAddCitation: (cit: LocalCitationItem) => void;
  onAddTranscript: (tr: AudioTranscriptItem) => void;
  onAddCampaignLog: (log: CampaignLogItem) => void;
  keywords?: KeywordItem[];
  competitors?: CompetitorItem[];
  contentPieces?: ContentPieceItem[];
  citations?: LocalCitationItem[];
  transcripts?: AudioTranscriptItem[];
  onToggleArchiveKeyword?: (id: string) => void;
  onToggleArchiveCompetitor?: (id: string) => void;
  onToggleArchiveContentPiece?: (id: string) => void;
  onToggleArchiveCitation?: (id: string) => void;
  onToggleArchiveTranscript?: (id: string) => void;
  onDeleteKeyword?: (id: string) => void;
  onDeleteCompetitor?: (id: string) => void;
  defaultSection?: string;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  onAddKeyword,
  onAddCompetitor,
  onAddContentPiece,
  onAddCitation,
  onAddTranscript,
  onAddCampaignLog,
  keywords = [],
  competitors = [],
  contentPieces = [],
  citations = [],
  transcripts = [],
  onToggleArchiveKeyword,
  onToggleArchiveCompetitor,
  onToggleArchiveContentPiece,
  onToggleArchiveCitation,
  onToggleArchiveTranscript,
  onDeleteKeyword,
  onDeleteCompetitor,
  defaultSection = "keyword",
}) => {
  const currentDateStr = "2026-08-24";
  const [modalTab, setModalTab] = useState<"create" | "manage-archive">("create");
  const [section, setSection] = useState<string>(defaultSection);
  const [createAsArchived, setCreateAsArchived] = useState(false);

  // Archive Manager Search & Filter states
  const [manageCategory, setManageCategory] = useState<"all" | "keyword" | "competitor" | "content">("all");
  const [manageFilterState, setManageFilterState] = useState<"all" | "active" | "archived">("archived");
  const [manageSearch, setManageSearch] = useState("");

  // Keyword fields
  const [kwName, setKwName] = useState("");
  const [kwVolume, setKwVolume] = useState("3500");
  const [kwDifficulty, setKwDifficulty] = useState("48");
  const [kwIntent, setKwIntent] = useState<"Informational" | "Commercial" | "Transactional" | "Navigational">("Commercial");
  const [kwAiProb, setKwAiProb] = useState("90");
  const [kwCluster, setKwCluster] = useState("Core Agency Services");
  const [kwRank, setKwRank] = useState("4");

  // Competitor fields
  const [compName, setCompName] = useState("");
  const [compDomain, setCompDomain] = useState("");
  const [compDA, setCompDA] = useState("60");
  const [compTraffic, setCompTraffic] = useState("120K/mo");

  // Content piece fields
  const [cntTitle, setCntTitle] = useState("");
  const [cntType, setCntType] = useState<"Blog Post" | "Guest Blog" | "Informational Piece" | "Press Release">("Blog Post");
  const [cntTargetKw, setCntTargetKw] = useState("");
  const [cntWordCount, setCntWordCount] = useState("2000");

  // Citation fields
  const [citPlatform, setCitPlatform] = useState("");
  const [citCategory, setCitCategory] = useState<"Google Business Profile" | "Local Directory" | "Industry Profile" | "Q&A Platform">("Industry Profile");
  const [citRating, setCitRating] = useState("4.9");

  // Transcript fields
  const [trTitle, setTrTitle] = useState("");
  const [trClient, setTrClient] = useState("Apex HealthTech");
  const [trText, setTrText] = useState("");

  // Log fields
  const [logCategory, setLogCategory] = useState<"Algorithm" | "On-Page" | "Link-Building" | "Content" | "Audit" | "A2A">("Content");
  const [logEvent, setLogEvent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (section === "keyword") {
      if (!kwName.trim()) return;
      const newKw: KeywordItem = {
        id: `kw-custom-${Date.now()}`,
        keyword: kwName.trim(),
        searchVolume: parseInt(kwVolume, 10) || 1000,
        difficulty: parseInt(kwDifficulty, 10) || 50,
        cpc: 8.5,
        currentRank: parseInt(kwRank, 10) || 5,
        previousRank: (parseInt(kwRank, 10) || 5) + 3,
        intent: kwIntent,
        aiOverviewProbability: parseInt(kwAiProb, 10) || 85,
        serpFeatures: ["AI Overview", "Featured Snippet"],
        cluster: kwCluster || "General",
        dateAdded: currentDateStr,
        status: parseInt(kwRank, 10) <= 3 ? "Ranking #1-3" : "Top 10",
        archived: createAsArchived,
      };
      onAddKeyword(newKw);
    } else if (section === "competitor") {
      if (!compName.trim() || !compDomain.trim()) return;
      const newComp: CompetitorItem = {
        id: `comp-custom-${Date.now()}`,
        name: compName.trim(),
        domain: compDomain.trim().replace(/^https?:\/\//, ""),
        domainAuthority: parseInt(compDA, 10) || 50,
        organicKeywords: 8500,
        estimatedTraffic: compTraffic || "80K/mo",
        aiOverviewPresence: 70,
        backlinksCount: 15400,
        overlapKeywordsCount: 20,
        dateAdded: currentDateStr,
        archived: createAsArchived,
      };
      onAddCompetitor(newComp);
    } else if (section === "content") {
      if (!cntTitle.trim()) return;
      const newCnt: ContentPieceItem = {
        id: `cnt-custom-${Date.now()}`,
        title: cntTitle.trim(),
        type: cntType,
        targetKeyword: cntTargetKw || "AI search optimization",
        wordCount: parseInt(cntWordCount, 10) || 2000,
        status: "Published",
        eeatScore: 95,
        publishDate: currentDateStr,
        aiOptimized: true,
        author: "AI SEO Editorial Team",
        archived: createAsArchived,
      };
      onAddContentPiece(newCnt);
    } else if (section === "citation") {
      if (!citPlatform.trim()) return;
      const newCit: LocalCitationItem = {
        id: `cit-custom-${Date.now()}`,
        platform: citPlatform.trim(),
        category: citCategory,
        status: "Verified & Active",
        napConsistency: 100,
        reviewCount: 30,
        rating: parseFloat(citRating) || 4.9,
        profileUrl: `https://${citPlatform.toLowerCase().replace(/\s+/g, "")}.com/profile`,
        dateUpdated: currentDateStr,
        archived: createAsArchived,
      };
      onAddCitation(newCit);
    } else if (section === "transcript") {
      if (!trTitle.trim()) return;
      const newTr: AudioTranscriptItem = {
        id: `tr-custom-${Date.now()}`,
        title: trTitle.trim(),
        client: trClient,
        duration: "15m 00s",
        dateRecorded: currentDateStr,
        fullTranscript: trText || "[00:00] Recorded client kickoff meeting discussing AI Search strategy.",
        timestamps: [
          { time: "00:00", speaker: "Client Lead", text: trText.slice(0, 100) || "Kickoff discussion", intent: "Requirement" }
        ],
        extractedKeywords: ["AI Search Strategy", "Google AI Overviews", "Local Citation"],
        actionItems: ["Deploy structured schema", "Audit 10 competitors"],
        sentiment: "Positive",
        archived: createAsArchived,
      };
      onAddTranscript(newTr);
    } else if (section === "log") {
      if (!logEvent.trim()) return;
      const newLog: CampaignLogItem = {
        id: `log-custom-${Date.now()}`,
        timestamp: `${currentDateStr} ${new Date().toLocaleTimeString()}`,
        category: logCategory,
        event: logEvent.trim(),
        impactScore: "+5.1%",
        user: "Lead Strategist",
      };
      onAddCampaignLog(newLog);
    }

    onClose();
  };

  // Compile Unified Archive List
  const allManagedItems: {
    id: string;
    type: "keyword" | "competitor" | "content" | "citation" | "transcript";
    title: string;
    subtitle: string;
    archived: boolean;
    date: string;
  }[] = [
    ...keywords.map((k) => ({
      id: k.id,
      type: "keyword" as const,
      title: k.keyword,
      subtitle: `Vol: ${k.searchVolume.toLocaleString()} | Rank: #${k.currentRank} | ${k.cluster}`,
      archived: !!k.archived,
      date: k.dateAdded,
    })),
    ...competitors.map((c) => ({
      id: c.id,
      type: "competitor" as const,
      title: c.name,
      subtitle: `Domain: ${c.domain} | DA: ${c.domainAuthority} | Traffic: ${c.estimatedTraffic}`,
      archived: !!c.archived,
      date: c.dateAdded,
    })),
    ...contentPieces.map((cnt) => ({
      id: cnt.id,
      type: "content" as const,
      title: cnt.title,
      subtitle: `${cnt.type} | Target: ${cnt.targetKeyword} | EEAT: ${cnt.eeatScore}/100`,
      archived: !!cnt.archived,
      date: cnt.publishDate,
    })),
  ];

  const totalArchivedCount = allManagedItems.filter((i) => i.archived).length;

  const filteredManagedItems = allManagedItems.filter((item) => {
    if (manageCategory !== "all" && item.type !== manageCategory) return false;
    if (manageFilterState === "archived" && !item.archived) return false;
    if (manageFilterState === "active" && item.archived) return false;
    if (manageSearch.trim()) {
      const q = manageSearch.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div
      id="add-record-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="add-record-modal"
        className="bg-white dark:bg-[#0b170b] w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 dark:border-[#004d00] overflow-hidden text-gray-900 dark:text-white transition-colors"
      >
        {/* Header */}
        <div className="bg-[#004d00] text-white px-6 py-4 flex items-center justify-between border-b border-[#003300]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ffa500] text-slate-950 flex items-center justify-center font-black text-sm">
              AI
            </div>
            <div>
              <h3 className="text-sm font-bold">Workspace Entity & Archive Manager</h3>
              <p className="text-[11px] text-green-100">
                System timestamp: <strong className="text-[#ffa500]">{currentDateStr}</strong> | Keyboard: <code className="bg-[#003300] px-1 rounded font-mono text-[10px]">Alt+N</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#003300] hover:bg-[#002800] text-green-100 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Mode Selector */}
        <div className="flex border-b border-gray-200 dark:border-[#003300] bg-gray-50 dark:bg-[#060e06] px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setModalTab("create")}
            className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all ${
              modalTab === "create"
                ? "border-[#ffa500] text-[#004d00] dark:text-[#ffa500]"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Record</span>
          </button>
          <button
            type="button"
            onClick={() => setModalTab("manage-archive")}
            className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all ${
              modalTab === "manage-archive"
                ? "border-[#ffa500] text-[#004d00] dark:text-[#ffa500]"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archived Items & Inventory ({totalArchivedCount})</span>
          </button>
        </div>

        {/* MODE 1: CREATE NEW RECORD FORM */}
        {modalTab === "create" ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Target Section Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Select Workspace Section
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[
                  { id: "keyword", label: "Keyword", icon: TrendingUp },
                  { id: "competitor", label: "Competitor", icon: Layers },
                  { id: "content", label: "Content", icon: FileText },
                  { id: "citation", label: "Citation", icon: ShieldCheck },
                  { id: "transcript", label: "Transcript", icon: Mic },
                  { id: "log", label: "Event Log", icon: Sparkles },
                ].map((s) => {
                  const Icon = s.icon;
                  const isSelected = section === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSection(s.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-[#004d00] text-[#ffa500] border-[#003300] shadow"
                          : "bg-gray-50 dark:bg-[#060e06] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#003300] hover:bg-gray-100 dark:hover:bg-[#002600]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mb-1" />
                      <span className="text-[10px]">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Initial Archive State Selector (Archive support) */}
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#003300] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-[#ffa500]" />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Record Visibility Status</span>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {createAsArchived
                      ? "Item will be created directly in the Archived repository."
                      : "Item will be immediately active in live tracking matrices."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateAsArchived(!createAsArchived)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  createAsArchived
                    ? "bg-amber-600 text-white"
                    : "bg-green-700 text-white"
                }`}
              >
                {createAsArchived ? "Directly Archive" : "Active Live"}
              </button>
            </div>

            {/* 1. Keyword Form Fields */}
            {section === "keyword" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Keyword / Phrase *</label>
                  <input
                    type="text"
                    required
                    value={kwName}
                    onChange={(e) => setKwName(e.target.value)}
                    placeholder="e.g. conversational search intent optimization"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06] focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Monthly Search Volume</label>
                    <input
                      type="number"
                      value={kwVolume}
                      onChange={(e) => setKwVolume(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Search Intent</label>
                    <select
                      value={kwIntent}
                      onChange={(e) => setKwIntent(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Informational">Informational</option>
                      <option value="Transactional">Transactional</option>
                      <option value="Navigational">Navigational</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Current Ranking Position (1-100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={kwRank}
                      onChange={(e) => setKwRank(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">AI Overview Likelihood (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={kwAiProb}
                      onChange={(e) => setKwAiProb(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Competitor Form Fields */}
            {section === "competitor" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Competitor Name *</label>
                  <input
                    type="text"
                    required
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    placeholder="e.g. BrightEdge AI Enterprise"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Domain Name / URL *</label>
                  <input
                    type="text"
                    required
                    value={compDomain}
                    onChange={(e) => setCompDomain(e.target.value)}
                    placeholder="e.g. brightedge.com"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Domain Authority (DA 1-100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={compDA}
                      onChange={(e) => setCompDA(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Estimated Organic Traffic</label>
                    <input
                      type="text"
                      value={compTraffic}
                      onChange={(e) => setCompTraffic(e.target.value)}
                      placeholder="e.g. 150K/mo"
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Content Piece Form Fields */}
            {section === "content" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Deliverable Title *</label>
                  <input
                    type="text"
                    required
                    value={cntTitle}
                    onChange={(e) => setCntTitle(e.target.value)}
                    placeholder="e.g. 2026 Guide to AI Overview Citations and EEAT"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Deliverable Type</label>
                    <select
                      value={cntType}
                      onChange={(e) => setCntType(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                    >
                      <option value="Blog Post">Blog Post (4 Total)</option>
                      <option value="Guest Blog">Guest Blog (4 Total)</option>
                      <option value="Informational Piece">Informational Piece (8 Total)</option>
                      <option value="Press Release">Press Release (2 Total)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Keyword</label>
                    <input
                      type="text"
                      value={cntTargetKw}
                      onChange={(e) => setCntTargetKw(e.target.value)}
                      placeholder="e.g. AI SEO Agency"
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Citation Form Fields */}
            {section === "citation" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Platform Name *</label>
                  <input
                    type="text"
                    required
                    value={citPlatform}
                    onChange={(e) => setCitPlatform(e.target.value)}
                    placeholder="e.g. Clutch.co Agency Directory"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Platform Category</label>
                    <select
                      value={citCategory}
                      onChange={(e) => setCitCategory(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                    >
                      <option value="Industry Profile">Industry Profile (7 Total)</option>
                      <option value="Google Business Profile">Google Business Profile (GBP)</option>
                      <option value="Local Directory">Local Directory</option>
                      <option value="Q&A Platform">Q&A Platform</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Average Star Rating (1.0 - 5.0)</label>
                    <input
                      type="text"
                      value={citRating}
                      onChange={(e) => setCitRating(e.target.value)}
                      placeholder="4.9"
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. Transcript Form Fields */}
            {section === "transcript" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Meeting / Audio Title *</label>
                  <input
                    type="text"
                    required
                    value={trTitle}
                    onChange={(e) => setTrTitle(e.target.value)}
                    placeholder="e.g. Q3 AI SEO Roadmap & Deliverables Call"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Transcript Content</label>
                  <textarea
                    rows={3}
                    value={trText}
                    onChange={(e) => setTrText(e.target.value)}
                    placeholder="Paste audio meeting notes or live transcript..."
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                  />
                </div>
              </div>
            )}

            {/* 6. Event Log Form Fields */}
            {section === "log" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Event Category</label>
                  <select
                    value={logCategory}
                    onChange={(e) => setLogCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                  >
                    <option value="Algorithm">Algorithm Update</option>
                    <option value="On-Page">On-Page Optimization</option>
                    <option value="Link-Building">Link Acquisition</option>
                    <option value="Content">Local Content Marketing</option>
                    <option value="Audit">Setup & Audit</option>
                    <option value="A2A">A2A Judge Run</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Event Description *</label>
                  <input
                    type="text"
                    required
                    value={logEvent}
                    onChange={(e) => setLogEvent(e.target.value)}
                    placeholder="e.g. Deployed 45-word direct answer blocks across all 8 info pieces."
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-[#003300]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-[#002600] hover:bg-gray-200 dark:hover:bg-[#003300] text-gray-700 dark:text-gray-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow transition-all active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>Add Record to Workspace</span>
              </button>
            </div>
          </form>
        ) : (
          /* MODE 2: ARCHIVE & RECORD MANAGER */
          <div className="p-6 space-y-4">
            {/* Search & Category Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-2 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manageSearch}
                  onChange={(e) => setManageSearch(e.target.value)}
                  placeholder="Search item name or details..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06] focus:outline-none focus:ring-1 focus:ring-[#ffa500]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={manageCategory}
                  onChange={(e) => setManageCategory(e.target.value as any)}
                  className="text-xs p-1.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06]"
                >
                  <option value="all">All Entity Types</option>
                  <option value="keyword">Keywords</option>
                  <option value="competitor">Competitors</option>
                  <option value="content">Content Pieces</option>
                </select>

                <select
                  value={manageFilterState}
                  onChange={(e) => setManageFilterState(e.target.value as any)}
                  className="text-xs p-1.5 rounded-lg border border-gray-300 dark:border-[#003300] dark:bg-[#060e06] font-semibold text-amber-700 dark:text-[#ffa500]"
                >
                  <option value="archived">Archived Records Only</option>
                  <option value="active">Active Live Records</option>
                  <option value="all">All Records</option>
                </select>
              </div>
            </div>

            {/* List of Managed Items */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-100 dark:divide-[#002600]">
              {filteredManagedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                  <Archive className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-semibold">No records match the selected archive filter.</p>
                  <p className="text-[11px] mt-1">Use the Archive buttons on Keyword or Competitor tables to move records here.</p>
                </div>
              ) : (
                filteredManagedItems.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="pt-2 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            item.type === "keyword"
                              ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200"
                              : item.type === "competitor"
                              ? "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200"
                              : "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200"
                          }`}
                        >
                          {item.type}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        {item.archived ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                            Archived
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-green-100 text-green-900 dark:bg-green-950/60 dark:text-green-300">
                            Active Live
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Archive / Restore Action */}
                      <button
                        type="button"
                        onClick={() => {
                          if (item.type === "keyword" && onToggleArchiveKeyword) {
                            onToggleArchiveKeyword(item.id);
                          } else if (item.type === "competitor" && onToggleArchiveCompetitor) {
                            onToggleArchiveCompetitor(item.id);
                          } else if (item.type === "content" && onToggleArchiveContentPiece) {
                            onToggleArchiveContentPiece(item.id);
                          }
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                          item.archived
                            ? "bg-green-50 text-[#004d00] border-green-300 hover:bg-green-100 dark:bg-green-950 dark:text-green-200 dark:border-[#004d00]"
                            : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700"
                        }`}
                        title={item.archived ? "Restore to active matrix" : "Move to archive"}
                      >
                        {item.archived ? (
                          <>
                            <ArchiveRestore className="w-3 h-3 text-green-700 dark:text-green-300" />
                            <span>Restore</span>
                          </>
                        ) : (
                          <>
                            <Archive className="w-3 h-3 text-amber-700 dark:text-amber-300" />
                            <span>Archive</span>
                          </>
                        )}
                      </button>

                      {/* Permanent Delete Action */}
                      <button
                        type="button"
                        onClick={() => {
                          if (item.type === "keyword" && onDeleteKeyword) {
                            onDeleteKeyword(item.id);
                          } else if (item.type === "competitor" && onDeleteCompetitor) {
                            onDeleteCompetitor(item.id);
                          }
                        }}
                        className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-[#003300] flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-[#004d00] text-white text-xs font-bold hover:bg-[#003a00] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

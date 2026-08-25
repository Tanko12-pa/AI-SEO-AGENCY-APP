import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Activity,
  History,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Bell,
  Sliders,
  Copy,
  Check,
  FileSpreadsheet,
} from "lucide-react";
import { INITIAL_ALGORITHM_UPDATES } from "../../data/initialData";
import {
  generateAlgorithmPlaybook,
  scanRealtimeAlgorithms,
  PlaybookResult,
  AlgorithmScanResult,
} from "../../services/api";
import { AlgorithmUpdate } from "../../types";

export const AlgorithmUpdatesView: React.FC = () => {
  const [selectedUpdate, setSelectedUpdate] = useState<AlgorithmUpdate>(INITIAL_ALGORITHM_UPDATES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [playbook, setPlaybook] = useState<PlaybookResult | null>(null);
  const [copiedPlaybook, setCopiedPlaybook] = useState(false);
  const [scanResult, setScanResult] = useState<AlgorithmScanResult | null>(null);
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);

  // Archive filters
  const [searchFilter, setSearchFilter] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("All");
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"radar" | "archive">("radar");

  // Initial scan on mount
  useEffect(() => {
    handleScanAlgorithms();
  }, []);

  const handleScanAlgorithms = async () => {
    setIsScanning(true);
    try {
      const res = await scanRealtimeAlgorithms({
        searchEngine: "Google",
        focusDomain: "AI Search & Enterprise",
      });
      setScanResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleGeneratePlaybook = async (updateToUse?: AlgorithmUpdate) => {
    const target = updateToUse || selectedUpdate;
    setIsGenerating(true);
    try {
      const res = await generateAlgorithmPlaybook({
        updateName: target.name,
        impactArea: target.focus,
        currentSymptoms: "Fluctuations in informational queries, voice search answers, and Google AI Overview citations.",
      });
      setPlaybook(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPlaybook = () => {
    if (!playbook) return;
    const text = `# ${playbook.playbookTitle}\nRisk Level: ${playbook.riskLevel}\nEstimated Impact: ${playbook.estimatedImpact}\n\n## Step-by-Step Remediation:\n${playbook.stepByStepActions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n## Content & Schema Adjustments:\n${playbook.contentAdjustments.map((c) => `- ${c}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedPlaybook(true);
    setTimeout(() => setCopiedPlaybook(false), 2500);
  };

  // Filter archived algorithm updates
  const filteredUpdates = INITIAL_ALGORITHM_UPDATES.filter((upd) => {
    const matchesSearch =
      upd.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      upd.focus.toLowerCase().includes(searchFilter.toLowerCase()) ||
      upd.description.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesYear =
      yearFilter === "All" || upd.releaseDate.startsWith(yearFilter);

    const matchesSeverity =
      severityFilter === "All" || upd.impactLevel === severityFilter;

    return matchesSearch && matchesYear && matchesSeverity;
  });

  return (
    <div id="algorithm-intel-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#004d00] rounded-xl p-6 text-white border border-[#003300] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#003300] text-[11px] text-[#ffa500] font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-[#ffa500]" />
            Continuous Real-Time Search Engine Algorithm Monitoring & Defense
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Google Algorithm Intel, Live Radar & Archive
          </h1>
          <p className="text-xs text-green-100 max-w-2xl">
            Continuously tracking updates and changes to major search engine algorithms in real-time. Detect significant volatility, generate instant strategic alerts, and archive past updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View switcher */}
          <div className="bg-[#003300] p-1 rounded-lg border border-[#002800] flex items-center text-xs">
            <button
              onClick={() => setViewMode("radar")}
              className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "radar"
                  ? "bg-[#ffa500] text-slate-950 shadow"
                  : "text-green-100 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Radar & Alerts</span>
            </button>
            <button
              onClick={() => setViewMode("archive")}
              className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "archive"
                  ? "bg-[#ffa500] text-slate-950 shadow"
                  : "text-green-100 hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Historical Archive</span>
            </button>
          </div>

          <button
            onClick={handleScanAlgorithms}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow transition-all active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Scanning SERPs..." : "Scan Algorithm Radar"}</span>
          </button>
        </div>
      </div>

      {/* Real-time Status Radar Ticker */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        {/* Volatility Meter */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
              SERP Volatility Index
            </div>
            <div className="text-2xl font-black text-red-600 mt-0.5 flex items-center gap-1.5">
              <span>{scanResult ? scanResult.volatilityScore : "8.7"}</span>
              <span className="text-xs font-normal text-gray-500">/ 10.0</span>
            </div>
            <div className="text-[10px] text-red-700 font-bold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-red-600" />
              <span>{scanResult ? scanResult.volatilityStatus : "High Volatility Active"}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Live Monitoring Pulse */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
              Scanner Radar Status
            </div>
            <div className="text-sm font-bold text-[#004d00] mt-1 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>24/7 Active Polling</span>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              Google Core, Helpful Content & SGE
            </div>
          </div>
          <button
            onClick={() => setIsLiveMonitoring(!isLiveMonitoring)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
              isLiveMonitoring
                ? "bg-green-50 text-[#004d00] border-green-200 hover:bg-green-100"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            {isLiveMonitoring ? "ENABLED" : "PAUSED"}
          </button>
        </div>

        {/* AI Overviews Capture Impact */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
            AI Overview Citations
          </div>
          <div className="text-2xl font-black text-[#004d00] mt-0.5">+22.4%</div>
          <div className="text-[10px] text-green-700 font-bold mt-0.5">
            45-word concise answer block lift
          </div>
        </div>

        {/* Unverified Content Penalty */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
            Authorless Content Classifiers
          </div>
          <div className="text-2xl font-black text-amber-700 mt-0.5">-28.6%</div>
          <div className="text-[10px] text-amber-800 font-bold mt-0.5">
            Demoted on informational queries
          </div>
        </div>
      </div>

      {/* VIEW 1: LIVE RADAR & ACTIVE BREAKING ALERT */}
      {viewMode === "radar" && (
        <div className="space-y-6">
          {/* Breaking Real-Time Detected Alert Box */}
          {scanResult && scanResult.detectedAlert && (
            <div className="bg-gradient-to-r from-red-50 via-amber-50 to-white rounded-xl p-5 border-2 border-red-300 shadow-sm space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-red-600 text-white shadow-sm">
                    <Bell className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                        {scanResult.detectedAlert.severity} ALERT
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {scanResult.detectedAlert.timestamp}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-gray-900 mt-0.5">
                      {scanResult.detectedAlert.headline}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => handleGeneratePlaybook()}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap active:scale-[0.98] disabled:opacity-50"
                >
                  <Zap className={`w-3.5 h-3.5 text-[#ffa500] ${isGenerating ? "animate-spin" : ""}`} />
                  <span>{isGenerating ? "Generating..." : "Generate Recovery Playbook"}</span>
                </button>
              </div>

              <p className="text-xs text-gray-800 font-medium leading-relaxed">
                {scanResult.detectedAlert.impactSummary}
              </p>

              {/* Impact Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-white border border-gray-200 space-y-1">
                  <strong className="text-[#004d00] block text-[11px] uppercase tracking-wider font-bold">
                    Content & Snippet Impact
                  </strong>
                  <p className="text-gray-700 text-[11px] leading-snug">
                    {scanResult.detectedAlert.strategicImpact.contentImpact}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-gray-200 space-y-1">
                  <strong className="text-amber-800 block text-[11px] uppercase tracking-wider font-bold">
                    Technical & Schema Impact
                  </strong>
                  <p className="text-gray-700 text-[11px] leading-snug">
                    {scanResult.detectedAlert.strategicImpact.technicalImpact}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-gray-200 space-y-1">
                  <strong className="text-purple-800 block text-[11px] uppercase tracking-wider font-bold">
                    E-E-E-A-T Signal Requirement
                  </strong>
                  <p className="text-gray-700 text-[11px] leading-snug">
                    {scanResult.detectedAlert.strategicImpact.eeatImpact}
                  </p>
                </div>
              </div>

              {/* Urgent Action Checklist */}
              <div className="bg-white/80 p-3.5 rounded-lg border border-red-200/60 space-y-2">
                <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#004d00]" />
                  Immediate Recommended Counter-Measures:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-gray-700">
                  {scanResult.detectedAlert.urgentActionItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 bg-gray-50 p-2 rounded border border-gray-100">
                      <span className="font-bold text-[#004d00]">{idx + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Algorithm Timeline Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#004d00]" />
                Select Update for Tactical Breakdown & Adaptation:
              </h3>
              <span className="text-xs text-gray-500">
                Click any card to load its deep-dive playbook
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {INITIAL_ALGORITHM_UPDATES.slice(0, 3).map((upd) => {
                const isSelected = selectedUpdate.id === upd.id;
                return (
                  <div
                    key={upd.id}
                    onClick={() => {
                      setSelectedUpdate(upd);
                      setPlaybook(null);
                    }}
                    className={`p-5 rounded-xl border text-xs cursor-pointer transition-all space-y-3 ${
                      isSelected
                        ? "bg-[#004d00] text-white border-[#003300] shadow-md ring-2 ring-[#ffa500]"
                        : "bg-white text-gray-900 border-gray-200 shadow-sm hover:border-[#004d00]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSelected
                            ? "bg-[#ffa500] text-slate-950"
                            : upd.impactLevel === "Critical"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-50 text-[#004d00]"
                        }`}
                      >
                        {upd.impactLevel} Impact
                      </span>
                      <span className={`font-mono text-[11px] ${isSelected ? "text-green-200" : "text-gray-500"}`}>
                        {upd.releaseDate}
                      </span>
                    </div>

                    <div>
                      <h4 className={`text-sm font-bold ${isSelected ? "text-[#ffa500]" : "text-gray-900"}`}>
                        {upd.name}
                      </h4>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? "text-green-100" : "text-gray-600"}`}>
                        {upd.description}
                      </p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-gray-200/40">
                      <div className={`font-semibold text-[10px] uppercase tracking-wider ${isSelected ? "text-green-200" : "text-gray-400"}`}>
                        Focus & AI Factor:
                      </div>
                      <div className={`p-2 rounded text-[11px] ${
                        isSelected ? "bg-[#003300] text-green-100" : "bg-gray-50 text-gray-700"
                      }`}>
                        {upd.focus}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Defense Playbook Result Container */}
          {playbook ? (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    Gemini 3.7 Flash Defensive Playbook
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{playbook.playbookTitle}</h3>
                  <div className="text-xs text-gray-500 mt-0.5 font-medium">
                    Risk Level: <strong className="text-amber-800">{playbook.riskLevel}</strong> • Estimated Impact: <span className="text-[#004d00] font-bold">{playbook.estimatedImpact}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPlaybook}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
                  >
                    {copiedPlaybook ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPlaybook ? "Copied!" : "Copy Playbook"}</span>
                  </button>
                  <button
                    onClick={() => handleGeneratePlaybook()}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow-sm transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                {/* Step-by-Step Defense Actions */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2.5">
                  <h4 className="font-bold text-[#004d00] flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#004d00]" />
                    Step-by-Step Technical Remediation:
                  </h4>
                  <div className="space-y-2">
                    {playbook.stepByStepActions.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-700 bg-white p-2 rounded border border-gray-100">
                        <span className="font-bold text-[#004d00] bg-green-50 px-1.5 py-0.2 rounded text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content & Schema Adjustments */}
                <div className="bg-amber-50/60 p-4 rounded-lg border border-amber-200 space-y-2.5">
                  <h4 className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                    <Sparkles className="w-4 h-4 text-[#ffa500]" />
                    Required Content & Schema Adjustments:
                  </h4>
                  <div className="space-y-2">
                    {playbook.contentAdjustments.map((adj, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-800 bg-white/90 p-2 rounded border border-amber-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{adj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200 text-gray-500 space-y-3">
              <ShieldAlert className="w-8 h-8 text-[#ffa500] mx-auto" />
              <div>
                <div className="font-bold text-gray-900 text-sm">
                  Selected Algorithm: {selectedUpdate.name}
                </div>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                  Synthesize an emergency Gemini 3.7 Flash adaptation roadmap with specific remediation steps for this update.
                </p>
              </div>
              <button
                onClick={() => handleGeneratePlaybook()}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 text-[#ffa500] ${isGenerating ? "animate-spin" : ""}`} />
                <span>{isGenerating ? "Synthesizing Defense Playbook..." : "Generate AI Defense Playbook"}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: HISTORICAL ALGORITHM UPDATES ARCHIVE DASHBOARD */}
      {viewMode === "archive" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Archive Filter Bar */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search archived algorithm updates..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Year Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-semibold">Year:</span>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="p-2 rounded-lg border border-gray-300 bg-gray-50 font-medium text-xs text-gray-700"
                >
                  <option value="All">All Years (2024-2026)</option>
                  <option value="2026">2026 Updates</option>
                  <option value="2025">2025 Updates</option>
                  <option value="2024">2024 Updates</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-semibold">Impact:</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="p-2 rounded-lg border border-gray-300 bg-gray-50 font-medium text-xs text-gray-700"
                >
                  <option value="All">All Impact Levels</option>
                  <option value="Critical">Critical Impact</option>
                  <option value="High">High Impact</option>
                  <option value="Moderate">Moderate Impact</option>
                </select>
              </div>
            </div>
          </div>

          {/* Archive Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUpdates.map((upd) => (
              <div
                key={upd.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3.5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        upd.impactLevel === "Critical"
                          ? "bg-red-50 text-red-800 border border-red-200"
                          : upd.impactLevel === "High"
                          ? "bg-amber-50 text-amber-900 border border-amber-200"
                          : "bg-green-50 text-[#004d00] border border-green-200"
                      }`}
                    >
                      {upd.impactLevel} Impact
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1.5">{upd.name}</h3>
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap">
                    {upd.releaseDate}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {upd.description}
                </p>

                <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-500 block">
                      Target Focus:
                    </span>
                    <span className="text-gray-900 font-medium">{upd.focus}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#004d00] block">
                      Recommended Strategic Action:
                    </span>
                    <span className="text-gray-700 leading-snug">{upd.recommendedAction}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono">
                    Factor: {upd.aiSearchFactor}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedUpdate(upd);
                      setViewMode("radar");
                      handleGeneratePlaybook(upd);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#004d00] hover:text-[#ffa500] transition-colors"
                  >
                    <span>Generate Playbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredUpdates.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200 text-gray-500 space-y-2">
              <History className="w-6 h-6 text-gray-400 mx-auto" />
              <div className="font-bold text-gray-800 text-xs">No updates match your filter criteria</div>
              <p className="text-[11px]">Try resetting search or year filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Zap,
  Globe,
  FileText,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Eye,
  Smartphone,
  Laptop,
  Code,
  Download,
  Share2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Layers,
  HelpCircle,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { optimizeContent, ContentOptimizationResult } from "../../services/api";

interface AIContentOptimizerProps {
  onInsertToDeliverables?: (title: string, keyword: string, snippet: string) => void;
}

const SAMPLE_PRESETS = [
  {
    name: "Enterprise SaaS AI Search Guide",
    keyword: "AI Search Engine Optimization",
    url: "https://apex-healthtech.com/ai-search-guide",
    audience: "Enterprise B2B Decision Makers & SEO Leaders",
    text: `Search engines are undergoing a monumental shift with Google AI Overviews, Perplexity, and conversational chatbots. In 2026, websites must transition from raw keyword density to topical authority, verified author credentials, and structured 45-word direct answers. Traditional SEO tactics like keyword stuffing fail under Google's helpful content systems. Brands need first-hand testing data, verified author Person schema markup, and rapid mobile page experiences with Interaction to Next Paint (INP) under 200ms to capture AI search citations.`,
  },
  {
    name: "Medical & Health EEAT Clinical Guide",
    keyword: "Clinical AI Healthcare Compliance",
    url: "https://biogen-medical.org/clinical-ai-compliance",
    audience: "Healthcare Providers & Medical Compliance Officers",
    text: `Healthcare compliance for artificial intelligence systems requires rigorous adherence to HIPAA regulations, FDA Software as a Medical Device (SaMD) classifications, and patient data governance. When evaluating medical algorithms, clinical trials must provide peer-reviewed statistical validation with audited patient outcome datasets. Without verified medical board credentials and transparent practitioner oversight, automated health tools cannot achieve clinical deployment.`,
  },
  {
    name: "FinTech Cybersecurity Blueprint",
    keyword: "Zero Trust Banking Architecture",
    url: "https://finguard-cyber.io/zero-trust-banking",
    audience: "Chief Information Security Officers (CISOs) & Financial Engineers",
    text: `Financial institutions face escalating threats targeting distributed ledger systems and cloud microservices. Implementing a Zero Trust architecture mandates continuous micro-segmentation, multi-factor cryptographic authentication, and automated threat telemetry. By enforcing least-privilege access controls and real-time anomaly detection, modern banks protect transaction pipelines against unauthorized exfiltration.`,
  },
];

export const AIContentOptimizer: React.FC<AIContentOptimizerProps> = ({
  onInsertToDeliverables,
}) => {
  // Input Mode: "text" | "url" | "hybrid"
  const [inputMode, setInputMode] = useState<"text" | "url" | "hybrid">("hybrid");

  // Inputs
  const [targetKeyword, setTargetKeyword] = useState("AI Search Engine Optimization");
  const [urlInput, setUrlInput] = useState("https://client-site.com/ai-search-guide");
  const [contentTextInput, setContentTextInput] = useState(SAMPLE_PRESETS[0].text);
  const [targetAudience, setTargetAudience] = useState("B2B Enterprise Decision Makers & SEO Leaders");

  // Processing & State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<ContentOptimizationResult | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Copied states
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Completed Checklist Items (tracked locally)
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  // Real-time client-side stats calculation
  const clientStats = useMemo(() => {
    const text = contentTextInput.trim();
    if (!text) {
      return { words: 0, chars: 0, sentences: 0, kwCount: 0, kwDensity: "0.0%" };
    }
    const wordsArray = text.split(/\s+/).filter(Boolean);
    const words = wordsArray.length;
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    // keyword frequency
    const kw = targetKeyword.trim().toLowerCase();
    let kwCount = 0;
    if (kw) {
      const lower = text.toLowerCase();
      let pos = 0;
      while ((pos = lower.indexOf(kw, pos)) !== -1) {
        kwCount++;
        pos += kw.length;
      }
    }
    const kwWords = kw ? kw.split(/\s+/).length : 1;
    const density = words > 0 ? ((kwCount * kwWords) / words) * 100 : 0;

    return {
      words,
      chars,
      sentences: sentences || 1,
      kwCount,
      kwDensity: `${density.toFixed(1)}%`,
    };
  }, [contentTextInput, targetKeyword]);

  // Load Preset
  const handleLoadPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setTargetKeyword(preset.keyword);
    setUrlInput(preset.url);
    setContentTextInput(preset.text);
    setTargetAudience(preset.audience);
  };

  // Run Optimization
  const handleRunOptimizer = async () => {
    setIsOptimizing(true);
    try {
      const res = await optimizeContent({
        contentText: contentTextInput,
        url: urlInput,
        targetKeyword: targetKeyword,
        targetAudience: targetAudience,
      });
      setResult(res);
      setCompletedTasks({});
    } catch (err) {
      console.error("Content Optimizer failed:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Toggle Task Checklist
  const toggleTask = (taskName: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskName]: !prev[taskName],
    }));
  };

  // Copy Full Markdown Audit Report
  const handleExportAuditReport = () => {
    if (!result) return;
    const md = `# AI CONTENT OPTIMIZATION AUDIT REPORT (2026)
Target Keyword: ${targetKeyword}
Target URL: ${urlInput || "N/A"}
Target Audience: ${targetAudience}
Generated At: 2026-08-24

## SCORES
- Overall Optimization Score: ${result.optimizationScore}/100
- EEAT Compliance Score: ${result.eeatScore}/100
- Readability Score: ${result.readabilityScore}/100 (${result.readabilityStructure.fleschKincaidLevel})
- Google AI Overview Citation Probability: ${result.aiSearchReadiness}%

## 1. TITLE & META SPECIFICATIONS
- Recommended Title: ${result.titleTagMeta.recommendedTitle} (${result.titleTagMeta.titleCharCount} chars)
- Recommended Meta: ${result.titleTagMeta.recommendedMeta} (${result.titleTagMeta.metaCharCount} chars)
- CTR Formula: ${result.titleTagMeta.ctrImprovementFormula}

## 2. 45-WORD DIRECT ANSWER BLOCK (Google AI Overviews)
"${result.readabilityStructure.directAnswerBlock45Words}"

## 3. HEADING HIERARCHY
- H1: ${result.readabilityStructure.recommendedH1}
${result.readabilityStructure.recommendedH2s.map((h, i) => `  - H2.${i + 1}: ${h}`).join("\n")}

## 4. KEYWORD & LSI INTEGRATION
- Primary Density: ${result.keywordIntegration.primaryDensity}
- LSI Entities:
${result.keywordIntegration.lsiEntities.map((l) => `  * ${l.keyword} (${l.importance}) - ${l.recommendedUsage}`).join("\n")}

## 5. EEAT SIGNALS & SCHEMA
- Experience Proof: ${result.eeatSignals.experienceProof}
- Authoritativeness: ${result.eeatSignals.authoritativeness}
- JSON-LD Schema:
\`\`\`json
${result.eeatSignals.recommendedJsonLdSchema}
\`\`\`

## 6. ACTION CHECKLIST
${result.actionChecklist.map((a) => `- [ ] [${a.priority}] ${a.task}`).join("\n")}
`;

    navigator.clipboard.writeText(md);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div id="ai-content-optimizer-component" className="space-y-6">
      {/* Top Controls & Presets Bar */}
      <div className="bg-white dark:bg-[#0b170b] rounded-xl p-5 border border-gray-200 dark:border-[#163016] shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#163016] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ffa500]/10 dark:bg-[#ffa500]/20 border border-[#ffa500]/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#ffa500]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                AI Content Optimizer & EEAT Audit Core
                <span className="text-[10px] bg-green-100 dark:bg-[#003300] text-[#004d00] dark:text-[#ffa500] font-mono px-2 py-0.5 rounded font-bold">
                  2026 Engine
                </span>
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Audits raw text & URLs against Google AI Overviews, Flesch-Kincaid readability, EEAT signals, and keyword density.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#060e06] p-1 rounded-lg border border-gray-200 dark:border-[#163016] text-xs">
            <button
              onClick={() => setInputMode("hybrid")}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                inputMode === "hybrid"
                  ? "bg-[#004d00] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Hybrid (Text + URL)
            </button>
            <button
              onClick={() => setInputMode("text")}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                inputMode === "text"
                  ? "bg-[#004d00] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Raw Text Copy
            </button>
            <button
              onClick={() => setInputMode("url")}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                inputMode === "url"
                  ? "bg-[#004d00] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Live URL Scrape
            </button>
          </div>
        </div>

        {/* Preset Sample Quick-Loads */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-[#ffa500]" />
            Quick Presets:
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleLoadPreset(preset)}
              className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#122412] hover:bg-green-50 dark:hover:bg-[#183618] border border-gray-200 dark:border-[#1a3d1a] text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:text-[#004d00] dark:hover:text-[#ffa500] transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Target Focus Keyword:
            </label>
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="e.g. AI Search Engine Optimization"
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-[#1e461e] bg-white dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ffa500] focus:outline-none"
            />
          </div>

          {(inputMode === "url" || inputMode === "hybrid") && (
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Target Webpage URL:
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://client-site.com/guide"
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-[#1e461e] bg-white dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ffa500] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Target Audience / Search Intent:
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. B2B Enterprise Decision Makers"
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-[#1e461e] bg-white dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ffa500] focus:outline-none"
            />
          </div>
        </div>

        {/* Text Input Area with Live Metrics Bar */}
        {(inputMode === "text" || inputMode === "hybrid") && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Draft Content / Webpage Copy:
              </label>
              <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500 dark:text-gray-400">
                <span>Words: <strong className="text-gray-800 dark:text-gray-200">{clientStats.words}</strong></span>
                <span>Sentences: <strong className="text-gray-800 dark:text-gray-200">{clientStats.sentences}</strong></span>
                <span>Keyword Count: <strong className="text-[#004d00] dark:text-[#ffa500]">{clientStats.kwCount}</strong></span>
                <span>Density: <strong className="text-[#004d00] dark:text-[#ffa500]">{clientStats.kwDensity}</strong></span>
              </div>
            </div>
            <textarea
              value={contentTextInput}
              onChange={(e) => setContentTextInput(e.target.value)}
              rows={4}
              placeholder="Paste article body or draft text here for comprehensive multi-pillar AI optimization..."
              className="w-full p-3 text-xs rounded-lg border border-gray-300 dark:border-[#1e461e] bg-white dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ffa500] focus:outline-none font-mono leading-relaxed"
            />
          </div>
        )}

        {/* Action Button Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-[#004d00] dark:text-[#ffa500]" />
            <span>Auditing EEAT Compliance • Flesch-Kincaid • 45-Word SGE Block • LSI Density</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setContentTextInput("");
                setUrlInput("");
              }}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-[#1e461e] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#122412] text-xs font-semibold transition-colors"
            >
              Clear
            </button>
            <button
              id="run-ai-content-optimizer-btn"
              onClick={handleRunOptimizer}
              disabled={isOptimizing}
              className="flex items-center gap-2 px-6 py-2 rounded-md bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 text-[#ffa500] ${isOptimizing ? "animate-spin" : ""}`} />
              <span>{isOptimizing ? "Optimizing with Gemini 3.7..." : "Run AI Content Optimization"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* OPTIMIZATION RESULTS CONTAINER */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Executive Scorecard Ticker */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white dark:bg-[#0b170b] p-4 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm text-center">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-semibold">
                Overall AI Optimization
              </span>
              <div className="text-3xl font-black text-[#004d00] dark:text-[#10b981] mt-0.5">
                {result.optimizationScore} <span className="text-sm font-normal text-gray-400">/ 100</span>
              </div>
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold">
                Tier-1 AI Search Ready
              </span>
            </div>

            <div className="bg-white dark:bg-[#0b170b] p-4 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm text-center">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-semibold">
                EEAT Compliance Index
              </span>
              <div className="text-3xl font-black text-[#004d00] dark:text-[#10b981] mt-0.5">
                {result.eeatScore} <span className="text-sm font-normal text-gray-400">/ 100</span>
              </div>
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold">
                Verified Author Signals
              </span>
            </div>

            <div className="bg-white dark:bg-[#0b170b] p-4 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm text-center">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-semibold">
                Readability & Flow
              </span>
              <div className="text-3xl font-black text-amber-600 dark:text-[#ffa500] mt-0.5">
                {result.readabilityScore} <span className="text-sm font-normal text-gray-400">/ 100</span>
              </div>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
                {result.readabilityStructure.fleschKincaidLevel}
              </span>
            </div>

            <div className="bg-white dark:bg-[#0b170b] p-4 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm text-center">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-semibold">
                Google AI Overview Citation
              </span>
              <div className="text-3xl font-black text-orange-600 dark:text-orange-400 mt-0.5">
                {result.aiSearchReadiness}%
              </div>
              <span className="text-[10px] text-orange-700 dark:text-orange-300 font-bold">
                High Probability Capture
              </span>
            </div>
          </div>

          {/* Executive Summary & Export Banner */}
          <div className="bg-white dark:bg-[#0b170b] rounded-xl p-5 border border-gray-200 dark:border-[#163016] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#004d00] dark:text-[#ffa500]" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Executive Optimization Diagnosis
                </h4>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed">
                {result.executiveSummary}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleExportAuditReport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-gray-100 dark:bg-[#122412] hover:bg-gray-200 dark:hover:bg-[#183618] border border-gray-200 dark:border-[#1e461e] text-xs font-semibold text-gray-800 dark:text-gray-200 transition-colors"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReport ? "Report Copied!" : "Export Full Report (MD)"}</span>
              </button>
            </div>
          </div>

          {/* PILLAR 1: Title Tag & Meta Description with Interactive SERP Simulation */}
          <div className="bg-white dark:bg-[#0b170b] rounded-xl p-5 border border-gray-200 dark:border-[#163016] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-[#163016] pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#004d00] dark:text-[#ffa500]" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  1. Title Tag & Meta Description Optimization (Google SERP Simulation)
                </h4>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#060e06] p-1 rounded-md border border-gray-200 dark:border-[#163016] text-[11px]">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded font-semibold ${
                    previewDevice === "desktop"
                      ? "bg-white dark:bg-[#122412] text-[#004d00] dark:text-[#ffa500] shadow-xs"
                      : "text-gray-500"
                  }`}
                >
                  <Laptop className="w-3 h-3" /> Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded font-semibold ${
                    previewDevice === "mobile"
                      ? "bg-white dark:bg-[#122412] text-[#004d00] dark:text-[#ffa500] shadow-xs"
                      : "text-gray-500"
                  }`}
                >
                  <Smartphone className="w-3 h-3" /> Mobile
                </button>
              </div>
            </div>

            {/* Google SERP Simulated Card */}
            <div
              className={`p-4 rounded-xl border border-gray-200 dark:border-[#1e461e] space-y-1.5 transition-all ${
                previewDevice === "mobile" ? "max-w-md mx-auto bg-gray-50 dark:bg-[#060e06]" : "bg-gray-50 dark:bg-[#060e06]"
              }`}
            >
              <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-[#ffa500]" />
                Google AI Search Snippet Preview ({previewDevice.toUpperCase()})
              </div>
              <div className="text-[#1a0dab] dark:text-[#60a5fa] hover:underline text-base font-medium cursor-pointer leading-snug">
                {result.titleTagMeta.recommendedTitle}
              </div>
              <div className="text-[11px] text-[#006621] dark:text-[#4ade80] font-mono truncate">
                {urlInput || "https://client-site.com"} › guide › {targetKeyword.toLowerCase().replace(/ /g, "-")}
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                {result.titleTagMeta.recommendedMeta}
              </p>
            </div>

            {/* Title & Meta Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-green-50/60 dark:bg-[#081f08] rounded-lg border border-green-200 dark:border-[#164016] space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-[#004d00] dark:text-green-300">Recommended Title Tag:</strong>
                  <span className="font-mono text-[10px] text-green-800 dark:text-[#ffa500] font-bold">
                    {result.titleTagMeta.titleCharCount} / 60 chars (Optimal Pixel Width)
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-[#060e06] rounded border border-green-100 dark:border-[#1a4a1a] font-medium text-gray-900 dark:text-white">
                  {result.titleTagMeta.recommendedTitle}
                </div>
                <div className="text-[11px] text-gray-600 dark:text-gray-400">
                  Assessment: {result.titleTagMeta.currentTitleAssessment}
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/60 dark:bg-[#1a1405] rounded-lg border border-amber-200 dark:border-[#40300a] space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-amber-900 dark:text-amber-300">Recommended Meta Description:</strong>
                  <span className="font-mono text-[10px] text-amber-800 dark:text-[#ffa500] font-bold">
                    {result.titleTagMeta.metaCharCount} / 155 chars (High CTR Formula)
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-[#060e06] rounded border border-amber-100 dark:border-[#4d3a0f] font-medium text-gray-900 dark:text-white">
                  {result.titleTagMeta.recommendedMeta}
                </div>
                <div className="text-[11px] text-gray-600 dark:text-gray-400">
                  Formula: <strong className="text-amber-800 dark:text-amber-300">{result.titleTagMeta.ctrImprovementFormula}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* PILLAR 2: Readability & 45-Word Google AI Overview Answer Block */}
          <div className="bg-white dark:bg-[#0b170b] rounded-xl p-5 border border-gray-200 dark:border-[#163016] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#163016] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ffa500]" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  2. Readability, Heading Structure & 45-Word Direct SGE Answer Block
                </h4>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.readabilityStructure.directAnswerBlock45Words);
                  setCopiedAnswer(true);
                  setTimeout(() => setCopiedAnswer(false), 2500);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-gray-100 dark:bg-[#122412] hover:bg-gray-200 dark:hover:bg-[#183618] text-gray-700 dark:text-gray-200 transition-colors"
              >
                {copiedAnswer ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAnswer ? "Copied Block!" : "Copy 45-Word Answer"}</span>
              </button>
            </div>

            {/* 45-Word Direct Answer Block */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-[#1a1405] dark:to-[#241505] border border-amber-200 dark:border-[#40300a] space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-[#ffa500] text-amber-950 dark:text-slate-950 font-bold text-[10px] uppercase">
                  Google AI Overview Snippet Format (45 Words)
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                  Inject directly under main H1
                </span>
              </div>
              <p className="text-xs text-gray-900 dark:text-gray-100 font-medium leading-relaxed italic">
                "{result.readabilityStructure.directAnswerBlock45Words}"
              </p>
            </div>

            {/* Heading Hierarchy Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-gray-50 dark:bg-[#060e06] rounded-lg border border-gray-200 dark:border-[#163016] space-y-2">
                <strong className="text-gray-900 dark:text-white block">Recommended H1:</strong>
                <div className="font-bold text-[#004d00] dark:text-[#ffa500] bg-white dark:bg-[#0b170b] p-2.5 rounded border border-gray-200 dark:border-[#1e461e]">
                  {result.readabilityStructure.recommendedH1}
                </div>
                <div className="text-[11px] text-gray-500">
                  Status: <strong className="text-green-700 dark:text-green-400">{result.readabilityStructure.headingHierarchyStatus}</strong>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 dark:bg-[#060e06] rounded-lg border border-gray-200 dark:border-[#163016] space-y-2">
                <strong className="text-gray-900 dark:text-white block">Recommended H2 Section Sequence:</strong>
                <div className="space-y-1.5">
                  {result.readabilityStructure.recommendedH2s.map((h2, i) => (
                    <div
                      key={i}
                      className="text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0b170b] p-2 rounded border border-gray-100 dark:border-[#1a3d1a] text-[11px] flex items-center gap-2"
                    >
                      <span className="font-bold text-[#ffa500] dark:text-[#ffa500]">H2.{i + 1}</span>
                      <span>{h2}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PILLARS 3, 4 & 5: Keywords/LSI, EEAT Signals & Actionable Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
            {/* 3. Semantic Entities & LSI Keyword Density */}
            <div className="bg-white dark:bg-[#0b170b] p-5 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-3.5">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-[#163016] pb-2">
                <Sliders className="w-4 h-4 text-[#004d00] dark:text-[#ffa500]" />
                3. Semantic Entities & Density
              </h4>

              <div className="flex items-center justify-between bg-gray-50 dark:bg-[#060e06] p-2.5 rounded-lg border border-gray-100 dark:border-[#163016]">
                <span className="text-gray-600 dark:text-gray-400">Primary Keyword Density:</span>
                <strong className="text-[#004d00] dark:text-[#10b981] font-mono text-sm">
                  {result.keywordIntegration.primaryDensity}
                </strong>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">
                  LSI Keyword Placement Targets:
                </span>
                {result.keywordIntegration.lsiEntities.map((lsi, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-gray-50 dark:bg-[#060e06] rounded-lg border border-gray-100 dark:border-[#163016] space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-gray-900 dark:text-white">{lsi.keyword}</strong>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {lsi.importance}
                      </span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-[10px]">{lsi.recommendedUsage}</div>
                  </div>
                ))}
              </div>

              {result.keywordIntegration.semanticGaps.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">
                    Semantic Gaps to Address:
                  </span>
                  <div className="space-y-1 mt-1">
                    {result.keywordIntegration.semanticGaps.map((gap, i) => (
                      <div key={i} className="text-[11px] text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                        <span className="text-red-500">•</span>
                        <span>{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. EEAT Compliance Signals & JSON-LD Person Schema */}
            <div className="bg-white dark:bg-[#0b170b] p-5 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-3.5">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-[#163016] pb-2">
                <CheckCircle2 className="w-4 h-4 text-[#004d00] dark:text-[#ffa500]" />
                4. EEAT Compliance & Schema
              </h4>

              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-green-50 dark:bg-[#081f08] rounded-lg border border-green-100 dark:border-[#164016] text-gray-800 dark:text-gray-200">
                  <strong className="text-[#004d00] dark:text-green-300 block text-[10px] uppercase font-bold">
                    Experience Proof Points:
                  </strong>
                  {result.eeatSignals.experienceProof}
                </div>

                <div className="p-2.5 bg-amber-50 dark:bg-[#1a1405] rounded-lg border border-amber-100 dark:border-[#40300a] text-gray-800 dark:text-gray-200">
                  <strong className="text-amber-900 dark:text-amber-300 block text-[10px] uppercase font-bold">
                    Authoritativeness & Trust:
                  </strong>
                  {result.eeatSignals.authoritativeness}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.eeatSignals.recommendedJsonLdSchema);
                    setCopiedSchema(true);
                    setTimeout(() => setCopiedSchema(false), 2500);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#122412] hover:bg-gray-200 dark:hover:bg-[#183618] text-gray-800 dark:text-gray-200 font-semibold transition-colors border border-gray-200 dark:border-[#1e461e]"
                >
                  <Code className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                  <span>{copiedSchema ? "Schema Markup Copied!" : "Copy JSON-LD Person Schema"}</span>
                </button>
              </div>
            </div>

            {/* 5. Actionable Suggestions Checklist with Interactive Checkboxes */}
            <div className="bg-white dark:bg-[#0b170b] p-5 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#163016] pb-2">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#ffa500]" />
                  5. Actionable Roadmap
                </h4>
                <span className="text-[10px] text-gray-500 font-mono">
                  {Object.values(completedTasks).filter(Boolean).length} / {result.actionChecklist.length} Fixed
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                {result.actionChecklist.map((act, i) => {
                  const isDone = Boolean(completedTasks[act.task]);
                  return (
                    <div
                      key={i}
                      onClick={() => toggleTask(act.task)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2 ${
                        isDone
                          ? "bg-green-50 dark:bg-[#081f08] border-green-200 dark:border-[#164016] line-through text-gray-400 dark:text-gray-500"
                          : "bg-gray-50 dark:bg-[#060e06] border-gray-100 dark:border-[#163016] text-gray-800 dark:text-gray-200 hover:border-gray-300 dark:hover:border-[#1e461e]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleTask(act.task)}
                        className="mt-0.5 rounded text-[#004d00] focus:ring-[#ffa500]"
                      />
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              act.priority === "High"
                                ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300"
                                : "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300"
                            }`}
                          >
                            {act.priority}
                          </span>
                        </div>
                        <p className="leading-snug">{act.task}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Core Web Vitals & Mobile Tip */}
              <div className="p-2.5 bg-gray-50 dark:bg-[#060e06] rounded-lg border border-gray-100 dark:border-[#163016] text-[11px]">
                <strong className="text-gray-900 dark:text-white block text-[10px] uppercase font-bold">
                  Core Web Vitals & Scannability:
                </strong>
                <span className="text-gray-600 dark:text-gray-400">
                  {result.mobileFriendliness.coreWebVitalsTip}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

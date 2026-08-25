import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Gauge,
  Heart,
  Eye,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  FileText,
  HelpCircle,
  Copy,
  Check,
  BrainCircuit,
} from "lucide-react";
import {
  SentimentEngagementResult,
  analyzeContentSentimentAndEngagement,
} from "../../services/api";
import { ContentPieceItem } from "../../types";

interface SentimentEngagementGaugeProps {
  contentPieces?: ContentPieceItem[];
  defaultTitle?: string;
  defaultText?: string;
  onApplyRecommendations?: (recommendations: string[]) => void;
}

export const SentimentEngagementGauge: React.FC<SentimentEngagementGaugeProps> = ({
  contentPieces = [],
  defaultTitle = "Google AI Overviews Optimization & 45-Word Answer Blueprint",
  defaultText = "",
  onApplyRecommendations,
}) => {
  const [selectedPieceId, setSelectedPieceId] = useState<string>("custom");
  const [contentTitle, setContentTitle] = useState<string>(defaultTitle);
  const [contentText, setContentText] = useState<string>(defaultText);
  const [contentType, setContentType] = useState<string>("Blog Post");
  const [targetAudience, setTargetAudience] = useState<string>(
    "Tech Leaders, CMOs, & SEO Practitioners"
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] =
    useState<SentimentEngagementResult | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Trigger analysis
  const handleRunAnalysis = async (customTitle?: string, customText?: string) => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeContentSentimentAndEngagement({
        contentTitle: customTitle !== undefined ? customTitle : contentTitle,
        contentText: customText !== undefined ? customText : contentText,
        contentType,
        targetAudience,
      });
      setAnalysisResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run on mount or when default title changes
  useEffect(() => {
    handleRunAnalysis(defaultTitle, defaultText);
  }, []);

  // Handle selecting an existing content piece
  const handleSelectPiece = (pieceId: string) => {
    setSelectedPieceId(pieceId);
    if (pieceId === "custom") {
      setContentTitle("Google AI Overviews Optimization & 45-Word Answer Blueprint");
      setContentText("");
      handleRunAnalysis("Google AI Overviews Optimization & 45-Word Answer Blueprint", "");
    } else {
      const found = contentPieces.find((p) => p.id === pieceId);
      if (found) {
        setContentTitle(found.title);
        setContentText(
          `Target Keyword: ${found.targetKeyword}. Category: ${found.category}. Delivered asset for organic search authority.`
        );
        setContentType(found.category);
        handleRunAnalysis(
          found.title,
          `Target Keyword: ${found.targetKeyword}. Category: ${found.category}.`
        );
      }
    }
  };

  const handleCopyPrompt = () => {
    if (analysisResult?.simulatedGeminiPrompt) {
      navigator.clipboard.writeText(analysisResult.simulatedGeminiPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const score = analysisResult?.readerEngagementScore || 85;

  // Gauge angle calculation (-90 deg to +90 deg)
  const gaugeAngle = -90 + (score / 100) * 180;

  // Rating label & color
  const getRatingTier = (val: number) => {
    if (val >= 90) return { label: "Exceptional Engagement", color: "#10b981", badge: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300" };
    if (val >= 75) return { label: "High Engagement Potential", color: "#004d00", badge: "bg-green-100 text-[#004d00] dark:bg-green-950 dark:text-green-300" };
    if (val >= 55) return { label: "Moderate Engagement", color: "#f59e0b", badge: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300" };
    return { label: "Low Retention Risk", color: "#ef4444", badge: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300" };
  };

  const tier = getRatingTier(score);

  return (
    <div
      id="sentiment-engagement-gauge-section"
      className="bg-white dark:bg-[#071207] rounded-xl border border-gray-200 dark:border-[#142e14] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#142e14] bg-gray-50/70 dark:bg-[#091609] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#004d00] dark:bg-[#0e2c0e] text-[#ffa500] flex items-center justify-center shadow-xs">
            <Heart className="w-4 h-4 text-[#ffa500]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>Real-Time Content Sentiment & Engagement Gauge</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ffa500] text-slate-950">
                Gemini NLP Powered
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Evaluates emotional resonance, clarity index, and reader dwell potential for newly drafted articles.
            </p>
          </div>
        </div>

        {/* Action Button & Selector */}
        <div className="flex items-center gap-2 text-xs">
          {contentPieces.length > 0 && (
            <select
              value={selectedPieceId}
              onChange={(e) => handleSelectPiece(e.target.value)}
              className="p-2 rounded-lg border border-gray-200 dark:border-[#1e421e] bg-white dark:bg-[#050e05] font-semibold text-gray-700 dark:text-gray-300 text-xs"
            >
              <option value="custom">✍️ Custom Draft Analyzer</option>
              {contentPieces.map((p) => (
                <option key={p.id} value={p.id}>
                  📄 {p.title.length > 32 ? p.title.substring(0, 32) + "..." : p.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => handleRunAnalysis()}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow-xs transition-all active:scale-98 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
            <span>{isAnalyzing ? "Analyzing..." : "Re-Calculate Gauge"}</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Body: Inputs + Interactive Gauge + Metrics Breakdown */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Live Input & Content Controls */}
        <div className="lg:col-span-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Content Title / Headline
            </label>
            <input
              type="text"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              placeholder="e.g. Complete Guide to AI Search & Natural Language SEO"
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#1e421e] bg-white dark:bg-[#050e05] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 dark:border-[#1e421e] bg-white dark:bg-[#050e05] text-gray-900 dark:text-gray-100"
              >
                <option value="Blog Post">Blog Post (Thought Leadership)</option>
                <option value="Guest Blog">Guest Blog (EEAT Backlink)</option>
                <option value="Informational Piece">Informational Piece (AI Snippet)</option>
                <option value="Press Release">Press Release (PR & Citations)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Audience Persona
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. CMOs, Search Marketers"
                className="w-full text-xs p-2 rounded-lg border border-gray-300 dark:border-[#1e421e] bg-white dark:bg-[#050e05] text-gray-900 dark:text-gray-100"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Sample Text / Opening Hook (Optional)
            </label>
            <textarea
              rows={3}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Paste draft paragraph or lead sentence here to evaluate emotional friction and dwell time..."
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 dark:border-[#1e421e] bg-white dark:bg-[#050e05] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
            />
          </div>

          {/* Prompt Transparency Box */}
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#0c1a0c] border border-gray-200 dark:border-[#1e421e] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1">
                <BrainCircuit className="w-3 h-3 text-[#ffa500]" />
                Simulated Gemini Prompt
              </span>
              <button
                onClick={handleCopyPrompt}
                className="text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 font-bold flex items-center gap-1"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? "Copied" : "Copy Prompt"}</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 font-mono italic leading-relaxed">
              "{analysisResult?.simulatedGeminiPrompt || "Analyze emotional tone, hook power, and reader dwell probability for digital content optimization."}"
            </p>
          </div>
        </div>

        {/* Center/Right Col: Interactive Gauge & Score Display */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* SVG Semi-Circle Needle Gauge */}
            <div className="sm:col-span-6 flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50/80 dark:bg-[#0b180b] border border-gray-200 dark:border-[#1e421e]">
              <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
                <svg viewBox="0 0 200 110" className="w-48 h-28">
                  {/* Outer Track Arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    strokeLinecap="round"
                    className="dark:stroke-gray-800"
                  />
                  {/* Red Zone (0 - 45%) */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 65 35"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray="1 1"
                  />
                  {/* Amber Zone (45% - 75%) */}
                  <path
                    d="M 65 35 A 80 80 0 0 1 135 35"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="16"
                  />
                  {/* Green Zone (75% - 100%) */}
                  <path
                    d="M 135 35 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />

                  {/* Needle Pivot & Line */}
                  <g transform="translate(100, 100)">
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-68"
                      stroke="#004d00"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      transform={`rotate(${gaugeAngle})`}
                      className="dark:stroke-[#ffa500] transition-transform duration-700 ease-out"
                    />
                    <circle cx="0" cy="0" r="7" fill="#004d00" className="dark:fill-[#ffa500]" />
                    <circle cx="0" cy="0" r="3" fill="#ffffff" />
                  </g>
                </svg>

                {/* Score Counter overlay */}
                <div className="absolute bottom-0 text-center">
                  <div className="text-3xl font-black text-gray-950 dark:text-white tracking-tight">
                    {score}
                    <span className="text-sm font-semibold text-gray-400">/100</span>
                  </div>
                </div>
              </div>

              {/* Tier Label Badge */}
              <div className="mt-3 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${tier.badge}`}>
                  {tier.label}
                </span>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Dominant Sentiment: <strong>{analysisResult?.sentiment || "Inspiring & Authoritative"}</strong>
                </div>
              </div>
            </div>

            {/* Metric Bars Grid */}
            <div className="sm:col-span-6 space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  <span>Emotional Resonance</span>
                  <span className="font-bold text-green-700 dark:text-green-400">
                    {analysisResult?.emotionalResonance || 86}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#004d00] dark:bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult?.emotionalResonance || 86}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  <span>Clarity & Cognitive Ease</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    {analysisResult?.clarityIndex || 92}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult?.clarityIndex || 92}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  <span>Click-Through Hook Power</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    {analysisResult?.hookPowerScore || 89}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#ffa500] h-full rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult?.hookPowerScore || 89}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  <span>EEAT Trust Factor</span>
                  <span className="font-bold text-purple-700 dark:text-purple-400">
                    {analysisResult?.eeatTrustFactor || 94}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult?.eeatTrustFactor || 94}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Drivers & Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-[#0c1f0c] border border-green-200 dark:border-[#1e421e] space-y-1.5">
              <strong className="text-green-950 dark:text-green-200 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#004d00] dark:text-green-400" />
                Key Engagement Drivers:
              </strong>
              {(analysisResult?.engagementDrivers || [
                "Direct benefit-oriented proposition in lead paragraph",
                "High semantic density with verified entity citations",
              ]).map((d, i) => (
                <p key={i} className="text-green-900 dark:text-green-300 pl-4 relative before:content-['•'] before:absolute before:left-1">
                  {d}
                </p>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-[#1f190c] border border-amber-200 dark:border-[#42341e] space-y-1.5">
              <strong className="text-amber-950 dark:text-amber-200 flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-[#ffa500]" />
                Optimization Recommendations:
              </strong>
              {(analysisResult?.recommendations || [
                "Insert 45-word direct answer block immediately under H1",
                "Break long sentences in third section into 2-sentence chunks",
              ]).map((r, i) => (
                <p key={i} className="text-amber-900 dark:text-amber-300 pl-4 relative before:content-['•'] before:absolute before:left-1">
                  {r}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

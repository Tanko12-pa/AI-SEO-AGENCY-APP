import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Brain,
  Mic,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  TrendingUp,
} from "lucide-react";
import { runSeoAudit, AuditResult } from "../../services/api";

export const AISearchEEATView: React.FC = () => {
  const [urlInput, setUrlInput] = useState("https://client-agency.com");
  const [topicInput, setTopicInput] = useState("AI Search Optimization & EEAT Services");
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"auditor" | "technologies" | "eeat-framework" | "mistakes">("auditor");

  const handleRunAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const res = await runSeoAudit({
        url: urlInput,
        topic: topicInput,
        targetAudience: "B2B decision makers & enterprise searchers",
        currentRankings: "Position 4-12 for high-intent keywords",
      });
      setAuditResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-search-eeat-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#004d00] rounded-xl p-6 text-white border border-[#003300] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#003300] text-[11px] text-[#ffa500] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#ffa500]" />
            Search Engine Architecture & EEAT Authority
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Search Technologies & EEAT Authority Engine
          </h1>
          <p className="text-xs text-green-100 max-w-2xl">
            Evaluate how Natural Language Processing (NLP), Machine Learning, Voice Search,
            and Google AI Overviews evaluate search intent and author trustworthiness.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#003300] p-1.5 rounded-lg border border-[#002800] text-xs">
          <button
            onClick={() => setActiveSubTab("auditor")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeSubTab === "auditor"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            Live EEAT Auditor
          </button>
          <button
            onClick={() => setActiveSubTab("technologies")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeSubTab === "technologies"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            AI Technologies
          </button>
          <button
            onClick={() => setActiveSubTab("eeat-framework")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeSubTab === "eeat-framework"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            EEAT Pillars
          </button>
          <button
            onClick={() => setActiveSubTab("mistakes")}
            className={`px-3 py-1.5 rounded font-semibold transition-all ${
              activeSubTab === "mistakes"
                ? "bg-[#ffa500] text-slate-950 shadow"
                : "text-green-100 hover:text-white"
            }`}
          >
            Common Pitfalls
          </button>
        </div>
      </div>

      {/* SubTab 1: Live EEAT & AI Search Auditor */}
      {activeSubTab === "auditor" && (
        <div className="space-y-6">
          {/* Audit Trigger Form */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ffa500]" />
              Run Live AI Search & EEAT Audit with Gemini 3.7 Flash
            </h3>
            <form onSubmit={handleRunAudit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target URL / Domain</label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://yourdomain.com"
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Niche Topic / Target Keyword</label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="AI SEO and voice search"
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
                />
              </div>
              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-md font-bold text-xs shadow transition-all ${
                    isLoading
                      ? "bg-[#003300] text-[#ffa500] cursor-wait"
                      : "bg-[#ffa500] hover:brightness-110 text-slate-950 active:scale-[0.98]"
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>{isLoading ? "Auditing..." : "Audit Now"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Audit Results Visualization */}
          {auditResult ? (
            <div className="space-y-6">
              {/* Scorecard */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-[#004d00] text-white p-4 rounded-xl border border-[#003300] text-center">
                  <div className="text-xs text-green-200 font-semibold">Overall AI SEO</div>
                  <div className="text-3xl font-bold text-[#ffa500] mt-1">{auditResult.overallScore}/100</div>
                  <div className="text-[10px] text-green-300 mt-0.5 font-bold">Top Tier</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 font-semibold">EEAT Score</div>
                  <div className="text-3xl font-bold text-[#004d00] mt-1">{auditResult.eeatScore}/100</div>
                  <div className="text-[10px] text-green-700 mt-0.5 font-bold">High Trust</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 font-semibold">AI Overview Trigger</div>
                  <div className="text-3xl font-bold text-orange-600 mt-1">{auditResult.aiSearchReadiness}%</div>
                  <div className="text-[10px] text-amber-800 mt-0.5 font-bold">Optimal Snippet</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 font-semibold">Technical Score</div>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{auditResult.technicalScore}/100</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 font-bold">Crawl Efficient</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 font-semibold">Content Quality</div>
                  <div className="text-3xl font-bold text-[#004d00] mt-1">{auditResult.contentQualityScore}/100</div>
                  <div className="text-[10px] text-green-700 mt-0.5 font-bold">NLP Aligned</div>
                </div>
              </div>

              {/* Executive Audit Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Overview & SGE Strategy */}
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#ffa500]" />
                    Google AI Overview Snippet Trigger Optimization
                  </h4>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-1">
                    <div className="font-bold text-amber-900">
                      Trigger Probability: <span className="text-[#004d00]">{auditResult.aiOverviewOptimization.triggerProbability}</span>
                    </div>
                    <div className="text-gray-700">
                      <strong>Recommended Format:</strong> {auditResult.aiOverviewOptimization.recommendedAnswerFormat}
                    </div>
                    <div className="text-gray-600">
                      <strong>Target Query:</strong> "{auditResult.aiOverviewOptimization.snippetTargetQuery}"
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-700">
                    <div className="font-bold text-gray-900">Immediate Action Steps:</div>
                    {auditResult.aiOverviewOptimization.actionSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#004d00] flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EEAT 4-Pillar Evaluation */}
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#004d00]" />
                    EEAT 4-Pillar Breakdown
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                      <strong className="text-[#004d00] block mb-0.5">1. Experience (First-Hand Testing):</strong>
                      <p className="text-gray-600">{auditResult.eeatEvaluation.experience}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                      <strong className="text-[#004d00] block mb-0.5">2. Expertise (Subject Matter Depth):</strong>
                      <p className="text-gray-600">{auditResult.eeatEvaluation.expertise}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                      <strong className="text-[#004d00] block mb-0.5">3. Authoritativeness (Citations & Graph):</strong>
                      <p className="text-gray-600">{auditResult.eeatEvaluation.authoritativeness}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                      <strong className="text-[#004d00] block mb-0.5">4. Trustworthiness (Security & Transparency):</strong>
                      <p className="text-gray-600">{auditResult.eeatEvaluation.trustworthiness}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Issues & Quick Wins */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Critical Issues Detected
                  </h4>
                  <div className="space-y-2 text-xs">
                    {auditResult.criticalIssues.map((issue, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-950 flex items-start gap-2">
                        <span className="font-bold text-red-700">#{idx + 1}</span>
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#004d00] flex items-center gap-1.5 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#004d00]" />
                    Quick Optimization Wins
                  </h4>
                  <div className="space-y-2 text-xs">
                    {auditResult.quickWins.map((win, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-green-950 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#004d00] flex-shrink-0 mt-0.5" />
                        <span>{win}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-10 text-center border border-gray-200 text-gray-500 space-y-2">
              <Sparkles className="w-8 h-8 text-[#ffa500] mx-auto" />
              <div className="font-bold text-gray-800">Ready to execute AI Search & EEAT Audit</div>
              <p className="text-xs max-w-md mx-auto">
                Click "Audit Now" above to analyze the target domain against Google's 2026 Core Algorithm standards.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SubTab 2: AI Search Technologies */}
      {activeSubTab === "technologies" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-green-50 text-[#004d00] flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Natural Language Processing (NLP)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Google algorithms no longer perform literal string matching. Modern search understands semantic relationships,
              conversational context, sentence sentiment, and entity clustering.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Machine Learning & Quality Models</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Algorithms continuously learn from real human search behavior, dwell time, navigation paths, and verified user satisfaction,
              dynamically adjusting rankings for maximum utility.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-green-50 text-[#004d00] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Predictive Search Modeling</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Anticipating the user’s next 3 questions before they type them. By structuring content to answer sequential inquiries,
              pages capture follow-up AI overview citations.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Voice Search Optimization</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Siri, Google Assistant, and Alexa queries are conversational and question-based. Optimizing for direct speech syntax ensures
              audio answers pull from your verified content.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-green-50 text-[#004d00] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">AI-Generated Summaries (SGE)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Google synthesizes multi-source answers in the top SERP module. Our 45-word direct answer blocks position your brand as the primary cited authority.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Personalized Search Experiences</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Search results adapt dynamically to user location, historical preferences, device type, and topical familiarity. Local citations reinforce geographic relevance.
            </p>
          </div>
        </div>
      )}

      {/* SubTab 3: EEAT Framework */}
      {activeSubTab === "eeat-framework" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="text-xs font-bold uppercase text-[#004d00] bg-green-50 px-2.5 py-1 rounded w-fit">
              E — Experience
            </div>
            <h3 className="text-sm font-bold text-gray-900">First-Hand Practitioner Proof</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Google algorithms scan for tangible proof that the author personally used the product, executed the workflow, or visited the location. Includes original data, real photos, and benchmark results.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="text-xs font-bold uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded w-fit">
              E — Expertise
            </div>
            <h3 className="text-sm font-bold text-gray-900">Subject Matter Mastery</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Formal knowledge, technical accuracy, and domain authority. Evaluated through author biography schema (`Person`), verified credentials, and citations in peer-reviewed industry publications.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="text-xs font-bold uppercase text-[#004d00] bg-green-50 px-2.5 py-1 rounded w-fit">
              A — Authoritativeness
            </div>
            <h3 className="text-sm font-bold text-gray-900">Entity Graph & Industry Citations</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              How often other trusted experts refer to your domain as a definitive source. Built through digital PR, guest articles on reputable publications, and topical backlink equity.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="text-xs font-bold uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded w-fit">
              T — Trustworthiness
            </div>
            <h3 className="text-sm font-bold text-gray-900">Transparency & Web Security</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              The cornerstone of EEAT. Transparent business contact information (NAP), verified reviews (Google, Trustpilot), clear refund policies, HTTPS encryption, and editorial integrity.
            </p>
          </div>
        </div>
      )}

      {/* SubTab 4: Common Pitfalls */}
      {activeSubTab === "mistakes" && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs space-y-2">
            <h4 className="font-bold text-red-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-700" />
              Top 4 Critical Mistakes Businesses Make in AI SEO
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1">
                <strong className="text-red-950 block">1. Overusing Raw AI-Generated Content:</strong>
                <p className="text-gray-600">
                  Publishing generic AI output without human editing, fact-checking, or original case study metrics triggers automated Helpful Content demotions.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1">
                <strong className="text-red-950 block">2. Focusing Only on Exact Keywords:</strong>
                <p className="text-gray-600">
                  Keyword stuffing ignores modern NLP and conversational search intent. Modern search engines penalize awkward phrasing in favor of natural semantic answers.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1">
                <strong className="text-red-950 block">3. Ignoring User Experience & Mobile Speed:</strong>
                <p className="text-gray-600">
                  Even the best content fails if page load exceeds 2 seconds or mobile navigation is clunky. Core Web Vitals directly dictate crawl budget and ranking stability.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1">
                <strong className="text-red-950 block">4. Neglecting Structured Data Schema:</strong>
                <p className="text-gray-600">
                  Failing to provide JSON-LD schema (FAQ, HowTo, Person, Organization) blinds AI search bots from parsing your exact answer blocks for AI Overview snippets.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

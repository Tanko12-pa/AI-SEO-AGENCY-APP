import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Wrench,
  FileCode,
  Terminal,
} from "lucide-react";
import { runA2AJudgeLoop, A2AJudgeResult } from "../../services/api";
import { EEATAuditTrendChart } from "../a2a/EEATAuditTrendChart";

export const A2AJudgeView: React.FC = () => {
  const [taskType, setTaskType] = useState("AI Search Overview Content & Schema Strategy");
  const [targetKeyword, setTargetKeyword] = useState("Natural Language Processing SEO for Enterprise");
  const [strategyContext, setStrategyContext] = useState("Optimizing for Google AI Overviews and high EEAT authority with conversational schema");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<A2AJudgeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [maintenanceRunning, setMaintenanceRunning] = useState(false);
  const [maintenanceComplete, setMaintenanceComplete] = useState(false);

  const handleRunA2A = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsRunning(true);
    setMaintenanceComplete(false);
    try {
      const res = await runA2AJudgeLoop({
        taskType,
        targetKeyword,
        strategyContext,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteSelfMaintenance = () => {
    setMaintenanceRunning(true);
    setTimeout(() => {
      setMaintenanceRunning(false);
      setMaintenanceComplete(true);
    }, 1500);
  };

  return (
    <div id="a2a-judge-view" className="space-y-6">
      {/* Header */}
      <div className="bg-[#004d00] rounded-xl p-6 text-white border border-[#003300] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#003300] text-[11px] text-[#ffa500] font-semibold">
            <Bot className="w-3.5 h-3.5 text-[#ffa500]" />
            Agent-to-Agent (A2A) Autonomous Governance
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            A2A & Adversarial Judge Agent Studio
          </h1>
          <p className="text-xs text-green-100 max-w-2xl">
            Autonomous dual-agent loop: Agent Alpha generates optimized SEO strategy and prompts,
            while Agent Omega (Google Algorithm Judge) stress-tests against EEAT, Helpful Content guidelines,
            and executes self-maintenance to remove errors.
          </p>
        </div>

        <button
          onClick={() => handleRunA2A()}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow transition-all active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
          <span>{isRunning ? "Running Dual A2A Loop..." : "Launch A2A Judge Loop"}</span>
        </button>
      </div>

      {/* Recharts Comparative Audit Pass/Fail Trend Chart */}
      <EEATAuditTrendChart />

      {/* Control & Input Form */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ffa500]" />
          Configure A2A Optimization Task
        </h3>
        <form onSubmit={handleRunA2A} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Task Type</label>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
            >
              <option value="AI Search Overview Content & Schema Strategy">AI Overview Content & Schema Strategy</option>
              <option value="Voice Search Q&A Conversational Script">Voice Search Q&A Conversational Script</option>
              <option value="EEAT Author Node & Entity Graph Prompt">EEAT Author Node & Entity Graph Prompt</option>
              <option value="Competitor Gap Counter-Strategy Asset">Competitor Gap Counter-Strategy Asset</option>
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Target Keyword / Topic</label>
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="e.g. Natural Language Processing SEO"
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Context & Constraints</label>
            <input
              type="text"
              value={strategyContext}
              onChange={(e) => setStrategyContext(e.target.value)}
              placeholder="e.g. 45-word direct answer block + schema"
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa500]"
            />
          </div>
        </form>
      </div>

      {/* Dual Agent Process Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#004d00] text-white p-5 rounded-xl border border-[#003300] shadow-sm relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#003300] text-[#ffa500] flex items-center justify-center font-bold text-xs">
                α
              </span>
              <h4 className="text-sm font-bold">Agent Alpha (Generator Agent)</h4>
            </div>
            <span className="text-[10px] bg-[#003300] text-green-200 px-2 py-0.5 rounded">Creative Core</span>
          </div>
          <p className="text-xs text-green-100 leading-relaxed">
            Constructs the initial high-authority content outline, structured schema, 45-word direct answer block, and conversational Q&A framework.
          </p>
        </div>

        <div className="bg-[#003300] text-white p-5 rounded-xl border border-[#002200] shadow-sm relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#ffa500] text-slate-950 flex items-center justify-center font-bold text-xs">
                Ω
              </span>
              <h4 className="text-sm font-bold">Agent Omega (Adversarial Judge)</h4>
            </div>
            <span className="text-[10px] bg-[#ffa500] text-slate-950 px-2 py-0.5 rounded font-bold">Audit Core</span>
          </div>
          <p className="text-xs text-green-100 leading-relaxed">
            Evaluates against Google Search Essentials, verifies EEAT author proof, calculates AI Overview trigger probability, and generates self-maintenance code fixes.
          </p>
        </div>
      </div>

      {/* Results Container */}
      {result ? (
        <div className="space-y-6">
          {/* Judge Verdict Scorecard */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-[#004d00] flex items-center justify-center font-black text-lg">
                  {result.judgeResult.judgeScore}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">Omega Judge Evaluation Score</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        result.judgeResult.verdict === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      VERDICT: {result.judgeResult.verdict}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{result.judgeResult.judgeCritique}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right text-xs">
                  <div className="text-gray-500 font-medium">EEAT Compliance</div>
                  <strong className="text-[#004d00] font-bold text-sm">
                    {result.judgeResult.eeatComplianceScore}/100
                  </strong>
                </div>
                <div className="text-right text-xs pl-3 border-l border-gray-200">
                  <div className="text-gray-500 font-medium">AI Overview Capture</div>
                  <strong className="text-orange-600 font-bold text-sm">
                    {result.judgeResult.aiOverviewsTriggerScore}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Strengths & Vulnerabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 space-y-1.5">
                <strong className="text-green-950 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#004d00]" />
                  Verified Strengths:
                </strong>
                {result.judgeResult.strengths.map((s, i) => (
                  <p key={i} className="text-green-900 pl-4 relative before:content-['•'] before:absolute before:left-1">
                    {s}
                  </p>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5">
                <strong className="text-amber-950 flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Audit Vulnerabilities & Risks:
                </strong>
                {result.judgeResult.vulnerabilities.map((v, i) => (
                  <p key={i} className="text-amber-900 pl-4 relative before:content-['•'] before:absolute before:left-1">
                    {v}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Self-Maintenance & Automated Error Removal Tool */}
          <div className="bg-gray-900 text-white rounded-xl p-5 border border-gray-800 shadow space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#ffa500]" />
                <div>
                  <h4 className="text-sm font-bold">Self-Maintenance & Automated Code Upgrades</h4>
                  <p className="text-xs text-gray-400">
                    Judge agent automatically applies schema injection and fixes errors in the generated output.
                  </p>
                </div>
              </div>

              <button
                onClick={handleExecuteSelfMaintenance}
                disabled={maintenanceRunning || maintenanceComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all shadow ${
                  maintenanceComplete
                    ? "bg-[#004d00] text-white cursor-default"
                    : maintenanceRunning
                    ? "bg-amber-600 text-white cursor-wait animate-pulse"
                    : "bg-[#ffa500] hover:brightness-110 text-slate-950"
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${maintenanceRunning ? "animate-spin" : ""}`} />
                <span>
                  {maintenanceComplete
                    ? "Maintenance Synchronized"
                    : maintenanceRunning
                    ? "Executing Self-Maintenance..."
                    : "Run Self-Maintenance Upgrade"}
                </span>
              </button>
            </div>

            {/* Self Maintenance Actions List */}
            <div className="bg-black p-3 rounded-lg border border-gray-800 text-xs font-mono space-y-1 text-gray-300">
              <div className="text-[11px] text-[#ffa500] font-semibold mb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Applied Self-Maintenance Fixes:
              </div>
              {result.judgeResult.selfMaintenanceFixes.map((fix, idx) => (
                <div key={idx} className="flex items-center gap-2 text-green-300">
                  <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                  <span>{fix}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Perfected Output Artifact */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#004d00]" />
                <h4 className="text-sm font-bold text-gray-900">
                  Perfected Output Artifact (Judge Certified)
                </h4>
              </div>
              <button
                onClick={() => handleCopy(result.judgeResult.finalOptimizedArtifact)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#004d00]" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                <span>{copied ? "Copied to Clipboard" : "Copy Artifact"}</span>
              </button>
            </div>

            <pre className="bg-gray-950 text-emerald-300 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-96 leading-relaxed border border-gray-800">
              {result.judgeResult.finalOptimizedArtifact}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-10 text-center border border-gray-200 text-gray-500 space-y-2">
          <Bot className="w-8 h-8 text-[#ffa500] mx-auto" />
          <div className="font-bold text-gray-800">A2A Dual Loop Ready</div>
          <p className="text-xs max-w-md mx-auto">
            Click "Launch A2A Judge Loop" above to run Agent Alpha generator and Agent Omega algorithmic judge.
          </p>
        </div>
      )}
    </div>
  );
};

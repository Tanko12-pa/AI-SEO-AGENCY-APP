import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Layers,
  HelpCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { AiActionItem, AiInsightTier } from "../../types";

const INITIAL_ACTIONS: AiActionItem[] = [
  {
    id: "act-1",
    title: "Remediate 4 Inadvertent Noindex Directives on Core Services",
    category: "Critical Issue",
    priority: "P1 - Immediate",
    why: "Staging build pushed meta noindex tags to 4 primary service sub-pages, removing them from Google organic index.",
    impact: "+14.2% Estimated Organic Traffic Recovery within 7 days of re-indexation.",
    how: "Remove X-Robots-Tag header and meta noindex in layout.tsx, then trigger Search Console URL Inspection re-crawl.",
    businessValue: "$4,200/mo in organic lead pipeline value",
    effort: "Low",
    status: "New",
    tier: "Observed Data",
  },
  {
    id: "act-2",
    title: "Capitalize on High-Impression / Low-CTR Commercial Queries",
    category: "Growth Opportunity",
    priority: "P2 - High",
    why: "Query 'enterprise generative search optimization' generates 18,400 monthly impressions at Position #4.2, but has only 1.8% CTR.",
    impact: "+650 High-Intent Clicks/Month by matching search intent and optimizing Title/Meta CTR.",
    how: "Update title tag with commercial power words and add numerical case study proof.",
    businessValue: "$6,800/mo estimated inbound pipeline",
    effort: "Low",
    status: "New",
    tier: "Calculated Insight",
  },
  {
    id: "act-3",
    title: "Inject FAQPage & Service JSON-LD Schema on 6 Money Pages",
    category: "Technical Fix",
    priority: "P2 - High",
    why: "Competitors hold 58% AI Overview share by providing structured Q&A entity pairs in JSON-LD.",
    impact: "Unlocks Rich Snippets in SERP and inclusion in Gemini / AI Overview citations.",
    how: "Generate FAQPage schema using the Schema Generator and paste into HTML head.",
    businessValue: "$3,100/mo organic equity value",
    effort: "Medium",
    status: "Approved",
    tier: "Recommendation",
  },
  {
    id: "act-4",
    title: "Revitalize 3 Declining 2024 Pillar Articles with Fresh 2026 EEAT Data",
    category: "Content Strategy",
    priority: "P3 - Medium",
    why: "3 cornerstone guides have experienced a 22% ranking dip over the last 90 days due to competitor freshness signals.",
    impact: "Restores Top-3 ranking positions across 14 high-volume informational keywords.",
    how: "Add original case study data, updated 2026 algorithm benchmarks, and author credentials.",
    businessValue: "$2,900/mo top-of-funnel traffic value",
    effort: "Medium",
    status: "In Progress",
    tier: "Observed Data",
  },
  {
    id: "act-5",
    title: "Synchronize NAP Consistency Across 12 Verified Local Directories",
    category: "Local SEO",
    priority: "P2 - High",
    why: "Phone number mismatch detected between Yelp, Bing Places, and Google Business Profile.",
    impact: "Strengthens Google Maps 3-pack local algorithm confidence score.",
    how: "Execute directory push to harmonize phone and address formatting.",
    businessValue: "$1,800/mo in local qualified phone inquiries",
    effort: "Low",
    status: "New",
    tier: "Observed Data",
  },
];

const PRESET_QUERIES = [
  "Why did my organic traffic drop recently?",
  "What critical technical problems should I fix first?",
  "Which high-impression pages have low CTR opportunities?",
  "How can I optimize this website for AI Search & GEO?",
  "What are our biggest competitor backlink & keyword gaps?",
  "What should I do before migrating our CMS?",
];

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  tier?: AiInsightTier;
}

export const AiConsultantView: React.FC = () => {
  const [actions, setActions] = useState<AiActionItem[]>(INITIAL_ACTIONS);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello! I am your AI SEO Consultant. I analyze your live website crawl, Search Console impressions, GA4 engagement, Core Web Vitals, and competitor data to provide prioritized, verified recommendations. What would you like to investigate today?",
      timestamp: "Just now",
      tier: "Observed Data",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      let tier: AiInsightTier = "Calculated Insight";

      if (query.toLowerCase().includes("traffic drop") || query.toLowerCase().includes("why")) {
        reply = `Based on connected Search Console & Analytics logs:
1. [Observed Data]: Total organic clicks decreased 12.4% last month following the Core Algorithm update.
2. [Calculated Insight]: 82% of the drop is concentrated on 3 legacy articles lacking modern structured data and author entities.
3. [Recommendation]: Apply our EEAT Optimization workflow to refresh these 3 URLs and submit for re-crawling.
4. [Assumption]: Presumes competitor backlink velocity remains steady over the next 14 days.`;
        tier = "Calculated Insight";
      } else if (query.toLowerCase().includes("fix first") || query.toLowerCase().includes("critical")) {
        reply = `Top 3 prioritized actions for immediate execution:
1. [Observed Data]: 4 service pages have meta noindex headers active from a staging deploy.
2. [Recommendation]: Remove the noindex header immediately—this unlocks ~$4,200/mo in lost lead opportunities.
3. [Recommendation]: Preload your Largest Contentful Paint (LCP) hero asset to bring mobile CWV under 2.5s.`;
        tier = "Recommendation";
      } else {
        reply = `Analysis for: "${query}":
1. [Observed Data]: Your domain currently ranks in the Top 10 for 18 primary target keywords.
2. [Calculated Insight]: You hold a 65% AI Overview citation probability on commercial search queries.
3. [Recommendation]: Deploy FAQPage structured data to capture the remaining 35% Answer Engine real estate.`;
        tier = "Calculated Insight";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        tier,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleActionStatus = (id: string, newStatus: "Approved" | "Rejected") => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div id="ai-consultant-view" className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#ffa500]" />
              <span>AI SEO Consultant & Priority Action Center</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Conversational intelligence engine distinguishing observed data, calculated insights, actionable recommendations, and explicit assumptions.
            </p>
          </div>
        </div>

        {/* 5-Tier Classification Legend */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="font-semibold text-gray-500">Tier Labels:</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
            Observed Data
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
            Calculated Insight
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
            Recommendation
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
            Assumption
          </span>
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-green-950 dark:text-gray-300 font-bold">
            Data Not Available
          </span>
        </div>
      </div>

      {/* Main Grid: Action Center (Left) & Chat Assistant (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: WHAT SHOULD I DO NEXT? (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ffa500]" />
              <span>WHAT SHOULD I DO NEXT? (Top Action Queue)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {actions.filter((a) => a.status === "New").length} Pending Review
            </span>
          </div>

          <div className="space-y-4">
            {actions.map((act) => (
              <div
                key={act.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-green-950/80 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-green-950/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        act.priority.startsWith("P1")
                          ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {act.priority}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500">{act.category}</span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    {act.businessValue}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{act.title}</h4>

                {/* Structured Why -> Impact -> How */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
                    <strong className="text-gray-900 dark:text-white block font-sans">Why:</strong>
                    <p className="text-gray-600 dark:text-gray-300 mt-0.5">{act.why}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                    <strong className="text-emerald-800 dark:text-emerald-300 block font-sans">Impact:</strong>
                    <p className="text-emerald-900 dark:text-emerald-200 mt-0.5 font-medium">{act.impact}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-green-950">
                    <strong className="text-gray-900 dark:text-white block font-sans">How:</strong>
                    <p className="text-gray-600 dark:text-gray-300 mt-0.5">{act.how}</p>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-mono">
                    Status: <strong className="text-gray-700 dark:text-gray-300">{act.status}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleActionStatus(act.id, "Rejected")}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-green-950 text-gray-700 dark:text-gray-300 hover:bg-gray-100 text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleActionStatus(act.id, "Approved")}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#004d00] hover:bg-[#003800] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 text-[#ffa500]" />
                      <span>Approve & Create Task</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Conversational AI SEO Consultant (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-green-950/80 shadow-md flex flex-col justify-between space-y-4 min-h-[580px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-green-950/60 pb-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffa500]" />
                <span>Conversational AI SEO Consultant</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Gemini 3.7 Grounded
              </span>
            </div>

            {/* Preset Query Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Suggested Questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUERIES.slice(0, 4).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-green-950/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-left font-medium transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl ${
                    m.sender === "user"
                      ? "bg-[#004d00] text-white ml-6 shadow-xs"
                      : "bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-green-950 text-gray-800 dark:text-gray-200 mr-4 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] opacity-75 font-mono">
                    <span>{m.sender === "user" ? "You" : "AI SEO Consultant"}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#060e06] text-xs text-gray-400 animate-pulse font-mono">
                  AI Consultant analyzing crawl & analytics telemetry...
                </div>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-green-950/60"
          >
            <input
              type="text"
              placeholder="Ask anything about your SEO strategy..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-green-950 bg-gray-50 dark:bg-[#060e06] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ffa500]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold transition-all shadow-xs"
            >
              <Send className="w-4 h-4 text-[#ffa500]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

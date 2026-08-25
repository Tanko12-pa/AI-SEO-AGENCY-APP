import React from "react";
import {
  TrendingUp,
  Target,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Printer,
} from "lucide-react";

interface MetricCardsProps {
  onDownloadPdf?: () => void;
  totalKeywords?: number;
  topRankingsCount?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  onDownloadPdf,
  totalKeywords = 35,
  topRankingsCount = 28,
}) => {
  const metrics = [
    {
      id: "metric-visibility",
      title: "Organic Visibility",
      value: "94.2%",
      trend: "↑ 4.3% vs Last Month",
      trendColor: "text-green-600",
      subtext: "AI Search + NLP Capture",
    },
    {
      id: "metric-keywords",
      title: "Target Keywords",
      value: `${topRankingsCount}/${totalKeywords}`,
      trend: "All tracked metrics active",
      trendColor: "text-gray-600",
      subtext: "100% in Top 10 SERPs",
    },
    {
      id: "metric-eeat",
      title: "AI Content Score",
      value: "98.1",
      trend: "High EEAT Confidence",
      trendColor: "text-orange-500",
      subtext: "Experience & Author Trust",
    },
    {
      id: "metric-backlinks",
      title: "Backlink Power",
      value: "1.2k",
      trend: "+12 New High DA Links",
      trendColor: "text-green-600",
      subtext: "Authoritative Referrals",
    },
  ];

  return (
    <div id="metric-cards-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m) => (
        <div
          key={m.id}
          id={m.id}
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all"
        >
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
            {m.title}
          </p>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {m.value}
          </h2>
          <div className="flex items-center justify-between mt-2">
            <p className={`text-xs font-medium ${m.trendColor}`}>
              {m.trend}
            </p>
            <span className="text-[10px] text-gray-400 font-medium">
              {m.subtext}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

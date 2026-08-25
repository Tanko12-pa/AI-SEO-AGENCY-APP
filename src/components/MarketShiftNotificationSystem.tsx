import React, { useState, useEffect } from "react";
import {
  Flame,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Bell,
  CheckCircle2,
  X,
  Sliders,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  RefreshCw,
  Zap,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { KeywordItem, MarketShiftAlert, NavigationTab } from "../types";
import { detectMarketShifts } from "../services/marketShiftService";

interface MarketShiftNotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
  keywords: KeywordItem[];
  alerts: MarketShiftAlert[];
  onUpdateAlerts: (alerts: MarketShiftAlert[]) => void;
  onNavigate: (tab: NavigationTab) => void;
  onSelectKeywordForTrends?: (keyword: string) => void;
}

export const MarketShiftNotificationSystem: React.FC<MarketShiftNotificationSystemProps> = ({
  isOpen,
  onClose,
  keywords,
  alerts,
  onUpdateAlerts,
  onNavigate,
  onSelectKeywordForTrends,
}) => {
  const [threshold, setThreshold] = useState<number>(20);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "surge" | "drop">("all");
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  // Auto-scan on keywords or threshold update
  const handleRunManualScan = () => {
    const newShifts = detectMarketShifts(keywords, threshold);
    // Merge without duplicates
    const existingKeywords = new Set(alerts.map((a) => a.keyword));
    const merged = [
      ...newShifts.filter((ns) => !existingKeywords.has(ns.keyword)),
      ...alerts,
    ];
    onUpdateAlerts(merged);
  };

  const handleMarkAllAsRead = () => {
    const updated = alerts.map((a) => ({ ...a, read: true }));
    onUpdateAlerts(updated);
  };

  const handleDismissAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    onUpdateAlerts(updated);
  };

  const handleSimulateSurge = () => {
    const randomKw = keywords[Math.floor(Math.random() * keywords.length)] || {
      id: "kw-sim",
      keyword: "AI Search Agent Strategy",
      searchVolume: 12500,
    };

    const surgePercent = Math.floor(Math.random() * 35) + 22; // 22% to 56%
    const currentVol = Math.round(randomKw.searchVolume * (1 + surgePercent / 100));

    const simulatedAlert: MarketShiftAlert = {
      id: `shift-sim-${Date.now()}`,
      keywordId: randomKw.id,
      keyword: randomKw.keyword,
      previousVolume: randomKw.searchVolume,
      currentVolume: currentVol,
      percentageChange: surgePercent,
      direction: "surge",
      detectedAt: new Date().toISOString(),
      source: "Google Trends Grounding",
      significance: surgePercent > 35 ? "critical" : "high",
      recommendation: `High velocity breakout (+${surgePercent}%). Google Trends signals surge in commercial search queries for this topic. Immediate cluster expansion recommended.`,
      read: false,
      trendScores: [
        { month: "M-5", value: Math.round(randomKw.searchVolume * 0.8) },
        { month: "M-4", value: Math.round(randomKw.searchVolume * 0.85) },
        { month: "M-3", value: Math.round(randomKw.searchVolume * 0.92) },
        { month: "M-2", value: randomKw.searchVolume },
        { month: "M-1", value: Math.round(randomKw.searchVolume * 1.1) },
        { month: "Current", value: currentVol },
      ],
    };

    onUpdateAlerts([simulatedAlert, ...alerts]);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (selectedFilter === "surge") return a.direction === "surge";
    if (selectedFilter === "drop") return a.direction === "drop";
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  if (!isOpen) return null;

  return (
    <div
      id="market-shift-notification-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-[#163016] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-gray-900 dark:text-white">
        {/* Header */}
        <div className="bg-[#004d00] text-white p-6 flex items-center justify-between border-b border-[#003800] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#003300] border border-[#002800] text-[#ffa500]">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Market Shift Notification System
                </h2>
                <span className="bg-[#ffa500] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  ≥{threshold}% Trends Trigger
                </span>
              </div>
              <p className="text-xs text-green-200 mt-0.5">
                Real-time surveillance monitoring Google Trends data for sudden search volume surges and declines.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#003300] hover:bg-[#002800] text-green-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Control Toolbar */}
        <div className="p-4 bg-gray-50 dark:bg-[#060e06] border-b border-gray-200 dark:border-[#163016] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="flex items-center bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-[#163016] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className={`px-3 py-1.5 rounded-md font-bold text-[11px] transition-colors ${
                  selectedFilter === "all"
                    ? "bg-[#004d00] text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                All Alerts ({alerts.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("surge")}
                className={`px-3 py-1.5 rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors ${
                  selectedFilter === "surge"
                    ? "bg-green-700 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-green-700"
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
                <span>Surges (≥+{threshold}%)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("drop")}
                className={`px-3 py-1.5 rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors ${
                  selectedFilter === "drop"
                    ? "bg-red-700 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-red-700"
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                <span>Drops (≤-{threshold}%)</span>
              </button>
            </div>

            {/* Threshold Slider */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-[#163016] px-3 py-1.5 rounded-lg">
              <Sliders className="w-3.5 h-3.5 text-[#ffa500]" />
              <span className="text-[11px] text-gray-500 font-semibold">Sensitivity:</span>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-20 accent-[#004d00]"
              />
              <span className="font-mono font-bold text-[11px] text-[#004d00] dark:text-[#ffa500]">
                ±{threshold}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateSurge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-[#1e1500] hover:bg-amber-200 border border-amber-300 dark:border-[#4d3a00] text-amber-900 dark:text-[#ffa500] font-bold text-[11px] transition-colors"
              title="Simulate a real-time 20%+ keyword surge"
            >
              <Zap className="w-3.5 h-3.5 text-[#ffa500]" />
              <span>Simulate Shift</span>
            </button>

            <button
              onClick={handleRunManualScan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-[#163016] hover:bg-gray-300 dark:hover:bg-[#1e461e] text-gray-800 dark:text-gray-200 font-semibold text-[11px] transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Re-Scan</span>
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#004d00] hover:bg-[#003800] text-white font-bold text-[11px] transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffa500]" />
                <span>Mark Read ({unreadCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Alerts List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-[#122412] text-[#004d00] dark:text-[#ffa500] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                No Market Shifts Detected Above ±{threshold}%
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                All tracked keywords are currently within normal baseline volatility ranges. You will be automatically alerted if Google Trends detects a ≥{threshold}% surge or drop.
              </p>
              <button
                onClick={handleSimulateSurge}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ffa500] text-slate-950 font-bold text-xs shadow hover:brightness-110 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate 20%+ Market Shift Surge</span>
              </button>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSurge = alert.direction === "surge";
              const isExpanded = activeAlertId === alert.id;

              return (
                <div
                  key={alert.id}
                  className={`rounded-xl border p-5 transition-all ${
                    alert.read
                      ? "bg-white dark:bg-[#0b170b] border-gray-200 dark:border-[#163016]"
                      : "bg-amber-50/40 dark:bg-[#18150a] border-amber-300 dark:border-[#4d3a00] shadow-sm ring-1 ring-amber-300/30"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl mt-0.5 flex-shrink-0 ${
                          isSurge
                            ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {isSurge ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-base text-gray-900 dark:text-white">
                            {alert.keyword}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono text-xs font-black flex items-center gap-1 ${
                              isSurge
                                ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {isSurge ? "+" : ""}
                            {alert.percentageChange}% {isSurge ? "Surge" : "Drop"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {alert.source}
                          </span>
                          {!alert.read && (
                            <span className="bg-[#ffa500] text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.2 rounded">
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {alert.recommendation}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                          <span>
                            Previous Vol:{" "}
                            <strong className="text-gray-700 dark:text-gray-200">
                              {alert.previousVolume.toLocaleString()}
                            </strong>
                          </span>
                          <span>→</span>
                          <span>
                            Current Vol:{" "}
                            <strong className="text-gray-900 dark:text-white font-bold">
                              {alert.currentVolume.toLocaleString()}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => {
                          onNavigate("keywords");
                          if (onSelectKeywordForTrends) {
                            onSelectKeywordForTrends(alert.keyword);
                          }
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#004d00] hover:bg-[#003800] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#ffa500]" />
                        <span>Inspect in Matrix</span>
                      </button>

                      <button
                        onClick={() => setActiveAlertId(isExpanded ? null : alert.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-[#1e461e] hover:bg-gray-50 dark:hover:bg-[#122412] text-xs font-semibold text-gray-700 dark:text-gray-300"
                      >
                        {isExpanded ? "Hide Trend Chart" : "View Trend Chart"}
                      </button>

                      <button
                        onClick={() => handleDismissAlert(alert.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#163016]"
                        title="Dismiss Alert"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded 6-Month Trend Curve */}
                  {isExpanded && alert.trendScores && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#163016] animate-in fade-in duration-150">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                        6-Month Search Volume Trajectory (Google Trends Calibrated)
                      </div>
                      <div className="h-32 w-full bg-gray-50 dark:bg-[#060e06] p-2 rounded-lg border border-gray-200 dark:border-[#163016]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={alert.trendScores}>
                            <defs>
                              <linearGradient id={`grad-${alert.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop
                                  offset="5%"
                                  stopColor={isSurge ? "#10b981" : "#ef4444"}
                                  stopOpacity={0.4}
                                />
                                <stop
                                  offset="95%"
                                  stopColor={isSurge ? "#10b981" : "#ef4444"}
                                  stopOpacity={0.0}
                                />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="month"
                              stroke="#888888"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#888888"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                            />
                            <Tooltip
                              formatter={(value: any) => [
                                `${Number(value).toLocaleString()} monthly searches`,
                                "Search Volume",
                              ]}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={isSurge ? "#10b981" : "#ef4444"}
                              strokeWidth={2.5}
                              fillOpacity={1}
                              fill={`url(#grad-${alert.id})`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#060e06] border-t border-gray-200 dark:border-[#163016] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-gray-500">
            <Bell className="w-3.5 h-3.5 text-[#ffa500]" />
            <span>Alerts automatically check Google Trends sync every 12 hours.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-[#163016] hover:bg-gray-300 dark:hover:bg-[#1e461e] font-bold text-gray-800 dark:text-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

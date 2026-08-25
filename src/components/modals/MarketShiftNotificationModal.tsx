import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Zap,
  Bell,
  CheckCircle2,
  X,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Filter,
  Eye,
  Check,
  RotateCcw,
} from "lucide-react";
import { MarketShiftAlert, NavigationTab } from "../../types";

interface MarketShiftNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: MarketShiftAlert[];
  onUpdateAlertStatus: (alertId: string, status: "unread" | "read" | "acknowledged" | "dismissed") => void;
  onMarkAllAsRead: () => void;
  onInspectKeywordTrends: (keyword: string) => void;
  onNavigate?: (tab: NavigationTab) => void;
}

export const MarketShiftNotificationModal: React.FC<MarketShiftNotificationModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onUpdateAlertStatus,
  onMarkAllAsRead,
  onInspectKeywordTrends,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<"all" | "surge" | "drop" | "unread">("all");

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType === "surge") return alert.direction === "surge";
    if (filterType === "drop") return alert.direction === "drop";
    if (filterType === "unread") return alert.status === "unread";
    return true;
  });

  const unreadCount = alerts.filter((a) => a.status === "unread").length;
  const surgeCount = alerts.filter((a) => a.direction === "surge").length;
  const dropCount = alerts.filter((a) => a.direction === "drop").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0b170b] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-[#163016] text-xs flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-[#163016] bg-gradient-to-r from-amber-500/10 via-green-900/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#004d00] text-[#ffa500] shadow-sm ring-2 ring-[#ffa500]/30">
              <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Market Shift Intelligence Center
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-extrabold text-[10px] animate-bounce">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Automated Google Trends detection for tracked keywords experiencing ≥ 20% search velocity changes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#122412] hover:bg-gray-200 dark:hover:bg-[#1e461e] text-gray-700 dark:text-gray-300 font-semibold text-[11px] transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#122412] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Strip & Filter Bar */}
        <div className="p-4 bg-gray-50 dark:bg-[#060e06] border-b border-gray-100 dark:border-[#163016] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                filterType === "all"
                  ? "bg-[#004d00] text-white shadow-xs"
                  : "bg-white dark:bg-[#0b170b] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#163016]"
              }`}
            >
              All Shifts ({alerts.length})
            </button>
            <button
              onClick={() => setFilterType("surge")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 ${
                filterType === "surge"
                  ? "bg-green-700 text-white shadow-xs"
                  : "bg-white dark:bg-[#0b170b] text-green-800 dark:text-green-400 border border-gray-200 dark:border-[#163016]"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Surges ≥20% ({surgeCount})</span>
            </button>
            <button
              onClick={() => setFilterType("drop")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 ${
                filterType === "drop"
                  ? "bg-amber-700 text-white shadow-xs"
                  : "bg-white dark:bg-[#0b170b] text-amber-800 dark:text-amber-400 border border-gray-200 dark:border-[#163016]"
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Drops ≥20% ({dropCount})</span>
            </button>
            <button
              onClick={() => setFilterType("unread")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                filterType === "unread"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-white dark:bg-[#0b170b] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#163016]"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Threshold: <strong>±20% Search Velocity</strong></span>
          </div>
        </div>

        {/* Alerts List */}
        <div className="overflow-y-auto p-5 space-y-3.5 flex-1 max-h-[60vh]">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-green-500 mb-2 opacity-80" />
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">No market shifts in this view</p>
              <p className="text-xs mt-1">All tracked keywords are operating within standard ±20% volume thresholds.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSurge = alert.direction === "surge";
              const isUnread = alert.status === "unread";

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnread
                      ? "bg-amber-50/50 dark:bg-[#122412]/80 border-amber-300 dark:border-[#ffa500]/50 shadow-md ring-1 ring-[#ffa500]/30"
                      : "bg-white dark:bg-[#060e06] border-gray-200 dark:border-[#163016]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-black text-xs flex items-center gap-1 ${
                            isSurge
                              ? "bg-green-100 text-[#004d00] dark:bg-green-950 dark:text-green-300"
                              : "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300"
                          }`}
                        >
                          {isSurge ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          <span>{alert.percentageChange > 0 ? `+${alert.percentageChange}%` : `${alert.percentageChange}%`} Market {isSurge ? "Surge" : "Drop"}</span>
                        </span>

                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                          "{alert.keyword}"
                        </h4>

                        <span className="text-[10px] text-gray-400 font-mono">
                          {alert.triggerDate}
                        </span>

                        {isUnread && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-extrabold uppercase">
                            New Shift
                          </span>
                        )}
                      </div>

                      {/* Metrics comparison */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                        <div className="p-2 rounded bg-gray-50 dark:bg-[#0b170b] border border-gray-100 dark:border-[#163016]">
                          <span className="text-gray-400 block text-[9px] uppercase font-sans">Baseline Vol</span>
                          <span className="font-bold text-gray-700 dark:text-gray-300">{alert.previousVolume.toLocaleString()}/mo</span>
                        </div>
                        <div className="p-2 rounded bg-gray-50 dark:bg-[#0b170b] border border-gray-100 dark:border-[#163016]">
                          <span className="text-gray-400 block text-[9px] uppercase font-sans">Current Vol</span>
                          <span className="font-bold text-[#004d00] dark:text-[#ffa500]">{alert.currentVolume.toLocaleString()}/mo</span>
                        </div>
                        <div className="p-2 rounded bg-gray-50 dark:bg-[#0b170b] border border-gray-100 dark:border-[#163016]">
                          <span className="text-gray-400 block text-[9px] uppercase font-sans">Trends Score</span>
                          <span className="font-bold text-orange-600">{alert.currentTrendScore} / 100</span>
                        </div>
                        <div className="p-2 rounded bg-gray-50 dark:bg-[#0b170b] border border-gray-100 dark:border-[#163016]">
                          <span className="text-gray-400 block text-[9px] uppercase font-sans">YoY Velocity</span>
                          <span className="font-bold text-gray-900 dark:text-white">{alert.growthRateYoY}</span>
                        </div>
                      </div>

                      {/* AI Search Impact */}
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                        <strong className="text-gray-900 dark:text-white">AI Search Context:</strong> {alert.aiOverviewImpact}
                      </p>

                      {/* Actionable Recommendation */}
                      <div className="p-2.5 rounded-lg bg-green-50/70 dark:bg-[#0e240e] border border-green-200 dark:border-[#1e461e] flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-[#004d00] dark:text-[#ffa500] shrink-0 mt-0.5" />
                        <span className="text-[11px] text-green-950 dark:text-green-200">
                          <strong>Strategic Action:</strong> {alert.actionableRecommendation}
                        </span>
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex sm:flex-col items-center gap-1.5 shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={() => {
                          onInspectKeywordTrends(alert.keyword);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#004d00] hover:bg-[#003300] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs w-full justify-center transition-colors"
                        title="Open Google Trends Grounding for this term"
                      >
                        <Flame className="w-3.5 h-3.5 text-[#ffa500]" />
                        <span>Inspect Trends</span>
                      </button>

                      {alert.status !== "acknowledged" && (
                        <button
                          onClick={() => onUpdateAlertStatus(alert.id, "acknowledged")}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#122412] hover:bg-gray-200 dark:hover:bg-[#1e461e] text-gray-700 dark:text-gray-300 font-semibold text-[11px] w-full text-center transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}

                      {alert.status === "unread" && (
                        <button
                          onClick={() => onUpdateAlertStatus(alert.id, "read")}
                          className="px-2.5 py-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-[10px]"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#060e06] border-t border-gray-200 dark:border-[#163016] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <ShieldAlert className="w-4 h-4 text-[#ffa500]" />
            <span>Market Shift alerts run automatically across all active 35 target keywords.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#004d00] text-white font-bold text-xs hover:bg-[#003300] transition-colors"
          >
            Close Notification Center
          </button>
        </div>
      </div>
    </div>
  );
};

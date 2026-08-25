import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  Bot,
  TrendingUp,
  Layers,
  FileCode,
  FileText,
  Mic,
  PackageCheck,
  ShieldAlert,
  PlusCircle,
  Download,
  FileSpreadsheet,
  Zap,
  Wrench,
  ChevronRight,
  Radio,
  CreditCard,
} from "lucide-react";
import { NavigationTab } from "../types";

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenAddModal: () => void;
  onExportCsv: () => void;
  onOpenPrintReport: () => void;
  onRunAudit: () => void;
  onRunA2A: () => void;
  onStartAudioLive: () => void;
  onSelfMaintenance: () => void;
  isAuditing?: boolean;
  isA2ARunning?: boolean;
  isRecording?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  onOpenAddModal,
  onExportCsv,
  onOpenPrintReport,
  onRunAudit,
  onRunA2A,
  onStartAudioLive,
  onSelfMaintenance,
  isAuditing = false,
  isA2ARunning = false,
  isRecording = false,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: string; shortcut: string }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, shortcut: "Alt+O" },
    { id: "ai-search-eeat", label: "Site Audit & EEAT", icon: Sparkles, badge: "NLP / SGE", shortcut: "Alt+E" },
    { id: "a2a-judge", label: "A2A & Judge Core", icon: Bot, badge: "Judge Core", shortcut: "Alt+J" },
    { id: "keywords", label: "Keyword Research (35)", icon: TrendingUp, badge: "35 Matrix", shortcut: "Alt+K" },
    { id: "initial-audit", label: "10 Competitor Analysis", icon: Layers, badge: "10 Comp", shortcut: "Alt+A" },
    { id: "onpage-tech", label: "On-Page & Tech Engine", icon: FileCode, shortcut: "Alt+T" },
    { id: "content-marketing", label: "Content Strategy & PR", icon: FileText, badge: "18 Assets", shortcut: "Alt+C" },
    { id: "audio-transcriber", label: "Audio Transcription AI", icon: Mic, badge: "Live NLP", shortcut: "Alt+M" },
    { id: "packages-roi", label: "SEO Packages & ROI", icon: PackageCheck, shortcut: "Alt+P" },
    { id: "algorithm-intel", label: "Algorithm Intel & Radar", icon: ShieldAlert, shortcut: "Alt+U" },
    { id: "subscription-billing", label: "Subscription & Billing", icon: CreditCard, badge: "7-Day Trial", shortcut: "Alt+B" },
  ];

  return (
    <aside
      id="left-control-panel-sidebar"
      className="w-64 lg:w-72 flex-shrink-0 bg-[#004d00] text-white border-r border-[#003300] flex flex-col h-screen overflow-y-auto select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-[#003300]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#ffa500] flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
            AI
          </div>
          <div>
            <h1 className="text-white text-lg font-bold tracking-tight">
              AI <span className="text-[#ffa500]">SEO</span> Agency
            </h1>
            <p className="text-green-300 text-[10px] uppercase tracking-widest font-semibold">
              Enterprise AI v2.4
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons Panel */}
      <div className="p-3 border-b border-[#003300] space-y-1.5 bg-[#004400]/40">
        <div className="text-[10px] font-bold uppercase tracking-wider text-green-300/90 px-1 mb-1 flex items-center justify-between">
          <span>Action Triggers</span>
          <span className="text-[9px] bg-[#003300] text-[#ffa500] px-1.5 py-0.2 rounded font-mono font-semibold">
            Live
          </span>
        </div>

        {/* Add New Record Button */}
        <button
          id="sidebar-add-record-btn"
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-[#ffa500] hover:brightness-110 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-[0.99]"
        >
          <span className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-slate-950" />
            + ADD NEW DATA
          </span>
          <span className="text-[10px] bg-amber-600/30 px-1.5 py-0.5 rounded font-mono text-slate-900">
            2026
          </span>
        </button>

        {/* Action Triggers Grid */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            id="sidebar-run-audit-btn"
            onClick={onRunAudit}
            disabled={isAuditing}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all ${
              isAuditing
                ? "bg-[#003300] text-amber-300 border-[#ffa500] animate-pulse cursor-wait"
                : "bg-[#003300]/80 hover:bg-[#003300] text-green-100 border-[#002800]"
            }`}
            title="Execute live AI Search audit"
          >
            <Zap className={`w-3 h-3 text-[#ffa500] ${isAuditing ? "animate-spin" : ""}`} />
            <span>{isAuditing ? "Auditing..." : "AI Audit"}</span>
          </button>

          <button
            id="sidebar-launch-a2a-btn"
            onClick={onRunA2A}
            disabled={isA2ARunning}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all ${
              isA2ARunning
                ? "bg-[#003300] text-amber-300 border-[#ffa500] animate-pulse cursor-wait"
                : "bg-[#003300]/80 hover:bg-[#003300] text-green-100 border-[#002800]"
            }`}
            title="Launch A2A Judge Evaluation Loop"
          >
            <Bot className="w-3 h-3 text-[#ffa500]" />
            <span>{isA2ARunning ? "Judging..." : "A2A Loop"}</span>
          </button>

          <button
            id="sidebar-start-audio-btn"
            onClick={onStartAudioLive}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all ${
              isRecording
                ? "bg-red-950 text-red-300 border-red-500 animate-pulse"
                : "bg-[#003300]/80 hover:bg-[#003300] text-green-100 border-[#002800]"
            }`}
            title="Toggle live NLP audio recording stream"
          >
            {isRecording ? (
              <Radio className="w-3 h-3 text-red-400 animate-spin" />
            ) : (
              <Mic className="w-3 h-3 text-[#ffa500]" />
            )}
            <span>{isRecording ? "Live Rec..." : "Live Audio"}</span>
          </button>

          <button
            id="sidebar-export-csv-btn"
            onClick={onExportCsv}
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-[#003300]/80 hover:bg-[#003300] border border-[#002800] text-green-100 text-[11px] font-semibold transition-colors"
            title="Export CSV data"
          >
            <FileSpreadsheet className="w-3 h-3 text-[#ffa500]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-green-300/80 px-3 py-1 mb-0.5">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-all text-xs font-medium group ${
                isActive
                  ? "bg-[#003300] text-white font-semibold shadow-inner border-l-4 border-[#ffa500]"
                  : "text-green-100 hover:bg-[#003300]/70 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                {isActive ? (
                  <div className="w-2 h-2 bg-[#ffa500] rounded-full flex-shrink-0" />
                ) : (
                  <Icon className="w-4 h-4 text-green-300/70 flex-shrink-0" />
                )}
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                      isActive
                        ? "bg-[#ffa500] text-slate-950 font-bold"
                        : "bg-[#003300] text-green-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <span className="text-[9px] px-1 py-0.5 rounded font-mono text-green-300/60 group-hover:text-[#ffa500] group-hover:bg-[#002600] transition-colors">
                  {item.shortcut}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3.5 border-t border-[#003300] bg-[#003800] space-y-2">
        <button
          id="sidebar-self-maintenance-btn"
          onClick={onSelfMaintenance}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#002b00] hover:bg-[#002200] border border-[#001f00] text-green-300 hover:text-white text-[11px] font-medium transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Wrench className="w-3 h-3 text-[#ffa500]" />
            Self-Maintenance
          </span>
          <span className="text-[9px] text-[#ffa500] font-mono font-bold">Active v2.4</span>
        </button>
        <p className="text-green-400 text-[10px] text-center font-medium">
          Encrypted AI Sync: AES-256 Active
        </p>
      </div>
    </aside>
  );
};

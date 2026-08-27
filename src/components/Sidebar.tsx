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
  Lock,
  Printer,
  Compass,
  Search,
  Code2,
  Network,
  ArrowRightLeft,
  BookOpen,
  FolderKanban,
  Building2,
} from "lucide-react";
import { NavigationTab } from "../types";
import { useAuthBilling } from "../context/AuthBillingContext";
import { useI18n } from "../context/I18nContext";

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenAddModal: () => void;
  onExportCsv: () => void;
  onOpenPrintReport?: () => void;
  onDownloadPdf?: () => void;
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
  onDownloadPdf,
  onRunAudit,
  onRunA2A,
  onStartAudioLive,
  onSelfMaintenance,
  isAuditing = false,
  isA2ARunning = false,
  isRecording = false,
}) => {
  const { isAccessRestricted, hasActivePaidPlan, trialState } = useAuthBilling();
  const { t } = useI18n();

  const handleActionClick = (actionFn?: () => void) => {
    if (!actionFn) return;
    if (isAccessRestricted) {
      onNavigate("subscription-billing");
      return;
    }
    actionFn();
  };

  const handleDownloadPdf = () => {
    const fn = onDownloadPdf || onOpenPrintReport;
    if (fn) handleActionClick(fn);
  };

  interface NavItem {
    id: NavigationTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
    isLiveBadge?: boolean;
    liveBadgeColor?: string;
    shortcut?: string;
    section?: string;
  }

  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: "Core Platform",
      items: [
        { id: "overview", label: t("nav.overview", "Dashboard"), icon: LayoutDashboard, shortcut: "Alt+O" },
        {
          id: "ai-search-eeat",
          label: t("nav.ai_audit", "Site Audit & EEAT"),
          icon: Sparkles,
          badge: isAuditing ? "LIVE AUDIT" : "NLP / SGE",
          isLiveBadge: isAuditing,
          liveBadgeColor: "bg-emerald-500 text-slate-950",
          shortcut: "Alt+E",
        },
        {
          id: "a2a-judge",
          label: "A2A & Judge Core",
          icon: Bot,
          badge: isA2ARunning ? "LIVE JUDGE" : "Judge Core",
          isLiveBadge: isA2ARunning,
          liveBadgeColor: "bg-amber-400 text-slate-950",
          shortcut: "Alt+J",
        },
        { id: "keywords", label: t("nav.keywords", "Keyword Research (35)"), icon: TrendingUp, badge: "35 Matrix", shortcut: "Alt+K" },
        { id: "initial-audit", label: "10 Competitor Analysis", icon: Layers, badge: "10 Comp", shortcut: "Alt+A" },
        { id: "onpage-tech", label: t("nav.onpage_tech", "On-Page & Tech Engine"), icon: FileCode, shortcut: "Alt+T" },
        { id: "content-marketing", label: t("nav.content_engine", "Content Strategy & PR"), icon: FileText, badge: "18 Assets", shortcut: "Alt+C" },
        {
          id: "audio-transcriber",
          label: t("nav.audio_transcripts", "Audio Transcription AI"),
          icon: Mic,
          badge: isRecording ? "LIVE REC" : "Live NLP",
          isLiveBadge: isRecording,
          liveBadgeColor: "bg-red-500 text-white animate-pulse",
          shortcut: "Alt+M",
        },
      ],
    },
    {
      title: "Agency Engines & Services",
      items: [
        { id: "services-catalog", label: t("nav.services_catalog", "9-Pillar Service Catalog"), icon: Compass, badge: "9 Pillars" },
        { id: "website-discovery", label: t("nav.website_discovery", "36-Signal Site Discovery"), icon: Search, badge: "36 Signals" },
        { id: "schema-generator", label: t("nav.schema_generator", "16-Type JSON-LD Schema"), icon: Code2, badge: "16 Types" },
        { id: "internal-linking", label: t("nav.internal_linking", "Internal Linking Graph"), icon: Network, badge: "PageRank" },
        { id: "migration-seo", label: t("nav.migration_seo", "Migration & 301 Replatform"), icon: ArrowRightLeft, badge: "301 Map" },
        { id: "platform-guides", label: t("nav.platform_guides", "CMS Platform Guides"), icon: BookOpen, badge: "6 Platforms" },
        { id: "integrations-center", label: t("nav.integrations", "Tool Connectors (12)"), icon: Zap, badge: "12 APIs" },
        { id: "ai-consultant", label: t("nav.ai_consultant", "AI Consultant & Action"), icon: Sparkles, badge: "Priority" },
        { id: "project-management", label: t("nav.project_mgmt", "Project Management"), icon: FolderKanban, badge: "Workflow" },
        { id: "white-label", label: t("nav.white_label", "White-Label & Reports"), icon: Building2, badge: "Branded" },
      ],
    },
    {
      title: "Commercial & Admin",
      items: [
        { id: "packages-roi", label: t("nav.packages_roi", "SEO Packages & ROI"), icon: PackageCheck, shortcut: "Alt+P" },
        { id: "algorithm-intel", label: "Algorithm Intel & Radar", icon: ShieldAlert, shortcut: "Alt+U" },
        {
          id: "subscription-billing",
          label: t("nav.subscription_billing", "Subscription & Billing"),
          icon: CreditCard,
          badge: isAccessRestricted ? "REQUIRED" : hasActivePaidPlan ? "ACTIVE" : `${trialState.daysRemaining}d Trial`,
          shortcut: "Alt+B",
        },
      ],
    },
  ];

  return (
    <aside
      id="left-control-panel-sidebar"
      className="w-64 lg:w-72 flex-shrink-0 bg-[#004d00] text-white border-r border-[#003300] flex flex-col h-screen overflow-hidden select-none relative"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-[#003300] shrink-0">
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
      <div className="p-3 border-b border-[#003300] space-y-1.5 bg-[#004400]/40 shrink-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-green-300/90 px-1 mb-1 flex items-center justify-between">
          <span>Action Triggers</span>
          <span className="text-[9px] bg-[#003300] text-[#ffa500] px-1.5 py-0.2 rounded font-mono font-semibold">
            {isAccessRestricted ? "Locked" : "Live"}
          </span>
        </div>

        {/* Add New Record Button */}
        <button
          id="sidebar-add-record-btn"
          onClick={() => handleActionClick(onOpenAddModal)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-bold text-xs shadow-md transition-all active:scale-[0.99] ${
            isAccessRestricted
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-[#ffa500] hover:brightness-110 text-slate-950"
          }`}
        >
          <span className="flex items-center gap-2">
            {isAccessRestricted ? (
              <Lock className="w-4 h-4 text-amber-400" />
            ) : (
              <PlusCircle className="w-4 h-4 text-slate-950" />
            )}
            {isAccessRestricted ? "DATA LOCKED (EXPIRED)" : "+ ADD NEW DATA"}
          </span>
          <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono">
            {isAccessRestricted ? "Locked" : "2026"}
          </span>
        </button>

        {/* Action Triggers Grid with Visual Live Indicators */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {/* AI Audit Button */}
          <button
            id="sidebar-run-audit-btn"
            onClick={() => handleActionClick(onRunAudit)}
            disabled={isAuditing}
            className={`relative flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all ${
              isAuditing
                ? "bg-[#002b00] text-emerald-300 border-emerald-500 shadow-sm ring-1 ring-emerald-500/50"
                : isAccessRestricted
                ? "bg-[#002b00] text-gray-400 border-transparent opacity-75"
                : "bg-[#003300]/80 hover:bg-[#003300] text-green-100 border-[#002800]"
            }`}
            title={isAccessRestricted ? "Trial expired. Subscribe to audit" : "Execute live AI Search audit"}
          >
            {isAuditing ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-bold text-emerald-300 animate-pulse">Auditing...</span>
              </>
            ) : isAccessRestricted ? (
              <>
                <Lock className="w-3 h-3 text-amber-400" />
                <span>AI Audit</span>
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 text-[#ffa500]" />
                <span>AI Audit</span>
              </>
            )}
          </button>

          {/* A2A Loop Button */}
          <button
            id="sidebar-launch-a2a-btn"
            onClick={() => handleActionClick(onRunA2A)}
            disabled={isA2ARunning}
            className={`relative flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all ${
              isA2ARunning
                ? "bg-[#002b00] text-amber-300 border-[#ffa500] shadow-sm ring-1 ring-amber-500/50"
                : isAccessRestricted
                ? "bg-[#002b00] text-gray-400 border-transparent opacity-75"
                : "bg-[#003300]/80 hover:bg-[#003300] text-green-100 border-[#002800]"
            }`}
            title={isAccessRestricted ? "Trial expired. Subscribe to judge" : "Launch A2A Judge Evaluation Loop"}
          >
            {isA2ARunning ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffa500]" />
                </span>
                <span className="font-bold text-amber-300 animate-pulse">Judging...</span>
              </>
            ) : isAccessRestricted ? (
              <>
                <Lock className="w-3 h-3 text-amber-400" />
                <span>A2A Loop</span>
              </>
            ) : (
              <>
                <Bot className="w-3 h-3 text-[#ffa500]" />
                <span>A2A Loop</span>
              </>
            )}
          </button>

          {/* Live Audio Button */}
          <button
            id="sidebar-start-audio-btn"
            onClick={() => handleActionClick(onStartAudioLive)}
            className={`relative flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-all ${
              isRecording
                ? "bg-red-950 text-red-200 border-red-500 shadow-md ring-1 ring-red-500/50"
                : isAccessRestricted
                ? "bg-[#002b00] text-gray-400 border-transparent opacity-75"
                : "bg-[#003300]/80 hover:bg-[#003300] text-green-100 border-[#002800]"
            }`}
            title="Toggle live NLP audio recording stream"
          >
            {isRecording ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="font-bold text-red-300 animate-pulse">Recording...</span>
              </>
            ) : isAccessRestricted ? (
              <>
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Live Audio</span>
              </>
            ) : (
              <>
                <Mic className="w-3 h-3 text-[#ffa500]" />
                <span>Live Audio</span>
              </>
            )}
          </button>

          {/* Export CSV Button */}
          <button
            id="sidebar-export-csv-btn"
            onClick={() => handleActionClick(onExportCsv)}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md border text-[11px] font-semibold transition-colors ${
              isAccessRestricted
                ? "bg-[#002b00] text-gray-400 border-transparent opacity-75"
                : "bg-[#003300]/80 hover:bg-[#003300] border-[#002800] text-green-100"
            }`}
            title="Export CSV data"
          >
            {isAccessRestricted ? (
              <Lock className="w-3 h-3 text-amber-400" />
            ) : (
              <FileSpreadsheet className="w-3 h-3 text-[#ffa500]" />
            )}
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-3 space-y-3 overflow-y-auto min-h-0">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-green-300/80 px-2 py-0.5 flex items-center justify-between">
              <span>{section.title}</span>
              {sIdx === 0 && isAccessRestricted && (
                <span className="text-[9px] text-amber-400 font-mono font-black flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Plan Required
                </span>
              )}
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isItemLocked = isAccessRestricted && item.id !== "subscription-billing";

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => {
                    if (isItemLocked) {
                      onNavigate("subscription-billing");
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all text-xs font-medium group ${
                    isActive
                      ? "bg-[#003300] text-white font-semibold shadow-inner border-l-4 border-[#ffa500]"
                      : isItemLocked
                      ? "text-green-200/50 hover:bg-[#003300]/40 hover:text-white"
                      : "text-green-100 hover:bg-[#003300]/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {isActive ? (
                      <div className="w-2 h-2 bg-[#ffa500] rounded-full flex-shrink-0" />
                    ) : isItemLocked ? (
                      <Lock className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
                    ) : (
                      <Icon className="w-3.5 h-3.5 text-green-300/70 flex-shrink-0" />
                    )}
                    <span className={`truncate ${isItemLocked ? "opacity-75" : ""}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                          item.isLiveBadge
                            ? `${item.liveBadgeColor} font-black animate-pulse shadow-sm`
                            : isActive
                            ? "bg-[#ffa500] text-slate-950 font-bold"
                            : item.badge === "REQUIRED"
                            ? "bg-amber-500 text-slate-950 font-black animate-pulse"
                            : "bg-[#003300] text-green-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.shortcut && (
                      <span className="text-[9px] px-1 py-0.5 rounded font-mono text-green-300/60 group-hover:text-[#ffa500] group-hover:bg-[#002600] transition-colors">
                        {item.shortcut}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Floating Download PDF Report Action Button */}
      <div className="px-3 py-2 bg-gradient-to-t from-[#003800] via-[#003800] to-transparent shrink-0">
        <button
          id="sidebar-floating-download-pdf-btn"
          type="button"
          onClick={handleDownloadPdf}
          className="w-full group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#003300] via-[#004400] to-[#002b00] hover:from-[#004400] hover:to-[#003300] text-white border border-[#ffa500]/40 hover:border-[#ffa500] shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] overflow-hidden"
          title="Download printable executive SEO audit & campaign performance PDF"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -inset-0.5 bg-[#ffa500]/10 rounded-xl blur-xs group-hover:bg-[#ffa500]/20 transition-all pointer-events-none" />

          <div className="relative flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#ffa500] text-slate-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-bold text-xs text-white group-hover:text-[#ffa500] transition-colors flex items-center gap-1.5">
                <span>Download PDF Report</span>
              </div>
              <p className="text-[9px] text-green-200/80 font-medium">
                Printable Metrics & Campaign ROI
              </p>
            </div>
          </div>

          <div className="relative flex items-center">
            <span className="text-[9px] bg-[#ffa500]/20 text-[#ffa500] font-black uppercase px-1.5 py-0.5 rounded border border-[#ffa500]/30 font-mono">
              PDF
            </span>
          </div>
        </button>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#003300] bg-[#003800] space-y-1.5 shrink-0">
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

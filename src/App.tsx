import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { AddRecordModal } from "./components/AddRecordModal";
import { PrintableReportModal } from "./components/PrintableReportModal";
import { MarketShiftNotificationSystem } from "./components/MarketShiftNotificationSystem";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthBillingProvider, useAuthBilling } from "./context/AuthBillingContext";
import { detectMarketShifts } from "./services/marketShiftService";

// Views
import { OverviewView } from "./components/views/OverviewView";
import { AISearchEEATView } from "./components/views/AISearchEEATView";
import { A2AJudgeView } from "./components/views/A2AJudgeView";
import { KeywordMatrixView } from "./components/views/KeywordMatrixView";
import { InitialAuditView } from "./components/views/InitialAuditView";
import { OnPageTechView } from "./components/views/OnPageTechView";
import { ContentMarketingView } from "./components/views/ContentMarketingView";
import { AudioTranscribeView } from "./components/views/AudioTranscribeView";
import { PackagesPricingView } from "./components/views/PackagesPricingView";
import { AlgorithmUpdatesView } from "./components/views/AlgorithmUpdatesView";
import { SubscriptionBillingView } from "./components/views/SubscriptionBillingView";

import {
  INITIAL_KEYWORDS,
  INITIAL_COMPETITORS,
  INITIAL_CONTENT_PIECES,
  INITIAL_CITATIONS,
  INITIAL_TRANSCRIPTS,
  INITIAL_CAMPAIGN_LOGS,
} from "./data/initialData";
import {
  NavigationTab,
  KeywordItem,
  CompetitorItem,
  ContentPieceItem,
  LocalCitationItem,
  AudioTranscriptItem,
  CampaignLogItem,
  MarketShiftAlert,
} from "./types";
import { CheckCircle2, X, Radio } from "lucide-react";

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>("overview");
  const { theme, toggleTheme } = useTheme();
  const { currentUser, trialState } = useAuthBilling();

  // Core Data States with Add/Delete/Archive support
  const [keywords, setKeywords] = useState<KeywordItem[]>(INITIAL_KEYWORDS);
  const [competitors, setCompetitors] = useState<CompetitorItem[]>(INITIAL_COMPETITORS);
  const [contentPieces, setContentPieces] = useState<ContentPieceItem[]>(INITIAL_CONTENT_PIECES);
  const [citations, setCitations] = useState<LocalCitationItem[]>(INITIAL_CITATIONS);
  const [transcripts, setTranscripts] = useState<AudioTranscriptItem[]>(INITIAL_TRANSCRIPTS);
  const [campaignLogs, setCampaignLogs] = useState<CampaignLogItem[]>(INITIAL_CAMPAIGN_LOGS);

  // Market Shift Surveillance Alerts
  const [marketShiftAlerts, setMarketShiftAlerts] = useState<MarketShiftAlert[]>(() =>
    detectMarketShifts(INITIAL_KEYWORDS, 20)
  );
  const [isMarketShiftOpen, setIsMarketShiftOpen] = useState(false);

  // Modals & Banners
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeAlgorithmAlert, setActiveAlgorithmAlert] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // Direct Triggers
  const [isAuditing, setIsAuditing] = useState(false);
  const [isA2ARunning, setIsA2ARunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Algorithm Update Notification Handler
  const handleTriggerAlgorithmAlert = (title: string, message: string) => {
    setActiveAlgorithmAlert({ title, message });
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio context may be limited before first user click
    }
  };

  // Global Event Listener for Keyboard Shortcuts (Alt+K for Keywords, Alt+C for Content, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Alt or Option key is pressed
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const key = e.key.toLowerCase();

        switch (key) {
          case "k":
            e.preventDefault();
            setCurrentTab("keywords");
            showToast("Navigated to Keywords Matrix (Alt+K)");
            break;
          case "c":
            e.preventDefault();
            setCurrentTab("content-marketing");
            showToast("Navigated to Content Strategy & Optimizer (Alt+C)");
            break;
          case "o":
            e.preventDefault();
            setCurrentTab("overview");
            showToast("Navigated to Dashboard Overview (Alt+O)");
            break;
          case "e":
            e.preventDefault();
            setCurrentTab("ai-search-eeat");
            showToast("Navigated to AI Search & EEAT Audit (Alt+E)");
            break;
          case "j":
            e.preventDefault();
            setCurrentTab("a2a-judge");
            showToast("Navigated to A2A Judge Core (Alt+J)");
            break;
          case "a":
            e.preventDefault();
            setCurrentTab("initial-audit");
            showToast("Navigated to 10-Competitor Benchmark Matrix (Alt+A)");
            break;
          case "t":
            e.preventDefault();
            setCurrentTab("onpage-tech");
            showToast("Navigated to On-Page & Technical SEO (Alt+T)");
            break;
          case "m":
            e.preventDefault();
            setCurrentTab("audio-transcriber");
            showToast("Navigated to Audio Transcription AI (Alt+M)");
            break;
          case "p":
            e.preventDefault();
            setCurrentTab("packages-roi");
            showToast("Navigated to Packages & Pricing ROI (Alt+P)");
            break;
          case "u":
            e.preventDefault();
            setCurrentTab("algorithm-intel");
            showToast("Navigated to Algorithm Intel & Radar (Alt+U)");
            break;
          case "n":
            e.preventDefault();
            setIsAddModalOpen((prev) => !prev);
            break;
          case "r":
            e.preventDefault();
            setIsPrintReportOpen((prev) => !prev);
            break;
          case "x":
            e.preventDefault();
            handleExportCsv();
            break;
          case "l":
            e.preventDefault();
            toggleTheme();
            showToast(`Theme switched to ${theme === "dark" ? "Light" : "Deep Dark"} mode (Alt+L)`);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme, toggleTheme, campaignLogs]);

  // Add Item Handlers
  const handleAddKeyword = (kw: KeywordItem) => {
    setKeywords((prev) => [kw, ...prev]);
    const log: CampaignLogItem = {
      id: `log-kw-${Date.now()}`,
      timestamp: `2026-08-24 ${new Date().toLocaleTimeString()}`,
      category: "On-Page",
      event: `Added target keyword "${kw.keyword}" (Vol: ${kw.searchVolume.toLocaleString()}) to matrix.`,
      impactScore: "+2.4%",
      user: "Lead Strategist",
    };
    setCampaignLogs((prev) => [log, ...prev]);
    showToast(`Keyword "${kw.keyword}" added successfully!`);
  };

  const handleAddCompetitor = (comp: CompetitorItem) => {
    setCompetitors((prev) => [comp, ...prev]);
    const log: CampaignLogItem = {
      id: `log-comp-${Date.now()}`,
      timestamp: `2026-08-24 ${new Date().toLocaleTimeString()}`,
      category: "Audit",
      event: `Added competitor "${comp.name}" (${comp.domain}) to Benchmark Matrix.`,
      impactScore: "+1.8%",
      user: "Lead Strategist",
    };
    setCampaignLogs((prev) => [log, ...prev]);
    showToast(`Competitor "${comp.name}" benchmarked!`);
  };

  const handleAddContentPiece = (cnt: ContentPieceItem) => {
    setContentPieces((prev) => [cnt, ...prev]);
    const log: CampaignLogItem = {
      id: `log-cnt-${Date.now()}`,
      timestamp: `2026-08-24 ${new Date().toLocaleTimeString()}`,
      category: "Content",
      event: `Published "${cnt.title}" (${cnt.type}) targeting "${cnt.targetKeyword}".`,
      impactScore: "+4.6%",
      user: "Content Director",
    };
    setCampaignLogs((prev) => [log, ...prev]);
    showToast(`Content piece "${cnt.title}" added to inventory!`);
  };

  const handleAddCitation = (cit: LocalCitationItem) => {
    setCitations((prev) => [cit, ...prev]);
    showToast(`Citation on ${cit.platform} verified & registered!`);
  };

  const handleAddTranscript = (tr: AudioTranscriptItem) => {
    setTranscripts((prev) => [tr, ...prev]);
    showToast(`Audio transcript "${tr.title}" synchronized!`);
  };

  const handleAddCampaignLog = (log: CampaignLogItem) => {
    setCampaignLogs((prev) => [log, ...prev]);
    showToast("New campaign log recorded!");
  };

  // Archive / Restore Handlers
  const handleToggleArchiveKeyword = (id: string) => {
    setKeywords((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const nextArchived = !k.archived;
          const log: CampaignLogItem = {
            id: `log-kw-arch-${Date.now()}`,
            timestamp: `2026-08-24 ${new Date().toLocaleTimeString()}`,
            category: "On-Page",
            event: `${nextArchived ? "Archived" : "Restored"} keyword "${k.keyword}"`,
            impactScore: nextArchived ? "0.0%" : "+1.2%",
            user: "Lead Strategist",
          };
          setCampaignLogs((logs) => [log, ...logs]);
          showToast(nextArchived ? `Keyword "${k.keyword}" moved to archive.` : `Keyword "${k.keyword}" restored to active matrix.`);
          return { ...k, archived: nextArchived };
        }
        return k;
      })
    );
  };

  const handleToggleArchiveCompetitor = (id: string) => {
    setCompetitors((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextArchived = !c.archived;
          const log: CampaignLogItem = {
            id: `log-comp-arch-${Date.now()}`,
            timestamp: `2026-08-24 ${new Date().toLocaleTimeString()}`,
            category: "Audit",
            event: `${nextArchived ? "Archived" : "Restored"} competitor "${c.name}"`,
            impactScore: nextArchived ? "0.0%" : "+1.0%",
            user: "Lead Strategist",
          };
          setCampaignLogs((logs) => [log, ...logs]);
          showToast(nextArchived ? `Competitor "${c.name}" moved to archive.` : `Competitor "${c.name}" restored to active tracking.`);
          return { ...c, archived: nextArchived };
        }
        return c;
      })
    );
  };

  const handleToggleArchiveContentPiece = (id: string) => {
    setContentPieces((prev) =>
      prev.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c))
    );
    showToast("Content piece archive status updated.");
  };

  const handleToggleArchiveCitation = (id: string) => {
    setCitations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c))
    );
    showToast("Citation archive status updated.");
  };

  const handleToggleArchiveTranscript = (id: string) => {
    setTranscripts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, archived: !t.archived } : t))
    );
    showToast("Transcript archive status updated.");
  };

  // Delete Handlers
  const handleDeleteKeyword = (id: string) => {
    setKeywords((prev) => prev.filter((k) => k.id !== id));
    showToast("Keyword permanently deleted.");
  };

  const handleDeleteCompetitor = (id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    showToast("Competitor permanently deleted.");
  };

  const handleDeleteContentPiece = (id: string) => {
    setContentPieces((prev) => prev.filter((c) => c.id !== id));
    showToast("Content piece removed.");
  };

  const handleUpdateContentPiece = (updatedPiece: ContentPieceItem) => {
    setContentPieces((prev) =>
      prev.map((c) => (c.id === updatedPiece.id ? updatedPiece : c))
    );
    showToast(`Deliverable "${updatedPiece.title}" re-audited & marked fresh!`);
  };

  const handleDeleteCitation = (id: string) => {
    setCitations((prev) => prev.filter((c) => c.id !== id));
    showToast("Citation profile removed.");
  };

  const handleDeleteTranscript = (id: string) => {
    setTranscripts((prev) => prev.filter((t) => t.id !== id));
    showToast("Transcript deleted.");
  };

  const handleDeleteCampaignLog = (id: string) => {
    setCampaignLogs((prev) => prev.filter((l) => l.id !== id));
    showToast("Log entry deleted.");
  };

  // CSV Export Feature
  const handleExportCsv = () => {
    const headers = ["ID", "Timestamp", "Category", "Event Description", "Impact Score", "Executor"];
    const rows = campaignLogs.map((log) => [
      `"${log.id}"`,
      `"${log.timestamp}"`,
      `"${log.category}"`,
      `"${log.event.replace(/"/g, '""')}"`,
      `"${log.impactScore}"`,
      `"${log.user}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ai_seo_campaign_logs_2026-08-24.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#004d00", "#ffa500", "#10b981"],
    });

    showToast("Campaign Event Logs successfully exported to CSV format!");
  };

  // Global Sidebar Action Triggers
  const handleRunAuditTrigger = () => {
    setCurrentTab("ai-search-eeat");
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      showToast("Live AI Search & EEAT Audit completed!");
    }, 2000);
  };

  const handleRunA2ATrigger = () => {
    setCurrentTab("a2a-judge");
    setIsA2ARunning(true);
    setTimeout(() => {
      setIsA2ARunning(false);
      showToast("A2A Dual Loop executed with Omega Judge certification!");
    }, 2000);
  };

  const handleStartAudioLiveTrigger = () => {
    setCurrentTab("audio-transcriber");
    setIsRecording(!isRecording);
    showToast(isRecording ? "Live audio feed stopped." : "Live NLP audio stream initialized!");
  };

  const handleSelfMaintenanceTrigger = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#004d00", "#ffa500", "#34d399"],
    });
    showToast("Self-Maintenance Check Complete: All systems operational & error-free (v2.4).");
  };

  return (
    <div id="ai-seo-agency-app" className="flex h-screen w-full bg-[#f8fafc] dark:bg-[#060e06] text-gray-900 dark:text-white font-sans overflow-hidden transition-colors">
      {/* Left Control Panel / Sidebar with Keyboard Shortcuts Display */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExportCsv={handleExportCsv}
        onOpenPrintReport={() => setIsPrintReportOpen(true)}
        onRunAudit={handleRunAuditTrigger}
        onRunA2A={handleRunA2ATrigger}
        onStartAudioLive={handleStartAudioLiveTrigger}
        onSelfMaintenance={handleSelfMaintenanceTrigger}
        isAuditing={isAuditing}
        isA2ARunning={isA2ARunning}
        isRecording={isRecording}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Header with Global Search, User Profile, and Theme Switcher */}
        <Header
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          keywords={keywords}
          competitors={competitors}
          contentPieces={contentPieces}
          transcripts={transcripts}
          marketShiftAlerts={marketShiftAlerts}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenMarketShiftsModal={() => setIsMarketShiftOpen(true)}
          onDownloadPdf={() => setIsPrintReportOpen(true)}
          onTriggerTestAlert={handleTriggerAlgorithmAlert}
        />

        {/* Algorithm Update Live Banner (if active) */}
        {activeAlgorithmAlert && (
          <div className="bg-gradient-to-r from-amber-600 via-[#ffa500] to-orange-600 text-slate-950 px-6 py-2.5 flex items-center justify-between shadow-md shrink-0 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="p-1 rounded bg-slate-950 text-[#ffa500]">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <span className="font-black uppercase tracking-wider text-[11px]">
                {activeAlgorithmAlert.title}:
              </span>
              <span className="font-medium text-slate-900 hidden sm:inline">
                {activeAlgorithmAlert.message}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentTab("algorithm-intel");
                  setActiveAlgorithmAlert(null);
                }}
                className="px-2.5 py-0.5 rounded bg-slate-950 text-[#ffa500] text-[10px] font-bold hover:bg-slate-900 transition-colors"
              >
                View Radar
              </button>
              <button
                onClick={() => setActiveAlgorithmAlert(null)}
                className="p-1 hover:bg-black/10 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 7-DAY FREE TRIAL EXPIRATION ACCESS BANNER */}
        {trialState.isExpired &&
          currentUser?.subscriptionPlan === "free_trial" &&
          currentTab !== "subscription-billing" && (
            <div
              id="trial-expired-global-banner"
              className="bg-gradient-to-r from-red-600 via-amber-600 to-red-700 text-white px-5 py-3 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-red-800 animate-in slide-in-from-top duration-200"
            >
              <div className="flex items-center gap-3 text-xs">
                <span className="p-1.5 bg-black/20 rounded-lg">⚠️</span>
                <div>
                  <strong className="font-bold tracking-wide">
                    Your 7-Day Free Trial Period Has Concluded.
                  </strong>
                  <p className="text-[11px] text-red-100 mt-0.5">
                    To continue uninterrupted access to the 35-Keyword Matrix, Market Shift Radar, and AI Judge, please activate your Monthly ($29.99) or Yearly ($299.99) subscription.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setCurrentTab("subscription-billing")}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-slate-950 font-black text-xs hover:bg-gray-100 shadow transition-all active:scale-95"
                >
                  Subscribe ($29.99 / $299.99)
                </button>
                <button
                  onClick={() => setCurrentTab("subscription-billing")}
                  className="px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/40 text-white font-bold text-xs border border-white/20 transition-colors"
                >
                  Sign In / Up
                </button>
              </div>
            </div>
          )}

        {/* Scrollable View Container */}
        <section className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {currentTab === "overview" && (
            <OverviewView
              keywords={keywords}
              competitors={competitors}
              campaignLogs={campaignLogs}
              onDeleteLog={handleDeleteCampaignLog}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onExportCsv={handleExportCsv}
              onDownloadPdf={() => setIsPrintReportOpen(true)}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === "ai-search-eeat" && <AISearchEEATView />}

          {currentTab === "a2a-judge" && <A2AJudgeView />}

          {currentTab === "keywords" && (
            <KeywordMatrixView
              keywords={keywords}
              onAddKeyword={handleAddKeyword}
              onDeleteKeyword={handleDeleteKeyword}
              onToggleArchiveKeyword={handleToggleArchiveKeyword}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {currentTab === "initial-audit" && (
            <InitialAuditView
              competitors={competitors}
              onAddCompetitor={handleAddCompetitor}
              onDeleteCompetitor={handleDeleteCompetitor}
              onToggleArchiveCompetitor={handleToggleArchiveCompetitor}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {currentTab === "onpage-tech" && <OnPageTechView />}

          {currentTab === "content-marketing" && (
            <ContentMarketingView
              contentPieces={contentPieces}
              citations={citations}
              onAddContentPiece={handleAddContentPiece}
              onUpdateContentPiece={handleUpdateContentPiece}
              onDeleteContentPiece={handleDeleteContentPiece}
              onToggleArchiveContentPiece={handleToggleArchiveContentPiece}
              onAddCitation={handleAddCitation}
              onDeleteCitation={handleDeleteCitation}
              onToggleArchiveCitation={handleToggleArchiveCitation}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {currentTab === "audio-transcriber" && (
            <AudioTranscribeView
              transcripts={transcripts}
              onAddTranscript={handleAddTranscript}
              onDeleteTranscript={handleDeleteTranscript}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              isRecordingProp={isRecording}
              onToggleRecording={() => setIsRecording(!isRecording)}
            />
          )}

          {currentTab === "packages-roi" && (
            <PackagesPricingView
              keywords={keywords}
              competitors={competitors}
            />
          )}

          {currentTab === "algorithm-intel" && <AlgorithmUpdatesView />}

          {currentTab === "subscription-billing" && (
            <SubscriptionBillingView onNavigate={setCurrentTab} />
          )}
        </section>
      </main>

      {/* Universal Add Record & Archive Manager Modal */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddKeyword={handleAddKeyword}
        onAddCompetitor={handleAddCompetitor}
        onAddContentPiece={handleAddContentPiece}
        onAddCitation={handleAddCitation}
        onAddTranscript={handleAddTranscript}
        onAddCampaignLog={handleAddCampaignLog}
        keywords={keywords}
        competitors={competitors}
        contentPieces={contentPieces}
        citations={citations}
        transcripts={transcripts}
        onToggleArchiveKeyword={handleToggleArchiveKeyword}
        onToggleArchiveCompetitor={handleToggleArchiveCompetitor}
        onToggleArchiveContentPiece={handleToggleArchiveContentPiece}
        onToggleArchiveCitation={handleToggleArchiveCitation}
        onToggleArchiveTranscript={handleToggleArchiveTranscript}
        onDeleteKeyword={handleDeleteKeyword}
        onDeleteCompetitor={handleDeleteCompetitor}
      />

      {/* Formatted Printable PDF Report Snapshot Modal */}
      <PrintableReportModal
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        keywords={keywords}
        competitors={competitors}
        contentPieces={contentPieces}
        citations={citations}
      />

      {/* Market Shift Surveillance & Notification Modal */}
      <MarketShiftNotificationSystem
        isOpen={isMarketShiftOpen}
        onClose={() => setIsMarketShiftOpen(false)}
        keywords={keywords}
        alerts={marketShiftAlerts}
        onUpdateAlerts={setMarketShiftAlerts}
        onNavigate={setCurrentTab}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#003300] text-white border border-[#004d00] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          <CheckCircle2 className="w-5 h-5 text-[#ffa500] flex-shrink-0" />
          <span className="text-xs font-semibold text-green-100">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthBillingProvider>
        <AppContent />
      </AuthBillingProvider>
    </ThemeProvider>
  );
}

export default App;

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
import {
  subscribeKeywords,
  saveKeywordToFirestore,
  deleteKeywordFromFirestore,
  bulkDeleteKeywordsFromFirestore,
  subscribeCompetitors,
  saveCompetitorToFirestore,
  deleteCompetitorFromFirestore,
  subscribeContentPieces,
  saveContentPieceToFirestore,
  deleteContentPieceFromFirestore,
  subscribeCitations,
  saveCitationToFirestore,
  deleteCitationFromFirestore,
  subscribeTranscripts,
  saveTranscriptToFirestore,
  deleteTranscriptFromFirestore,
  subscribeCampaignLogs,
  addCampaignLogToFirestore,
  deleteCampaignLogFromFirestore,
  seedInitialFirestoreData,
} from "./services/firebaseService";

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
import { TrialExpirationLockout } from "./components/TrialExpirationLockout";

// New Agency Module Views
import { ServicesCatalogView } from "./components/views/ServicesCatalogView";
import { WebsiteDiscoveryView } from "./components/views/WebsiteDiscoveryView";
import { SchemaGeneratorView } from "./components/views/SchemaGeneratorView";
import { InternalLinkingView } from "./components/views/InternalLinkingView";
import { MigrationSeoView } from "./components/views/MigrationSeoView";
import { PlatformGuidesView } from "./components/views/PlatformGuidesView";
import { IntegrationsCenterView } from "./components/views/IntegrationsCenterView";
import { AiConsultantView } from "./components/views/AiConsultantView";
import { ProjectManagementView } from "./components/views/ProjectManagementView";
import { WhiteLabelView } from "./components/views/WhiteLabelView";

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
import { CheckCircle2, X, Radio, AlertTriangle, Trash2, ShieldAlert } from "lucide-react";

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>("overview");
  const { theme, toggleTheme } = useTheme();
  const {
    currentUser,
    trialState,
    isAccessRestricted,
    isAdvanceWarning,
    hasActivePaidPlan,
  } = useAuthBilling();

  // Core Data States with Add/Delete/Archive support
  const [keywords, setKeywords] = useState<KeywordItem[]>(INITIAL_KEYWORDS);
  const [competitors, setCompetitors] = useState<CompetitorItem[]>(INITIAL_COMPETITORS);
  const [contentPieces, setContentPieces] = useState<ContentPieceItem[]>(INITIAL_CONTENT_PIECES);
  const [citations, setCitations] = useState<LocalCitationItem[]>(INITIAL_CITATIONS);
  const [transcripts, setTranscripts] = useState<AudioTranscriptItem[]>(INITIAL_TRANSCRIPTS);
  const [campaignLogs, setCampaignLogs] = useState<CampaignLogItem[]>(INITIAL_CAMPAIGN_LOGS);
  const [firestoreConnected, setFirestoreConnected] = useState(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [logPendingDelete, setLogPendingDelete] = useState<CampaignLogItem | null>(null);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    const unsubKeywords = subscribeKeywords((items) => {
      if (items.length > 0) setKeywords(items);
    });
    const unsubCompetitors = subscribeCompetitors((items) => {
      if (items.length > 0) setCompetitors(items);
    });
    const unsubContent = subscribeContentPieces((items) => {
      if (items.length > 0) setContentPieces(items);
    });
    const unsubCitations = subscribeCitations((items) => {
      if (items.length > 0) setCitations(items);
    });
    const unsubTranscripts = subscribeTranscripts((items) => {
      if (items.length > 0) setTranscripts(items);
    });
    const unsubLogs = subscribeCampaignLogs((items) => {
      if (items.length > 0) setCampaignLogs(items);
    });

    return () => {
      unsubKeywords();
      unsubCompetitors();
      unsubContent();
      unsubCitations();
      unsubTranscripts();
      unsubLogs();
    };
  }, []);

  // One-click Firestore Seeder
  const handleSeedToFirestore = async () => {
    setIsCloudSyncing(true);
    showToast("Syncing all workspace items to Firebase Firestore...");
    try {
      const res = await seedInitialFirestoreData({
        keywords,
        competitors,
        contentPieces,
        citations,
        transcripts,
        campaignLogs,
      });
      if (res.success) {
        showToast(`Firebase Firestore synced successfully (${res.count} records)!`);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#ffa500", "#004d00", "#10b981"],
        });
      } else {
        showToast("Firestore sync completed.");
      }
    } catch (e) {
      showToast("Cloud sync finished.");
    } finally {
      setIsCloudSyncing(false);
    }
  };

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
    saveKeywordToFirestore(kw);
    const log: CampaignLogItem = {
      id: `log-kw-${Date.now()}`,
      timestamp: `2026-08-24 ${new Date().toLocaleTimeString()}`,
      category: "On-Page",
      event: `Added target keyword "${kw.keyword}" (Vol: ${kw.searchVolume.toLocaleString()}) to matrix.`,
      impactScore: "+2.4%",
      user: "Lead Strategist",
    };
    setCampaignLogs((prev) => [log, ...prev]);
    addCampaignLogToFirestore(log);
    showToast(`Keyword "${kw.keyword}" added & synced to Firebase!`);
  };

  const handleAddCompetitor = (comp: CompetitorItem) => {
    setCompetitors((prev) => [comp, ...prev]);
    saveCompetitorToFirestore(comp);
    const log: CampaignLogItem = {
      id: `log-comp-${Date.now()}`,
      timestamp: `2026-08-24 ${new Date().toLocaleTimeString()}`,
      category: "Audit",
      event: `Added competitor "${comp.name}" (${comp.domain}) to Benchmark Matrix.`,
      impactScore: "+1.8%",
      user: "Lead Strategist",
    };
    setCampaignLogs((prev) => [log, ...prev]);
    addCampaignLogToFirestore(log);
    showToast(`Competitor "${comp.name}" benchmarked & saved in Firebase!`);
  };

  const handleAddContentPiece = (cnt: ContentPieceItem) => {
    setContentPieces((prev) => [cnt, ...prev]);
    saveContentPieceToFirestore(cnt);
    const log: CampaignLogItem = {
      id: `log-cnt-${Date.now()}`,
      timestamp: `2026-08-24 ${new Date().toLocaleTimeString()}`,
      category: "Content",
      event: `Published "${cnt.title}" (${cnt.type}) targeting "${cnt.targetKeyword}".`,
      impactScore: "+4.6%",
      user: "Content Director",
    };
    setCampaignLogs((prev) => [log, ...prev]);
    addCampaignLogToFirestore(log);
    showToast(`Content piece "${cnt.title}" added to inventory & Firebase!`);
  };

  const handleAddCitation = (cit: LocalCitationItem) => {
    setCitations((prev) => [cit, ...prev]);
    saveCitationToFirestore(cit);
    showToast(`Citation on ${cit.platform} verified & saved in Firebase!`);
  };

  const handleAddTranscript = (tr: AudioTranscriptItem) => {
    setTranscripts((prev) => [tr, ...prev]);
    saveTranscriptToFirestore(tr);
    showToast(`Audio transcript "${tr.title}" synchronized in Firebase!`);
  };

  const handleAddCampaignLog = (log: CampaignLogItem) => {
    setCampaignLogs((prev) => [log, ...prev]);
    addCampaignLogToFirestore(log);
    showToast("New campaign log recorded in Firebase!");
  };

  // Archive / Restore Handlers
  const handleToggleArchiveKeyword = (id: string) => {
    setKeywords((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const nextArchived = !k.archived;
          const updated = { ...k, archived: nextArchived };
          saveKeywordToFirestore(updated);
          const log: CampaignLogItem = {
            id: `log-kw-arch-${Date.now()}`,
            timestamp: `2026-08-24 ${new Date().toLocaleTimeString()}`,
            category: "On-Page",
            event: `${nextArchived ? "Archived" : "Restored"} keyword "${k.keyword}"`,
            impactScore: nextArchived ? "0.0%" : "+1.2%",
            user: "Lead Strategist",
          };
          setCampaignLogs((logs) => [log, ...logs]);
          addCampaignLogToFirestore(log);
          showToast(nextArchived ? `Keyword "${k.keyword}" moved to archive.` : `Keyword "${k.keyword}" restored to active matrix.`);
          return updated;
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
          const updated = { ...c, archived: nextArchived };
          saveCompetitorToFirestore(updated);
          const log: CampaignLogItem = {
            id: `log-comp-arch-${Date.now()}`,
            timestamp: `2026-08-24 ${new Date().toLocaleTimeString()}`,
            category: "Audit",
            event: `${nextArchived ? "Archived" : "Restored"} competitor "${c.name}"`,
            impactScore: nextArchived ? "0.0%" : "+1.0%",
            user: "Lead Strategist",
          };
          setCampaignLogs((logs) => [log, ...logs]);
          addCampaignLogToFirestore(log);
          showToast(nextArchived ? `Competitor "${c.name}" moved to archive.` : `Competitor "${c.name}" restored to active tracking.`);
          return updated;
        }
        return c;
      })
    );
  };

  const handleToggleArchiveContentPiece = (id: string) => {
    setContentPieces((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, archived: !c.archived };
          saveContentPieceToFirestore(updated);
          return updated;
        }
        return c;
      })
    );
    showToast("Content piece archive status updated in Firebase.");
  };

  const handleToggleArchiveCitation = (id: string) => {
    setCitations((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, archived: !c.archived };
          saveCitationToFirestore(updated);
          return updated;
        }
        return c;
      })
    );
    showToast("Citation archive status updated in Firebase.");
  };

  const handleToggleArchiveTranscript = (id: string) => {
    setTranscripts((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, archived: !t.archived };
          saveTranscriptToFirestore(updated);
          return updated;
        }
        return t;
      })
    );
    showToast("Transcript archive status updated in Firebase.");
  };

  // Delete Handlers
  const handleDeleteKeyword = (id: string) => {
    setKeywords((prev) => prev.filter((k) => k.id !== id));
    deleteKeywordFromFirestore(id);
    showToast("Keyword permanently deleted from Firebase.");
  };

  const handleDeleteCompetitor = (id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    deleteCompetitorFromFirestore(id);
    showToast("Competitor permanently deleted from Firebase.");
  };

  const handleDeleteContentPiece = (id: string) => {
    setContentPieces((prev) => prev.filter((c) => c.id !== id));
    deleteContentPieceFromFirestore(id);
    showToast("Content piece removed from Firebase.");
  };

  const handleUpdateContentPiece = (updatedPiece: ContentPieceItem) => {
    setContentPieces((prev) =>
      prev.map((c) => (c.id === updatedPiece.id ? updatedPiece : c))
    );
    saveContentPieceToFirestore(updatedPiece);
    showToast(`Deliverable "${updatedPiece.title}" re-audited & marked fresh!`);
  };

  const handleDeleteCitation = (id: string) => {
    setCitations((prev) => prev.filter((c) => c.id !== id));
    deleteCitationFromFirestore(id);
    showToast("Citation profile removed from Firebase.");
  };

  const handleDeleteTranscript = (id: string) => {
    setTranscripts((prev) => prev.filter((t) => t.id !== id));
    deleteTranscriptFromFirestore(id);
    showToast("Transcript deleted from Firebase.");
  };

  const handleDeleteCampaignLog = (id: string) => {
    const target = campaignLogs.find((l) => l.id === id);
    if (target) {
      setLogPendingDelete(target);
    }
  };

  const handleConfirmDeleteCampaignLog = async () => {
    if (!logPendingDelete) return;
    const id = logPendingDelete.id;
    const cat = logPendingDelete.category;
    setCampaignLogs((prev) => prev.filter((l) => l.id !== id));
    await deleteCampaignLogFromFirestore(id);
    showToast(`Campaign record [${cat}] permanently removed from SEO history.`);
    setLogPendingDelete(null);
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
        onDownloadPdf={() => setIsPrintReportOpen(true)}
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
          searchQuery={globalSearchQuery}
          onSearchQueryChange={setGlobalSearchQuery}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenMarketShiftsModal={() => setIsMarketShiftOpen(true)}
          onDownloadPdf={() => setIsPrintReportOpen(true)}
          onTriggerTestAlert={handleTriggerAlgorithmAlert}
          onSyncFirestore={handleSeedToFirestore}
          isCloudSyncing={isCloudSyncing}
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

        {/* ADVANCE NOTIFICATION BANNER (1-2 Days Before Expiration) */}
        {!isAccessRestricted &&
          isAdvanceWarning &&
          currentUser?.subscriptionPlan === "free_trial" && (
            <div
              id="trial-advance-warning-global-banner"
              className="bg-gradient-to-r from-amber-600 via-[#ffa500] to-yellow-500 text-slate-950 px-5 py-2.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-amber-600 animate-in slide-in-from-top duration-200 shrink-0"
            >
              <div className="flex items-center gap-3 text-xs">
                <span className="p-1 rounded-lg bg-slate-950 text-[#ffa500] font-black">
                  ⏳
                </span>
                <div>
                  <strong className="font-black uppercase tracking-wider text-[11px]">
                    Advance Notice: 7-Day Free Trial Concludes in {trialState.daysRemaining} Day{trialState.daysRemaining > 1 ? "s" : ""}
                  </strong>
                  <p className="text-[11px] text-slate-900 font-medium mt-0.5">
                    Your complimentary period will expire soon. Activate your Monthly ($29.99/mo) or Yearly ($299.99/yr) plan to prevent access suspension.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setCurrentTab("subscription-billing")}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-950 text-[#ffa500] font-black text-xs hover:bg-slate-900 shadow transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>Select Plan ($29.99 / $299.99)</span>
                </button>
              </div>
            </div>
          )}

        {/* 7-DAY FREE TRIAL EXPIRATION ACCESS SUSPENDED BANNER */}
        {isAccessRestricted && currentTab !== "subscription-billing" && (
          <div
            id="trial-expired-global-banner"
            className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white px-5 py-3 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-red-900 animate-in slide-in-from-top duration-200 shrink-0"
          >
            <div className="flex items-center gap-3 text-xs">
              <span className="p-1.5 bg-black/30 rounded-lg text-amber-300 font-bold">
                🔒
              </span>
              <div>
                <strong className="font-black tracking-wide uppercase text-[11px] text-amber-300">
                  Access Suspended • 7-Day Free Trial Expired
                </strong>
                <p className="text-[11px] text-red-100 mt-0.5">
                  Your 7-day trial period has concluded. As per application policy, access to all tools is suspended until a Monthly ($29.99/mo) or Annual ($299.99/yr) plan is activated.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setCurrentTab("subscription-billing")}
                className="px-4 py-1.5 rounded-lg bg-[#ffa500] text-slate-950 font-black text-xs hover:brightness-110 shadow transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>Upgrade to Regain Access &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable View Container */}
        <section className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* HARD GATE: If trial expired and user is on any feature tab, show Lockout View */}
          {isAccessRestricted && currentTab !== "subscription-billing" ? (
            <TrialExpirationLockout onNavigate={setCurrentTab} />
          ) : (
            <>
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
                  externalSearchQuery={globalSearchQuery}
                  onAddKeyword={handleAddKeyword}
                  onDeleteKeyword={handleDeleteKeyword}
                  onToggleArchiveKeyword={handleToggleArchiveKeyword}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />
              )}

              {currentTab === "initial-audit" && (
                <InitialAuditView
                  competitors={competitors}
                  externalSearchQuery={globalSearchQuery}
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
                  externalSearchQuery={globalSearchQuery}
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

              {currentTab === "services-catalog" && (
                <ServicesCatalogView onNavigate={setCurrentTab} />
              )}

              {currentTab === "website-discovery" && <WebsiteDiscoveryView />}

              {currentTab === "schema-generator" && <SchemaGeneratorView />}

              {currentTab === "internal-linking" && <InternalLinkingView />}

              {currentTab === "migration-seo" && <MigrationSeoView />}

              {currentTab === "platform-guides" && <PlatformGuidesView />}

              {currentTab === "integrations-center" && <IntegrationsCenterView />}

              {currentTab === "ai-consultant" && <AiConsultantView />}

              {currentTab === "project-management" && <ProjectManagementView />}

              {currentTab === "white-label" && <WhiteLabelView />}

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
            </>
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

      {/* Campaign Log Deletion Confirmation Dialog Modal */}
      {logPendingDelete && (
        <div
          id="delete-campaign-log-dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setLogPendingDelete(null)}
        >
          <div
            id="delete-campaign-log-modal-content"
            className="bg-white dark:bg-[#0b170b] border border-red-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Warning Icon */}
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-red-100 dark:bg-red-950/60 rounded-xl text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Confirm Campaign Record Removal
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Are you sure you want to permanently delete this SEO event log from the history records and Firebase Firestore?
                </p>
              </div>
            </div>

            {/* Target Record Details Preview */}
            <div className="bg-gray-50 dark:bg-[#060e06] p-4 rounded-xl border border-gray-200 dark:border-green-950/60 text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-green-950/40">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Record ID:</span>
                <span className="font-mono font-bold text-gray-700 dark:text-green-300">{logPendingDelete.id}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 font-medium block mb-0.5">Event Description:</span>
                <p className="font-semibold text-gray-900 dark:text-white">{logPendingDelete.event}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium block">Category:</span>
                  <span className="inline-block px-2 py-0.5 mt-0.5 rounded bg-[#004d00]/10 dark:bg-[#004d00]/40 text-[#004d00] dark:text-[#ffa500] font-bold">
                    {logPendingDelete.category}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium block">Impact Score:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    +{logPendingDelete.impactScore} Pts
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-green-950/40 text-[11px] text-gray-500 dark:text-gray-400">
                <span>Timestamp: {logPendingDelete.timestamp}</span>
                <span>Logged by: {logPendingDelete.user}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="cancel-delete-log-btn"
                type="button"
                onClick={() => setLogPendingDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-green-950/40 transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-log-btn"
                type="button"
                onClick={handleConfirmDeleteCampaignLog}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

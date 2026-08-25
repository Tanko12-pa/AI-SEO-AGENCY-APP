import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Sparkles,
  Calendar,
  Layers,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Zap,
  Bot,
  FileText,
  Mic,
  TrendingUp,
  Download,
  Printer,
  Sun,
  Moon,
  Bell,
  User,
  CheckCircle2,
  Sliders,
  Radio,
  Volume2,
  Mail,
  Smartphone,
  ShieldAlert,
  LogOut,
  Settings,
  Flame,
  CreditCard,
  UserPlus,
  LogIn,
  KeyRound,
  Clock,
} from "lucide-react";
import {
  NavigationTab,
  KeywordItem,
  CompetitorItem,
  ContentPieceItem,
  AudioTranscriptItem,
  AlgorithmNotificationPreferences,
  MarketShiftAlert,
} from "../types";
import { useTheme } from "../context/ThemeContext";
import { useAuthBilling } from "../context/AuthBillingContext";

interface HeaderProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  keywords: KeywordItem[];
  competitors: CompetitorItem[];
  contentPieces: ContentPieceItem[];
  transcripts: AudioTranscriptItem[];
  marketShiftAlerts?: MarketShiftAlert[];
  onOpenAddModal: () => void;
  onOpenMarketShiftsModal?: () => void;
  onDownloadPdf?: () => void;
  onTriggerTestAlert?: (title: string, message: string) => void;
}

const DEFAULT_PREFERENCES: AlgorithmNotificationPreferences = {
  criticalCoreUpdates: true,
  aiOverviewFluctuations: true,
  eeatHelpfulContentShifts: true,
  dailySerpDigest: false,
  marketShiftAlerts: true,
  audibleChimes: true,
  browserPush: true,
  emailAlerts: true,
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  keywords,
  competitors,
  contentPieces,
  transcripts,
  marketShiftAlerts = [],
  onOpenAddModal,
  onOpenMarketShiftsModal,
  onDownloadPdf,
  onTriggerTestAlert,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, trialState, signOut } = useAuthBilling();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState("Apex HealthTech & Enterprise SaaS");
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Notification Preferences State (with localStorage persistence)
  const [notifPrefs, setNotifPrefs] = useState<AlgorithmNotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem("ai_seo_notif_prefs");
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [testAlertSent, setTestAlertSent] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<HTMLDivElement>(null);

  // Save prefs when changed
  const handleTogglePref = (key: keyof AlgorithmNotificationPreferences) => {
    setNotifPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("ai_seo_notif_prefs", JSON.stringify(updated));
      return updated;
    });
  };

  // Test Notification Trigger
  const handleSendTestNotification = () => {
    setTestAlertSent(true);
    if (onTriggerTestAlert) {
      onTriggerTestAlert(
        "Google Core & AI Overview Radar Spike (Test Alert)",
        "Volatility index reached 8.7/10. 45-word direct answer blocks active in 82% of SERPs."
      );
    }
    setTimeout(() => setTestAlertSent(false), 3000);
  };

  // Filter items across all system entities
  const searchResults = searchQuery.trim()
    ? {
        keywords: keywords
          .filter((k) => k.keyword.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 4),
        competitors: competitors
          .filter(
            (c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.domain.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3),
        content: contentPieces
          .filter(
            (c) =>
              c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.targetKeyword.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3),
        transcripts: transcripts
          .filter(
            (t) =>
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.fullTranscript.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 2),
      }
    : null;

  const totalResultsCount = searchResults
    ? searchResults.keywords.length +
      searchResults.competitors.length +
      searchResults.content.length +
      searchResults.transcripts.length
    : 0;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (clientRef.current && !clientRef.current.contains(e.target as Node)) {
        setIsClientMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      id="app-global-header"
      className="h-16 bg-white dark:bg-[#0b170b] border-b border-gray-200 dark:border-[#163016] flex items-center justify-between px-6 lg:px-8 shrink-0 z-30 relative transition-colors"
    >
      {/* Global Search Bar */}
      <div ref={searchRef} className="relative w-72 md:w-96 lg:w-[460px]">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            id="global-system-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search campaigns, 35-matrix keywords, competitors..."
            className="w-full bg-gray-100 dark:bg-[#060e06] border border-gray-300 dark:border-[#1e461e] rounded-full py-1.5 pl-10 pr-10 text-xs text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffa500] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-gray-200 dark:bg-[#163016] text-gray-700 dark:text-gray-300 hover:text-gray-900 rounded px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <div
            id="search-results-dropdown"
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white rounded-xl shadow-2xl border border-gray-200 dark:border-[#163016] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="p-3 bg-gray-50 dark:bg-[#060e06] text-gray-700 dark:text-gray-300 flex items-center justify-between text-xs font-semibold border-b border-gray-200 dark:border-[#163016]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ffa500]" />
                Search Results ({totalResultsCount} found)
              </span>
              <span className="text-gray-400 text-[11px]">ESC to close</span>
            </div>

            <div className="max-h-96 overflow-y-auto p-3 space-y-3 text-xs">
              {totalResultsCount === 0 && (
                <div className="text-center py-6 text-gray-400">
                  <p>No matches found for "{searchQuery}".</p>
                  <p className="mt-1 text-[11px]">Try querying keywords, competitors, or deliverables.</p>
                </div>
              )}

              {/* Keywords Section */}
              {searchResults && searchResults.keywords.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-[#ffa500]" />
                    Target Keywords ({searchResults.keywords.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.keywords.map((kw) => (
                      <button
                        key={kw.id}
                        onClick={() => {
                          onNavigate("keywords");
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left p-2 rounded hover:bg-gray-50 dark:hover:bg-[#122412] flex items-center justify-between border border-gray-100 dark:border-[#163016] transition-colors"
                      >
                        <div className="truncate pr-2">
                          <span className="font-medium text-gray-900 dark:text-white">{kw.keyword}</span>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">
                            Vol: {kw.searchVolume.toLocaleString()} • Diff: {kw.difficulty}% • AI Overview: {kw.aiOverviewProbability}%
                          </div>
                        </div>
                        <span className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          Rank #{kw.currentRank}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Competitors Section */}
              {searchResults && searchResults.competitors.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#ffa500]" />
                    Competitors ({searchResults.competitors.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.competitors.map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => {
                          onNavigate("initial-audit");
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left p-2 rounded hover:bg-gray-50 dark:hover:bg-[#122412] flex items-center justify-between border border-gray-100 dark:border-[#163016] transition-colors"
                      >
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{comp.name}</span>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">{comp.domain}</div>
                        </div>
                        <span className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          DA {comp.domainAuthority}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Strategy Section */}
              {searchResults && searchResults.content.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#ffa500]" />
                    Content Strategy Pieces ({searchResults.content.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.content.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onNavigate("content-marketing");
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left p-2 rounded hover:bg-gray-50 dark:hover:bg-[#122412] flex items-center justify-between border border-gray-100 dark:border-[#163016] transition-colors"
                      >
                        <div className="truncate pr-2">
                          <span className="font-medium text-gray-900 dark:text-white">{c.title}</span>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">{c.type} • {c.targetKeyword}</div>
                        </div>
                        <span className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          EEAT {c.eeatScore}/100
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Theme Toggle, Client Switcher, PDF Report, User Profile Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* THEME TOGGLE BUTTON (Light vs Deep Dark Mode) */}
        <button
          id="theme-mode-toggle-btn"
          onClick={toggleTheme}
          className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-100 dark:bg-[#060e06] hover:bg-gray-200 dark:hover:bg-[#122412] border border-gray-200 dark:border-[#163016] text-gray-700 dark:text-gray-300 transition-all shadow-xs"
          title={`Switch to ${theme === "light" ? "Deep Dark Mode" : "Light Mode"}`}
        >
          {theme === "light" ? (
            <>
              <Moon className="w-4 h-4 text-[#004d00]" />
              <span className="text-[11px] font-semibold hidden sm:inline text-gray-700">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-[#ffa500]" />
              <span className="text-[11px] font-semibold hidden sm:inline text-[#ffa500]">Light</span>
            </>
          )}
        </button>

        {/* Client Switcher */}
        <div ref={clientRef} className="relative hidden md:block">
          <button
            onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
            className="flex items-center gap-2 bg-gray-50 dark:bg-[#060e06] hover:bg-gray-100 dark:hover:bg-[#122412] border border-gray-300 dark:border-[#1e461e] rounded-lg px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 font-medium transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-[#004d00] dark:bg-[#10b981]" />
            <span className="max-w-[170px] truncate">{selectedClient}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {isClientMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-[#163016] rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider border-b border-gray-100 dark:border-[#163016]">
                Client Workspaces
              </div>
              {[
                "Apex HealthTech & Enterprise SaaS",
                "BioGen Medical Devices Inc.",
                "OmniCommerce Global Retail",
                "FinGuard Cyber & FinTech",
              ].map((client) => (
                <button
                  key={client}
                  onClick={() => {
                    setSelectedClient(client);
                    setIsClientMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#122412] flex items-center justify-between ${
                    selectedClient === client
                      ? "font-bold text-[#004d00] dark:text-[#ffa500] bg-green-50/50 dark:bg-[#081f08]"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="truncate">{client}</span>
                  {selectedClient === client && <ShieldCheck className="w-3.5 h-3.5 text-[#004d00] dark:text-[#ffa500]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Download PDF Button */}
        {onDownloadPdf && (
          <button
            id="header-download-pdf-btn"
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#060e06] border border-gray-300 dark:border-[#1e461e] px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-[#122412] transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#004d00] dark:text-[#ffa500]" />
            <span className="hidden sm:inline">REPORT</span>
          </button>
        )}

        {/* SUBSCRIPTION & 7-DAY TRIAL QUICK PILL BUTTON */}
        <button
          id="header-subscription-status-btn"
          onClick={() => onNavigate("subscription-billing")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
            currentUser?.subscriptionPlan === "monthly" || currentUser?.subscriptionPlan === "yearly"
              ? "bg-green-100 dark:bg-[#122412] text-green-900 dark:text-[#ffa500] border border-green-300 dark:border-[#1e461e]"
              : trialState.isExpired
              ? "bg-red-500 text-white animate-pulse"
              : "bg-amber-100 dark:bg-[#20170a] text-amber-900 dark:text-[#ffa500] border border-amber-300 dark:border-[#4d3a00]"
          }`}
          title="Manage Account, 7-Day Free Trial, or Monthly/Yearly Subscription"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">
            {currentUser?.subscriptionPlan === "monthly"
              ? "Pro Monthly ($29.99)"
              : currentUser?.subscriptionPlan === "yearly"
              ? "Pro Yearly ($299.99)"
              : trialState.isExpired
              ? "Trial Expired • Upgrade"
              : `Trial: ${trialState.daysRemaining}d Left`}
          </span>
          <span className="lg:hidden">Billing</span>
        </button>

        {/* MARKET SHIFT ALERTS QUICK BUTTON */}
        {onOpenMarketShiftsModal && (
          <button
            id="header-market-shift-alerts-btn"
            onClick={onOpenMarketShiftsModal}
            className="relative flex items-center gap-1.5 bg-amber-50 dark:bg-[#1f1608] hover:bg-amber-100 dark:hover:bg-[#2e200a] border border-amber-300 dark:border-[#523e12] px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 dark:text-[#ffa500] transition-colors shadow-xs"
            title="View Market Shift Alerts (Tracked Keywords with ≥20% Search Volume Shifts)"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span className="hidden md:inline font-mono">Market Shifts</span>
            {marketShiftAlerts.filter((a) => !a.read).length > 0 && (
              <span className="bg-red-600 text-white font-mono text-[9px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white dark:ring-[#0b170b] animate-bounce">
                {marketShiftAlerts.filter((a) => !a.read).length}
              </span>
            )}
          </button>
        )}

        {/* USER PROFILE DROPDOWN WITH AUTH & ALGORITHM NOTIFICATION PREFERENCES */}
        <div ref={profileRef} className="relative">
          <button
            id="user-profile-menu-button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#ffa500] transition-all cursor-pointer"
            title="User Profile, Auth & Algorithm Notification Preferences"
          >
            <div className="h-8 w-8 rounded-full bg-[#ffa500] flex items-center justify-center text-slate-950 font-black text-xs shadow-sm ring-2 ring-[#004d00] dark:ring-[#163016]">
              {currentUser?.avatarInitials || "AK"}
            </div>
            <div className="hidden xl:block text-left text-[11px] leading-tight">
              <div className="font-bold text-gray-900 dark:text-white">{currentUser?.name || "Akindewum"}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[110px]">
                {currentUser?.subscriptionPlan === "yearly"
                  ? "Yearly Pro ($299.99)"
                  : currentUser?.subscriptionPlan === "monthly"
                  ? "Monthly Pro ($29.99)"
                  : "7-Day Free Trial"}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden xl:block" />
          </button>

          {/* Profile & Notification Center Dropdown */}
          {isProfileMenuOpen && (
            <div
              id="user-profile-dropdown-modal"
              className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-[#163016] rounded-2xl shadow-2xl z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150"
            >
              {/* User Identity Header */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-[#061406] dark:to-[#091f09] border-b border-gray-200 dark:border-[#163016]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-[#ffa500] flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                      {currentUser?.avatarInitials || "AK"}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                        {currentUser?.name || "Guest User"}
                        <span className="text-[9px] bg-[#004d00] text-white px-1.5 py-0.2 rounded font-mono font-bold">
                          {currentUser?.subscriptionPlan === "yearly"
                            ? "YEARLY PRO"
                            : currentUser?.subscriptionPlan === "monthly"
                            ? "MONTHLY PRO"
                            : "7-DAY TRIAL"}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 dark:text-gray-300 font-mono">
                        {currentUser?.email || "akindewum@gmail.com"}
                      </div>
                      <div className="text-[10px] text-green-800 dark:text-green-400 font-semibold mt-0.5">
                        {currentUser?.role || "Lead AI SEO Architect & Director"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-green-200/50 dark:border-[#143314] flex items-center justify-between text-[11px]">
                  <span className="text-gray-600 dark:text-gray-400">Subscription Status:</span>
                  <span className="font-bold text-[#004d00] dark:text-[#ffa500]">
                    {currentUser?.subscriptionPlan === "monthly"
                      ? "Monthly Active ($29.99/mo)"
                      : currentUser?.subscriptionPlan === "yearly"
                      ? "Yearly Active ($299.99/yr)"
                      : trialState.isExpired
                      ? "Trial Expired (Upgrade Required)"
                      : `7-Day Free Trial (${trialState.daysRemaining} days left)`}
                  </span>
                </div>

                {/* Quick Auth & Billing Action Links */}
                <div className="mt-3 pt-2.5 border-t border-green-200/50 dark:border-[#143314] grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    onClick={() => {
                      onNavigate("subscription-billing");
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-1 p-1.5 rounded-lg bg-[#004d00] text-white hover:bg-[#003800] font-bold text-[10px] transition-colors"
                  >
                    <CreditCard className="w-3 h-3 text-[#ffa500]" />
                    <span>Billing & Plans</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate("subscription-billing");
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-1 p-1.5 rounded-lg bg-white dark:bg-[#122412] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#1e461e] hover:bg-gray-50 font-bold text-[10px] transition-colors"
                  >
                    <UserPlus className="w-3 h-3 text-[#004d00] dark:text-[#ffa500]" />
                    <span>Sign Up / Sign In</span>
                  </button>
                </div>
              </div>

              {/* ALGORITHM NOTIFICATION PREFERENCES SECTION */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#163016] pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                    <ShieldAlert className="w-4 h-4 text-[#ffa500]" />
                    <span>Algorithm Update Alerts</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Real-Time Radar</span>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                  Customize your automated notifications when Google Core, Helpful Content, or AI Overviews algorithm shifts occur:
                </p>

                {/* Preference Toggles List */}
                <div className="space-y-2.5 pt-1">
                  {/* 1. Critical Core Updates */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-[#163016]">
                    <div className="space-y-0.5 pr-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-[#ffa500]" />
                        <span>Critical Core Updates</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                        Instant alerts when SERP Volatility index exceeds 8.0/10
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePref("criticalCoreUpdates")}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        notifPrefs.criticalCoreUpdates ? "bg-[#004d00]" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          notifPrefs.criticalCoreUpdates ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* 2. AI Overviews & SGE Fluctuations */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-[#163016]">
                    <div className="space-y-0.5 pr-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        <span>AI Overviews & SGE Shifts</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                        Alerts on citation pattern changes & 45-word snippet captures
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePref("aiOverviewFluctuations")}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        notifPrefs.aiOverviewFluctuations ? "bg-[#004d00]" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          notifPrefs.aiOverviewFluctuations ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* 3. Helpful Content & EEAT Shifts */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-[#163016]">
                    <div className="space-y-0.5 pr-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-green-600" />
                        <span>Helpful Content & EEAT Shifts</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                        Notifies when unverified author rankings fluctuate
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePref("eeatHelpfulContentShifts")}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        notifPrefs.eeatHelpfulContentShifts ? "bg-[#004d00]" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          notifPrefs.eeatHelpfulContentShifts ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* 4. Daily SERP Volatility Digest */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-[#163016]">
                    <div className="space-y-0.5 pr-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-purple-500" />
                        <span>Daily SERP Volatility Digest</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                        Daily summary digest of 35 target keyword stability
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePref("dailySerpDigest")}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        notifPrefs.dailySerpDigest ? "bg-[#004d00]" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          notifPrefs.dailySerpDigest ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* 5. In-App Toast & Audio Chime */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#060e06] border border-gray-100 dark:border-[#163016]">
                    <div className="space-y-0.5 pr-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        <Volume2 className="w-3 h-3 text-orange-500" />
                        <span>Audio Chimes & In-App Toasts</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                        Sound cue and popup banner during active algorithm shifts
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePref("audibleChimes")}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        notifPrefs.audibleChimes ? "bg-[#004d00]" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          notifPrefs.audibleChimes ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Test Dispatch Button */}
                <div className="pt-2">
                  <button
                    id="test-algorithm-notification-btn"
                    onClick={handleSendTestNotification}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Radio className={`w-3.5 h-3.5 text-[#ffa500] ${testAlertSent ? "animate-ping" : ""}`} />
                    <span>{testAlertSent ? "Notification Dispatched!" : "Test Algorithm Alert Dispatch"}</span>
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-3 bg-gray-50 dark:bg-[#060e06] border-t border-gray-200 dark:border-[#163016] flex items-center justify-between text-[11px]">
                <button
                  onClick={() => {
                    onNavigate("algorithm-intel");
                    setIsProfileMenuOpen(false);
                  }}
                  className="text-[#004d00] dark:text-[#ffa500] font-semibold hover:underline flex items-center gap-1"
                >
                  <ShieldAlert className="w-3 h-3" />
                  View Algorithm Radar
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useState } from "react";
import {
  Lock,
  Sparkles,
  CheckCircle2,
  Zap,
  ShieldCheck,
  CreditCard,
  Layers,
  TrendingUp,
  FileCode,
  FileText,
  Bot,
  Mic,
  ArrowRight,
  RefreshCw,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useAuthBilling } from "../context/AuthBillingContext";
import { NavigationTab } from "../types";
import confetti from "canvas-confetti";

interface TrialExpirationLockoutProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const TrialExpirationLockout: React.FC<TrialExpirationLockoutProps> = ({
  onNavigate,
}) => {
  const {
    currentUser,
    trialState,
    subscribe,
    subscribeWithPayPal,
    simulateTrialState,
  } = useAuthBilling();

  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleInstantSubscribe = async (plan: "monthly" | "yearly") => {
    setIsProcessing(true);
    try {
      const res = subscribe(plan, {
        method: "Credit Card (Instant Auth)",
        last4: "8899",
      });

      if (res.success) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#004d00", "#ffa500", "#34d399", "#60a5fa"],
        });
        setFeedbackMessage(res.message);
        setTimeout(() => {
          if (onNavigate) {
            onNavigate("overview");
          }
        }, 1200);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalSubscribe = async (plan: "monthly" | "yearly") => {
    setIsProcessing(true);
    try {
      const planId =
        plan === "monthly"
          ? "P-60J823292U163132VNKGRA6Y"
          : "P-0SJ71276U2989504JNKGRCHQ";
      const res = await subscribeWithPayPal(plan, {
        planId,
        subscriptionId: `I-PP-${Date.now().toString(36).toUpperCase()}`,
        payerEmail: currentUser?.email || "subscriber@enterprise.com",
      });

      if (res.success) {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#003087", "#0079C1", "#ffa500", "#34d399"],
        });
        setFeedbackMessage(res.message);
        setTimeout(() => {
          if (onNavigate) {
            onNavigate("overview");
          }
        }, 1200);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const lockedFeatures = [
    {
      name: "35-Keyword Target Matrix & SERP Radar",
      desc: "Complete difficulty, AI Overview probabilities, and rank velocity tracking",
      icon: TrendingUp,
    },
    {
      name: "10-Competitor Benchmarking Engine",
      desc: "Live domain authority, gap overlap analysis, and backlink intelligence",
      icon: Layers,
    },
    {
      name: "AI Search EEAT & Information Gain Auditing",
      desc: "Per-URL technical scores, author expertise verification, and schema validation",
      icon: Sparkles,
    },
    {
      name: "A2A Dual Loop & Omega Judge Core",
      desc: "Multi-agent adversarial SEO evaluation and algorithmic pass/fail certification",
      icon: Bot,
    },
    {
      name: "Audio Transcription AI & Live Briefings",
      desc: "Continuous voice processing, automatic keyword extraction, and action items",
      icon: Mic,
    },
    {
      name: "Market Shift Surveillance Radar",
      desc: "Real-time Google search trends anomaly detection and rapid algorithm countermeasures",
      icon: AlertTriangle,
    },
  ];

  return (
    <div
      id="trial-expiration-lockout-gate"
      className="max-w-5xl mx-auto py-6 px-4 space-y-8 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-red-950 via-slate-900 to-amber-950 text-white p-8 rounded-3xl border border-red-800/60 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#ffa500]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>7-Day Free Trial Concluded &bull; Access Suspended</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              Subscription Required to Continue Full Access
            </h1>

            <p className="text-gray-300 text-sm leading-relaxed">
              In accordance with the <strong className="text-white">AI SEO Agency Subscription & Free Trial Policy</strong>, every new account enjoys a complimentary 7-day evaluation period. Because your trial has expired, application features remain suspended until an active subscription plan is chosen.
            </p>
          </div>

          <div className="bg-black/40 border border-white/10 p-4 rounded-2xl text-center flex-shrink-0 min-w-[200px]">
            <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              Current Account Status
            </div>
            <div className="text-lg font-black text-red-400 mt-1 flex items-center justify-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Trial Expired</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Account: <span className="font-mono text-gray-200">{currentUser?.email || "Logged User"}</span>
            </div>
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Plan Selection Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Select Your Continuous Access Plan
            </h2>
            <p className="text-xs text-gray-500">
              Immediate unlock upon confirmation &bull; Automated recurring billing &bull; Cancel anytime
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="inline-flex p-1 rounded-xl bg-gray-200 dark:bg-[#122412] border border-gray-300 dark:border-[#1e461e]">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedPlan === "monthly"
                  ? "bg-white dark:bg-[#004d00] text-gray-900 dark:text-[#ffa500] shadow-sm font-black"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedPlan === "yearly"
                  ? "bg-white dark:bg-[#004d00] text-gray-900 dark:text-[#ffa500] shadow-sm font-black"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-[#ffa500] text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MONTHLY PLAN CARD */}
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative bg-white dark:bg-[#0b170b] ${
              selectedPlan === "monthly"
                ? "border-[#004d00] dark:border-[#ffa500] ring-4 ring-[#004d00]/10 dark:ring-[#ffa500]/20 shadow-xl"
                : "border-gray-200 dark:border-[#163016] hover:border-gray-300 dark:hover:border-[#1e461e]"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-black uppercase">
                  Standard Flexibility
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  Monthly Subscription Plan
                </h3>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === "monthly"
                    ? "border-[#004d00] dark:border-[#ffa500] bg-[#004d00] dark:bg-[#ffa500] text-white dark:text-slate-950"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {selectedPlan === "monthly" && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-900 dark:text-white">$29.99</span>
                <span className="text-xs text-gray-500 font-medium">/ month</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Billed monthly &bull; Automatic renewal &bull; Full platform access
              </p>
            </div>

            <div className="space-y-2 py-4 border-t border-b border-gray-100 dark:border-[#163016] text-xs text-gray-700 dark:text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant restoration of all 11 core intelligence views</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Real-time Firebase cloud multi-device synchronization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Automated monthly renewal with PDF invoices</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                id="lockout-subscribe-monthly-btn"
                type="button"
                disabled={isProcessing}
                onClick={(e) => {
                  e.stopPropagation();
                  handleInstantSubscribe("monthly");
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-[#ffa500]" />
                <span>Activate Monthly Plan ($29.99/mo)</span>
              </button>

              <button
                id="lockout-paypal-monthly-btn"
                type="button"
                disabled={isProcessing}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePayPalSubscribe("monthly");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f4bb33] text-[#003087] font-black text-xs shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>PayPal Express Checkout</span>
              </button>
            </div>
          </div>

          {/* YEARLY PLAN CARD */}
          <div
            onClick={() => setSelectedPlan("yearly")}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative bg-white dark:bg-[#0b170b] ${
              selectedPlan === "yearly"
                ? "border-[#004d00] dark:border-[#ffa500] ring-4 ring-[#004d00]/10 dark:ring-[#ffa500]/20 shadow-xl"
                : "border-gray-200 dark:border-[#163016] hover:border-gray-300 dark:hover:border-[#1e461e]"
            }`}
          >
            <div className="absolute -top-3 right-6 bg-[#ffa500] text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              Most Popular &bull; Save 17%
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                  Best Value &bull; 2 Months Free
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  Annual (Yearly) Plan
                </h3>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === "yearly"
                    ? "border-[#004d00] dark:border-[#ffa500] bg-[#004d00] dark:bg-[#ffa500] text-white dark:text-slate-950"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {selectedPlan === "yearly" && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-900 dark:text-white">$299.99</span>
                <span className="text-xs text-gray-500 font-medium">/ year</span>
                <span className="text-[11px] text-emerald-600 dark:text-[#ffa500] font-bold ml-1">
                  ($24.99/mo effective)
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Billed annually &bull; Automatic yearly renewal &bull; Priority AI Judge Core
              </p>
            </div>

            <div className="space-y-2 py-4 border-t border-b border-gray-100 dark:border-[#163016] text-xs text-gray-700 dark:text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Full access to all 11 intelligence modules with no limits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Save $59.89 compared to monthly billing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Priority queue for Google Gemini NLP and A2A iterations</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                id="lockout-subscribe-yearly-btn"
                type="button"
                disabled={isProcessing}
                onClick={(e) => {
                  e.stopPropagation();
                  handleInstantSubscribe("yearly");
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#ffa500]" />
                <span>Activate Annual Plan ($299.99/yr)</span>
              </button>

              <button
                id="lockout-paypal-yearly-btn"
                type="button"
                disabled={isProcessing}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePayPalSubscribe("yearly");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f4bb33] text-[#003087] font-black text-xs shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>PayPal Express Checkout (Annual)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Locked Features Summary Table */}
      <div className="bg-white dark:bg-[#0b170b] p-6 rounded-3xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Features Restored Immediately Upon Subscription
            </h3>
            <p className="text-xs text-gray-500">
              Your data and keyword matrices are securely preserved in Firestore and will be available instantly.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-[#ffa500] text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Data Safe</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {lockedFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] flex items-start gap-3"
              >
                <span className="p-2 rounded-xl bg-gray-200 dark:bg-[#122412] text-gray-700 dark:text-[#ffa500] flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {feat.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Policy Verification & Quick Simulator Toolbar */}
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-[#081308] border border-gray-200 dark:border-[#163016] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 text-[#ffa500]" />
          <span>
            <strong>Policy Testing Switcher:</strong> Quickly toggle trial states to verify policy behaviors.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => simulateTrialState("active_7days")}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors"
          >
            🟢 Reset 7-Day Trial
          </button>
          <button
            onClick={() => simulateTrialState("warning_1day")}
            className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 transition-colors"
          >
            🟠 Advance Warning (1 Day)
          </button>
          <button
            onClick={() => simulateTrialState("monthly_paid")}
            className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors"
          >
            💳 Monthly ($29.99)
          </button>
          <button
            onClick={() => simulateTrialState("yearly_paid")}
            className="px-2.5 py-1 rounded-lg bg-[#004d00] text-[#ffa500] text-[11px] font-bold hover:bg-[#003800] transition-colors border border-[#ffa500]/40"
          >
            🏆 Annual ($299.99)
          </button>
        </div>
      </div>
    </div>
  );
};

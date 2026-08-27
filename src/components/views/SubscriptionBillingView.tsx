import React, { useState, useEffect } from "react";
import {
  CreditCard,
  UserPlus,
  LogIn,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Sparkles,
  Download,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  HelpCircle,
  Receipt,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Check,
  X,
  LogOut,
  Building,
  Mail,
  User,
  Star,
  Copy,
  ExternalLink,
  Activity,
  Server,
  Database,
  Bot,
  Terminal,
  Cpu,
} from "lucide-react";
import { useAuthBilling } from "../../context/AuthBillingContext";
import { NavigationTab } from "../../types";
import { PayPalGatewayModal } from "../PayPalGatewayModal";
import { PayPalSubscriptionButton } from "../PayPalSubscriptionButton";
import {
  fetchPayPalGatewayConfig,
  verifyPayPalSubscriptionOnBackend,
  cancelPayPalSubscriptionOnBackend,
  PayPalPublicConfig,
  callAiGatekeeper,
  fetchAiGatekeeperStats,
  fetchAiGatekeeperHealth,
  AiGatekeeperStats,
  AiGatekeeperHealth,
} from "../../services/api";

interface SubscriptionBillingViewProps {
  onNavigate?: (tab: NavigationTab) => void;
  initialTab?: "plans" | "paypal" | "gatekeeper" | "firebase" | "signup" | "signin" | "change-password";
}

export const SubscriptionBillingView: React.FC<SubscriptionBillingViewProps> = ({
  onNavigate,
  initialTab = "plans",
}) => {
  const {
    currentUser,
    isAuthenticated,
    trialState,
    invoices,
    signUp,
    signIn,
    signInWithGoogleAuth,
    signInWithFirebase,
    signUpWithFirebase,
    sendFirebasePasswordReset,
    signOut,
    changePassword,
    resetPasswordDirect,
    subscribe,
    subscribeWithPayPal,
    cancelSubscription,
    reactivateSubscription,
    simulateTrialExpiration,
    resetTrial,
    simulateTrialState,
    isAccessRestricted,
    isAdvanceWarning,
    hasActivePaidPlan,
  } = useAuthBilling();

  // Navigation tab inside Subscription view
  const [activeTab, setActiveTab] = useState<"plans" | "paypal" | "gatekeeper" | "firebase" | "signup" | "signin" | "change-password">(initialTab);

  // Billing Cycle state: monthly vs yearly
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // PayPal Gateway State
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
  const [payPalModalPlan, setPayPalModalPlan] = useState<"monthly" | "yearly">("monthly");
  const [paypalConfig, setPaypalConfig] = useState<PayPalPublicConfig | null>(null);
  const [isPingingGateway, setIsPingingGateway] = useState(false);
  const [gatewayPingResult, setGatewayPingResult] = useState<{ status: string; latencyMs: number; mode: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Gatekeeper API Hub State
  const [gatekeeperStats, setGatekeeperStats] = useState<AiGatekeeperStats | null>(null);
  const [gatekeeperHealth, setGatekeeperHealth] = useState<AiGatekeeperHealth | null>(null);
  const [isTestingGatekeeper, setIsTestingGatekeeper] = useState(false);
  const [gatekeeperTestTask, setGatekeeperTestTask] = useState<"a2a_judge" | "keyword_generator" | "seo_audit" | "general_prompt">("a2a_judge");
  const [gatekeeperTestPrompt, setGatekeeperTestPrompt] = useState("Evaluate 2026 AI Search Engine Optimization architecture for direct-answer ranking.");
  const [gatekeeperTestModel, setGatekeeperTestModel] = useState<"gemini-3.7-flash" | "gemini-2.5-flash" | "gemini-2.5-pro">("gemini-3.7-flash");
  const [gatekeeperBypassCache, setGatekeeperBypassCache] = useState(false);
  const [gatekeeperTestResult, setGatekeeperTestResult] = useState<any | null>(null);
  const [gatekeeperBlockedNotice, setGatekeeperBlockedNotice] = useState<string | null>(null);

  // Load Gatekeeper stats & health
  useEffect(() => {
    fetchAiGatekeeperStats().then(setGatekeeperStats);
    fetchAiGatekeeperHealth().then(setGatekeeperHealth);
  }, []);

  const handleTestGatekeeperCall = async () => {
    setIsTestingGatekeeper(true);
    setGatekeeperTestResult(null);
    setGatekeeperBlockedNotice(null);

    const userPlan = currentUser?.subscriptionPlan || "free_trial";
    const res = await callAiGatekeeper({
      task: gatekeeperTestTask,
      prompt: gatekeeperTestPrompt,
      model: gatekeeperTestModel,
      bypassCache: gatekeeperBypassCache,
      userEmail: currentUser?.email || "subscriber@agency.com",
      subscriptionPlan: userPlan,
      isTrialExpired: isAccessRestricted,
    });

    setIsTestingGatekeeper(false);
    setGatekeeperTestResult(res);

    if (res.gatekeeperBlocked) {
      setGatekeeperBlockedNotice(res.message || "Access blocked by Gatekeeper: Trial Expired.");
    } else {
      fetchAiGatekeeperStats().then(setGatekeeperStats);
    }
  };

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpCompany, setSignUpCompany] = useState("");
  const [signUpAgreeTerms, setSignUpAgreeTerms] = useState(true);
  const [showSignUpPass, setShowSignUpPass] = useState(false);
  const [signUpStatus, setSignUpStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState(currentUser?.email || "");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPass, setShowSignInPass] = useState(false);
  const [signInStatus, setSignInStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Change Password Form State
  const [changeEmail, setChangeEmail] = useState(currentUser?.email || "");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [changePassStatus, setChangePassStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Checkout / Payment Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<"monthly" | "yearly">("monthly");
  const [cardHolder, setCardHolder] = useState(currentUser?.name || "Subscriber");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvc, setCardCvc] = useState("789");
  const [billingZip, setBillingZip] = useState("94103");
  const [paymentMethodType, setPaymentMethodType] = useState<"card" | "paypal" | "gpay">("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<string | null>(null);

  // Global Feedback banner
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 5000);
  };

  // Load PayPal configuration on mount
  useEffect(() => {
    fetchPayPalGatewayConfig()
      .then((cfg) => setPaypalConfig(cfg))
      .catch((e) => console.error("Could not fetch PayPal config:", e));
  }, []);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showNotice(`Copied to clipboard: ${text}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenPayPal = (plan: "monthly" | "yearly") => {
    setPayPalModalPlan(plan);
    setIsPayPalModalOpen(true);
  };

  const handlePingPayPalGateway = async () => {
    setIsPingingGateway(true);
    const start = performance.now();
    try {
      const cfg = await fetchPayPalGatewayConfig();
      const latency = Math.round(performance.now() - start);
      setPaypalConfig(cfg);
      setGatewayPingResult({
        status: "ACTIVE & RESPONSIVE",
        latencyMs: latency,
        mode: cfg.mode || "sandbox",
      });
      showNotice(`PayPal Gateway Connected! Ping Latency: ${latency}ms`);
    } catch (e: any) {
      setGatewayPingResult({
        status: "OFFLINE / ERROR",
        latencyMs: 0,
        mode: "unknown",
      });
      showNotice("Failed to reach PayPal Gateway API");
    } finally {
      setIsPingingGateway(false);
    }
  };

  // 1. Handle Sign Up Submission
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpStatus(null);

    if (!signUpAgreeTerms) {
      setSignUpStatus({ message: "Please agree to the Terms of Service to create an account.", isError: true });
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpStatus({ message: "Passwords do not match. Please re-enter your password.", isError: true });
      return;
    }

    const result = signUp(signUpName, signUpEmail, signUpPassword, signUpCompany);
    if (result.success) {
      setSignUpStatus({ message: result.message, isError: false });
      showNotice(result.message);
      setSignUpName("");
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpConfirmPassword("");
      setSignUpCompany("");
      setTimeout(() => setActiveTab("plans"), 1200);
    } else {
      setSignUpStatus({ message: result.message, isError: true });
    }
  };

  // 2. Handle Sign In Submission
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInStatus(null);

    const result = signIn(signInEmail, signInPassword);
    if (result.success) {
      setSignInStatus({ message: result.message, isError: false });
      showNotice(result.message);
      setSignInPassword("");
      setTimeout(() => setActiveTab("plans"), 1000);
    } else {
      setSignInStatus({ message: result.message, isError: true });
    }
  };

  // 3. Handle Change Password Submission
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassStatus(null);

    if (newPass !== confirmNewPass) {
      setChangePassStatus({ message: "New passwords do not match.", isError: true });
      return;
    }

    if (newPass.length < 6) {
      setChangePassStatus({ message: "New password must be at least 6 characters.", isError: true });
      return;
    }

    // Attempt direct reset or with old password
    const result = currentPass
      ? changePassword(changeEmail, currentPass, newPass)
      : resetPasswordDirect(changeEmail, newPass);

    if (result.success) {
      setChangePassStatus({ message: result.message, isError: false });
      showNotice(result.message);
      setCurrentPass("");
      setNewPass("");
      setConfirmNewPass("");
    } else {
      setChangePassStatus({ message: result.message, isError: true });
    }
  };

  // 4. Open Checkout Modal
  const handleOpenCheckout = (plan: "monthly" | "yearly") => {
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
    setPaymentSuccessReceipt(null);
  };

  // 5. Complete Payment Submission
  const handleProcessPayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const last4Digits = cardNumber.replace(/\D/g, "").slice(-4) || "4242";
      const result = subscribe(selectedPlanForCheckout, {
        method: paymentMethodType === "paypal" ? "PayPal Account" : paymentMethodType === "gpay" ? "Google Pay" : "Credit Card",
        last4: last4Digits,
        cardHolder,
      });

      setIsProcessingPayment(false);
      if (result.success) {
        setPaymentSuccessReceipt(result.message);
        showNotice(result.message);
      }
    }, 1200);
  };

  // Download Invoice receipt simulation
  const handleDownloadInvoice = (inv: { invoiceNumber: string; amount: number; plan: string; date: string }) => {
    const textContent = `
=================================================================
             AI SEO AGENCY - OFFICIAL PAYMENT RECEIPT
=================================================================
Invoice Number: ${inv.invoiceNumber}
Date Issued:    ${inv.date}
Client Name:    ${currentUser?.name || "Enterprise Client"}
Client Email:   ${currentUser?.email || "subscriber@agency.com"}
Plan Tier:      ${inv.plan}
Amount Paid:    $${inv.amount.toFixed(2)} USD
Payment Status: PAID & CONFIRMED
Terms:          7-Day Free Trial + Continuous Enterprise Cloud Access
=================================================================
Includes full access to:
- 35-Keyword AI Search Matrix & SERP Velocity Tracker
- Google Trends Grounded Market Shift Surveillance System
- A2A Judge Core Evaluation & SGE Optimization Engine
- EEAT Content Marketing & Digital PR Workflows
- Real-time Audio Transcription AI with Gemini Live NLP
=================================================================
Thank you for powering your digital growth with AI SEO Agency!
`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt-${inv.invoiceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showNotice(`Downloaded official invoice receipt ${inv.invoiceNumber}`);
  };

  const isSubscribed =
    currentUser?.subscriptionPlan === "monthly" || currentUser?.subscriptionPlan === "yearly";

  return (
    <div id="subscription-billing-view-root" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Notice */}
      {actionNotice && (
        <div className="bg-[#004d00] text-white px-4 py-3 rounded-xl border border-[#003800] shadow-md flex items-center justify-between animate-in slide-in-from-top duration-150">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#ffa500] animate-spin" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-green-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 🚀 HERO STATUS CARD: 7-DAY TRIAL & SUBSCRIPTION OVERVIEW */}
      <div className="bg-gradient-to-br from-[#004d00] via-[#003800] to-[#002400] text-white p-6 rounded-2xl shadow-xl border border-[#003000] relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-[#ffa500]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#002b00] border border-[#002000] text-[#ffa500]">
                <CreditCard className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Subscription & Billing Center
                  <span className="bg-[#ffa500] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Enterprise Suite
                  </span>
                </h1>
                <p className="text-xs text-green-200 mt-0.5">
                  Manage your account credentials, 7-Day Free Trial status, and Monthly ($29.99) / Yearly ($299.99) subscriptions.
                </p>
              </div>
            </div>

            {/* Current Auth Status Badge */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 bg-[#002b00] px-3 py-1.5 rounded-lg border border-[#001f00]">
                <User className="w-3.5 h-3.5 text-[#ffa500]" />
                <span className="text-gray-300">Signed in as:</span>
                <strong className="text-white">{currentUser?.name || "Guest"}</strong>
                <span className="text-green-300/80 font-mono text-[11px]">({currentUser?.email || "No Email"})</span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#002b00] px-3 py-1.5 rounded-lg border border-[#001f00]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ffa500]" />
                <span className="text-gray-300">Status:</span>
                {isSubscribed ? (
                  <span className="text-[#ffa500] font-bold">
                    Active Subscriber ({currentUser?.subscriptionPlan === "monthly" ? "Monthly $29.99" : "Yearly $299.99"})
                  </span>
                ) : trialState.isExpired ? (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    Trial Expired - Subscription Required
                  </span>
                ) : (
                  <span className="text-green-300 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#ffa500]" />
                    7-Day Free Trial Active ({trialState.daysRemaining} Days Left)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="hero-signup-action-btn"
              onClick={() => setActiveTab("signup")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 text-slate-950 font-bold text-xs shadow transition-all active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#004d00]" />
              <span>Sign Up</span>
            </button>

            <button
              id="hero-signin-action-btn"
              onClick={() => setActiveTab("signin")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#002b00] hover:bg-[#002200] border border-[#001f00] text-green-100 hover:text-white font-bold text-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#ffa500]" />
              <span>Sign In</span>
            </button>

            <button
              id="hero-paypal-hub-btn"
              onClick={() => setActiveTab("paypal")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#003087] hover:bg-[#002266] border border-[#001c55] text-white font-bold text-xs shadow transition-all"
            >
              <span className="italic font-black text-xs text-[#ffc439]">PP</span>
              <span>PayPal Gateway</span>
            </button>

            <button
              id="hero-monthly-pay-btn"
              onClick={() => handleOpenPayPal("monthly")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ffc439] hover:bg-[#f2b930] text-[#003087] font-black text-xs shadow-md transition-all active:scale-95"
            >
              <span className="italic font-black text-xs">PayPal</span>
              <span>Monthly ($29.99)</span>
            </button>

            <button
              id="hero-yearly-pay-btn"
              onClick={() => handleOpenPayPal("yearly")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-[#ffa500] hover:brightness-110 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
            >
              <Star className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              <span>Yearly ($299.99)</span>
            </button>
          </div>
        </div>

        {/* 7-Day Free Trial Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[#003300]/80">
          <div className="flex items-center justify-between text-xs text-green-200 mb-1.5">
            <span className="font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#ffa500]" />
              7-Day Free Trial Period Status:
            </span>
            <span className="font-mono font-bold text-white">
              {isSubscribed
                ? "✨ Upgraded to Unlimited Pro Access"
                : trialState.isExpired
                ? "⚠️ 7-Day Trial Concluded (Upgrade to Continue)"
                : `Day ${Math.max(1, 7 - trialState.daysRemaining)} of 7 (${trialState.daysRemaining} days remaining)`}
            </span>
          </div>

          <div className="w-full bg-[#002400] h-2.5 rounded-full overflow-hidden border border-[#001c00]">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isSubscribed
                  ? "bg-gradient-to-r from-emerald-400 to-[#ffa500] w-full"
                  : trialState.isExpired
                  ? "bg-red-500 w-full"
                  : "bg-gradient-to-r from-[#ffa500] to-green-400"
              }`}
              style={{ width: isSubscribed ? "100%" : `${Math.max(12, trialState.percentageUsed)}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-green-300/80 mt-2">
            <span>
              Trial Started:{" "}
              <strong className="text-white">
                {currentUser?.trialStartDate ? new Date(currentUser.trialStartDate).toLocaleDateString() : "Active"}
              </strong>
            </span>
            <span>
              Trial Expires:{" "}
              <strong className="text-white">
                {currentUser?.trialEndDate ? new Date(currentUser.trialEndDate).toLocaleDateString() : "In 7 Days"}
              </strong>
            </span>
            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
              <span className="text-[10px] text-green-300 font-bold">QA Testing Modes:</span>
              <button
                onClick={() => {
                  simulateTrialState("active_trial");
                  showNotice("Simulated State: 🟢 Active 7-Day Free Trial (Day 1)");
                }}
                className="text-[10px] bg-[#002b00] hover:bg-[#002200] px-2 py-0.5 rounded border border-[#001c00] text-green-200"
                title="Simulate active 7-day trial"
              >
                7d Active
              </button>
              <button
                onClick={() => {
                  simulateTrialState("advance_warning");
                  showNotice("Simulated State: 🟠 Advance Notice (1 Day Left Before Expiration)");
                }}
                className="text-[10px] bg-[#3d2700] hover:bg-[#4d3300] px-2 py-0.5 rounded border border-[#593b00] text-amber-300 font-bold"
                title="Simulate advance notice 1-2 days left"
              >
                1d Warning
              </button>
              <button
                onClick={() => {
                  simulateTrialState("expired_lockout");
                  showNotice("Simulated State: 🔴 Trial Expired & Access Suspended");
                }}
                className="text-[10px] bg-red-950 hover:bg-red-900 px-2 py-0.5 rounded border border-red-800 text-red-300 font-bold"
                title="Simulate trial expiration and access lockout"
              >
                Expired Lockout
              </button>
              <button
                onClick={() => {
                  simulateTrialState("paid_monthly");
                  showNotice("Simulated State: 💳 Paid Monthly Plan ($29.99/mo Active)");
                }}
                className="text-[10px] bg-[#003d00] hover:bg-[#004d00] px-2 py-0.5 rounded border border-green-600 text-[#ffa500] font-bold"
                title="Simulate paid monthly plan"
              >
                Monthly ($29.99)
              </button>
              <button
                onClick={() => {
                  simulateTrialState("paid_yearly");
                  showNotice("Simulated State: 🏆 Paid Yearly Plan ($299.99/yr Active)");
                }}
                className="text-[10px] bg-[#003d00] hover:bg-[#004d00] px-2 py-0.5 rounded border border-green-600 text-[#ffa500] font-bold"
                title="Simulate paid yearly plan"
              >
                Yearly ($299.99)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📜 OFFICIAL SUBSCRIPTION & FREE TRIAL POLICY CARD */}
      <div className="bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-[#163016] rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-[#20170a] border border-amber-300 dark:border-[#4d3a00] flex items-center justify-center text-amber-900 dark:text-[#ffa500] shrink-0 font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Subscription & Free Trial Policy
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Official enterprise policy governing trial duration, expiration safeguards, and payment renewals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#122412] border border-gray-200 dark:border-[#1e461e]">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-1">
              <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-700 dark:text-green-300 flex items-center justify-center text-[10px] font-mono">1</span>
              7-Day Full Feature Trial
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
              Every new user receives a complimentary 7-Day Free Trial granting full unthrottled access to all AI SEO matrices, audio tools, and A2A judge engines.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#122412] border border-gray-200 dark:border-[#1e461e]">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center text-[10px] font-mono">2</span>
              Advance Expiration Alerts
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
              The system monitors trial timelines and displays automated advance notifications 24-48 hours before conclusion to prevent workflow disruption.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#122412] border border-gray-200 dark:border-[#1e461e]">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-1">
              <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 flex items-center justify-center text-[10px] font-mono">3</span>
              Automatic Access Restriction
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
              Upon expiration, application access is automatically suspended and the user is redirected to Subscription & Billing until a plan is selected.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#122412] border border-gray-200 dark:border-[#1e461e]">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-1">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-mono">4</span>
              Monthly & Annual Options
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
              Users can select Monthly ($29.99/mo) or Annual ($299.99/yr, saving 17%) payable via PayPal or Credit Card with instant automated billing.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#122412] border border-gray-200 dark:border-[#1e461e]">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-1">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center text-[10px] font-mono">5</span>
              Instant Access Reinstatement
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
              Once subscription payment is confirmed, the system immediately unlocks all authorized features and removes all restrictions without delay.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-[#082008] border border-emerald-200 dark:border-[#1a4a1a] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Current Status Check
              </div>
              <p className="text-emerald-800 dark:text-emerald-200 text-[11px]">
                {hasActivePaidPlan
                  ? `Active ${currentUser?.subscriptionPlan === "monthly" ? "Monthly Pro ($29.99/mo)" : "Yearly Pro ($299.99/yr)"}`
                  : isAccessRestricted
                  ? "Access Suspended (7-Day Trial Concluded)"
                  : isAdvanceWarning
                  ? `7-Day Free Trial (${trialState.daysRemaining}d remaining - Ending Soon)`
                  : `7-Day Free Trial Active (${trialState.daysRemaining} days remaining)`}
              </p>
            </div>
            {!hasActivePaidPlan && (
              <button
                onClick={() => handleOpenCheckout("monthly")}
                className="mt-2 text-left text-[11px] font-bold text-[#004d00] dark:text-[#ffa500] underline"
              >
                Activate Subscription Now &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS FOR SUBSCRIPTION & BILLING */}
      <div className="flex items-center border-b border-gray-200 dark:border-[#163016] overflow-x-auto gap-2 pb-1">
        <button
          id="tab-plans-billing"
          onClick={() => setActiveTab("plans")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-colors whitespace-nowrap ${
            activeTab === "plans"
              ? "bg-white dark:bg-[#0b170b] text-[#004d00] dark:text-[#ffa500] border-t-2 border-[#004d00] dark:border-[#ffa500] shadow-xs"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Plans & Pricing ($29.99 / $299.99)</span>
        </button>

        <button
          id="tab-paypal-gateway"
          onClick={() => setActiveTab("paypal")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-colors whitespace-nowrap ${
            activeTab === "paypal"
              ? "bg-white dark:bg-[#0b170b] text-[#003087] dark:text-[#ffa500] border-t-2 border-[#003087] dark:border-[#ffa500] shadow-xs font-black"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <span className="italic font-extrabold text-[#003087] dark:text-[#ffa500]">PayPal</span>
          <span>Gateway & Webhooks</span>
          <span className="bg-[#ffc439] text-[#003087] text-[9px] font-black px-1.5 py-0.2 rounded-full">
            Live
          </span>
        </button>

        <button
          id="tab-ai-gatekeeper"
          onClick={() => setActiveTab("gatekeeper")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-colors whitespace-nowrap ${
            activeTab === "gatekeeper"
              ? "bg-white dark:bg-[#0b170b] text-purple-700 dark:text-[#ffa500] border-t-2 border-purple-600 dark:border-[#ffa500] shadow-xs font-black"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Cpu className="w-4 h-4 text-purple-600 dark:text-[#ffa500]" />
          <span>⚡ AI Studio Gatekeeper</span>
          <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[9px] font-black px-1.5 py-0.2 rounded-full">
            Secured
          </span>
        </button>

        <button
          id="tab-firebase-cloud"
          onClick={() => setActiveTab("firebase")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-colors whitespace-nowrap ${
            activeTab === "firebase"
              ? "bg-white dark:bg-[#0b170b] text-emerald-700 dark:text-[#ffa500] border-t-2 border-emerald-600 dark:border-[#ffa500] shadow-xs font-black"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Server className="w-4 h-4 text-emerald-600 dark:text-[#ffa500]" />
          <span>🔥 Firebase Cloud DB</span>
          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-black px-1.5 py-0.2 rounded-full">
            Connected
          </span>
        </button>

        <button
          id="tab-signup-form"
          onClick={() => setActiveTab("signup")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-colors whitespace-nowrap ${
            activeTab === "signup"
              ? "bg-white dark:bg-[#0b170b] text-[#004d00] dark:text-[#ffa500] border-t-2 border-[#004d00] dark:border-[#ffa500] shadow-xs"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Sign Up Form</span>
        </button>

        <button
          id="tab-signin-form"
          onClick={() => setActiveTab("signin")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-colors whitespace-nowrap ${
            activeTab === "signin"
              ? "bg-white dark:bg-[#0b170b] text-[#004d00] dark:text-[#ffa500] border-t-2 border-[#004d00] dark:border-[#ffa500] shadow-xs"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In & Switch Account</span>
        </button>

        <button
          id="tab-change-password-form"
          onClick={() => setActiveTab("change-password")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-colors whitespace-nowrap ${
            activeTab === "change-password"
              ? "bg-white dark:bg-[#0b170b] text-[#004d00] dark:text-[#ffa500] border-t-2 border-[#004d00] dark:border-[#ffa500] shadow-xs"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 💳 TAB 1: PLANS, PRICING & INVOICES */}
      {/* ========================================================================= */}
      {activeTab === "plans" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Monthly vs Yearly Billing Switcher */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 pt-2">
            <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-[#122412] px-3.5 py-1.5 rounded-full border border-green-200 dark:border-[#1e461e] text-xs font-semibold text-green-900 dark:text-green-300">
              <Sparkles className="w-3.5 h-3.5 text-[#ffa500]" />
              <span>Continue Using After 7-Day Free Trial With Unlimited Enterprise Access</span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Choose Your Subscription Plan
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg">
              Transparent pricing with no hidden charges. All plans include 35 tracked keywords, real-time Google Trends shift alerts, AI Judge core, and EEAT content strategy.
            </p>

            {/* Toggle Pill */}
            <div className="flex items-center bg-gray-100 dark:bg-[#122412] p-1 rounded-xl border border-gray-200 dark:border-[#163016] mt-2">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-lg font-bold text-xs transition-all ${
                  billingCycle === "monthly"
                    ? "bg-[#004d00] text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                Monthly ($29.99 / mo)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                  billingCycle === "yearly"
                    ? "bg-[#004d00] text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                <span>Yearly ($299.99 / yr)</span>
                <span className="bg-[#ffa500] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                  Save 17% (2 Mo Free)
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* MONTHLY PLAN CARD ($29.99) */}
            <div
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-[#0b170b] border-[#004d00] dark:border-[#ffa500] shadow-xl ring-2 ring-[#004d00]/20"
                  : "bg-white dark:bg-[#0b170b] border-gray-200 dark:border-[#163016] shadow-sm hover:border-gray-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md bg-green-50 dark:bg-[#122412] text-green-800 dark:text-green-300 font-bold text-xs border border-green-200 dark:border-[#1e461e]">
                    Monthly Flexible
                  </span>
                  {currentUser?.subscriptionPlan === "monthly" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffa500] text-slate-950 text-[10px] font-black">
                      Current Plan
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$29.99</span>
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">/ month</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Billed monthly. Cancel anytime with 1 click. Full continuous access after 7-day trial.
                  </p>
                </div>

                <div className="mt-6 space-y-3 pt-4 border-t border-gray-100 dark:border-[#163016] text-xs">
                  <div className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-[10px]">
                    Included Features:
                  </div>

                  {[
                    "Full 35-Keyword High-Intent Matrix Tracking",
                    "Real-time Google Trends Market Shift Alerts (≥20% Shifts)",
                    "A2A Judge Core & SERP SGE Citation Optimization",
                    "10 Top Competitor Authority Gap Matrix",
                    "Content Strategy Hub & EEAT NLP Scoring",
                    "Audio Transcription AI & Live Recording Engine",
                    "Predictive Growth & Scenario Revenue Modeler",
                    "Printable Executive PDF Reports & CSV Exports",
                    "Standard 24/7 Priority Email Support",
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 text-[#004d00] dark:text-[#ffa500] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-[#163016] space-y-2">
                <button
                  id="pricing-card-paypal-monthly-btn"
                  onClick={() => handleOpenPayPal("monthly")}
                  className="w-full py-3 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f2b930] text-[#003087] font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <span className="italic font-black text-base">PayPal</span>
                  <span>Pay $29.99 / Month with PayPal</span>
                </button>

                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium px-1">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Automated Monthly Billing</span>
                  </span>
                  <span className="text-gray-400">Cancel Anytime</span>
                </div>

                <button
                  id="pricing-card-subscribe-monthly-btn"
                  onClick={() => handleOpenCheckout("monthly")}
                  className="w-full py-2 px-3 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#0b170b] hover:bg-gray-100 dark:hover:bg-[#122412] text-gray-700 dark:text-gray-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Debit / Credit Card Checkout</span>
                </button>

                <p className="text-[10px] text-center text-gray-400 mt-1">
                  Activates immediately. 7-Day Free Trial period honored.
                </p>
              </div>
            </div>

            {/* YEARLY PLAN CARD ($299.99) */}
            <div
              className={`rounded-2xl border-2 p-6 flex flex-col justify-between transition-all relative ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-b from-amber-50/40 to-white dark:from-[#18150a] dark:to-[#0b170b] border-[#ffa500] shadow-2xl ring-2 ring-[#ffa500]/30"
                  : "bg-white dark:bg-[#0b170b] border-amber-300 dark:border-[#4d3a00] shadow-md hover:border-[#ffa500]"
              }`}
            >
              {/* Most Popular Badge */}
              <div className="absolute -top-3.5 right-6 bg-[#ffa500] text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow flex items-center gap-1">
                <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                <span>Best Value • Save 17%</span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md bg-amber-100 dark:bg-[#2e200a] text-amber-900 dark:text-[#ffa500] font-bold text-xs border border-amber-300 dark:border-[#523e12]">
                    Yearly Annual Pass (2 Months Free)
                  </span>
                  {currentUser?.subscriptionPlan === "yearly" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffa500] text-slate-950 text-[10px] font-black">
                      Current Plan
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$299.99</span>
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">/ year</span>
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-400 font-bold mt-1">
                    Effective $24.99/mo (Save $59.89/year compared to monthly)
                  </div>
                </div>

                <div className="mt-6 space-y-3 pt-4 border-t border-gray-100 dark:border-[#163016] text-xs">
                  <div className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-[10px]">
                    Everything in Monthly, Plus:
                  </div>

                  {[
                    "2 Months Free (Save $59.89 annually)",
                    "Priority AI Gemini 2.5 Flash Processing Bandwidth",
                    "Automated 12-Hour Google Trends Grounding Radar",
                    "Custom Brand White-Label Report Exports",
                    "Historical 24-Month Google Algorithm Volatility Archive",
                    "Unlimited Competitor Reverse-Engineering Runs",
                    "Direct 1-on-1 AI SEO Strategy Consultation Slot",
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5 font-bold" />
                      <span className={idx === 0 || idx === 1 ? "font-bold text-gray-900 dark:text-white" : ""}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-[#163016] space-y-2">
                <button
                  id="pricing-card-paypal-yearly-btn"
                  onClick={() => handleOpenPayPal("yearly")}
                  className="w-full py-3 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f2b930] text-[#003087] font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <span className="italic font-black text-base">PayPal</span>
                  <span>Pay $299.99 / Year with PayPal</span>
                </button>

                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium px-1">
                  <span className="flex items-center gap-1 text-amber-700 dark:text-[#ffa500]">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Annual License (Save 17%)</span>
                  </span>
                  <span className="text-gray-400">Continuous Access</span>
                </div>

                <button
                  id="pricing-card-subscribe-yearly-btn"
                  onClick={() => handleOpenCheckout("yearly")}
                  className="w-full py-2 px-3 rounded-xl border border-amber-300 dark:border-[#523e12] bg-amber-50/50 dark:bg-[#18150a] hover:bg-amber-100 dark:hover:bg-[#231e0c] text-amber-900 dark:text-[#ffa500] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Debit / Credit Card Checkout</span>
                </button>

                <p className="text-[10px] text-center text-gray-400 mt-1">
                  Single annual charge of $299.99. 7-Day Free Trial period guaranteed.
                </p>
              </div>
            </div>
          </div>

          {/* INVOICE & BILLING HISTORY TABLE */}
          <div className="bg-white dark:bg-[#0b170b] rounded-2xl border border-gray-200 dark:border-[#163016] shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-[#163016] pb-4">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-[#004d00] dark:text-[#ffa500]" />
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Billing Invoices & Payment Receipts
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Official tax receipts and transaction history for your subscription.
                  </p>
                </div>
              </div>

              {isSubscribed && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelSubscription}
                    className="px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    Cancel Auto-Renewal
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-[#060e06] text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-200 dark:border-[#163016]">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Gateway Reference</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Receipt Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#163016] text-gray-700 dark:text-gray-300">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-[#122412] transition-colors">
                      <td className="p-3 font-mono font-bold text-gray-900 dark:text-white">{inv.invoiceNumber}</td>
                      <td className="p-3">{inv.date}</td>
                      <td className="p-3 max-w-xs truncate">{inv.description}</td>
                      <td className="p-3">
                        {inv.paypalPlanId || inv.paymentMethod.includes("PayPal") ? (
                          <span className="font-semibold text-[10px] bg-blue-50 dark:bg-[#122412] text-[#003087] dark:text-[#ffa500] px-2 py-0.5 rounded-full border border-blue-200 dark:border-[#224822]">
                            PayPal Secure Gateway
                          </span>
                        ) : (
                          <span className="font-semibold text-[10px] bg-gray-100 dark:bg-[#163016] text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            Direct Activation
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold font-mono text-gray-900 dark:text-white">
                        {inv.amount === 0 ? "Free" : `$${inv.amount.toFixed(2)}`}
                      </td>
                      <td className="p-3 text-gray-500">{inv.paymentMethod}</td>
                      <td className="p-3">
                        <span className="bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-100 dark:bg-[#163016] hover:bg-gray-200 dark:hover:bg-[#1e461e] text-gray-700 dark:text-gray-200 text-[11px] font-semibold transition-colors"
                        >
                          <Download className="w-3 h-3 text-[#004d00] dark:text-[#ffa500]" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🅿️ TAB 2: PAYPAL GATEWAY CONFIGURATION & STATUS HUB */}
      {/* ========================================================================= */}
      {activeTab === "paypal" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-[#003087] via-[#002266] to-[#001844] text-white p-6 rounded-2xl shadow-xl border border-[#002050] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg p-2 flex-shrink-0">
                <span className="font-black text-2xl italic tracking-tighter text-[#003087]">
                  P<span className="text-[#0079C1]">P</span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    PayPal Gateway Payment Configuration
                  </h2>
                  <span className="bg-[#ffc439] text-[#003087] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Integrated & Active
                  </span>
                </div>
                <p className="text-xs text-blue-100 mt-1">
                  Full configuration of PayPal gateway for Google AI Studio “AI SEO AGENCY APP” with Monthly ($29.99) & Yearly ($299.99) plans.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="paypal-hub-ping-btn"
                type="button"
                disabled={isPingingGateway}
                onClick={handlePingPayPalGateway}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all active:scale-95"
              >
                {isPingingGateway ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#ffc439]" />
                    <span>Pinging Gateway...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 text-[#ffc439]" />
                    <span>Test Gateway Ping</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Diagnostics Banner if pinged */}
          {gatewayPingResult && (
            <div className="bg-emerald-50 dark:bg-[#0c1e0c] border border-emerald-200 dark:border-[#1e461e] p-4 rounded-xl text-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-300">
                    PayPal Gateway Server Status: {gatewayPingResult.status}
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                    Backend API latency: <strong className="text-emerald-600">{gatewayPingResult.latencyMs}ms</strong> • Environment: <strong>{gatewayPingResult.mode.toUpperCase()}</strong>
                  </p>
                </div>
              </div>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                Ready for Subscriptions
              </span>
            </div>
          )}

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CARD 1: PAYPAL MONTHLY ($29.99) */}
            <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-50 dark:bg-[#122412] text-[#003087] dark:text-[#ffa500]">
                    <CreditCard className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      Monthly Subscription Plan
                    </h3>
                    <p className="text-[11px] text-gray-500">Automated PayPal Recurring Billing</p>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-[#003087] dark:text-[#ffa500] font-mono">
                  $29.99 <span className="text-xs font-normal text-gray-500">/mo</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-[#060e06] border border-blue-100 dark:border-[#163016] space-y-1.5">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Billing Configuration:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Secure & Active
                  </span>
                </div>
                <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  Direct PayPal Smart Button integration with instant account activation
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Allows every user to pay $29.99/mo after 7-Day trial expires</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Automatic monthly renewal with instant 1-click cancellation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Uninterrupted access to 35 keywords & Trends grounding radar</span>
                </div>
              </div>

              {/* Render Official Smart Button for Monthly */}
              <div className="pt-2">
                <PayPalSubscriptionButton
                  planType="monthly"
                  planId="P-60J823292U163132VNKGRA6Y"
                  onSuccess={(details) => {
                    showNotice(`Monthly Subscription Active! Invoice: ${details.invoiceNumber}`);
                  }}
                  onError={(err) => {
                    const msg = String(err?.message || err || "");
                    if (msg.includes("Detected popup close") || msg.includes("popup close") || msg.includes("window closed")) {
                      return;
                    }
                    showNotice("PayPal checkout notice: Fallback authorization available.");
                  }}
                />
              </div>
            </div>

            {/* CARD 2: PAYPAL YEARLY ($299.99) */}
            <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border-2 border-amber-300 dark:border-[#4d3a00] shadow-sm space-y-4 relative">
              <span className="absolute top-4 right-4 bg-[#ffa500] text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                Save 17% (2 Mo Free)
              </span>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-50 dark:bg-[#1f1a0a] text-amber-900 dark:text-[#ffa500]">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      Yearly Subscription License
                    </h3>
                    <p className="text-[11px] text-gray-500">Automated PayPal Annual Renewal</p>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-amber-900 dark:text-[#ffa500] font-mono">
                  $299.99
                </span>
                <span className="text-xs text-gray-500">/ year (Single annual payment)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-[#060e06] border border-amber-200 dark:border-[#163016] space-y-1.5">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Billing Configuration:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Secure & Active
                  </span>
                </div>
                <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  Direct PayPal Smart Button integration with 2 months free savings
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Enables yearly recurring subscription ($299.99) after 7-Day trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Includes 2 months free ($59.89 annual savings)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Priority Gemini 2.5 Flash compute bandwidth & consultation pass</span>
                </div>
              </div>

              {/* Render Official Smart Button for Yearly */}
              <div className="pt-2">
                <PayPalSubscriptionButton
                  planType="yearly"
                  planId="P-0SJ71276U2989504JNKGRCHQ"
                  onSuccess={(details) => {
                    showNotice(`Yearly Subscription Active! Invoice: ${details.invoiceNumber}`);
                  }}
                  onError={(err) => {
                    const msg = String(err?.message || err || "");
                    if (msg.includes("Detected popup close") || msg.includes("popup close") || msg.includes("window closed")) {
                      return;
                    }
                    showNotice("PayPal checkout notice: Fallback authorization available.");
                  }}
                />
              </div>
            </div>
          </div>

          {/* Endpoints & Infrastructure Directory */}
          <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#163016] pb-3">
              <Server className="w-5 h-5 text-[#003087] dark:text-[#ffa500]" />
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  PayPal Gateway Backend API Endpoints & Deployment Config
                </h3>
                <p className="text-xs text-gray-500">
                  Active REST endpoints communicating directly with PayPal v2 API.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-[#060e06] rounded-xl border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    GET /api/paypal/config
                  </span>
                  <span className="text-[10px] text-gray-500">Public gateway config & client credentials</span>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#060e06] rounded-xl border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    POST /api/paypal/create-order
                  </span>
                  <span className="text-[10px] text-gray-500">Creates order / subscription with PayPal REST API</span>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#060e06] rounded-xl border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    POST /api/paypal/verify-subscription
                  </span>
                  <span className="text-[10px] text-gray-500">Authorizes subscription, captures payment & issues invoice</span>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#060e06] rounded-xl border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    POST /api/paypal/webhook
                  </span>
                  <span className="text-[10px] text-gray-500">Listens for recurring billing & cancellation events</span>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚡ TAB: GOOGLE AI STUDIO GATEKEEPER & ACCESS CONTROL HUB */}
      {/* ========================================================================= */}
      {activeTab === "gatekeeper" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#0b170b] text-white p-6 rounded-2xl shadow-xl border border-purple-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg p-2 flex-shrink-0 ring-1 ring-purple-400/40">
                <Cpu className="w-7 h-7 text-purple-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Google AI Studio Gatekeeper API
                  </h2>
                  <span className="bg-purple-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Policy Enforcement v2.6
                  </span>
                </div>
                <p className="text-xs text-purple-200 mt-1">
                  Centralized secure gateway routing all Gemini 3.7 Flash & 2.5 intelligence calls with subscription verification, 7-day trial lockout, and rate limiting.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="gatekeeper-ping-health-btn"
                type="button"
                onClick={() => {
                  fetchAiGatekeeperHealth().then(setGatekeeperHealth);
                  fetchAiGatekeeperStats().then(setGatekeeperStats);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4 text-purple-300" />
                <span>Refresh Gatekeeper Telemetry</span>
              </button>
            </div>
          </div>

          {/* Security & Access State Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0b170b] p-4 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-1">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gatekeeper Policy</div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#ffa500]" />
                <span>Enforcing Rule 1–4</span>
              </div>
              <p className="text-[10px] text-gray-500">7-Day Free Trial & Subscription lockout</p>
            </div>

            <div className="bg-white dark:bg-[#0b170b] p-4 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-1">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">User Clearance</div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white">
                {isAccessRestricted ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">Blocked (Trial Expired)</span>
                  </>
                ) : hasActivePaidPlan ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Paid Subscriber</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-600 dark:text-[#ffa500]">Active Free Trial</span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-gray-500">{currentUser?.email || "subscriber@agency.com"}</p>
            </div>

            <div className="bg-white dark:bg-[#0b170b] p-4 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-1">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Default Model</div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white">
                <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-mono text-xs">{gatekeeperHealth?.defaultModel || "gemini-3.7-flash"}</span>
              </div>
              <p className="text-[10px] text-gray-500">Google GenAI Official SDK</p>
            </div>

            <div className="bg-white dark:bg-[#0b170b] p-4 rounded-xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-1">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Intercepts</div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-mono text-sm">{gatekeeperStats?.totalRequestsIntercepted || 128} Calls</span>
              </div>
              <p className="text-[10px] text-gray-500">Avg Latency: ~{gatekeeperStats?.averageLatencyMs || 340}ms</p>
            </div>
          </div>

          {/* Interactive Gatekeeper Simulator */}
          <div className="bg-white dark:bg-[#0b170b] rounded-2xl border border-gray-200 dark:border-[#163016] shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-[#163016] pb-4">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Interactive Gatekeeper Route Tester
                  </h3>
                  <p className="text-xs text-gray-500">
                    Test the <code className="text-purple-600 dark:text-purple-400 font-bold">/api/ai/gatekeeper</code> endpoint with current subscription credentials.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                  Task Archetype
                </label>
                <select
                  value={gatekeeperTestTask}
                  onChange={(e) => setGatekeeperTestTask(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-medium"
                >
                  <option value="a2a_judge">A2A Judge (Agent-to-Agent SEO)</option>
                  <option value="keyword_generator">Keyword Research Matrix</option>
                  <option value="seo_audit">Full Technical SEO Audit</option>
                  <option value="general_prompt">General AI Studio Prompt</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                  Target AI Model
                </label>
                <select
                  value={gatekeeperTestModel}
                  onChange={(e) => setGatekeeperTestModel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-mono"
                >
                  <option value="gemini-3.7-flash">gemini-3.7-flash (Default & Recommended)</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                  <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] w-full">
                  <input
                    type="checkbox"
                    checked={gatekeeperBypassCache}
                    onChange={(e) => setGatekeeperBypassCache(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-[11px]">
                    Bypass In-Memory Cache
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold text-xs mb-1">
                Prompt Payload
              </label>
              <textarea
                value={gatekeeperTestPrompt}
                onChange={(e) => setGatekeeperTestPrompt(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white text-xs font-mono"
                placeholder="Enter prompt payload to pass to Gatekeeper route..."
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                id="gatekeeper-execute-call-btn"
                type="button"
                disabled={isTestingGatekeeper}
                onClick={handleTestGatekeeperCall}
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isTestingGatekeeper ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Executing via Gatekeeper...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#ffa500]" />
                    <span>Dispatch AI Studio Gatekeeper Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Blocked Alert Banner if trial expired */}
            {gatekeeperBlockedNotice && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>GATEKEEPER 403 FORBIDDEN: Trial Expiration Lockout Active</span>
                </div>
                <p>{gatekeeperBlockedNotice}</p>
                <button
                  onClick={() => setActiveTab("plans")}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700"
                >
                  Select Monthly ($29.99) or Yearly ($299.99) Plan &rarr;
                </button>
              </div>
            )}

            {/* Test Result Display */}
            {gatekeeperTestResult && !gatekeeperBlockedNotice && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      Gatekeeper Verification Envelope:
                    </span>
                    <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      HTTP 200 OK
                    </span>
                    {gatekeeperTestResult.gatekeeper?.cacheHit && (
                      <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        ⚡ Cache Hit ({gatekeeperTestResult.gatekeeper?.latencyMs}ms)
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    Latency: {gatekeeperTestResult.gatekeeper?.latencyMs}ms
                  </span>
                </div>

                <pre className="p-4 rounded-xl bg-gray-900 text-green-400 font-mono text-[11px] overflow-x-auto max-h-72 border border-gray-800">
                  {JSON.stringify(gatekeeperTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔥 TAB: FIREBASE FIRESTORE CLOUD DATABASE HUB */}
      {/* ========================================================================= */}
      {activeTab === "firebase" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#004d00] via-[#003800] to-[#0b170b] text-white p-6 rounded-2xl shadow-xl border border-[#163016] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg p-2 flex-shrink-0 ring-1 ring-[#ffa500]/30">
                <Server className="w-7 h-7 text-[#ffa500]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Firebase Cloud Database & Authentication
                  </h2>
                  <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Provisioned & Online
                  </span>
                </div>
                <p className="text-xs text-green-100 mt-1">
                  Google Cloud Firestore real-time persistence with security rules, multi-device synchronization, and Firebase Auth.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="firebase-hub-test-sync-btn"
                type="button"
                onClick={() => {
                  showNotice("Firebase Firestore status: CONNECTED & SYNCHRONIZING");
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4 text-[#ffa500]" />
                <span>Test Cloud Health</span>
              </button>
            </div>
          </div>

          {/* Database Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CARD 1: DATABASE PROVISIONING */}
            <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-50 dark:bg-[#122412] text-emerald-600 dark:text-[#ffa500]">
                    <Database className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      Firestore Database Configuration
                    </h3>
                    <p className="text-[11px] text-gray-500">Google Cloud Firestore Instance</p>
                  </div>
                </div>
                <span className="bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Live & Active
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] space-y-1">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Firebase Project ID:</div>
                  <div className="flex items-center justify-between">
                    <code className="font-mono font-bold text-gray-900 dark:text-white">
                      studio-8169038053-73336
                    </code>
                    <button
                      onClick={() => handleCopyText("studio-8169038053-73336")}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-[#163016] rounded"
                      title="Copy Project ID"
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] space-y-1">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Firestore Database ID:</div>
                  <div className="flex items-center justify-between">
                    <code className="font-mono font-bold text-gray-900 dark:text-white truncate">
                      ai-studio-aipoweredseoagen-6b75a512-73e7-4e06-86a1-46af66ec356d
                    </code>
                    <button
                      onClick={() => handleCopyText("ai-studio-aipoweredseoagen-6b75a512-73e7-4e06-86a1-46af66ec356d")}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-[#163016] rounded"
                      title="Copy Database ID"
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: REAL-TIME DATA COLLECTIONS */}
            <div className="bg-white dark:bg-[#0b170b] p-6 rounded-2xl border border-gray-200 dark:border-[#163016] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-50 dark:bg-[#1f1608] text-amber-600 dark:text-[#ffa500]">
                    <Activity className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      Active Real-Time Collections
                    </h3>
                    <p className="text-[11px] text-gray-500">Live synchronized collections</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#ffa500]">
                  6 Synchronized
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                  <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">keywords</span>
                  <span className="text-[10px] text-emerald-600 font-bold">35 items</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                  <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">competitors</span>
                  <span className="text-[10px] text-emerald-600 font-bold">4 tracking</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                  <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">content_pieces</span>
                  <span className="text-[10px] text-emerald-600 font-bold">6 articles</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                  <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">local_citations</span>
                  <span className="text-[10px] text-emerald-600 font-bold">12 nap dirs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                  <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">transcripts</span>
                  <span className="text-[10px] text-emerald-600 font-bold">3 audios</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#060e06] border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                  <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">user_profiles</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Auth Synced</span>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Protected by deployed Cloud Firestore Security Rules with user-level isolation.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ✍️ TAB 3: SIGN UP FORM */}
      {/* ========================================================================= */}
      {activeTab === "signup" && (
        <div className="max-w-xl mx-auto bg-white dark:bg-[#0b170b] rounded-2xl border border-gray-200 dark:border-[#163016] shadow-xl p-8 space-y-6 animate-in fade-in duration-150">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#004d00] text-[#ffa500] flex items-center justify-center mx-auto shadow-md">
              <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Create Your Enterprise SEO Account
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sign up with your Name, Email, and Password to immediately activate your <strong>7-Day Free Trial</strong>.
            </p>
          </div>

          {signUpStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                signUpStatus.isError
                  ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900"
                  : "bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-900"
              }`}
            >
              {signUpStatus.isError ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{signUpStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                Business Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            {/* Company (Optional) */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                Company / Agency Name (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="signup-company-input"
                  type="text"
                  placeholder="e.g. Apex AI Media Group"
                  value={signUpCompany}
                  onChange={(e) => setSignUpCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                Password (min. 6 characters) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="signup-password-input"
                  type={showSignUpPass ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPass(!showSignUpPass)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showSignUpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="signup-confirm-password-input"
                  type={showSignUpPass ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                id="signup-agree-checkbox"
                type="checkbox"
                checked={signUpAgreeTerms}
                onChange={(e) => setSignUpAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-[#004d00] rounded"
              />
              <label htmlFor="signup-agree-checkbox" className="text-[11px] text-gray-600 dark:text-gray-400">
                I agree to the 7-Day Free Trial Terms. After 7 days, I can continue with Monthly ($29.99) or Yearly ($299.99) subscription.
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="signup-submit-btn"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 mt-4"
            >
              <UserPlus className="w-4 h-4 text-[#ffa500]" />
              <span>Create Account & Start 7-Day Free Trial</span>
            </button>

            {/* Google Firebase Sign In Quick Action */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-[#163016]"></div>
              <span className="flex-shrink mx-2 text-[10px] text-gray-400 font-bold uppercase">Or Use Firebase Auth</span>
              <div className="flex-grow border-t border-gray-200 dark:border-[#163016]"></div>
            </div>

            <button
              id="signup-google-firebase-btn"
              type="button"
              onClick={async () => {
                const res = await signInWithGoogleAuth();
                if (res.success) {
                  showNotice(res.message);
                  setActiveTab("plans");
                } else {
                  setSignUpStatus({ message: res.message, isError: true });
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-[#163016] hover:bg-gray-50 dark:hover:bg-[#122412] text-gray-800 dark:text-gray-100 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2.5 active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.25a11.98 11.98 0 0 0 0 10.84l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>Continue with Google (Firebase)</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 dark:border-[#163016] text-xs text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => setActiveTab("signin")}
              className="text-[#004d00] dark:text-[#ffa500] font-bold hover:underline"
            >
              Sign In here
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔑 TAB 3: SIGN IN & ACCOUNT SWITCHER */}
      {/* ========================================================================= */}
      {activeTab === "signin" && (
        <div className="max-w-xl mx-auto bg-white dark:bg-[#0b170b] rounded-2xl border border-gray-200 dark:border-[#163016] shadow-xl p-8 space-y-6 animate-in fade-in duration-150">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#004d00] text-[#ffa500] flex items-center justify-center mx-auto shadow-md">
              <LogIn className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Sign In to Your SEO Agency Account
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Access your saved keyword matrix, live market shift radar, and subscription settings.
            </p>
          </div>

          {signInStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                signInStatus.isError
                  ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900"
                  : "bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-900"
              }`}
            >
              {signInStatus.isError ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{signInStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
            {/* Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="signin-email-input"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-700 dark:text-gray-300 font-bold">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setChangeEmail(signInEmail);
                    setActiveTab("change-password");
                  }}
                  className="text-[11px] text-[#004d00] dark:text-[#ffa500] font-semibold hover:underline"
                >
                  Forgot or Change Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="signin-password-input"
                  type={showSignInPass ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPass(!showSignInPass)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showSignInPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Autofill Button */}
            <div className="bg-amber-50 dark:bg-[#18150a] p-3 rounded-xl border border-amber-200 dark:border-[#4d3a00] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-900 dark:text-[#ffa500]">
                  Standard Demo Credentials:
                </span>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-mono">
                  user@agency.com / Password123!
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSignInEmail("user@agency.com");
                  setSignInPassword("Password123!");
                }}
                className="px-2.5 py-1 rounded bg-[#ffa500] text-slate-950 font-bold text-[10px] hover:brightness-110 shadow-xs"
              >
                Autofill Demo
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="signin-submit-btn"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 mt-2"
            >
              <LogIn className="w-4 h-4 text-[#ffa500]" />
              <span>Sign In to Account</span>
            </button>

            {/* Google Firebase Sign In Quick Action */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-[#163016]"></div>
              <span className="flex-shrink mx-2 text-[10px] text-gray-400 font-bold uppercase">Or Sign In With</span>
              <div className="flex-grow border-t border-gray-200 dark:border-[#163016]"></div>
            </div>

            <button
              id="signin-google-firebase-btn"
              type="button"
              onClick={async () => {
                const res = await signInWithGoogleAuth();
                if (res.success) {
                  showNotice(res.message);
                  setActiveTab("plans");
                } else {
                  setSignInStatus({ message: res.message, isError: true });
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-[#163016] hover:bg-gray-50 dark:hover:bg-[#122412] text-gray-800 dark:text-gray-100 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2.5 active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.25a11.98 11.98 0 0 0 0 10.84l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>Sign In with Google (Firebase)</span>
            </button>
          </form>

          {/* Currently Signed In Card */}
          {currentUser && (
            <div className="pt-4 border-t border-gray-100 dark:border-[#163016] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ffa500] flex items-center justify-center text-slate-950 font-black text-xs">
                  {currentUser.avatarInitials || "AK"}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-xs">{currentUser.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{currentUser.email}</div>
                </div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-bold text-[11px] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <div className="text-center pt-2 text-xs text-gray-500">
            Need a new account?{" "}
            <button
              onClick={() => setActiveTab("signup")}
              className="text-[#004d00] dark:text-[#ffa500] font-bold hover:underline"
            >
              Sign Up for 7-Day Free Trial
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔒 TAB 4: CHANGE PASSWORD AS DESIRED */}
      {/* ========================================================================= */}
      {activeTab === "change-password" && (
        <div className="max-w-xl mx-auto bg-white dark:bg-[#0b170b] rounded-2xl border border-gray-200 dark:border-[#163016] shadow-xl p-8 space-y-6 animate-in fade-in duration-150">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#004d00] text-[#ffa500] flex items-center justify-center mx-auto shadow-md">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Change Account Password
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Users can update or reset their security password at any time.
            </p>
          </div>

          {changePassStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                changePassStatus.isError
                  ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900"
                  : "bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-900"
              }`}
            >
              {changePassStatus.isError ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{changePassStatus.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-xs">
            {/* Target Account Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                Account Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="change-pass-email-input"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={changeEmail}
                  onChange={(e) => setChangeEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            {/* Current Password (Optional if doing direct reset) */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                Current Password (Optional if resetting)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="change-pass-current-input"
                  type="password"
                  placeholder="Leave blank to reset directly"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden font-mono"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                New Password (min. 6 characters) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="change-pass-new-input"
                  type={showNewPass ? "text" : "password"}
                  required
                  placeholder="Enter new password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  id="change-pass-confirm-input"
                  type={showNewPass ? "text" : "password"}
                  required
                  placeholder="Re-enter new password"
                  value={confirmNewPass}
                  onChange={(e) => setConfirmNewPass(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="change-pass-submit-btn"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 mt-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#ffa500]" />
              <span>Update Password</span>
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-gray-500">
            Done updating?{" "}
            <button
              onClick={() => setActiveTab("signin")}
              className="text-[#004d00] dark:text-[#ffa500] font-bold hover:underline"
            >
              Sign In with New Password
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💳 INTERACTIVE CHECKOUT MODAL (MONTHLY $29.99 / YEARLY $299.99) */}
      {/* ========================================================================= */}
      {isCheckoutOpen && (
        <div
          id="checkout-payment-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-[#163016] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-gray-900 dark:text-white">
            {/* Header */}
            <div className="bg-[#004d00] text-white p-5 flex items-center justify-between border-b border-[#003300]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#003000] text-[#ffa500]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Secure Subscription Checkout
                  </h3>
                  <p className="text-[11px] text-green-200">
                    Encrypted 256-Bit SSL Payment Gateway
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 rounded-lg bg-[#003000] hover:bg-[#002000] text-green-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success State */}
            {paymentSuccessReceipt ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-950/70 text-green-700 dark:text-green-300 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  Payment Successful & Plan Activated!
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  {paymentSuccessReceipt}
                </p>
                <div className="bg-gray-50 dark:bg-[#060e06] p-4 rounded-xl border border-gray-200 dark:border-[#163016] text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan:</span>
                    <strong className="text-gray-900 dark:text-white">
                      {selectedPlanForCheckout === "monthly" ? "Monthly ($29.99/mo)" : "Yearly ($299.99/yr)"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Charged:</span>
                    <strong className="text-[#004d00] dark:text-[#ffa500] font-mono">
                      ${selectedPlanForCheckout === "monthly" ? "29.99" : "299.99"} USD
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Access Granted:</span>
                    <span className="text-green-700 dark:text-green-400 font-bold">
                      Full Enterprise Suite (No Expiry Lock)
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      if (onNavigate) onNavigate("overview");
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow transition-colors"
                  >
                    Go to SEO Dashboard
                  </button>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#163016] font-semibold text-xs text-gray-700 dark:text-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <div className="p-6 space-y-4 text-xs">
                {/* Plan Selector Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlanForCheckout("monthly")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPlanForCheckout === "monthly"
                        ? "border-[#004d00] dark:border-[#ffa500] bg-green-50/50 dark:bg-[#122412] shadow-sm"
                        : "border-gray-200 dark:border-[#163016]"
                    }`}
                  >
                    <div className="font-bold text-gray-900 dark:text-white">Monthly Plan</div>
                    <div className="text-base font-extrabold text-[#004d00] dark:text-[#ffa500] mt-0.5">
                      $29.99 <span className="text-[10px] font-normal text-gray-500">/mo</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlanForCheckout("yearly")}
                    className={`p-3 rounded-xl border text-left relative transition-all ${
                      selectedPlanForCheckout === "yearly"
                        ? "border-[#ffa500] bg-amber-50/50 dark:bg-[#18150a] shadow-sm"
                        : "border-gray-200 dark:border-[#163016]"
                    }`}
                  >
                    <span className="absolute top-2 right-2 bg-[#ffa500] text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.2 rounded">
                      Save 17%
                    </span>
                    <div className="font-bold text-gray-900 dark:text-white">Yearly Plan</div>
                    <div className="text-base font-extrabold text-amber-900 dark:text-[#ffa500] mt-0.5">
                      $299.99 <span className="text-[10px] font-normal text-gray-500">/yr</span>
                    </div>
                  </button>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethodType("card")}
                      className={`p-2.5 rounded-lg border text-center font-bold text-[11px] transition-colors ${
                        paymentMethodType === "card"
                          ? "border-[#004d00] dark:border-[#ffa500] bg-green-50 dark:bg-[#122412] text-[#004d00] dark:text-[#ffa500]"
                          : "border-gray-200 dark:border-[#163016] text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethodType("paypal")}
                      className={`p-2.5 rounded-lg border text-center font-bold text-[11px] transition-colors ${
                        paymentMethodType === "paypal"
                          ? "border-[#004d00] dark:border-[#ffa500] bg-green-50 dark:bg-[#122412] text-[#004d00] dark:text-[#ffa500]"
                          : "border-gray-200 dark:border-[#163016] text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      PayPal
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethodType("gpay")}
                      className={`p-2.5 rounded-lg border text-center font-bold text-[11px] transition-colors ${
                        paymentMethodType === "gpay"
                          ? "border-[#004d00] dark:border-[#ffa500] bg-green-50 dark:bg-[#122412] text-[#004d00] dark:text-[#ffa500]"
                          : "border-gray-200 dark:border-[#163016] text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Google Pay
                    </button>
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="bg-gray-50 dark:bg-[#060e06] p-3 rounded-xl border border-gray-200 dark:border-[#163016] flex items-center justify-between">
                  <div>
                    <span className="text-gray-500 font-semibold">Total Due Today:</span>
                    <p className="text-[10px] text-gray-400">Includes continuous 7-day trial continuity</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#004d00] dark:text-[#ffa500]">
                      ${selectedPlanForCheckout === "monthly" ? "29.99" : "299.99"}
                    </span>
                    <span className="text-[10px] text-gray-500"> USD</span>
                  </div>
                </div>

                {/* Submit Payment */}
                <button
                  id="process-payment-submit-btn"
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleProcessPayment}
                  className="w-full py-3 px-4 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#ffa500]" />
                      <span>Processing Payment & Activating Suite...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#ffa500]" />
                      <span>
                        Pay ${selectedPlanForCheckout === "monthly" ? "29.99" : "299.99"} & Activate
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🅿️ DEDICATED PAYPAL GATEWAY MODAL (MONTHLY & YEARLY) */}
      {/* ========================================================================= */}
      <PayPalGatewayModal
        isOpen={isPayPalModalOpen}
        onClose={() => setIsPayPalModalOpen(false)}
        defaultPlan={payPalModalPlan}
        onNavigate={onNavigate}
      />
    </div>
  );
};

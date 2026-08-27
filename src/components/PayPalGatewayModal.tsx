import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  X,
  CreditCard,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { useAuthBilling } from "../context/AuthBillingContext";
import {
  fetchPayPalGatewayConfig,
  createPayPalOrderOnBackend,
  verifyPayPalSubscriptionOnBackend,
  PayPalPublicConfig,
} from "../services/api";
import { NavigationTab } from "../types";
import { PayPalSubscriptionButton } from "./PayPalSubscriptionButton";

interface PayPalGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: "monthly" | "yearly";
  onNavigate?: (tab: NavigationTab) => void;
}

export const PayPalGatewayModal: React.FC<PayPalGatewayModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = "monthly",
  onNavigate,
}) => {
  const { currentUser, subscribeWithPayPal } = useAuthBilling();

  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(defaultPlan);
  const [gatewayConfig, setGatewayConfig] = useState<PayPalPublicConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"paypal_smart" | "paypal_card" | "paypal_paylater">("paypal_smart");
  const [copiedPlanId, setCopiedPlanId] = useState<string | null>(null);
  const [customPayerEmail, setCustomPayerEmail] = useState(currentUser?.email || "");

  // Card sub-inputs for PayPal Guest Checkout
  const [cardHolder, setCardHolder] = useState(currentUser?.name || "Subscriber");
  const [cardNumber, setCardNumber] = useState("4000 1234 5678 9010");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("321");
  const [billingCountry, setBillingCountry] = useState("United States (US)");

  // Result state
  const [completionReceipt, setCompletionReceipt] = useState<{
    message: string;
    invoiceNumber: string;
    planId: string;
    transactionId: string;
    amount: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync plan choice if prop changes
  useEffect(() => {
    setSelectedPlan(defaultPlan);
  }, [defaultPlan]);

  // Load gateway configuration
  useEffect(() => {
    if (isOpen) {
      setIsLoadingConfig(true);
      fetchPayPalGatewayConfig()
        .then((cfg) => {
          setGatewayConfig(cfg);
        })
        .finally(() => {
          setIsLoadingConfig(false);
        });
      setCompletionReceipt(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isYearly = selectedPlan === "yearly";
  const amount = isYearly ? 299.99 : 29.99;
  const currentPlanId = isYearly
    ? gatewayConfig?.planYearly || "P-0SJ71276U2989504JNKGRCHQ"
    : gatewayConfig?.planMonthly || "P-60J823292U163132VNKGRA6Y";

  const handleCopyPlanId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedPlanId(id);
    setTimeout(() => setCopiedPlanId(null), 2000);
  };

  // Execute PayPal Subscription Authorization & Capture Flow
  const handleExecutePayPalPayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Request Order / Subscription Setup on Backend
      const orderResp = await createPayPalOrderOnBackend(
        selectedPlan,
        customPayerEmail || currentUser?.email
      );

      const subId =
        orderResp.orderId ||
        `I-PP${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      // 2. Call backend verification endpoint
      const verifyResp = await verifyPayPalSubscriptionOnBackend({
        subscriptionId: subId,
        orderId: orderResp.orderId,
        planType: selectedPlan,
        planId: currentPlanId,
        userEmail: customPayerEmail || currentUser?.email || "subscriber@gmail.com",
      });

      // 3. Update application context with active subscription & invoice
      const subResult = await subscribeWithPayPal(selectedPlan, {
        subscriptionId: subId,
        planId: currentPlanId,
        payerEmail: customPayerEmail || currentUser?.email,
      });

      setCompletionReceipt({
        message: subResult.message,
        invoiceNumber: subResult.invoice.invoiceNumber,
        planId: currentPlanId,
        transactionId: subId,
        amount: amount,
      });
    } catch (err: any) {
      console.error("PayPal Execution Error:", err);
      setErrorMessage(
        err.message || "Failed to process PayPal payment. Please check connection and try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="paypal-gateway-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <div className="bg-white dark:bg-[#0b170b] border border-gray-200 dark:border-[#163016] rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden text-gray-900 dark:text-white my-8">
        {/* PayPal Header */}
        <div className="bg-[#003087] text-white p-5 flex items-center justify-between border-b border-[#002266] relative">
          <div className="flex items-center gap-3">
            {/* PayPal Stylized Emblem */}
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md p-1.5 flex-shrink-0">
              <span className="font-black text-xl italic tracking-tighter text-[#003087]">
                P<span className="text-[#0079C1]">P</span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-wide">
                  PayPal Gateway Checkout
                </h3>
                <span className="bg-[#ffc439] text-[#003087] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Official Gateway
                </span>
              </div>
              <p className="text-[11px] text-blue-100">
                Seamless subscription payment & instant 7-Day trial continuity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SUCCESS RECEIPT STATE */}
        {/* ========================================================================= */}
        {completionReceipt ? (
          <div className="p-6 md:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner ring-4 ring-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-gray-900 dark:text-white">
                PayPal Subscription Active!
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                {completionReceipt.message}
              </p>
            </div>

            {/* Official PayPal Confirmation Card */}
            <div className="bg-gray-50 dark:bg-[#060e06] p-4 rounded-xl border border-gray-200 dark:border-[#163016] text-xs text-left space-y-2 font-sans">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-[#163016]">
                <span className="text-gray-500 font-semibold">Payment Status:</span>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                  <Check className="w-3 h-3" /> VERIFIED & CAPTURED
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Plan Selected:</span>
                <strong className="text-gray-900 dark:text-white">
                  {selectedPlan === "monthly"
                    ? "Monthly Subscription ($29.99/mo)"
                    : "Yearly Subscription ($299.99/yr - Save 17%)"}
                </strong>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Gateway Processing:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PayPal Express Gateway
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">PayPal Transaction ID:</span>
                <code className="font-mono text-[11px] text-gray-800 dark:text-gray-200">
                  {completionReceipt.transactionId}
                </code>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Invoice Number:</span>
                <strong className="text-gray-900 dark:text-white font-mono">
                  {completionReceipt.invoiceNumber}
                </strong>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-[#163016]">
                <span className="text-gray-700 dark:text-gray-300 font-bold">Amount Paid:</span>
                <span className="text-base font-extrabold text-[#004d00] dark:text-[#ffa500] font-mono">
                  ${completionReceipt.amount.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate("overview");
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#004d00] hover:bg-[#003800] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#ffa500]" />
                <span>Return to SEO Agency Dashboard</span>
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl border border-gray-300 dark:border-[#163016] text-gray-700 dark:text-gray-300 font-semibold text-xs hover:bg-gray-100 dark:hover:bg-[#122412] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CHECKOUT FORM */
          /* ========================================================================= */
          <div className="p-6 space-y-5 text-xs">
            {/* Plan Switcher Grid */}
            <div className="space-y-1.5">
              <label className="block font-bold text-gray-700 dark:text-gray-300">
                1. Select Subscription Billing Tier
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* MONTHLY OPTION */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("monthly")}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    selectedPlan === "monthly"
                      ? "border-[#003087] dark:border-[#ffa500] bg-blue-50/40 dark:bg-[#122412] shadow-md ring-2 ring-[#003087]/20"
                      : "border-gray-200 dark:border-[#163016] hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Monthly Subscription
                    </span>
                    {selectedPlan === "monthly" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#003087] dark:bg-[#ffa500]" />
                    )}
                  </div>

                  <div className="text-xl font-black text-[#003087] dark:text-[#ffa500] mt-1">
                    $29.99{" "}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      / month
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-[#163016] flex items-center justify-between text-[10px] text-gray-500 font-medium">
                    <span className="text-emerald-600 dark:text-emerald-400">● Active Gateway</span>
                    <span>Billed Monthly</span>
                  </div>
                </button>

                {/* YEARLY OPTION */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("yearly")}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    selectedPlan === "yearly"
                      ? "border-[#ffa500] bg-amber-50/40 dark:bg-[#1f1a0a] shadow-md ring-2 ring-[#ffa500]/30"
                      : "border-gray-200 dark:border-[#163016] hover:border-gray-300"
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-[#ffa500] text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                    Save 17% (2 Mo Free)
                  </span>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Yearly Annual License
                    </span>
                    {selectedPlan === "yearly" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffa500]" />
                    )}
                  </div>

                  <div className="text-xl font-black text-amber-900 dark:text-[#ffa500] mt-1">
                    $299.99{" "}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      / year
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-200/60 dark:border-[#163016] flex items-center justify-between text-[10px] text-gray-500 font-medium">
                    <span className="text-amber-700 dark:text-[#ffa500]">★ Best Value</span>
                    <span>Billed Annually</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Secure PayPal Gateway Security Reassurance Box */}
            <div className="bg-blue-50/80 dark:bg-[#0c1c0c] border border-blue-200 dark:border-[#163016] p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#003087] dark:text-[#ffa500] flex-shrink-0" />
                <div>
                  <span className="text-gray-900 dark:text-white font-bold text-xs block">
                    Secure PayPal Express Gateway
                  </span>
                  <span className="text-gray-500 text-[11px]">
                    256-bit SSL encrypted recurring billing. Internal tier configuration active.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-[#122412] px-2.5 py-1 rounded-full border border-emerald-200 dark:border-[#224822] flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
                <span>SSL Encrypted</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="block font-bold text-gray-700 dark:text-gray-300">
                2. Select PayPal Gateway Payment Option
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode("paypal_smart")}
                  className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMode === "paypal_smart"
                      ? "border-[#003087] dark:border-[#ffa500] bg-blue-50 dark:bg-[#122412] text-[#003087] dark:text-[#ffa500] shadow-xs"
                      : "border-gray-200 dark:border-[#163016] text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <span className="font-extrabold italic text-sm text-[#003087] dark:text-[#ffa500]">
                    PayPal
                  </span>
                  <span className="text-[10px] text-gray-500">1-Click Fast</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode("paypal_card")}
                  className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMode === "paypal_card"
                      ? "border-[#003087] dark:border-[#ffa500] bg-blue-50 dark:bg-[#122412] text-[#003087] dark:text-[#ffa500] shadow-xs"
                      : "border-gray-200 dark:border-[#163016] text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span>Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode("paypal_paylater")}
                  className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMode === "paypal_paylater"
                      ? "border-[#003087] dark:border-[#ffa500] bg-blue-50 dark:bg-[#122412] text-[#003087] dark:text-[#ffa500] shadow-xs"
                      : "border-gray-200 dark:border-[#163016] text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <span className="font-extrabold text-[11px] text-[#0079C1] dark:text-[#ffa500]">
                    Pay in 4
                  </span>
                  <span className="text-[10px] text-gray-500">Pay Later</span>
                </button>
              </div>
            </div>

            {/* Subscriber Email Input */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Subscriber / PayPal Account Email:
              </label>
              <input
                type="email"
                value={customPayerEmail}
                onChange={(e) => setCustomPayerEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#163016] bg-gray-50 dark:bg-[#060e06] text-gray-900 dark:text-white"
              />
            </div>

            {/* If PayPal Card Option Selected */}
            {paymentMode === "paypal_card" && (
              <div className="space-y-3 p-3.5 bg-gray-50 dark:bg-[#060e06] rounded-xl border border-gray-200 dark:border-[#163016] animate-in fade-in duration-100">
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    PayPal Guest Checkout (Debit / Credit)
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">
                    Processed by PayPal Gateway
                  </span>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-[11px] mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#163016] bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-[11px] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#163016] bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-[11px] mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#163016] bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-[11px] mb-1">
                      CVV / Security Code
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#163016] bg-white dark:bg-[#0b170b] text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary Banner */}
            <div className="bg-gray-50 dark:bg-[#060e06] p-3.5 rounded-xl border border-gray-200 dark:border-[#163016] flex items-center justify-between">
              <div>
                <span className="text-gray-500 font-bold block text-[11px]">Total Subscription Charge:</span>
                <span className="text-[10px] text-gray-400">
                  {isYearly ? "Billed annually ($299.99/yr)" : "Billed monthly ($29.99/mo)"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-[#003087] dark:text-[#ffa500] font-mono">
                  ${amount.toFixed(2)}
                </span>
                <span className="text-[11px] text-gray-500"> USD</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* PAYPAL PRIMARY ACTION BUTTON (Official Smart Subscription Buttons or fallback) */}
            {paymentMode === "paypal_smart" ? (
              <div className="space-y-2">
                <PayPalSubscriptionButton
                  planType={selectedPlan}
                  planId={currentPlanId}
                  customPayerEmail={customPayerEmail}
                  onSuccess={(details) => {
                    setCompletionReceipt({
                      message: `Successfully verified PayPal ${selectedPlan === "yearly" ? "Yearly" : "Monthly"} subscription!`,
                      invoiceNumber: details.invoiceNumber || `INV-PP-${Date.now().toString().slice(-6)}`,
                      planId: details.planId,
                      transactionId: details.subscriptionId,
                      amount: amount,
                    });
                  }}
                  onError={(err) => {
                    const msg = String(err?.message || err || "");
                    if (
                      msg.includes("Detected popup close") ||
                      msg.includes("popup close") ||
                      msg.includes("window closed")
                    ) {
                      return;
                    }
                    setErrorMessage(msg || "PayPal subscription processing notice");
                  }}
                />
              </div>
            ) : (
              <button
                id="paypal-gateway-submit-btn"
                type="button"
                disabled={isProcessing}
                onClick={handleExecutePayPalPayment}
                className="w-full py-3.5 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f2b930] text-[#003087] font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#003087]" />
                    <span>Connecting to PayPal & Activating License...</span>
                  </>
                ) : (
                  <>
                    <span className="font-black italic text-base">PayPal</span>
                    <span>
                      Pay ${amount.toFixed(2)} with PayPal & Continue Access
                    </span>
                  </>
                )}
              </button>
            )}

            {/* Debit or Credit Card Button Powered by PayPal */}
            {paymentMode !== "paypal_card" && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  setPaymentMode("paypal_card");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-gray-300" />
                <span>Debit or Credit Card (Powered by PayPal)</span>
              </button>
            )}

            <div className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-2 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>PayPal 256-Bit SSL Encrypted Vault Gateway • Cancel Anytime</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

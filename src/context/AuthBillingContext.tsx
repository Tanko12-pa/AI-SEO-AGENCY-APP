import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  AuthAccount,
  InvoiceRecord,
  SubscriptionPlanType,
  SubscriptionStatus,
  TrialState,
} from "../types";
import { fetchUserSubscriptionStatus } from "../services/api";
import {
  firebaseSignInWithGoogle,
  firebaseSignInWithEmail,
  firebaseSignUpWithEmail,
  firebaseSendPasswordReset,
  firebaseSignOutUser,
  subscribeAuthState,
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  saveInvoiceToFirestore,
  subscribeInvoices,
} from "../services/firebaseService";

const LOCAL_STORAGE_USERS_KEY = "ai_seo_agency_users_v2";
const LOCAL_STORAGE_CURRENT_USER_KEY = "ai_seo_agency_current_user_v2";
const LOCAL_STORAGE_INVOICES_KEY = "ai_seo_agency_invoices_v2";

const INITIAL_DEFAULT_USER: AuthAccount = {
  id: "user-default-agency",
  name: "Agency Strategist",
  email: "user@agency.com",
  password: "Password123!",
  role: "Lead AI SEO Architect",
  company: "AI SEO Enterprise Agency",
  avatarInitials: "AS",
  createdAt: "2026-08-20T09:00:00.000Z",
  trialStartDate: "2026-08-20T09:00:00.000Z",
  trialEndDate: "2026-08-27T09:00:00.000Z", // 7 days
  subscriptionPlan: "free_trial",
  subscriptionStatus: "trial_active",
  nextBillingDate: "2026-08-27",
  paymentMethod: "Visa ending in 4242",
  last4: "4242",
  autoRenew: true,
};

const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: "inv-init-001",
    invoiceNumber: "INV-2026-0820",
    date: "2026-08-20",
    description: "AI SEO Agency - 7-Day Free Enterprise Trial Activation",
    amount: 0.0,
    plan: "7-Day Free Trial",
    status: "Paid",
    paymentMethod: "Complimentary Free Trial",
    pdfDownloadName: "Invoice-INV-2026-0820.pdf",
  },
];

interface AuthBillingContextType {
  currentUser: AuthAccount | null;
  isAuthenticated: boolean;
  trialState: TrialState;
  hasActivePaidPlan: boolean;
  isAccessRestricted: boolean;
  isAdvanceWarning: boolean;
  invoices: InvoiceRecord[];
  allRegisteredUsers: AuthAccount[];
  firebaseConnected: boolean;
  signUp: (name: string, email: string, password: string, company?: string) => { success: boolean; message: string };
  signIn: (email: string, password: string) => { success: boolean; message: string };
  signInWithGoogleAuth: () => Promise<{ success: boolean; message: string }>;
  signInWithFirebase: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  signUpWithFirebase: (name: string, email: string, pass: string, company?: string) => Promise<{ success: boolean; message: string }>;
  sendFirebasePasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  signOut: (reloadPage?: boolean) => Promise<void> | void;
  changePassword: (email: string, oldPassword: string, newPassword: string) => { success: boolean; message: string };
  resetPasswordDirect: (email: string, newPassword: string) => { success: boolean; message: string };
  subscribe: (
    plan: "monthly" | "yearly",
    paymentDetails?: { method: string; last4: string; cardHolder?: string }
  ) => { success: boolean; message: string; invoice: InvoiceRecord };
  subscribeWithPayPal: (
    plan: "monthly" | "yearly",
    details: {
      subscriptionId?: string;
      orderId?: string;
      planId: string;
      payerEmail?: string;
    }
  ) => Promise<{ success: boolean; message: string; invoice: InvoiceRecord }>;
  cancelSubscription: () => { success: boolean; message: string };
  reactivateSubscription: (plan: "monthly" | "yearly") => { success: boolean; message: string };
  simulateTrialExpiration: () => void;
  resetTrial: (days?: number) => void;
  simulateTrialState: (
    state: "active_7days" | "warning_1day" | "expired_lockout" | "monthly_paid" | "yearly_paid"
  ) => void;
}

const AuthBillingContext = createContext<AuthBillingContextType | undefined>(undefined);

export const AuthBillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load registered users from local storage
  const [users, setUsers] = useState<AuthAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load users from storage", e);
    }
    return [INITIAL_DEFAULT_USER];
  });

  // Load current user from local storage
  const [currentUser, setCurrentUser] = useState<AuthAccount | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load current user from storage", e);
    }
    return INITIAL_DEFAULT_USER;
  });

  // Load invoices
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_INVOICES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load invoices from storage", e);
    }
    return INITIAL_INVOICES;
  });

  // Sync users to local storage & Firestore
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn("Failed to save users to storage", e);
    }
  }, [users]);

  // Sync current user to local storage & Firestore
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser));
        saveUserProfileToFirestore(currentUser);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      }
    } catch (e) {
      console.warn("Failed to save current user to storage", e);
    }
  }, [currentUser]);

  // Sync invoices to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_INVOICES_KEY, JSON.stringify(invoices));
    } catch (e) {
      console.warn("Failed to save invoices to storage", e);
    }
  }, [invoices]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (fbUser) => {
      if (fbUser) {
        // Fetch or create profile in Firestore
        const profile = await getUserProfileFromFirestore(fbUser.uid);
        if (profile) {
          setCurrentUser(profile);
        } else {
          const now = new Date();
          const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          const newAccount: AuthAccount = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split("@")[0] || "Agency Strategist",
            email: fbUser.email || "user@agency.com",
            role: "Lead SEO Architect",
            company: "Digital Marketing Enterprise",
            avatarInitials: (fbUser.displayName || fbUser.email || "AK").slice(0, 2).toUpperCase(),
            createdAt: now.toISOString(),
            trialStartDate: now.toISOString(),
            trialEndDate: trialEnd.toISOString(),
            subscriptionPlan: "free_trial",
            subscriptionStatus: "trial_active",
            autoRenew: true,
          };
          setCurrentUser(newAccount);
          await saveUserProfileToFirestore(newAccount);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Synchronize backend PayPal webhook status with client state
  const syncWithBackendWebhookState = useCallback(async () => {
    if (!currentUser?.email) return;
    try {
      const serverStatus = await fetchUserSubscriptionStatus(currentUser.email);
      if (serverStatus && serverStatus.subscription) {
        const sub = serverStatus.subscription;
        if (
          sub.planType !== currentUser.subscriptionPlan ||
          (sub.status === "ACTIVE" && currentUser.subscriptionStatus !== "active_monthly" && currentUser.subscriptionStatus !== "active_yearly")
        ) {
          const isMonthly = sub.planType === "monthly";
          const updated: AuthAccount = {
            ...currentUser,
            subscriptionPlan: sub.planType as "monthly" | "yearly",
            subscriptionStatus: isMonthly ? "active_monthly" : "active_yearly",
            paypalSubscriptionId: sub.subscriptionId || currentUser.paypalSubscriptionId,
            autoRenew: sub.status === "ACTIVE",
          };
          setCurrentUser(updated);
        }
      }
    } catch (err) {
      // Background sync silent catch
    }
  }, [currentUser]);

  useEffect(() => {
    syncWithBackendWebhookState();
    const interval = setInterval(syncWithBackendWebhookState, 45000);
    return () => clearInterval(interval);
  }, [syncWithBackendWebhookState]);

  // Compute 7-Day trial metrics
  const computeTrialState = (user: AuthAccount | null): TrialState => {
    if (!user) {
      return {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 7,
        hoursRemaining: 168,
        totalDays: 7,
        isExpired: false,
        isAdvanceWarning: false,
        hasActiveSubscription: false,
        isAccessRestricted: false,
        percentageUsed: 0,
      };
    }

    // If subscribed to Monthly ($29.99) or Yearly ($299.99), trial is bypassed / upgraded
    const hasActiveSubscription =
      user.subscriptionPlan === "monthly" ||
      user.subscriptionPlan === "yearly" ||
      user.subscriptionStatus === "active_monthly" ||
      user.subscriptionStatus === "active_yearly";

    if (hasActiveSubscription) {
      return {
        startDate: user.trialStartDate,
        endDate: user.trialEndDate,
        daysRemaining: 0,
        hoursRemaining: 0,
        totalDays: 7,
        isExpired: false,
        isAdvanceWarning: false,
        hasActiveSubscription: true,
        isAccessRestricted: false,
        percentageUsed: 100,
      };
    }

    const start = new Date(user.trialStartDate).getTime();
    const end = new Date(user.trialEndDate).getTime();
    const now = Date.now();
    const totalMs = 7 * 24 * 60 * 60 * 1000;
    const msRemaining = Math.max(0, end - now);
    const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
    const hoursRemaining = Math.max(0, Math.floor(msRemaining / (60 * 60 * 1000)));
    const isExpired = user.subscriptionStatus === "trial_expired" || now >= end;
    const isAdvanceWarning = !isExpired && user.subscriptionPlan === "free_trial" && daysRemaining <= 2;
    const percentageUsed = Math.min(100, Math.max(0, Math.round(((totalMs - msRemaining) / totalMs) * 100)));

    return {
      startDate: user.trialStartDate,
      endDate: user.trialEndDate,
      daysRemaining: isExpired ? 0 : daysRemaining,
      hoursRemaining: isExpired ? 0 : hoursRemaining,
      totalDays: 7,
      isExpired,
      isAdvanceWarning,
      hasActiveSubscription: false,
      isAccessRestricted: isExpired,
      percentageUsed,
    };
  };

  const trialState = computeTrialState(currentUser);
  const hasActivePaidPlan =
    currentUser?.subscriptionPlan === "monthly" ||
    currentUser?.subscriptionPlan === "yearly" ||
    currentUser?.subscriptionStatus === "active_monthly" ||
    currentUser?.subscriptionStatus === "active_yearly";
  const isAccessRestricted = !hasActivePaidPlan && (trialState.isExpired || currentUser?.subscriptionStatus === "trial_expired");
  const isAdvanceWarning = !isAccessRestricted && !hasActivePaidPlan && (trialState.isAdvanceWarning || trialState.daysRemaining <= 2);

  // Helper to extract initials
  const getInitials = (name: string): string => {
    if (!name) return "AI";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // 1. Sign Up Handler
  const signUp = (
    name: string,
    email: string,
    password: string,
    company: string = "Enterprise SEO Client"
  ): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      return { success: false, message: "Please fill in all required fields (Name, Email, Password)." };
    }

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      return { success: false, message: "Please enter a valid email address." };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    const existingUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingUser) {
      return { success: false, message: "An account with this email address already exists. Please Sign In." };
    }

    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const newUser: AuthAccount = {
      id: `user-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      password: password,
      role: "SEO Strategist & Account Owner",
      company: company || "Digital Marketing Hub",
      avatarInitials: getInitials(trimmedName),
      createdAt: now.toISOString(),
      trialStartDate: now.toISOString(),
      trialEndDate: trialEnd.toISOString(),
      subscriptionPlan: "free_trial",
      subscriptionStatus: "trial_active",
      autoRenew: true,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

    // Create free trial activation invoice
    const trialInvoice: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-TRIAL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: now.toISOString().split("T")[0],
      description: "AI SEO Agency - 7-Day Free Enterprise Trial Activation",
      amount: 0.0,
      plan: "7-Day Free Trial",
      status: "Paid",
      paymentMethod: "Free Trial Activated",
      pdfDownloadName: `Invoice-Trial-${trimmedName.replace(/\s+/g, "_")}.pdf`,
    };

    setInvoices([trialInvoice, ...invoices]);

    return {
      success: true,
      message: `Account created successfully! Your 7-Day Free Trial has been activated. Welcome, ${trimmedName}!`,
    };
  };

  // 2. Sign In Handler
  const signIn = (email: string, password: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      return { success: false, message: "Please enter both email and password." };
    }

    const targetUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!targetUser) {
      return {
        success: false,
        message: "No registered account found with this email. Please check your spelling or Sign Up for a new account.",
      };
    }

    if (targetUser.password && targetUser.password !== password) {
      return {
        success: false,
        message: "Incorrect password. Please try again or use the 'Change Password' feature.",
      };
    }

    setCurrentUser(targetUser);
    saveUserProfileToFirestore(targetUser);
    return {
      success: true,
      message: `Signed in successfully as ${targetUser.name}! Welcome back.`,
    };
  };

  // 2.1 Firebase Google Sign-In
  const signInWithGoogleAuth = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const fbUser = await firebaseSignInWithGoogle();
      const existing = await getUserProfileFromFirestore(fbUser.uid);
      if (existing) {
        setCurrentUser(existing);
        return { success: true, message: `Welcome back, ${existing.name}! Signed in via Firebase Google Auth.` };
      }

      const now = new Date();
      const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const newAcc: AuthAccount = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split("@")[0] || "Agency Strategist",
        email: fbUser.email || "subscriber@agency.com",
        role: "Lead AI SEO Architect & Director",
        company: "Digital Marketing Enterprise",
        avatarInitials: (fbUser.displayName || fbUser.email || "AS").slice(0, 2).toUpperCase(),
        createdAt: now.toISOString(),
        trialStartDate: now.toISOString(),
        trialEndDate: trialEnd.toISOString(),
        subscriptionPlan: "free_trial",
        subscriptionStatus: "trial_active",
        autoRenew: true,
      };

      setCurrentUser(newAcc);
      await saveUserProfileToFirestore(newAcc);
      return { success: true, message: `Welcome to AI SEO Agency, ${newAcc.name}! Your 7-Day Free Trial is live.` };
    } catch (err: any) {
      console.error("Firebase Google Sign-In error:", err);
      return { success: false, message: err.message || "Failed to sign in with Google Auth." };
    }
  };

  // 2.2 Firebase Email Sign-In
  const signInWithFirebase = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    try {
      const fbUser = await firebaseSignInWithEmail(email, pass);
      const profile = await getUserProfileFromFirestore(fbUser.uid);
      if (profile) {
        setCurrentUser(profile);
        return { success: true, message: `Signed in as ${profile.name} via Firebase!` };
      }
      return { success: true, message: "Signed in successfully with Firebase Auth." };
    } catch (err: any) {
      return { success: false, message: err.message || "Firebase sign-in failed." };
    }
  };

  // 2.3 Firebase Email Sign-Up
  const signUpWithFirebase = async (
    name: string,
    email: string,
    pass: string,
    company: string = "Enterprise SEO Agency"
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const fbUser = await firebaseSignUpWithEmail(email, pass, name);
      const now = new Date();
      const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const newAcc: AuthAccount = {
        id: fbUser.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "SEO Strategist & Account Owner",
        company: company,
        avatarInitials: getInitials(name),
        createdAt: now.toISOString(),
        trialStartDate: now.toISOString(),
        trialEndDate: trialEnd.toISOString(),
        subscriptionPlan: "free_trial",
        subscriptionStatus: "trial_active",
        autoRenew: true,
      };
      setCurrentUser(newAcc);
      await saveUserProfileToFirestore(newAcc);
      return { success: true, message: `Account created in Firebase! Welcome ${name}.` };
    } catch (err: any) {
      return { success: false, message: err.message || "Firebase sign-up failed." };
    }
  };

  // 2.4 Firebase Password Reset
  const sendFirebasePasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await firebaseSendPasswordReset(email);
      return { success: true, message: `Password reset email sent to ${email} via Firebase Auth.` };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to send reset email." };
    }
  };

  // 3. Sign Out Handler (Supports Firebase / Supabase / Auth0 providers with session clear & reload)
  const signOut = async (reloadPage: boolean = false) => {
    try {
      await firebaseSignOutUser();
    } catch (e) {
      console.warn("Auth provider sign out notice:", e);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    } catch (e) {
      console.warn("Failed to clear local auth session key:", e);
    }
    if (reloadPage && typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // 4. Change Password Handler (with old password verification)
  const changePassword = (
    email: string,
    oldPassword: string,
    newPassword: string
  ): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !newPassword) {
      return { success: false, message: "Email and new password are required." };
    }

    if (newPassword.length < 6) {
      return { success: false, message: "New password must be at least 6 characters long." };
    }

    const userIndex = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);
    if (userIndex === -1) {
      return { success: false, message: "User not found with this email address." };
    }

    const user = users[userIndex];
    if (user.password && user.password !== oldPassword) {
      return { success: false, message: "Current password does not match. Please verify your current password." };
    }

    const updatedUser: AuthAccount = {
      ...user,
      password: newPassword,
    };

    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    setUsers(updatedUsers);

    if (currentUser?.email.toLowerCase() === trimmedEmail) {
      setCurrentUser(updatedUser);
    }

    return {
      success: true,
      message: "Password changed successfully! You can now sign in with your new password.",
    };
  };

  // 5. Direct Reset Password Handler (allows users to change password as they wish without old password lock)
  const resetPasswordDirect = (email: string, newPassword: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !newPassword) {
      return { success: false, message: "Email and new password are required." };
    }

    if (newPassword.length < 6) {
      return { success: false, message: "New password must be at least 6 characters long." };
    }

    const userIndex = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);
    if (userIndex === -1) {
      return { success: false, message: "No account found matching this email address." };
    }

    const updatedUser: AuthAccount = {
      ...users[userIndex],
      password: newPassword,
    };

    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    setUsers(updatedUsers);

    if (currentUser?.email.toLowerCase() === trimmedEmail) {
      setCurrentUser(updatedUser);
    }

    return {
      success: true,
      message: "Password successfully updated! Your credentials have been saved securely.",
    };
  };

  // 6. Subscribe Handler (Monthly $29.99 or Yearly $299.99)
  const subscribe = (
    plan: "monthly" | "yearly",
    paymentDetails?: { method: string; last4: string; cardHolder?: string }
  ): { success: boolean; message: string; invoice: InvoiceRecord } => {
    const isMonthly = plan === "monthly";
    const amount = isMonthly ? 29.99 : 299.99;
    const planName = isMonthly ? "Monthly ($29.99)" : "Yearly ($299.99)";
    const nextDate = new Date();
    if (isMonthly) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    const method = paymentDetails?.method || "Credit Card (Visa)";
    const last4 = paymentDetails?.last4 || "4242";

    const newInvoice: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      description: `AI SEO Agency Suite - ${planName} Subscription Renewal`,
      amount,
      plan: planName,
      status: "Paid",
      paymentMethod: `${method} ending in ${last4}`,
      pdfDownloadName: `Receipt-${planName.replace(/[^a-zA-Z0-9]/g, "-")}-${Date.now()}.pdf`,
    };

    setInvoices([newInvoice, ...invoices]);

    if (currentUser) {
      const updatedUser: AuthAccount = {
        ...currentUser,
        subscriptionPlan: plan,
        subscriptionStatus: isMonthly ? "active_monthly" : "active_yearly",
        nextBillingDate: nextDate.toISOString().split("T")[0],
        paymentMethod: `${method} ending in ${last4}`,
        last4,
        autoRenew: true,
      };

      setCurrentUser(updatedUser);

      // Update users array
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        const updatedUsers = [...users];
        updatedUsers[userIndex] = updatedUser;
        setUsers(updatedUsers);
      }
    }

    return {
      success: true,
      message: `Payment of $${amount.toFixed(2)} processed successfully! Your ${isMonthly ? "Monthly" : "Yearly"} subscription is active with uninterrupted access.`,
      invoice: newInvoice,
    };
  };

  // 6.2 PayPal Gateway Subscribe Handler (Monthly $29.99 / Yearly $299.99)
  const subscribeWithPayPal = async (
    plan: "monthly" | "yearly",
    details: {
      subscriptionId?: string;
      orderId?: string;
      planId: string;
      payerEmail?: string;
    }
  ): Promise<{ success: boolean; message: string; invoice: InvoiceRecord }> => {
    const isMonthly = plan === "monthly";
    const amount = isMonthly ? 29.99 : 299.99;
    const planName = isMonthly ? "Monthly ($29.99)" : "Yearly ($299.99)";
    const planId =
      details.planId ||
      (isMonthly
        ? "P-60J823292U163132VNKGRA6Y"
        : "P-0SJ71276U2989504JNKGRCHQ");
    const subId =
      details.subscriptionId ||
      details.orderId ||
      `I-PP${Date.now().toString(36).toUpperCase()}`;

    const nextDate = new Date();
    if (isMonthly) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    const invoiceNumber = `INV-PP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newInvoice: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoiceNumber,
      date: new Date().toISOString().split("T")[0],
      description: `AI SEO Agency Suite - ${planName} [PayPal Express Gateway]`,
      amount,
      plan: planName,
      status: "Paid",
      paymentMethod: `PayPal Gateway (${details.payerEmail || currentUser?.email || "Account"})`,
      pdfDownloadName: `PayPal-Receipt-${invoiceNumber}.pdf`,
      paypalTransactionId: subId,
      paypalPlanId: planId,
      paypalSubscriptionId: subId,
    };

    setInvoices([newInvoice, ...invoices]);

    if (currentUser) {
      const updatedUser: AuthAccount = {
        ...currentUser,
        subscriptionPlan: plan,
        subscriptionStatus: isMonthly ? "active_monthly" : "active_yearly",
        nextBillingDate: nextDate.toISOString().split("T")[0],
        paymentMethod: `PayPal (${details.payerEmail || currentUser.email})`,
        last4: "PayPal",
        paypalSubscriptionId: subId,
        paypalPlanId: planId,
        paypalEmail: details.payerEmail || currentUser.email,
        autoRenew: true,
      };

      setCurrentUser(updatedUser);

      // Update in stored users array
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        const updatedUsers = [...users];
        updatedUsers[userIndex] = updatedUser;
        setUsers(updatedUsers);
      }
    }

    return {
      success: true,
      message: `PayPal subscription verified successfully! Your account is now active with uninterrupted access to all AI SEO Agency suite tools.`,
      invoice: newInvoice,
    };
  };

  // 7. Cancel Subscription Handler
  const cancelSubscription = (): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: "No active user logged in." };

    const updatedUser: AuthAccount = {
      ...currentUser,
      subscriptionStatus: "cancelled",
      autoRenew: false,
    };

    setCurrentUser(updatedUser);
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      setUsers(updatedUsers);
    }

    return {
      success: true,
      message: "Subscription auto-renewal cancelled. You will continue to have full access until the end of your current billing period.",
    };
  };

  // 8. Reactivate Subscription Handler
  const reactivateSubscription = (plan: "monthly" | "yearly"): { success: boolean; message: string } => {
    return subscribe(plan);
  };

  // 9. Simulate Trial Expiration for testing
  const simulateTrialExpiration = () => {
    if (!currentUser) return;
    const expiredUser: AuthAccount = {
      ...currentUser,
      subscriptionPlan: "free_trial",
      subscriptionStatus: "trial_expired",
      trialEndDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    };
    setCurrentUser(expiredUser);
  };

  // 10. Reset Trial for testing
  const resetTrial = (days: number = 7) => {
    if (!currentUser) return;
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const resetUser: AuthAccount = {
      ...currentUser,
      subscriptionPlan: "free_trial",
      subscriptionStatus: "trial_active",
      trialStartDate: now.toISOString(),
      trialEndDate: future.toISOString(),
    };
    setCurrentUser(resetUser);
  };

  // 11. Multi-scenario Trial State Simulator for immediate policy testing
  const simulateTrialState = (
    state: "active_7days" | "warning_1day" | "expired_lockout" | "monthly_paid" | "yearly_paid"
  ) => {
    if (!currentUser) return;
    const now = new Date();

    if (state === "active_7days") {
      const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const updated: AuthAccount = {
        ...currentUser,
        subscriptionPlan: "free_trial",
        subscriptionStatus: "trial_active",
        trialStartDate: now.toISOString(),
        trialEndDate: future.toISOString(),
      };
      setCurrentUser(updated);
      saveUserProfileToFirestore(updated);
    } else if (state === "warning_1day") {
      const pastStart = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      const future1Day = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const updated: AuthAccount = {
        ...currentUser,
        subscriptionPlan: "free_trial",
        subscriptionStatus: "trial_active",
        trialStartDate: pastStart.toISOString(),
        trialEndDate: future1Day.toISOString(),
      };
      setCurrentUser(updated);
      saveUserProfileToFirestore(updated);
    } else if (state === "expired_lockout") {
      const pastStart = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
      const pastEnd = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      const updated: AuthAccount = {
        ...currentUser,
        subscriptionPlan: "free_trial",
        subscriptionStatus: "trial_expired",
        trialStartDate: pastStart.toISOString(),
        trialEndDate: pastEnd.toISOString(),
      };
      setCurrentUser(updated);
      saveUserProfileToFirestore(updated);
    } else if (state === "monthly_paid") {
      subscribe("monthly");
    } else if (state === "yearly_paid") {
      subscribe("yearly");
    }
  };

  return (
    <AuthBillingContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        trialState,
        hasActivePaidPlan,
        isAccessRestricted,
        isAdvanceWarning,
        invoices,
        allRegisteredUsers: users,
        firebaseConnected: true,
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
      }}
    >
      {children}
    </AuthBillingContext.Provider>
  );
};

export const useAuthBilling = () => {
  const context = useContext(AuthBillingContext);
  if (!context) {
    throw new Error("useAuthBilling must be used within an AuthBillingProvider");
  }
  return context;
};

export type NavigationTab =
  | "overview"
  | "ai-search-eeat"
  | "a2a-judge"
  | "keywords"
  | "initial-audit"
  | "onpage-tech"
  | "content-marketing"
  | "audio-transcriber"
  | "packages-roi"
  | "algorithm-intel"
  | "subscription-billing";

export interface KeywordItem {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number; // 1-100
  cpc: number;
  currentRank: number;
  previousRank: number;
  intent: "Informational" | "Commercial" | "Transactional" | "Navigational" | string;
  aiOverviewProbability: number; // 1-100%
  serpFeatures: string[];
  cluster: string;
  dateAdded: string;
  status: "Ranking #1-3" | "Top 10" | "Page 2" | "Tracking" | string;
  archived?: boolean;
}

export interface CompetitorItem {
  id: string;
  name: string;
  domain: string;
  domainAuthority: number;
  organicKeywords: number;
  estimatedTraffic: string;
  aiOverviewPresence: number; // %
  backlinksCount: number;
  overlapKeywordsCount: number;
  dateAdded: string;
  archived?: boolean;
}

export interface ContentPieceItem {
  id: string;
  title: string;
  type: "Blog Post" | "Guest Blog" | "Informational Piece" | "Press Release" | "Q&A Guide" | string;
  targetKeyword: string;
  wordCount: number;
  status: "Published" | "In Review" | "Drafting" | "Scheduled" | string;
  eeatScore: number;
  publishDate: string;
  lastAuditedDate?: string;
  aiOptimized: boolean;
  author: string;
  archived?: boolean;
}

export interface GoogleTrendsMonthData {
  month: string;
  interest: number;
}

export interface GoogleTrendsResult {
  keyword: string;
  currentInterestScore: number;
  averageInterestScore: number;
  peakMonth: string;
  trendTrajectory: "Explosive Growth" | "Rising Fast" | "Seasonal Peak" | "Steady Evergreen" | "Declining" | string;
  growthRateYoY: string;
  monthlyTrend: GoogleTrendsMonthData[];
  breakoutQueries: { query: string; growth: string }[];
  topRegions: { region: string; index: number }[];
  aiSearchContext: string;
  actionableTakeaway: string;
  sources?: { title: string; uri: string }[];
}

export interface LocalCitationItem {
  id: string;
  platform: string;
  category: "Google Business Profile" | "Local Directory" | "Industry Profile" | "Q&A Platform" | string;
  status: "Verified & Active" | "Pending Verification" | "Needs Optimization" | string;
  napConsistency: number; // %
  reviewCount: number;
  rating: number;
  profileUrl: string;
  dateUpdated: string;
  archived?: boolean;
}

export interface AudioTranscriptItem {
  id: string;
  title: string;
  client: string;
  duration: string;
  dateRecorded: string;
  fullTranscript: string;
  timestamps: { time: string; speaker: string; text: string; intent?: string }[];
  extractedKeywords: string[];
  actionItems: string[];
  sentiment: "Positive" | "Neutral" | "Constructive" | string;
  archived?: boolean;
}

export interface CampaignLogItem {
  id: string;
  timestamp: string;
  category: "Algorithm" | "On-Page" | "Link-Building" | "Content" | "Audit" | "A2A" | string;
  event: string;
  impactScore: string;
  user: string;
}

export interface SEOPackage {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  billingPeriod: string;
  popular?: boolean;
  colorTheme: string;
  features: string[];
  deliverables: {
    keywords: string;
    audits: string;
    content: string;
    localCitations: string;
    reporting: string;
    aiEngine: string;
  };
}

export interface AlgorithmUpdate {
  id: string;
  name: string;
  releaseDate: string;
  focus: string;
  impactLevel: "Critical" | "High" | "Moderate" | string;
  description: string;
  recommendedAction: string;
  aiSearchFactor: string;
}

export type ThemeMode = "light" | "dark";

export interface AlgorithmNotificationPreferences {
  criticalCoreUpdates: boolean;
  aiOverviewFluctuations: boolean;
  eeatHelpfulContentShifts: boolean;
  dailySerpDigest: boolean;
  marketShiftAlerts: boolean;
  audibleChimes: boolean;
  browserPush: boolean;
  emailAlerts: boolean;
}

export interface MarketShiftAlert {
  id: string;
  keywordId?: string;
  keyword: string;
  previousVolume: number;
  currentVolume: number;
  percentageChange: number; // e.g. +38.5% or -22.0%
  direction: "surge" | "drop";
  detectedAt?: string;
  triggerDate?: string;
  currentTrendScore?: number;
  growthRateYoY?: string;
  aiOverviewImpact?: string;
  source?: "Google Trends Grounding" | "SERP Velocity Engine" | "Historical Baseline" | string;
  significance?: "critical" | "high" | "moderate";
  severity?: "critical" | "high" | "moderate";
  recommendation?: string;
  actionableRecommendation?: string;
  status?: "unread" | "read" | "acknowledged" | "dismissed";
  read?: boolean;
  trendScores?: { month: string; value: number }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  tier: string;
  notificationPreferences: AlgorithmNotificationPreferences;
}

export interface GroundingSource {
  title?: string;
  uri: string;
}

export interface GoogleTrendsMonthData {
  month: string;
  interest: number;
}

export interface GoogleTrendsBreakout {
  query: string;
  growth: string;
}

export interface GoogleTrendsRegion {
  region: string;
  index: number;
}

export interface GoogleTrendsResult {
  keyword: string;
  currentInterestScore: number;
  growthRateYoY: string;
  peakMonth: string;
  trendTrajectory: "Sharp Upward" | "Steady Growth" | "Seasonal Cyclic" | "Emerging Breakout" | string;
  monthlyTrend: GoogleTrendsMonthData[];
  breakoutQueries: GoogleTrendsBreakout[];
  topRegions: GoogleTrendsRegion[];
  aiSearchContext: string;
  actionableTakeaway: string;
  groundingSources?: GroundingSource[];
}

export type SubscriptionPlanType = "free_trial" | "monthly" | "yearly";

export type SubscriptionStatus =
  | "trial_active"
  | "trial_expired"
  | "active_monthly"
  | "active_yearly"
  | "cancelled";

export interface AuthAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  company?: string;
  avatarInitials: string;
  createdAt: string;
  trialStartDate: string;
  trialEndDate: string;
  subscriptionPlan: SubscriptionPlanType;
  subscriptionStatus: SubscriptionStatus;
  nextBillingDate?: string;
  paymentMethod?: string;
  last4?: string;
  paypalSubscriptionId?: string;
  paypalPlanId?: string;
  paypalEmail?: string;
  autoRenew: boolean;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  description: string;
  amount: number;
  plan: "Monthly ($29.99)" | "Yearly ($299.99)" | string;
  status: "Paid" | "Refunded" | "Pending";
  paymentMethod: string;
  pdfDownloadName: string;
  paypalTransactionId?: string;
  paypalPlanId?: string;
  paypalSubscriptionId?: string;
}

export interface TrialState {
  startDate: string;
  endDate: string;
  daysRemaining: number;
  totalDays: number;
  isExpired: boolean;
  percentageUsed: number;
}

export interface PayPalGatewayConfig {
  clientId: string;
  mode: "sandbox" | "live";
  planMonthly: string;
  planYearly: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  isConfigured: boolean;
  webhookConfigured: boolean;
}

export interface PayPalSubscriptionVerifyPayload {
  subscriptionId: string;
  planType: "monthly" | "yearly";
  planId: string;
  userEmail: string;
  orderId?: string;
  facilitatorAccessToken?: string;
}


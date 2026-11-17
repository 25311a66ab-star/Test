export type Platform = 'instagram' | 'linkedin' | 'x' | 'facebook' | 'tiktok';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type InsightSeverity = 'high' | 'medium' | 'low';
export type DateRangeKey = '7d' | '30d' | '90d';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  industry: string;
  plan: string;
  avatarInitials: string;
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  industry: string;
  demoMode: boolean;
}

export interface DailyMetric {
  id: string;
  workspaceId: string;
  platform: Platform;
  date: string; // YYYY-MM-DD
  reach: number;
  impressions: number;
  engagement: number;
  followers: number;
  clicks: number;
}

export interface Competitor {
  id: string;
  workspaceId: string;
  name: string;
  platform: Platform;
  handle: string;
  notes: string;
  strengths: string[];
  weaknesses: string[];
  scores: {
    reach: number;
    engagement: number;
    consistency: number;
    contentQuality: number;
    audienceGrowth: number;
  };
}

export interface CompetitorMetric {
  id: string;
  competitorId: string;
  date: string;
  reach: number;
  engagement: number;
  followers: number;
}

export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  platform: Platform;
  objective: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  engagement: number;
  isUnderperforming?: boolean;
}

export interface CampaignDailyPoint {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface AIInsight {
  id: string;
  workspaceId: string;
  createdAt: string;
  category: 'Recommendations' | 'Weak Campaigns' | 'Competitor Gaps' | 'Engagement Playbook' | 'Full Strategy';
  severity: InsightSeverity;
  title: string;
  body: string;
  recommendation: string;
  confidence: number;
  generatedBy: 'llm' | 'heuristic';
  isDismissed: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'alert' | 'insight' | 'campaign' | 'report';
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface WorkspaceReport {
  id: string;
  workspaceId: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  payload: {
    totalReach: number;
    totalImpressions: number;
    avgEngagementRate: number;
    followerGrowth: number;
    topPlatform: Platform;
    activeCampaigns: number;
    executiveSummary: string;
    keyHighlights: string[];
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface NotificationPreferences {
  weeklyDigest: boolean;
  campaignAlerts: boolean;
  competitorSpikes: boolean;
  aiInsightReady: boolean;
}

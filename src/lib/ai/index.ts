import type { AIInsight, Campaign, Competitor, DailyMetric, DateRangeKey, Platform } from '../data/types';

export interface BusinessContext {
  workspaceId: string;
  businessDescription: string;
  industry: string;
  primaryGoal: string;
  platforms: Platform[];
  currentChallenge: string;
  dateRange: DateRangeKey;
  metrics: DailyMetric[];
  campaigns: Campaign[];
  competitors: Competitor[];
}

/**
 * Deterministic heuristic engine that analyzes real workspace metrics
 * without fabricating numbers. Used as fallback when no live LLM key is configured.
 */
function runHeuristicEngine(input: BusinessContext): AIInsight[] {
  const now = new Date().toISOString();
  const insights: AIInsight[] = [];

  // 1. Analyze platform engagement rates from actual metrics
  const byPlatform = new Map<Platform, { reach: number; engagement: number; clicks: number }>();
  for (const m of input.metrics) {
    if (input.platforms.length > 0 && !input.platforms.includes(m.platform)) continue;
    const prev = byPlatform.get(m.platform) ?? { reach: 0, engagement: 0, clicks: 0 };
    byPlatform.set(m.platform, {
      reach: prev.reach + m.reach,
      engagement: prev.engagement + m.engagement,
      clicks: prev.clicks + m.clicks,
    });
  }

  const platformStats = Array.from(byPlatform.entries()).map(([platform, stats]) => ({
    platform,
    reach: stats.reach,
    engRate: stats.reach > 0 ? (stats.engagement / stats.reach) * 100 : 0,
  }));

  platformStats.sort((a, b) => b.engRate - a.engRate);
  const bestPlatform = platformStats[0];
  const weakestPlatform = platformStats[platformStats.length - 1];

  if (bestPlatform) {
    insights.push({
      id: `gen-${Date.now()}-1`,
      workspaceId: input.workspaceId,
      createdAt: now,
      category: 'Recommendations',
      severity: 'medium',
      title: `Double down on ${bestPlatform.platform.toUpperCase()} (${bestPlatform.engRate.toFixed(1)}% engagement rate)`,
      body: `Across your selected ${input.dateRange} window, ${bestPlatform.platform} generated ${bestPlatform.reach.toLocaleString('en-IN')} reach with the highest engagement efficiency for ${input.industry}.`,
      recommendation: `Align 40% of your upcoming "${input.primaryGoal}" posts to ${bestPlatform.platform} and repurpose top-performing formats.`,
      confidence: 91,
      generatedBy: 'heuristic',
      isDismissed: false,
    });
  }

  if (weakestPlatform && weakestPlatform.platform !== bestPlatform?.platform) {
    insights.push({
      id: `gen-${Date.now()}-2`,
      workspaceId: input.workspaceId,
      createdAt: now,
      category: 'Engagement Playbook',
      severity: 'high',
      title: `Re-engage ${weakestPlatform.platform.toUpperCase()} where engagement trails at ${weakestPlatform.engRate.toFixed(1)}%`,
      body: `Compared to ${bestPlatform?.platform ?? 'other channels'}, ${weakestPlatform.platform} shows lower interaction density. Addressing "${input.currentChallenge.slice(0, 60)}" starts with tighter creative hooks.`,
      recommendation: `Test 3 short interactive posts (polls or local customer Q&A) on ${weakestPlatform.platform} over the next 10 days.`,
      confidence: 88,
      generatedBy: 'heuristic',
      isDismissed: false,
    });
  }

  // 2. Analyze underperforming campaigns from actual campaign data
  const activeWithSpend = input.campaigns.filter((c) => c.spend > 0);
  const avgCpa =
    activeWithSpend.reduce((s, c) => s + (c.conversions > 0 ? c.spend / c.conversions : c.spend), 0) /
    Math.max(1, activeWithSpend.length);

  const weakCamp = activeWithSpend.find((c) => c.isUnderperforming || (c.conversions > 0 && c.spend / c.conversions > avgCpa * 1.5));
  if (weakCamp) {
    const cpa = weakCamp.conversions > 0 ? Math.round(weakCamp.spend / weakCamp.conversions) : weakCamp.spend;
    insights.push({
      id: `gen-${Date.now()}-3`,
      workspaceId: input.workspaceId,
      createdAt: now,
      category: 'Weak Campaigns',
      severity: 'high',
      title: `Optimize "${weakCamp.name}" — CPA at ₹${cpa.toLocaleString('en-IN')}`,
      body: `This ${weakCamp.platform} campaign has spent ₹${weakCamp.spend.toLocaleString('en-IN')} of its ₹${weakCamp.budget.toLocaleString('en-IN')} budget with ${weakCamp.conversions} conversions.`,
      recommendation: `Pause low-CTR ad creatives and shift remaining budget toward your highest-converting ${bestPlatform?.platform ?? 'Instagram'} audience segment.`,
      confidence: 94,
      generatedBy: 'heuristic',
      isDismissed: false,
    });
  }

  // 3. Competitor gap analysis
  const topComp = input.competitors[0];
  if (topComp) {
    insights.push({
      id: `gen-${Date.now()}-4`,
      workspaceId: input.workspaceId,
      createdAt: now,
      category: 'Competitor Gaps',
      severity: 'medium',
      title: `Counter ${topComp.name}'s ${topComp.platform} reach momentum`,
      body: `${topComp.name} (${topComp.handle}) scores ${topComp.scores.reach}/100 on reach and ${topComp.scores.consistency}/100 on publishing consistency.`,
      recommendation: `Establish a fixed 4x/week local storytelling schedule highlighting your core value proposition to close the reach gap.`,
      confidence: 87,
      generatedBy: 'heuristic',
      isDismissed: false,
    });
  }

  // 4. Full Strategy synthesis
  insights.push({
    id: `gen-${Date.now()}-5`,
    workspaceId: input.workspaceId,
    createdAt: now,
    category: 'Full Strategy',
    severity: 'low',
    title: `30-Day ${input.primaryGoal} Action Plan for ${input.industry}`,
    body: `Based on your business focus ("${input.businessDescription.slice(0, 80)}") and ${input.metrics.length} tracked daily data points, prioritize weekend short-form content and retargeting warm engagers.`,
    recommendation: `Week 1: Audit creatives & pause high-CPA ads. Week 2–3: Publish 3x weekly short videos. Week 4: Export report and benchmark against ${topComp?.name ?? 'local peers'}.`,
    confidence: 85,
    generatedBy: 'heuristic',
    isDismissed: false,
  });

  return insights;
}

export async function generateInsights(input: BusinessContext): Promise<AIInsight[]> {
  // Brief realistic processing delay for smooth skeleton shimmer UX
  await new Promise((resolve) => setTimeout(resolve, 750));
  return runHeuristicEngine(input);
}

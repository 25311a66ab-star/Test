import React, { useEffect, useState } from 'react';
import { Printer, RefreshCw, Sparkles } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button, Card, DemoBadge, Input, Select, Skeleton, Textarea } from '../../components/ui/Primitives';
import { useApp } from '../../context/AppContext';
import { dataProvider } from '../../lib/data/provider';
import { generateInsights } from '../../lib/ai';
import type { AIInsight, DateRangeKey, Platform } from '../../lib/data/types';
import { PLATFORM_LABELS } from '../../lib/utils';

const TABS: AIInsight['category'][] = [
  'Recommendations',
  'Weak Campaigns',
  'Competitor Gaps',
  'Engagement Playbook',
  'Full Strategy',
];

const ALL_PLATFORMS: Platform[] = ['instagram', 'linkedin', 'x', 'facebook', 'tiktok'];

export function InsightsPage() {
  const { dateRange, toast } = useApp();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activeTab, setActiveTab] = useState<AIInsight['category']>('Recommendations');
  const [analyzing, setAnalyzing] = useState(false);

  // Form state
  const [businessDescription, setBusinessDescription] = useState(
    'Urban & semi-urban retail store selling lifestyle and festive home products in Hyderabad.'
  );
  const [industry, setIndustry] = useState('Retail & Local Business');
  const [primaryGoal, setPrimaryGoal] = useState('Increase Store Visits & Conversions');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram', 'facebook', 'x', 'tiktok']);
  const [currentChallenge, setCurrentChallenge] = useState(
    'Engagement dropped on X and ad spend is converting unevenly across weekend promotions.'
  );
  const [range, setRange] = useState<DateRangeKey>(dateRange);

  useEffect(() => {
    dataProvider.getInsights().then(setInsights);
  }, []);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (selectedPlatforms.length === 0) {
      toast({ title: 'Select at least one platform', variant: 'error' });
      return;
    }
    setAnalyzing(true);
    try {
      const [ws, metrics, campaigns, competitors] = await Promise.all([
        dataProvider.getWorkspace(),
        dataProvider.getMetrics(range),
        dataProvider.getCampaigns(),
        dataProvider.getCompetitors(),
      ]);
      const generated = await generateInsights({
        workspaceId: ws.id,
        businessDescription,
        industry,
        primaryGoal,
        platforms: selectedPlatforms,
        currentChallenge,
        dateRange: range,
        metrics,
        campaigns,
        competitors,
      });
      await dataProvider.saveInsights(generated);
      const all = await dataProvider.getInsights();
      setInsights(all);
      toast({
        title: 'Analysis complete',
        description: `Generated ${generated.length} metric-backed recommendations.`,
        variant: 'success',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const tabInsights = insights.filter((i) => i.category === activeTab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 no-print">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F1115]">AI Insights</h1>
            <p className="text-sm text-[#4B5563] mt-0.5">
              Generate prioritized marketing recommendations derived directly from your workspace metrics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DemoBadge />
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Context Form */}
        <Card className="p-6 no-print">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="ai-industry" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Industry
                </label>
                <Input id="ai-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="ai-goal" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Primary Goal
                </label>
                <Input id="ai-goal" value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="ai-range" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Analysis Window
                </label>
                <Select id="ai-range" value={range} onChange={(e) => setRange(e.target.value as DateRangeKey)}>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ai-desc" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Business Description
                </label>
                <Textarea id="ai-desc" rows={2} value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="ai-chal" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Current Marketing Challenge
                </label>
                <Textarea id="ai-chal" rows={2} value={currentChallenge} onChange={(e) => setCurrentChallenge(e.target.value)} required />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#4B5563]">Platforms:</span>
                {ALL_PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        active
                          ? 'bg-[#0F1115] text-white border-[#0F1115]'
                          : 'bg-white text-[#4B5563] border-[#E1E5EB] hover:bg-[#F8F9FB]'
                      }`}
                    >
                      {PLATFORM_LABELS[p]}
                    </button>
                  );
                })}
              </div>

              <Button type="submit" disabled={analyzing} className="bg-brand-gradient">
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing your performance…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Insights
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Tab Bar */}
        <div role="tablist" className="flex items-center gap-1.5 overflow-x-auto pb-1 no-print">
          {TABS.map((tab) => {
            const count = insights.filter((i) => i.category === tab).length;
            return (
              <button
                key={tab}
                role="tab"
                type="button"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-[#E11D2E] text-white'
                    : 'bg-white border border-[#EEF0F4] text-[#4B5563] hover:text-[#0F1115]'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div aria-live="polite" className="space-y-4">
          {analyzing ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#E11D2E]">Analyzing your performance…</p>
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ) : tabInsights.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-sm font-semibold text-[#0F1115]">No insights in this category yet</p>
              <p className="text-xs text-[#4B5563] mt-1">Click Generate Insights above to run a fresh analysis.</p>
            </Card>
          ) : (
            tabInsights.map((ins) => (
              <Card key={ins.id} className="p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4B5563]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        ins.severity === 'high'
                          ? 'text-[#DC2626]'
                          : ins.severity === 'medium'
                          ? 'text-[#F59E0B]'
                          : 'text-[#16A34A]'
                      }`}
                    >
                      {ins.severity.toUpperCase()} PRIORITY
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{ins.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">Confidence {ins.confidence}%</span>
                  </div>
                  <span className="font-medium text-[#0F1115]">
                    {ins.generatedBy === 'llm' ? 'Generated by AI' : 'Rule-based analysis (demo)'}
                  </span>
                </div>

                <h2 className="text-base font-bold text-[#0F1115]">{ins.title}</h2>
                <p className="text-sm text-[#4B5563]">{ins.body}</p>

                <div className="p-3.5 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4] text-sm text-[#0F1115]">
                  <strong className="text-xs text-[#4B5563] block mb-0.5">Recommended Next Action</strong>
                  {ins.recommendation}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

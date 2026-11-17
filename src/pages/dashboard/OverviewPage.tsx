import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowRight, ArrowUpDown, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ChartCard, CHART_THEME } from '../../components/charts/ChartCard';
import { Card, DemoBadge, Skeleton } from '../../components/ui/Primitives';
import { useApp } from '../../context/AppContext';
import { dataProvider } from '../../lib/data/provider';
import type { AIInsight, Campaign, Competitor, CompetitorMetric, DailyMetric, NotificationItem } from '../../lib/data/types';
import { formatNumber, formatPercent, PLATFORM_COLORS, PLATFORM_LABELS } from '../../lib/utils';

export function OverviewPage() {
  const { dateRange, globalSearch } = useApp();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [compMetrics, setCompMetrics] = useState<CompetitorMetric[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [sortCol, setSortCol] = useState<'reach' | 'engRate' | 'followers'>('reach');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      dataProvider.getMetrics(dateRange),
      dataProvider.getCampaigns(),
      dataProvider.getCompetitors(),
      dataProvider.getCompetitorMetrics(dateRange),
      dataProvider.getInsights(),
      dataProvider.getNotifications(),
    ]).then(([m, c, comp, cm, ins, notifs]) => {
      if (!active) return;
      setMetrics(m);
      setCampaigns(c);
      setCompetitors(comp);
      setCompMetrics(cm);
      setInsights(ins);
      setNotifications(notifs);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [dateRange]);

  // Aggregate daily series
  const dailySeries = useMemo(() => {
    const map = new Map<string, { date: string; reach: number; impressions: number; engagement: number; followers: number }>();
    for (const m of metrics) {
      const prev = map.get(m.date) ?? { date: m.date, reach: 0, impressions: 0, engagement: 0, followers: 0 };
      map.set(m.date, {
        date: m.date,
        reach: prev.reach + m.reach,
        impressions: prev.impressions + m.impressions,
        engagement: prev.engagement + m.engagement,
        followers: prev.followers + m.followers,
      });
    }
    const arr = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
    return arr.map((row, idx) => {
      const engRate = row.reach > 0 ? Number(((row.engagement / row.reach) * 100).toFixed(2)) : 0;
      const windowSlice = arr.slice(Math.max(0, idx - 6), idx + 1);
      const ma =
        windowSlice.reduce((s, r) => s + (r.reach > 0 ? (r.engagement / r.reach) * 100 : 0), 0) /
        Math.max(1, windowSlice.length);
      return {
        ...row,
        label: row.date.slice(5),
        engRate,
        movingAvg: Number(ma.toFixed(2)),
      };
    });
  }, [metrics]);

  // Compute KPIs + half-period delta
  const kpis = useMemo(() => {
    const mid = Math.max(1, Math.floor(dailySeries.length / 2));
    const first = dailySeries.slice(0, mid);
    const second = dailySeries.slice(mid);

    const sum = (arr: typeof dailySeries, key: 'reach' | 'impressions' | 'engagement') =>
      arr.reduce((s, d) => s + d[key], 0);

    const totalReach = sum(dailySeries, 'reach');
    const totalImpressions = sum(dailySeries, 'impressions');
    const totalEng = sum(dailySeries, 'engagement');
    const engRate = totalReach > 0 ? (totalEng / totalReach) * 100 : 0;

    const firstReach = sum(first, 'reach') || 1;
    const secondReach = sum(second, 'reach');
    const reachDelta = ((secondReach - firstReach) / firstReach) * 100;

    const firstImp = sum(first, 'impressions') || 1;
    const secondImp = sum(second, 'impressions');
    const impDelta = ((secondImp - firstImp) / firstImp) * 100;

    const firstEngRate = (sum(first, 'engagement') / firstReach) * 100 || 1;
    const secondEngRate = secondReach > 0 ? (sum(second, 'engagement') / secondReach) * 100 : 0;
    const engDelta = secondEngRate - firstEngRate;

    const startFollowers = dailySeries[0]?.followers ?? 0;
    const endFollowers = dailySeries[dailySeries.length - 1]?.followers ?? 0;
    const followerGrowth = Math.max(0, endFollowers - startFollowers);
    const followerDelta = startFollowers > 0 ? (followerGrowth / startFollowers) * 100 : 0;

    return [
      {
        label: 'Total Reach',
        value: formatNumber(totalReach),
        delta: reachDelta,
        spark: dailySeries.map((d) => ({ v: d.reach })),
        color: CHART_THEME.brand,
      },
      {
        label: 'Engagement Rate',
        value: `${engRate.toFixed(2)}%`,
        delta: engDelta,
        spark: dailySeries.map((d) => ({ v: d.engRate })),
        color: CHART_THEME.accent,
      },
      {
        label: 'Total Impressions',
        value: formatNumber(totalImpressions),
        delta: impDelta,
        spark: dailySeries.map((d) => ({ v: d.impressions })),
        color: CHART_THEME.info,
      },
      {
        label: 'Follower Growth',
        value: `+${formatNumber(followerGrowth)}`,
        delta: followerDelta,
        spark: dailySeries.map((d) => ({ v: d.followers })),
        color: CHART_THEME.success,
      },
    ];
  }, [dailySeries]);

  // Platform mix donut data
  const platformMix = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of metrics) {
      map.set(m.platform, (map.get(m.platform) ?? 0) + m.reach);
    }
    return Array.from(map.entries()).map(([platform, value]) => ({
      name: PLATFORM_LABELS[platform] ?? platform,
      key: platform,
      value,
      color: PLATFORM_COLORS[platform] ?? '#4B5563',
    }));
  }, [metrics]);

  // Campaign performance bar data
  const campaignBarData = useMemo(() => {
    return campaigns
      .filter((c) => c.impressions > 0)
      .filter((c) => !globalSearch || c.name.toLowerCase().includes(globalSearch.toLowerCase()))
      .slice(0, 5)
      .map((c) => ({
        name: c.name.length > 18 ? `${c.name.slice(0, 18)}…` : c.name,
        current: c.clicks,
        previous: Math.round(c.clicks * 0.82),
      }));
  }, [campaigns, globalSearch]);

  // Competitor comparison table rows (including "You")
  const competitorRows = useMemo(() => {
    const myReach = dailySeries.reduce((s, d) => s + d.reach, 0);
    const myEng = dailySeries.reduce((s, d) => s + d.engagement, 0);
    const myFollowers = dailySeries[dailySeries.length - 1]?.followers ?? 41400;

    const rows = [
      {
        id: 'you',
        name: 'Deccan Urban Retail (You)',
        handle: '@deccanurbanretail',
        isYou: true,
        reach: myReach,
        engRate: myReach > 0 ? Number(((myEng / myReach) * 100).toFixed(2)) : 0,
        followers: myFollowers,
      },
      ...competitors.map((comp) => {
        const cm = compMetrics.filter((x) => x.competitorId === comp.id);
        const reach = cm.reduce((s, d) => s + d.reach, 0);
        const eng = cm.reduce((s, d) => s + d.engagement, 0);
        const followers = cm[cm.length - 1]?.followers ?? 15000;
        return {
          id: comp.id,
          name: comp.name,
          handle: comp.handle,
          isYou: false,
          reach,
          engRate: reach > 0 ? Number(((eng / reach) * 100).toFixed(2)) : 0,
          followers,
        };
      }),
    ].filter((r) => !globalSearch || r.name.toLowerCase().includes(globalSearch.toLowerCase()));

    rows.sort((a, b) => (sortDesc ? b[sortCol] - a[sortCol] : a[sortCol] - b[sortCol]));
    return rows;
  }, [dailySeries, competitors, compMetrics, sortCol, sortDesc, globalSearch]);

  const maxCompReach = Math.max(1, ...competitorRows.map((r) => r.reach));

  const toggleSort = (col: 'reach' | 'engRate' | 'followers') => {
    if (sortCol === col) setSortDesc((v) => !v);
    else {
      setSortCol(col);
      setSortDesc(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F1115]">Overview</h1>
            <p className="text-sm text-[#4B5563] mt-0.5">
              Multi-platform social performance for the last {dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '90 days'}.
            </p>
          </div>
          <DemoBadge />
        </div>

        {/* 1. Four KPI Cards with Inline Sparklines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
            : kpis.map((kpi) => {
                const positive = kpi.delta >= 0;
                return (
                  <Card key={kpi.label} className="p-5 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-[#4B5563]">{kpi.label}</p>
                        <p className="text-2xl font-extrabold text-[#0F1115] tabular-nums mt-1">
                          {kpi.value}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${
                          positive ? 'text-[#16A34A]' : 'text-[#DC2626]'
                        }`}
                      >
                        {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {formatPercent(kpi.delta)}
                      </span>
                    </div>
                    <div className="h-10 w-full mt-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={kpi.spark}>
                          <Line
                            type="monotone"
                            dataKey="v"
                            stroke={kpi.color}
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                );
              })}
        </div>

        {/* 2 & 3. Reach & Impressions Area Chart + Engagement Rate Line Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <ChartCard
            title="Reach & Impressions"
            subtitle="Dual-series daily volume across all tracked channels"
            className="xl:col-span-7"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySeries} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ovReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_THEME.brand} stopOpacity={0.22} />
                      <stop offset="95%" stopColor={CHART_THEME.brand} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ovImp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_THEME.accent} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={CHART_THEME.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CHART_THEME.tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="impressions" name="Impressions" stroke={CHART_THEME.accent} strokeWidth={2} fill="url(#ovImp)" />
                  <Area type="monotone" dataKey="reach" name="Reach" stroke={CHART_THEME.brand} strokeWidth={2.5} fill="url(#ovReach)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Engagement Rate Trend"
            subtitle="Daily engagement % with 7-day moving average"
            className="xl:col-span-5"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailySeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={CHART_THEME.tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="engRate" name="Daily %" stroke={CHART_THEME.accent} strokeWidth={1.75} dot={false} />
                  <Line type="monotone" dataKey="movingAvg" name="7d Moving Avg" stroke={CHART_THEME.brand} strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* 4 & 5. Platform Mix Donut + Campaign Performance Bar */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <ChartCard
            title="Platform Mix"
            subtitle="Share of total reach by social channel"
            className="xl:col-span-5"
          >
            <div className="h-64 w-full flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-1/2 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformMix}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={2}
                    >
                      {platformMix.map((entry) => (
                        <Cell key={entry.key} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CHART_THEME.tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full sm:w-1/2 space-y-2.5">
                {platformMix.map((p) => (
                  <div key={p.key} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-[#0F1115] font-medium">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </span>
                    <span className="font-mono font-semibold text-[#4B5563] tabular-nums">
                      {formatNumber(p.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Campaign Performance"
            subtitle="Clicks — current period vs. previous period"
            className="xl:col-span-7"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignBarData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CHART_THEME.tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="current" name="Current Period" fill={CHART_THEME.brand} radius={[5, 5, 0, 0]} />
                  <Bar dataKey="previous" name="Previous Period" fill="#D1D5DB" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* 6. Competitor Comparison Sortable Table */}
        <Card className="overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#EEF0F4] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0F1115]">Competitor Comparison</h2>
              <p className="text-xs text-[#4B5563] mt-0.5">Click column headers to sort · Your workspace highlighted</p>
            </div>
            <Link to="/dashboard/competitors" className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1">
              Full analysis <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left tabular-nums">
              <thead className="bg-[#F8F9FB] text-xs text-[#4B5563] border-b border-[#EEF0F4]">
                <tr>
                  <th className="py-3 px-5 font-semibold sticky left-0 bg-[#F8F9FB]">Account</th>
                  <th className="py-3 px-5 font-semibold">
                    <button type="button" onClick={() => toggleSort('reach')} className="inline-flex items-center gap-1 hover:text-[#0F1115]">
                      Reach <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-5 font-semibold">
                    <button type="button" onClick={() => toggleSort('engRate')} className="inline-flex items-center gap-1 hover:text-[#0F1115]">
                      Eng. Rate <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-5 font-semibold text-right">
                    <button type="button" onClick={() => toggleSort('followers')} className="inline-flex items-center gap-1 hover:text-[#0F1115]">
                      Followers <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF0F4]">
                {competitorRows.map((row) => (
                  <tr
                    key={row.id}
                    className={row.isYou ? 'bg-[#FEF2F2] font-semibold' : 'hover:bg-[#F8F9FB]/60'}
                  >
                    <td className={`py-3.5 px-5 sticky left-0 ${row.isYou ? 'bg-[#FEF2F2] text-[#E11D2E]' : 'bg-white text-[#0F1115]'}`}>
                      <div>{row.name}</div>
                      <div className="text-xs text-[#4B5563] font-normal">{row.handle}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <span className="w-16 font-mono text-xs">{formatNumber(row.reach)}</span>
                        <div className="w-24 h-2 rounded-full bg-[#EEF0F4] overflow-hidden hidden sm:block">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.round((row.reach / maxCompReach) * 100)}%`,
                              backgroundColor: row.isYou ? '#E11D2E' : '#FF7A1A',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs">{row.engRate}%</td>
                    <td className="py-3.5 px-5 text-right font-mono text-xs">{formatNumber(row.followers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 7 & 8. AI Insights Top 3 + Recent Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E11D2E]" />
                <h2 className="text-base font-bold text-[#0F1115]">Top AI Insights</h2>
              </div>
              <Link to="/dashboard/insights" className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {insights.slice(0, 3).map((ins) => (
                <div key={ins.id} className="p-4 rounded-xl bg-[#F8F9FB] border border-[#EEF0F4] space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#4B5563]">
                      {ins.category} · {ins.severity.toUpperCase()} priority
                    </span>
                    <span className="text-[#4B5563]">
                      {ins.generatedBy === 'llm' ? 'Generated by AI' : 'Rule-based analysis (demo)'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#0F1115]">{ins.title}</p>
                  <p className="text-xs text-[#4B5563]">{ins.recommendation}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-5 p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0F1115]">Recent Activity & Alerts</h2>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="pb-3 border-b border-[#EEF0F4] last:border-0 last:pb-0">
                  <p className="text-xs font-semibold text-[#0F1115]">{n.title}</p>
                  <p className="text-xs text-[#4B5563] mt-0.5">{n.body}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

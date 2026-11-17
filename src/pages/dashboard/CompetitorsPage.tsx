import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Plus, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ChartCard, CHART_THEME } from '../../components/charts/ChartCard';
import { Button, Card, DemoBadge, Input, Modal, Select, Textarea } from '../../components/ui/Primitives';
import { useApp } from '../../context/AppContext';
import { dataProvider } from '../../lib/data/provider';
import type { Competitor, CompetitorMetric, Platform } from '../../lib/data/types';
import { formatNumber, PLATFORM_LABELS } from '../../lib/utils';

export function CompetitorsPage() {
  const { dateRange, toast } = useApp();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [metrics, setMetrics] = useState<CompetitorMetric[]>([]);
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Add form state
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [notes, setNotes] = useState('');

  const load = async () => {
    const [c, m] = await Promise.all([
      dataProvider.getCompetitors(),
      dataProvider.getCompetitorMetrics(dateRange),
    ]);
    setCompetitors(c);
    setMetrics(m);
  };

  useEffect(() => {
    load();
  }, [dateRange]);

  const filteredCompetitors = useMemo(
    () => competitors.filter((c) => platformFilter === 'all' || c.platform === platformFilter),
    [competitors, platformFilter]
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handle.trim()) return;
    await dataProvider.addCompetitor({ name: name.trim(), handle: handle.trim(), platform, notes });
    setName('');
    setHandle('');
    setNotes('');
    setModalOpen(false);
    await load();
    toast({ title: 'Competitor added', description: `${name} is now tracked in your workspace.`, variant: 'success' });
  };

  const handleRemove = async (id: string, compName: string) => {
    await dataProvider.removeCompetitor(id);
    await load();
    toast({ title: 'Competitor removed', description: `${compName} removed from tracking.` });
  };

  // Engagement bar chart data
  const engBarData = useMemo(() => {
    return filteredCompetitors.map((c) => {
      const cm = metrics.filter((m) => m.competitorId === c.id);
      const reach = cm.reduce((s, d) => s + d.reach, 0);
      const eng = cm.reduce((s, d) => s + d.engagement, 0);
      return {
        name: c.name,
        engRate: reach > 0 ? Number(((eng / reach) * 100).toFixed(2)) : 0,
        reach,
      };
    });
  }, [filteredCompetitors, metrics]);

  // Multi-series follower growth line chart
  const followerSeries = useMemo(() => {
    const dates = Array.from(new Set(metrics.map((m) => m.date))).sort();
    return dates.map((date) => {
      const row: Record<string, string | number> = { date: date.slice(5) };
      for (const c of filteredCompetitors) {
        const pt = metrics.find((m) => m.competitorId === c.id && m.date === date);
        row[c.name] = pt?.followers ?? 0;
      }
      return row;
    });
  }, [filteredCompetitors, metrics]);

  // 5-dimension Radar data
  const radarData = useMemo(() => {
    const dims: { key: keyof Competitor['scores']; label: string }[] = [
      { key: 'reach', label: 'Reach' },
      { key: 'engagement', label: 'Engagement' },
      { key: 'consistency', label: 'Consistency' },
      { key: 'contentQuality', label: 'Content' },
      { key: 'audienceGrowth', label: 'Growth' },
    ];
    return dims.map((d) => {
      const row: Record<string, string | number> = { dimension: d.label, You: 80 };
      filteredCompetitors.slice(0, 2).forEach((c) => {
        row[c.name] = c.scores[d.key];
      });
      return row;
    });
  }, [filteredCompetitors]);

  const LINE_COLORS = ['#E11D2E', '#FF7A1A', '#2563EB', '#16A34A'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F1115]">Competitor Analysis</h1>
            <p className="text-sm text-[#4B5563] mt-0.5">
              Benchmark regional competitors across reach, engagement, and audience growth.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              aria-label="Filter competitors by platform"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as Platform | 'all')}
              className="w-40 h-9"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X (Twitter)</option>
            </Select>
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Competitor
            </Button>
          </div>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCompetitors.map((c) => (
            <Card key={c.id} className="p-5 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-[#0F1115]">{c.name}</h2>
                    <p className="text-xs text-[#4B5563]">
                      {c.handle} · {PLATFORM_LABELS[c.platform]}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(c.id, c.name)}
                    className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                    aria-label={`Remove ${c.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#4B5563] mt-2">{c.notes}</p>
              </div>
              <div className="pt-3 border-t border-[#EEF0F4] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#4B5563] block">Strength</span>
                  <span className="font-medium text-[#0F1115]">{c.strengths[0]}</span>
                </div>
                <div>
                  <span className="text-[#4B5563] block">Gap</span>
                  <span className="font-medium text-[#0F1115]">{c.weaknesses[0]}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <ChartCard title="Engagement Rate Comparison" subtitle="Average engagement % in selected window" className="xl:col-span-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engBarData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={CHART_THEME.tooltipStyle} />
                  <Bar dataKey="engRate" name="Engagement Rate %" fill={CHART_THEME.brand} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="5-Dimension Benchmark Radar" subtitle="You vs. top tracked competitors" className="xl:col-span-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={CHART_THEME.grid} />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#4B5563' }} />
                  <Tooltip contentStyle={CHART_THEME.tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Radar name="You" dataKey="You" stroke="#E11D2E" fill="#E11D2E" fillOpacity={0.2} />
                  {filteredCompetitors.slice(0, 2).map((c, idx) => (
                    <Radar
                      key={c.id}
                      name={c.name}
                      dataKey={c.name}
                      stroke={idx === 0 ? '#FF7A1A' : '#2563EB'}
                      fill={idx === 0 ? '#FF7A1A' : '#2563EB'}
                      fillOpacity={0.12}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Follower Growth Line Chart */}
        <ChartCard title="Follower Growth Trajectory" subtitle={`Multi-series follower count over last ${dateRange}`}>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={followerSeries} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                <Tooltip contentStyle={CHART_THEME.tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                {filteredCompetitors.map((c, idx) => (
                  <Line
                    key={c.id}
                    type="monotone"
                    dataKey={c.name}
                    stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Add Competitor Modal */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Track New Competitor"
          description="Add a local or regional competitor to benchmark against your workspace."
        >
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="comp-name" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                Competitor Name *
              </label>
              <Input id="comp-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Banjara Boutique" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="comp-handle" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Handle *
                </label>
                <Input id="comp-handle" required value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@banjaraboutique" />
              </div>
              <div>
                <label htmlFor="comp-platform" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Primary Platform
                </label>
                <Select id="comp-platform" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X (Twitter)</option>
                </Select>
              </div>
            </div>
            <div>
              <label htmlFor="comp-notes" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                Notes
              </label>
              <Textarea id="comp-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Key strengths or campaign focus..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Competitor</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

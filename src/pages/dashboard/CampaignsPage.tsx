import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowLeft, Eye, Pause, Play, Plus, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ChartCard, CHART_THEME } from '../../components/charts/ChartCard';
import { Button, Card, DemoBadge, Input, Modal, Select } from '../../components/ui/Primitives';
import { useApp } from '../../context/AppContext';
import { dataProvider } from '../../lib/data/provider';
import type { Campaign, CampaignStatus, Platform } from '../../lib/data/types';
import { formatINR } from '../../data/ventureData';
import { formatNumber, PLATFORM_LABELS } from '../../lib/utils';

export function CampaignsPage() {
  const { globalSearch, toast } = useApp();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // New campaign form
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [objective, setObjective] = useState('Store Visits & Conversions');
  const [startDate, setStartDate] = useState('2026-11-18');
  const [endDate, setEndDate] = useState('2026-12-18');
  const [budget, setBudget] = useState('25000');

  const load = async () => {
    const list = await dataProvider.getCampaigns();
    setCampaigns(list);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = campaigns.filter(
    (c) =>
      (statusFilter === 'all' || c.status === statusFilter) &&
      (!globalSearch || c.name.toLowerCase().includes(globalSearch.toLowerCase()))
  );

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await dataProvider.createCampaign({
      name: name.trim(),
      platform,
      objective,
      startDate,
      endDate,
      budget: Number(budget) || 10000,
    });
    setName('');
    setModalOpen(false);
    await load();
    toast({ title: 'Campaign created', description: `${name} is now active.`, variant: 'success' });
  };

  const handleTogglePause = async (c: Campaign) => {
    const next: CampaignStatus = c.status === 'active' ? 'paused' : 'active';
    await dataProvider.updateCampaignStatus(c.id, next);
    await load();
    toast({ title: `Campaign ${next}`, description: `${c.name} status updated to ${next}.` });
  };

  const handleDelete = async (c: Campaign) => {
    await dataProvider.deleteCampaign(c.id);
    await load();
    toast({ title: 'Campaign deleted', description: `${c.name} was removed.` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F1115]">Campaigns</h1>
            <p className="text-sm text-[#4B5563] mt-0.5">
              Monitor budget pacing, conversion efficiency, and campaign status across platforms.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DemoBadge />
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5">
            <p className="text-xs text-[#4B5563]">Total Allocated Budget</p>
            <p className="text-2xl font-extrabold text-[#0F1115] tabular-nums mt-1">{formatINR(totalBudget)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-[#4B5563]">Total Spend to Date</p>
            <p className="text-2xl font-extrabold text-[#0F1115] tabular-nums mt-1">{formatINR(totalSpend)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-[#4B5563]">Total Conversions</p>
            <p className="text-2xl font-extrabold text-[#16A34A] tabular-nums mt-1">{formatNumber(totalConversions)}</p>
          </Card>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['all', 'active', 'paused', 'completed', 'draft'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#0F1115] text-white'
                  : 'bg-white border border-[#EEF0F4] text-[#4B5563] hover:text-[#0F1115]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Campaigns Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left tabular-nums">
              <thead className="bg-[#F8F9FB] text-xs text-[#4B5563] border-b border-[#EEF0F4]">
                <tr>
                  <th className="py-3 px-5 font-semibold sticky left-0 bg-[#F8F9FB]">Campaign</th>
                  <th className="py-3 px-5 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold">Budget / Spend</th>
                  <th className="py-3 px-5 font-semibold text-right">Clicks</th>
                  <th className="py-3 px-5 font-semibold text-right">Conversions</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF0F4]">
                {filtered.map((c) => {
                  const pct = c.budget > 0 ? Math.min(100, Math.round((c.spend / c.budget) * 100)) : 0;
                  return (
                    <tr key={c.id} className="hover:bg-[#F8F9FB]/60">
                      <td className="py-3.5 px-5 sticky left-0 bg-white">
                        <Link to={`/dashboard/campaigns/${c.id}`} className="font-semibold text-[#0F1115] hover:text-[#E11D2E]">
                          {c.name}
                        </Link>
                        <div className="text-xs text-[#4B5563]">
                          {PLATFORM_LABELS[c.platform]} · {c.objective}
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`text-xs font-semibold capitalize ${
                            c.status === 'active'
                              ? 'text-[#16A34A]'
                              : c.status === 'paused'
                              ? 'text-[#F59E0B]'
                              : 'text-[#4B5563]'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="text-xs font-mono">
                          {formatINR(c.spend)} / {formatINR(c.budget)}
                        </div>
                        <div className="w-28 h-1.5 rounded-full bg-[#EEF0F4] mt-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: c.isUnderperforming ? '#DC2626' : '#E11D2E',
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono text-xs">{formatNumber(c.clicks)}</td>
                      <td className="py-3.5 px-5 text-right font-mono text-xs">{formatNumber(c.conversions)}</td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            to={`/dashboard/campaigns/${c.id}`}
                            className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#0F1115] hover:bg-[#EEF0F4]"
                            aria-label={`View ${c.name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {(c.status === 'active' || c.status === 'paused') && (
                            <button
                              type="button"
                              onClick={() => handleTogglePause(c)}
                              className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#0F1115] hover:bg-[#EEF0F4]"
                              aria-label={c.status === 'active' ? `Pause ${c.name}` : `Resume ${c.name}`}
                            >
                              {c.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(c)}
                            className="p-1.5 rounded-lg text-[#4B5563] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                            aria-label={`Delete ${c.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* New Campaign Modal */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Create New Campaign"
          description="Launch a tracked campaign in your workspace."
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="camp-name" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                Campaign Name *
              </label>
              <Input id="camp-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="New Year Store Promo" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="camp-plat" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Platform
                </label>
                <Select id="camp-plat" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                  <option value="x">X (Twitter)</option>
                  <option value="tiktok">TikTok</option>
                </Select>
              </div>
              <div>
                <label htmlFor="camp-budget" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Budget (INR) *
                </label>
                <Input id="camp-budget" type="number" min={1000} required value={budget} onChange={(e) => setBudget(e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="camp-obj" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                Objective
              </label>
              <Input id="camp-obj" value={objective} onChange={(e) => setObjective(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="camp-start" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Start Date
                </label>
                <Input id="camp-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="camp-end" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  End Date
                </label>
                <Input id="camp-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Campaign</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useApp();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (!id) return;
    dataProvider.getCampaignById(id).then((c) => setCampaign(c ?? null));
  }, [id]);

  if (!campaign) {
    return (
      <DashboardLayout>
        <Card className="p-8 text-center space-y-3">
          <p className="text-base font-bold text-[#0F1115]">Campaign not found</p>
          <Button variant="outline" onClick={() => navigate('/dashboard/campaigns')}>
            Back to Campaigns
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const funnelData = [
    { stage: 'Impressions', count: campaign.impressions },
    { stage: 'Engagement', count: campaign.engagement },
    { stage: 'Clicks', count: campaign.clicks },
    { stage: 'Conversions', count: campaign.conversions },
  ];

  const handleStatusChange = async (status: CampaignStatus) => {
    const updated = await dataProvider.updateCampaignStatus(campaign.id, status);
    setCampaign(updated);
    toast({ title: 'Status updated', description: `Campaign is now ${status}.`, variant: 'success' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <Link to="/dashboard/campaigns" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#0F1115]">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Campaigns
            </Link>
            <h1 className="text-2xl font-extrabold text-[#0F1115]">{campaign.name}</h1>
            <p className="text-xs text-[#4B5563]">
              {PLATFORM_LABELS[campaign.platform]} · {campaign.objective} · {campaign.startDate} to {campaign.endDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              aria-label="Campaign status"
              value={campaign.status}
              onChange={(e) => handleStatusChange(e.target.value as CampaignStatus)}
              className="w-36 h-9"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <p className="text-xs text-[#4B5563]">Spend / Budget</p>
            <p className="text-xl font-extrabold text-[#0F1115] tabular-nums mt-1">
              {formatINR(campaign.spend)} / {formatINR(campaign.budget)}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-[#4B5563]">Impressions</p>
            <p className="text-xl font-extrabold text-[#0F1115] tabular-nums mt-1">{formatNumber(campaign.impressions)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-[#4B5563]">Clicks</p>
            <p className="text-xl font-extrabold text-[#0F1115] tabular-nums mt-1">{formatNumber(campaign.clicks)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-[#4B5563]">Conversions</p>
            <p className="text-xl font-extrabold text-[#16A34A] tabular-nums mt-1">{formatNumber(campaign.conversions)}</p>
          </Card>
        </div>

        <ChartCard title="Conversion Funnel" subtitle="Impressions → Engagement → Clicks → Conversions">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 8, right: 24, left: 24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: '#0F1115' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_THEME.tooltipStyle} />
                <Bar dataKey="count" name="Volume" fill={CHART_THEME.brand} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}

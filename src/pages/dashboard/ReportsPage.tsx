import React, { useEffect, useState } from 'react';
import { FileText, Plus, Printer } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button, Card, DemoBadge, Input } from '../../components/ui/Primitives';
import { useApp } from '../../context/AppContext';
import { dataProvider } from '../../lib/data/provider';
import type { WorkspaceReport } from '../../lib/data/types';
import { formatNumber, PLATFORM_LABELS } from '../../lib/utils';

export function ReportsPage() {
  const { toast } = useApp();
  const [reports, setReports] = useState<WorkspaceReport[]>([]);
  const [selected, setSelected] = useState<WorkspaceReport | null>(null);
  const [periodStart, setPeriodStart] = useState('2026-10-18');
  const [periodEnd, setPeriodEnd] = useState('2026-11-17');
  const [title, setTitle] = useState('');

  const load = async () => {
    const list = await dataProvider.getReports();
    setReports(list);
    if (list.length > 0 && !selected) setSelected(list[0]);
  };

  useEffect(() => {
    load();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const rep = await dataProvider.generateReport(periodStart, periodEnd, title);
    setTitle('');
    const list = await dataProvider.getReports();
    setReports(list);
    setSelected(rep);
    toast({ title: 'Report generated', description: `${rep.title} is ready to view or print.`, variant: 'success' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 no-print">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F1115]">Reports</h1>
            <p className="text-sm text-[#4B5563] mt-0.5">
              Generate structured summaries from workspace metrics and export print-optimized PDFs.
            </p>
          </div>
          <DemoBadge />
        </div>

        {/* Generate Form */}
        <Card className="p-5 no-print">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <label htmlFor="rep-title" className="block text-xs font-semibold text-[#0F1115] mb-1">
                Report Title (optional)
              </label>
              <Input id="rep-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="November Executive Summary" />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="rep-start" className="block text-xs font-semibold text-[#0F1115] mb-1">
                Period Start
              </label>
              <Input id="rep-start" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} required />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="rep-end" className="block text-xs font-semibold text-[#0F1115] mb-1">
                Period End
              </label>
              <Input id="rep-end" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4" />
                Generate
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Report List */}
          <div className="lg:col-span-4 space-y-2.5 no-print">
            {reports.map((rep) => (
              <button
                key={rep.id}
                type="button"
                onClick={() => setSelected(rep)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selected?.id === rep.id
                    ? 'bg-white border-[#E11D2E] shadow-sm'
                    : 'bg-white border-[#EEF0F4] hover:bg-[#F8F9FB]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-[#E11D2E] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#0F1115] truncate">{rep.title}</p>
                    <p className="text-xs text-[#4B5563] mt-0.5">
                      {rep.periodStart} → {rep.periodEnd}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Print-Optimized Report Detail */}
          <div className="lg:col-span-8">
            {selected ? (
              <Card className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#EEF0F4]">
                  <div>
                    <p className="text-xs font-semibold text-[#4B5563]">
                      MarketPulse Performance Report · Demo Data
                    </p>
                    <h2 className="text-xl font-extrabold text-[#0F1115] mt-1">{selected.title}</h2>
                    <p className="text-xs text-[#4B5563] mt-1">
                      Period: {selected.periodStart} to {selected.periodEnd}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.print()} className="no-print">
                    <Printer className="w-4 h-4" />
                    Print / Save PDF
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
                  <div className="p-3.5 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4]">
                    <p className="text-xs text-[#4B5563]">Total Reach</p>
                    <p className="text-lg font-extrabold text-[#0F1115] mt-0.5">
                      {formatNumber(selected.payload.totalReach)}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4]">
                    <p className="text-xs text-[#4B5563]">Impressions</p>
                    <p className="text-lg font-extrabold text-[#0F1115] mt-0.5">
                      {formatNumber(selected.payload.totalImpressions)}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4]">
                    <p className="text-xs text-[#4B5563]">Avg. Engagement</p>
                    <p className="text-lg font-extrabold text-[#0F1115] mt-0.5">
                      {selected.payload.avgEngagementRate}%
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#F8F9FB] border border-[#EEF0F4]">
                    <p className="text-xs text-[#4B5563]">Top Platform</p>
                    <p className="text-lg font-extrabold text-[#E11D2E] mt-0.5">
                      {PLATFORM_LABELS[selected.payload.topPlatform]}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#0F1115]">Executive Summary</h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">{selected.payload.executiveSummary}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#0F1115]">Key Highlights</h3>
                  <ul className="space-y-1.5 text-sm text-[#4B5563]">
                    {selected.payload.keyHighlights.map((h) => (
                      <li key={h}>• {h}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center text-sm text-[#4B5563]">
                Select or generate a report to view details.
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

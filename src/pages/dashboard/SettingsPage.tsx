import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button, Card, Input, Modal } from '../../components/ui/Primitives';
import { useApp } from '../../context/AppContext';
import { dataProvider } from '../../lib/data/provider';
import type { NotificationPreferences } from '../../lib/data/types';

export function SettingsPage() {
  const { user, refreshProfile, logout, toast } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [companyName, setCompanyName] = useState(user?.companyName ?? '');
  const [industry, setIndustry] = useState(user?.industry ?? '');
  const [workspaceName, setWorkspaceName] = useState('');
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    weeklyDigest: true,
    campaignAlerts: true,
    competitorSpikes: true,
    aiInsightReady: true,
  });
  const [newPassword, setNewPassword] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setCompanyName(user.companyName);
      setIndustry(user.industry);
    }
    dataProvider.getWorkspace().then((w) => setWorkspaceName(w.name));
    dataProvider.getNotificationPreferences().then(setPrefs);
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataProvider.updateProfile({ fullName, companyName, industry });
    await dataProvider.updateWorkspace({ name: workspaceName, industry });
    await refreshProfile();
    toast({ title: 'Settings saved', description: 'Profile and workspace updated.', variant: 'success' });
  };

  const handleTogglePref = async (key: keyof NotificationPreferences) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    await dataProvider.updateNotificationPreferences(next);
    toast({ title: 'Preferences updated' });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({ title: 'Password too short', description: 'Minimum 8 characters required.', variant: 'error' });
      return;
    }
    setNewPassword('');
    toast({ title: 'Password updated', description: 'Your password has been changed (demo mode).', variant: 'success' });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm !== 'DELETE') return;
    window.localStorage.removeItem('marketpulse_demo_state_v1');
    logout();
    navigate('/');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F1115]">Settings</h1>
          <p className="text-sm text-[#4B5563] mt-0.5">
            Manage your profile, workspace details, and notification preferences.
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-base font-bold text-[#0F1115] mb-4">Profile & Workspace</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="set-name" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Full Name
                </label>
                <Input id="set-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="set-company" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Company Name
                </label>
                <Input id="set-company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="set-ws" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Workspace Name
                </label>
                <Input id="set-ws" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="set-ind" className="block text-xs font-semibold text-[#0F1115] mb-1.5">
                  Industry
                </label>
                <Input id="set-ind" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
              </div>
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-bold text-[#0F1115] mb-4">Notification Preferences</h2>
          <div className="space-y-3">
            {(
              [
                ['weeklyDigest', 'Weekly performance summary digest'],
                ['campaignAlerts', 'Campaign budget & CPA threshold alerts'],
                ['competitorSpikes', 'Competitor reach spike notifications'],
                ['aiInsightReady', 'New AI insight recommendations'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between py-2 border-b border-[#EEF0F4] last:border-0 cursor-pointer">
                <span className="text-sm text-[#0F1115]">{label}</span>
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={() => handleTogglePref(key)}
                  className="w-4 h-4 accent-[#E11D2E]"
                />
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-bold text-[#0F1115] mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 chars)"
              aria-label="New password"
            />
            <Button type="submit" variant="outline">
              Update Password
            </Button>
          </form>
        </Card>

        <Card className="p-6 border-[#FECACA]">
          <h2 className="text-base font-bold text-[#DC2626]">Danger Zone</h2>
          <p className="text-xs text-[#4B5563] mt-1">
            Resetting or deleting your demo account clears all local workspace customizations and signs you out.
          </p>
          <Button variant="danger" size="sm" className="mt-4" onClick={() => setDeleteOpen(true)}>
            Delete Account & Reset Demo
          </Button>
        </Card>

        <Modal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          title="Confirm Account Deletion"
          description='Type "DELETE" below to confirm resetting your demo workspace.'
        >
          <div className="space-y-4">
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              aria-label="Type DELETE to confirm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" disabled={deleteConfirm !== 'DELETE'} onClick={handleDeleteAccount}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

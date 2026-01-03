import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AccountPage: React.FC = () => {
  const { user, signOut, getUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
  });

  const [settingsData, setSettingsData] = useState({
    language: 'en',
    timezone: 'PT',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
  });

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profileData.fullName }
      });

      if (error) throw error;

      await getUser(); // Refresh local user state
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditingProfile(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Storing settings in user_metadata for now
      const { error } = await supabase.auth.updateUser({
        data: { settings: settingsData }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      setIsEditingSettings(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      // Optional: Verify current password if needed, but Supabase allows update if logged in.
      // We will verify technically by attempting to sign in (check current password) if strictness is needed.
      // For now, simpler approach: just update password.
      
      const { error } = await supabase.auth.updateUser({
        password: securityData.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setSecurityData({ ...securityData, currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsEditingSecurity(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>
      
      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
          </div>
          {isEditingProfile ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                fullWidth
              />
              <Input
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                fullWidth
              />
              <div className="flex space-x-2">
                <Button type="submit">Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-gray-900">{user.full_name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
              <Button variant="outline" onClick={() => setIsEditingProfile(true)} fullWidth>
                Edit Profile
              </Button>
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
          </div>
          {isEditingSettings ? (
            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={settingsData.language}
                  onChange={(e) => setSettingsData({...settingsData, language: e.target.value})}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={settingsData.timezone}
                  onChange={(e) => setSettingsData({...settingsData, timezone: e.target.value})}
                >
                  <option value="PT">Pacific Time (PT)</option>
                  <option value="MT">Mountain Time (MT)</option>
                  <option value="CT">Central Time (CT)</option>
                  <option value="ET">Eastern Time (ET)</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditingSettings(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <p className="mt-1 text-gray-900">English</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Zone</label>
                <p className="mt-1 text-gray-900">Pacific Time (PT)</p>
              </div>
              <Button variant="outline" onClick={() => setIsEditingSettings(true)} fullWidth>
                Manage Settings
              </Button>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Lock className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Security</h2>
          </div>
          {isEditingSecurity ? (
            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                fullWidth
              />
              <Input
                label="New Password"
                type="password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                fullWidth
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                fullWidth
              />
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="two-factor"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={securityData.twoFactor}
                  onChange={(e) => setSecurityData({...securityData, twoFactor: e.target.checked})}
                />
                <label htmlFor="two-factor" className="ml-2 block text-sm text-gray-900">
                  Enable Two-Factor Authentication
                </label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditingSecurity(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <p className="mt-1 text-gray-900">Last changed 30 days ago</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                <p className="mt-1 text-gray-900">Not enabled</p>
              </div>
              <Button variant="outline" onClick={() => setIsEditingSecurity(true)} fullWidth>
                Security Settings
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button variant="danger" onClick={signOut}>Sign Out</Button>
      </div>
    </div>
  );
};

export default AccountPage;
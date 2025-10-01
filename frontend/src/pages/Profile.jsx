import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: data.name ?? '',
          email: data.email ?? '',
          university: data.university ?? '',
          address: data.address ?? '',
        });
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF1] dark:bg-slate-900 py-10 px-4">
      <div className="max-w-md mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md rounded-xl p-6"
        >
          <h1 className="mb-6 text-center text-[#8CB369] text-5xl font-['Satisfy']">
            Your Profile
          </h1>

          {loading ? (
            <div className="space-y-4">
              <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
          ) : (
            <>
              <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mb-4 p-2 rounded border
                           bg-white dark:bg-slate-800
                           border-slate-300 dark:border-slate-600
                           text-slate-900 dark:text-white
                           placeholder-slate-500 dark:placeholder-slate-400"
              />

              <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mb-4 p-2 rounded border
                           bg-white dark:bg-slate-800
                           border-slate-300 dark:border-slate-600
                           text-slate-900 dark:text-white
                           placeholder-slate-500 dark:placeholder-slate-400"
              />

              <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
                University
              </label>
              <input
                type="text"
                placeholder="e.g., QUT"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full mb-4 p-2 rounded border
                           bg-white dark:bg-slate-800
                           border-slate-300 dark:border-slate-600
                           text-slate-900 dark:text-white
                           placeholder-slate-500 dark:placeholder-slate-400"
              />

              <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
                Address
              </label>
              <input
                type="text"
                placeholder="Street, City, Postcode"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full mb-6 p-2 rounded border
                           bg-white dark:bg-slate-800
                           border-slate-300 dark:border-slate-600
                           text-slate-900 dark:text-white
                           placeholder-slate-500 dark:placeholder-slate-400"
              />

              <button
                type="submit"
                disabled={saving}
                className="mx-auto block w-44 h-10 rounded-[30px] font-['Roboto']
                           bg-[#8CB369] text-black hover:bg-[#e8d174]
                           dark:text-white dark:hover:bg-[#a3c96e]
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update Profile'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;

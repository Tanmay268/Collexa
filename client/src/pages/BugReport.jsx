import { useState } from 'react';
import api from '../services/api';

export default function BugReport() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pageUrl: window.location.href,
    deviceInfo: `${navigator.userAgent} | ${window.innerWidth}x${window.innerHeight}`,
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      await api.post('/support/bug-report', formData);
      setStatus({ type: 'success', message: 'Bug report sent to the support team.' });
      setFormData((prev) => ({
        ...prev,
        title: '',
        description: '',
      }));
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to submit bug report.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Support</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Report a Bug</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Describe what broke, where it happened, and what device you were using. The report is emailed directly to the company inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {status.message && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  status.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {status.message}
              </div>
            )}

            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-900">
                Issue Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Signup button overlaps the form on Fold devices"
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-brand-500"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-900">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us exactly what you did, what happened, and what you expected."
                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-brand-500"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pageUrl" className="mb-2 block text-sm font-semibold text-slate-900">
                  Page URL
                </label>
                <input
                  id="pageUrl"
                  name="pageUrl"
                  type="text"
                  value={formData.pageUrl}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-brand-500"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div>
                <label htmlFor="deviceInfo" className="mb-2 block text-sm font-semibold text-slate-900">
                  Device Info
                </label>
                <input
                  id="deviceInfo"
                  name="deviceInfo"
                  type="text"
                  value={formData.deviceInfo}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-brand-500"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-0 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-400 sm:min-h-[52px] sm:text-base"
            >
              {loading ? 'Sending report...' : 'Send Bug Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

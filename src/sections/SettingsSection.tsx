import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: Props) {
  const { settings, updateSettings, showToast } = useApp();
  const [form, setForm] = useState({ ...settings });

  const save = () => {
    updateSettings(form);
    showToast('Settings saved ♡');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="cute-card w-full max-w-md p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-petal-400" />
            <h3 className="font-display text-xl text-petal-600">Settings ♡</h3>
          </div>
          <button onClick={onClose} className="text-petal-300 hover:text-petal-500 transition-colors" aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Website Title">
            <input type="text" value={form.siteTitle} onChange={e => setForm(f => ({ ...f, siteTitle: e.target.value }))}
              className="input-field" placeholder="Love Web ♡" />
          </Field>

          <Field label="Your Name">
            <input type="text" value={form.yourName} onChange={e => setForm(f => ({ ...f, yourName: e.target.value }))}
              className="input-field" placeholder="My Love" />
          </Field>

          <Field label="Partner's Name">
            <input type="text" value={form.partnerName} onChange={e => setForm(f => ({ ...f, partnerName: e.target.value }))}
              className="input-field" placeholder="My Darling" />
          </Field>

          <Field label="Welcome Message">
            <input type="text" value={form.welcomeMessage} onChange={e => setForm(f => ({ ...f, welcomeMessage: e.target.value }))}
              className="input-field" placeholder="a tiny world for the softest feelings." />
          </Field>

          <Field label="Special Date">
            <input type="date" value={form.specialDate} onChange={e => setForm(f => ({ ...f, specialDate: e.target.value }))}
              className="input-field" />
          </Field>

          <Field label="Theme">
            <div className="flex gap-3">
              {(['blush', 'lavender'] as const).map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, theme: t }))}
                  className={`flex-1 py-2.5 rounded-2xl border-2 font-body font-semibold text-sm capitalize transition-all ${
                    form.theme === t ? 'border-petal-400 bg-petal-50 text-petal-600' : 'border-pink-100 bg-white/60 text-petal-400'
                  }`}>
                  {t === 'blush' ? '🌸 Blush Pink' : '💜 Lavender'}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={save} className="btn-primary flex-1">Save ♡</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

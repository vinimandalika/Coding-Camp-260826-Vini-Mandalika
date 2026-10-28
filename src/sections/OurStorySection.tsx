import { useState } from 'react';
import { Plus, Trash2, X, Heart, Flower, Star, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { StoryMoment } from '../types';

const ICON_MAP = {
  heart: <Heart size={16} className="fill-petal-400 text-petal-400" />,
  flower: <Flower size={16} className="text-petal-400" />,
  star: <Star size={16} className="fill-cream-400 text-cream-400" />,
  sparkle: <Sparkles size={16} className="text-lavender-400" />,
};

const NOTE_COLORS = ['pink', 'peach', 'lavender', 'mint'];
const COLOR_STYLES: Record<string, string> = {
  pink: 'from-pink-50 to-blush-100 border-pink-200',
  peach: 'from-orange-50 to-pink-50 border-orange-200',
  lavender: 'from-violet-50 to-purple-50 border-violet-200',
  mint: 'from-emerald-50 to-teal-50 border-emerald-200',
};

function MomentCard({ moment, onDelete }: { moment: StoryMoment; onDelete: () => void }) {
  return (
    <div className="cute-card p-5 hover:scale-[1.01] transition-transform group relative">
      <button
        onClick={onDelete}
        aria-label="Delete moment"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity
                   text-petal-300 hover:text-petal-500 p-1 rounded-full hover:bg-petal-50"
      >
        <Trash2 size={14} />
      </button>

      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-petal-100 to-blush-200
                        flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
        >
          {ICON_MAP[moment.icon]}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-petal-300 font-body mb-0.5 uppercase tracking-wider">
            {new Date(moment.date + 'T00:00:00').toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
          <h3 className="font-display text-lg text-petal-600 leading-tight mb-1">{moment.title}</h3>
          <p className="font-body text-petal-400 text-sm leading-relaxed">{moment.description}</p>
          {moment.photo && (
            <img
              src={moment.photo}
              alt={moment.title}
              className="mt-3 w-full h-32 object-cover rounded-2xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AddMomentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (m: StoryMoment) => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    photo: '',
    icon: 'heart' as StoryMoment['icon'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd({
      id: Date.now().toString(),
      ...form,
      photo: form.photo || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="cute-card w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl text-petal-600">Add a New Moment ♡</h3>
          <button onClick={onClose} className="text-petal-300 hover:text-petal-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 bg-white/70
                         text-petal-600 font-body text-sm focus:outline-none focus:border-petal-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="A magical moment..."
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 bg-white/70
                         text-petal-600 font-body text-sm focus:outline-none focus:border-petal-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Tell the story..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 bg-white/70
                         text-petal-600 font-body text-sm focus:outline-none focus:border-petal-300 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">Icon</label>
            <div className="flex gap-3">
              {(Object.keys(ICON_MAP) as StoryMoment['icon'][]).map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, icon }))}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    form.icon === icon ? 'border-petal-400 bg-petal-50 scale-110' : 'border-pink-100 bg-white/60'
                  }`}
                  aria-label={icon}
                >
                  {ICON_MAP[icon]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Save Moment ♡</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OurStorySection() {
  const { moments, setMoments, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);

  const sorted = [...moments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const addMoment = (m: StoryMoment) => {
    setMoments([...moments, m]);
    showToast('New moment added ♡');
  };

  const deleteMoment = (id: string) => {
    if (confirm('Remove this moment from your story?')) {
      setMoments(moments.filter(m => m.id !== id));
      showToast('Moment removed');
    }
  };

  return (
    <section id="story" className="py-20 px-4" aria-label="Our Story">
      <div className="max-w-2xl mx-auto">
        <h2 className="section-title">Our Story ♡</h2>
        <p className="section-subtitle">every chapter of our little love tale</p>

        {sorted.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🐰</div>
            <p className="font-body text-petal-300 italic">No moments yet — add your first!</p>
          </div>
        ) : (
          <div className="relative timeline-line space-y-6">
            {sorted.map((moment, idx) => (
              <div
                key={moment.id}
                className={`relative animate-fade-in ${idx % 2 === 0 ? 'ml-0 md:ml-4' : 'mr-0 md:mr-4'}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <MomentCard
                  moment={moment}
                  onDelete={() => deleteMoment(moment.id)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add a New Moment ♡
          </button>
        </div>
      </div>

      {showModal && (
        <AddMomentModal onClose={() => setShowModal(false)} onAdd={addMoment} />
      )}
    </section>
  );
}

import { useState } from 'react';
import { Plus, X, Trash2, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { LoveNote } from '../types';

const NOTE_COLORS = ['pink', 'peach', 'lavender', 'mint', 'butter'] as const;
type NoteColor = typeof NOTE_COLORS[number];

const COLOR_MAP: Record<NoteColor, { card: string; border: string }> = {
  pink:     { card: 'from-pink-50 to-rose-50',     border: 'border-pink-200' },
  peach:    { card: 'from-orange-50 to-amber-50',  border: 'border-orange-200' },
  lavender: { card: 'from-violet-50 to-purple-50', border: 'border-violet-200' },
  mint:     { card: 'from-emerald-50 to-teal-50',  border: 'border-emerald-200' },
  butter:   { card: 'from-yellow-50 to-amber-50',  border: 'border-yellow-200' },
};

function NoteCard({ note, onDelete, onEdit }: { note: LoveNote; onDelete: () => void; onEdit: () => void }) {
  const [open, setOpen] = useState(false);
  const colors = COLOR_MAP[(note.color as NoteColor)] ?? COLOR_MAP.pink;

  return (
    <>
      <div
        className={`relative cursor-pointer rounded-3xl border bg-gradient-to-br ${colors.card} ${colors.border}
                    shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 p-5 group`}
        onClick={() => setOpen(true)}
        role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(true)}
        aria-label={`Open note: ${note.title}`}
      >
        <div className="absolute inset-x-0 top-0 h-8 rounded-t-3xl opacity-40"
          style={{ background: 'linear-gradient(180deg,rgba(255,176,201,0.5) 0%,transparent 100%)',
                   clipPath: 'polygon(0 0, 50% 70%, 100% 0)' }} aria-hidden="true" />
        <div className="flex justify-center mb-3 mt-1" aria-hidden="true">
          <span className="text-2xl animate-heart-beat inline-block">♡</span>
        </div>
        <h3 className="font-display text-base text-center text-petal-600 mb-1 leading-snug">{note.title}</h3>
        {note.recipient && (
          <p className="text-xs text-center font-dancing text-petal-400">to {note.recipient}</p>
        )}
        <p className="text-xs text-center text-petal-300 font-body mt-1">
          {new Date(note.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-xs text-center text-petal-300 mt-2 italic font-body">click to open ♡</p>
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 rounded-full bg-white/80 text-petal-400 hover:text-petal-600 transition-colors" aria-label="Edit note">
            <Edit3 size={12} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded-full bg-white/80 text-petal-400 hover:text-red-400 transition-colors" aria-label="Delete note">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
             onClick={() => setOpen(false)}>
          <div className={`w-full max-w-md bg-gradient-to-br ${colors.card} border ${colors.border} rounded-4xl
                          shadow-2xl p-8 animate-slide-up cursor-default relative`}
               onClick={e => e.stopPropagation()} role="dialog" aria-label={`Love note: ${note.title}`}>
            <div className="absolute inset-x-8 top-16 bottom-8 pointer-events-none" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-full h-px bg-pink-100/60" style={{ marginTop: i === 0 ? '0' : '28px' }} />
              ))}
            </div>
            <button onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-petal-300 hover:text-petal-500 transition-colors" aria-label="Close note">
              <X size={20} />
            </button>
            <div className="relative z-10">
              <div className="text-center mb-4"><span className="text-3xl">💌</span></div>
              {note.recipient && <p className="font-dancing text-petal-400 text-lg mb-1">Dear {note.recipient},</p>}
              <h3 className="font-display text-xl text-petal-600 italic mb-4">{note.title}</h3>
              <p className="font-dancing text-petal-500 text-lg leading-relaxed whitespace-pre-wrap">{note.content}</p>
              <p className="font-body text-xs text-petal-300 mt-6 text-right italic">
                {new Date(note.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NoteForm({ initial, onSave, onClose }: { initial?: LoveNote; onSave: (n: LoveNote) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    content: initial?.content ?? '',
    recipient: initial?.recipient ?? '',
    date: initial?.date ?? new Date().toISOString().split('T')[0],
    color: initial?.color ?? 'pink',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    onSave({ id: initial?.id ?? Date.now().toString(), ...form } as LoveNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="cute-card w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl text-petal-600 italic">
            {initial ? 'Edit Love Note ♡' : 'Write a Little Love Note ♡'}
          </h3>
          <button onClick={onClose} className="text-petal-300 hover:text-petal-500"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">Title</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="My little note..." required
                className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 bg-white/70 text-petal-600 font-body text-sm focus:outline-none focus:border-petal-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">To (optional)</label>
              <input type="text" value={form.recipient} onChange={e => setForm(f => ({ ...f, recipient: e.target.value }))}
                placeholder="My darling..."
                className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 bg-white/70 text-petal-600 font-body text-sm focus:outline-none focus:border-petal-300" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">Your note</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Write from the heart..." rows={5} required
              className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 bg-white/70 text-petal-600 font-body text-sm focus:outline-none focus:border-petal-300 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">Color</label>
            <div className="flex gap-2">
              {NOTE_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${form.color === c ? 'scale-125 border-petal-400' : 'border-white'}`}
                  style={{ background: { pink:'#ffc0d0', peach:'#ffcba4', lavender:'#c4b5fd', mint:'#a7f3d0', butter:'#fde68a' }[c] }}
                  aria-label={c} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 bg-white/70 text-petal-600 font-body text-sm focus:outline-none focus:border-petal-300" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Save Note ♡</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoveNotesSection() {
  const { notes, setNotes, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LoveNote | undefined>();

  const handleSave = (note: LoveNote) => {
    const exists = notes.find(n => n.id === note.id);
    const updated = exists ? notes.map(n => n.id === note.id ? note : n) : [...notes, note];
    setNotes(updated);
    showToast(exists ? 'Note updated ♡' : 'Love note saved ♡');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this love note?')) {
      setNotes(notes.filter(n => n.id !== id));
      showToast('Note deleted');
    }
  };

  return (
    <section id="notes" className="py-20 px-4 bg-gradient-to-b from-transparent to-pink-50/30" aria-label="Love Notes">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Love Notes 💌</h2>
        <p className="section-subtitle">little letters from the heart</p>

        {notes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💌</div>
            <p className="font-body text-petal-300 italic">No notes yet — write your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {notes.map((note, i) => (
              <div key={note.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <NoteCard note={note} onDelete={() => handleDelete(note.id)} onEdit={() => { setEditing(note); setShowForm(true); }} />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            write a little love note ♡
          </button>
        </div>
      </div>

      {showForm && (
        <NoteForm initial={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(undefined); }} />
      )}
    </section>
  );
}

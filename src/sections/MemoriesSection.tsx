import { useState, useRef } from 'react';
import { Plus, X, Trash2, ZoomIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Memory } from '../types';

function PhotoCard({ memory, onClick, onDelete }: { memory: Memory; onClick: () => void; onDelete: () => void }) {
  return (
    <div className="polaroid group cursor-pointer relative bg-white rounded-2xl shadow-lg p-2 pb-8 hover:z-10 hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden rounded-xl" onClick={onClick}>
        <img
          src={memory.url}
          alt={memory.caption}
          className="w-full h-36 sm:h-44 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-pink-900/0 group-hover:bg-pink-900/10 transition-colors flex items-center justify-center">
          <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
      </div>
      <p className="text-center font-dancing text-petal-500 text-sm mt-2 px-1 leading-snug line-clamp-2">
        {memory.caption}
      </p>
      {memory.date && (
        <p className="text-center text-xs text-petal-300 font-body">
          {new Date(memory.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      )}
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        aria-label="Remove photo"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                   bg-white/90 text-petal-400 hover:text-red-400 rounded-full p-1.5 shadow-sm"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function Lightbox({ memory, onClose, onPrev, onNext, hasPrev, hasNext }: {
  memory: Memory; onClose: () => void;
  onPrev: () => void; onNext: () => void;
  hasPrev: boolean; hasNext: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
         onClick={onClose}>
      <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close lightbox"
          className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors">
          <X size={28} />
        </button>
        <div className="bg-white rounded-4xl overflow-hidden shadow-2xl p-3 pb-10">
          <img src={memory.url} alt={memory.caption} className="w-full max-h-[60vh] object-contain rounded-3xl" />
          <p className="text-center font-dancing text-petal-500 text-lg mt-3 px-4">{memory.caption}</p>
          {memory.date && (
            <p className="text-center text-xs text-petal-300 font-body mt-1">
              {new Date(memory.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
        {hasPrev && (
          <button onClick={onPrev} aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 text-petal-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            ‹
          </button>
        )}
        {hasNext && (
          <button onClick={onNext} aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 text-petal-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            ›
          </button>
        )}
      </div>
    </div>
  );
}

export default function MemoriesSection() {
  const { memories, setMemories, showToast } = useApp();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleAdd = () => {
    if (!previewUrl) return;
    const m: Memory = {
      id: Date.now().toString(),
      url: previewUrl,
      caption: newCaption || 'A sweet memory ♡',
      date: newDate || undefined,
    };
    setMemories([...memories, m]);
    showToast('Memory added ♡');
    setShowAdd(false);
    setPreviewUrl('');
    setNewCaption('');
    setNewDate('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this memory from the gallery?')) {
      setMemories(memories.filter(m => m.id !== id));
      showToast('Memory removed');
    }
  };

  return (
    <section id="memories" className="py-20 px-4" aria-label="Memories Gallery">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title">Memories 📸</h2>
        <p className="section-subtitle">little moments pressed like flowers</p>

        {memories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌸</div>
            <p className="font-body text-petal-300 italic">No memories yet — add your first photo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {memories.map((m, i) => (
              <div key={m.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
                <PhotoCard memory={m} onClick={() => setLightboxIdx(i)} onDelete={() => handleDelete(m.id)} />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add a Memory ♡
          </button>
        </div>
      </div>

      {/* Add photo modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="cute-card w-full max-w-sm p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl text-petal-600">Add a Memory ♡</h3>
              <button onClick={() => { setShowAdd(false); setPreviewUrl(''); }} className="text-petal-300 hover:text-petal-500"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-full h-36 rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50/50
                           flex flex-col items-center justify-center cursor-pointer hover:border-petal-300 transition-colors"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-3xl" />
                ) : (
                  <>
                    <span className="text-3xl mb-2">📷</span>
                    <span className="text-sm text-petal-400 font-body">Click to choose a photo</span>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

              <div>
                <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">Caption</label>
                <input type="text" value={newCaption} onChange={e => setNewCaption(e.target.value)}
                  placeholder="A sweet memory..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 bg-white/70 text-petal-600 font-body text-sm focus:outline-none focus:border-petal-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-petal-400 uppercase tracking-wider mb-1.5">Date (optional)</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 bg-white/70 text-petal-600 font-body text-sm focus:outline-none focus:border-petal-300" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowAdd(false); setPreviewUrl(''); }} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleAdd} disabled={!previewUrl} className="btn-primary flex-1 disabled:opacity-50">Save ♡</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          memory={memories[lightboxIdx]}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx(i => (i! > 0 ? i! - 1 : i))}
          onNext={() => setLightboxIdx(i => (i! < memories.length - 1 ? i! + 1 : i))}
          hasPrev={lightboxIdx > 0}
          hasNext={lightboxIdx < memories.length - 1}
        />
      )}
    </section>
  );
}

import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { Calendar, Tag, X, Image as ImageIcon } from 'lucide-react';

export const GaleriPage: React.FC<{ gallery: GalleryItem[] }> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['Semua', 'Kegiatan Belajar', 'Ekstrakurikuler', 'Peringatan Hari Besar', 'Sarana & Prasarana'];

  const filtered = gallery.filter(g => {
    return selectedCategory === 'Semua' || g.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Dokumentasi Visual
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Galeri Kegiatan MDTU Nurul Hidayah
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Kumpulan momen berharga santri dalam proses menuntut ilmu, tadabbur Al-Qur'an, kepanduan pramuka, peringatan hari besar Islam, dan aktivitas madrasah di Cigoong Sirnabaya.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg overflow-x-auto w-full sm:w-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group relative rounded-2xl overflow-hidden border border-stone-200 aspect-4/3 bg-stone-100 shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="text-sm font-bold truncate mt-1">{item.title}</h3>
              <p className="text-xs text-stone-300 line-clamp-2 mt-1">{item.caption}</p>
              <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-2">
                <Calendar className="w-3 h-3" />
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[70vh] bg-stone-950 flex items-center justify-center">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-6 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold rounded text-[11px]">
                  {activePhoto.category}
                </span>
                <span>·</span>
                <span>{activePhoto.date}</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900">{activePhoto.title}</h2>
              <p className="text-xs text-stone-600 leading-relaxed">{activePhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

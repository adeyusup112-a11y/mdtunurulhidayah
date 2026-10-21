import React, { useState } from 'react';
import { NewsItem, AnnouncementItem } from '../../types';
import { Search, Calendar, User, Eye, ArrowRight, Bell, Tag, X } from 'lucide-react';

interface BeritaPageProps {
  news: NewsItem[];
  announcements: AnnouncementItem[];
  selectedNews: NewsItem | null;
  onSelectNews: (news: NewsItem | null) => void;
}

export const BeritaPage: React.FC<BeritaPageProps> = ({
  news,
  announcements,
  selectedNews,
  onSelectNews
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Kegiatan', 'Prestasi', 'Pendidikan', 'Pengumuman'];

  const filteredNews = news.filter(n => {
    if (!n.isPublished) return false;
    const matchCategory = selectedCategory === 'Semua' || n.category === selectedCategory;
    const matchSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Warta & Informasi
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Berita & Pengumuman Madrasah
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Kilas kegiatan pembelajaran santri, agenda madrasah, pengumuman resmi, dan dokumentasi syiar Islam MDTU Nurul Hidayah.
        </p>
      </div>

      {/* Announcements Bar (Pengumuman Resmi) */}
      {announcements.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <Bell className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Pengumuman Penting</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.slice(0, 2).map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg border border-amber-200/80 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-semibold text-amber-800">{item.authorName}</span>
                  <span>{item.publishedAt}</span>
                </div>
                <h4 className="font-bold text-xs text-stone-900">{item.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul atau kata kunci..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
          />
        </div>

        {/* Categories as clean interactive filter controls (DO rule compliant) */}
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
      </div>

      {/* News List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            onClick={() => onSelectNews(item)}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col"
          >
            <div className="h-48 w-full bg-stone-200 overflow-hidden relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-950/80 text-amber-300 text-[10px] font-bold rounded">
                {item.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.publishedAt}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.author}
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-800 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span>Baca Berita</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
          <p className="text-sm font-semibold text-stone-700">Tidak ada berita yang sesuai dengan pencarian Anda.</p>
          <p className="text-xs text-stone-500">Silakan gunakan kata kunci lain atau pilih kategori "Semua".</p>
        </div>
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="relative h-64 sm:h-80 w-full bg-stone-200">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onSelectNews(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-emerald-900 text-amber-300 text-xs font-bold rounded-md">
                  {selectedNews.category}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-stone-200 pb-4">
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedNews.publishedAt}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Penulis: {selectedNews.author}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
                  {selectedNews.title}
                </h2>
              </div>

              <div className="text-sm text-stone-700 leading-relaxed space-y-4">
                <p className="font-semibold text-stone-900 text-base italic border-l-2 border-emerald-700 pl-4">
                  {selectedNews.summary}
                </p>
                <div className="whitespace-pre-line">
                  {selectedNews.content}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => onSelectNews(null)}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

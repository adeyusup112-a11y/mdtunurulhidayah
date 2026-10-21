import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { storageService } from '../../services/storageService';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export const KontakPage: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!senderName.trim() || !senderPhone.trim() || !message.trim()) {
      setErrorMsg('Mohon isi nama, nomor telepon/WhatsApp, dan pesan Anda.');
      return;
    }

    try {
      storageService.submitContactMessage({
        senderName,
        senderPhone,
        senderEmail: senderEmail || 'tidak_ada@email.com',
        subject: subject || 'Pertanyaan Umum Masyarakat',
        message
      });

      setIsSent(true);
      setSenderName('');
      setSenderPhone('');
      setSenderEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg('Gagal mengirim pesan.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Hubungi Lembaga
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Kontak & Informasi Lokasi
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Kami siap melayani pertanyaan dari masyarakat, orang tua santri, dan calon pendaftar seputar kegiatan belajar mengajar serta administrasi MDTU Nurul Hidayah.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-stone-900 text-lg border-b border-stone-100 pb-3">
              Informasi Sekretariat
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 block">Alamat Madrasah:</span>
                  <p className="text-stone-600 leading-relaxed mt-0.5">
                    {settings.address}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">Desa Sirnabaya, Kec. Rajadesa, Ciamis</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 block">Telepon / WhatsApp:</span>
                  <a
                    href="tel:082315987599"
                    className="text-emerald-800 font-mono font-bold hover:underline block"
                  >
                    0823-1598-7599 (182315987599)
                  </a>
                  <p className="text-[11px] text-stone-400">Ust. Ade Yusup, S.Pd. (Kepala Lembaga)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 block">Email Resmi:</span>
                  <a
                    href="mailto:nurulhidayah177@gmail.com"
                    className="text-emerald-800 font-mono hover:underline block"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-stone-900 block">Jam Operasional & Belajar:</span>
                  <p className="text-stone-600 leading-relaxed">
                    Senin s.d. Sabtu: 14.00 – 16.30 WIB
                  </p>
                  <p className="text-[11px] text-stone-400">Minggu & Hari Libur Nasional: Libur</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex gap-3">
              <a
                href="https://wa.me/6282315987599"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold text-center transition"
              >
                Chat WhatsApp
              </a>
              <a
                href="tel:082315987599"
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold text-center border border-stone-300 transition"
              >
                Panggil Telepon
              </a>
            </div>
          </div>

          {/* Map Card */}
          <div className="bg-stone-100 rounded-2xl border border-stone-200 p-6 space-y-3">
            <h4 className="font-bold text-stone-900 text-sm">Peta Wilayah Madrasah</h4>
            <div className="bg-white rounded-xl border border-stone-300 p-4 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Sirnabaya, Rajadesa, Kabupaten Ciamis</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Terletak di Dusun Cigoong RT 03 RW 01, dapat dijangkau dari pusat Kecamatan Rajadesa sekitar 15 menit melalui jalan pedesaan Sirnabaya.
              </p>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Sirnabaya+Rajadesa+Ciamis"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-800 font-semibold underline text-[11px]"
                >
                  Buka Titik di Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <div className="border-b border-stone-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-800" />
              <span>Kirim Pesan Langsung ke Pengurus</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Pesan yang Anda kirimkan akan langsung tersambung ke dashboard admin lembaga dan ditindaklanjuti.
            </p>
          </div>

          {isSent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-stone-900">Pesan Berhasil Terkirim!</h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Terima kasih atas pesan dan pertanyaan Anda. Pengurus MDTU Nurul Hidayah akan meninjau dan merespons melalui nomor telepon atau WhatsApp Anda.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-4 px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Nomor WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Alamat Email (Opsional)</label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Perihal / Topik Pesan</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Misal: Info Pendaftaran / Ibadah"
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Isi Pesan *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pertanyaan, saran, atau keperluan Anda..."
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs shadow-md transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

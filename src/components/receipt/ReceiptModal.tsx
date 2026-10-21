import React from 'react';
import { PaymentReceipt } from '../../types';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  receipt: PaymentReceipt | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  // Convert numbers to Indonesian words
  const terbilang = (n: number): string => {
    const angka = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    let hasil = '';
    if (n < 12) hasil = angka[n];
    else if (n < 20) hasil = terbilang(n - 10) + ' Belas';
    else if (n < 100) hasil = terbilang(Math.floor(n / 10)) + ' Puluh ' + terbilang(n % 10);
    else if (n < 200) hasil = 'Seratus ' + terbilang(n - 100);
    else if (n < 1000) hasil = terbilang(Math.floor(n / 100)) + ' Ratus ' + terbilang(n % 100);
    else if (n < 2000) hasil = 'Seribu ' + terbilang(n - 1000);
    else if (n < 1000000) hasil = terbilang(Math.floor(n / 1000)) + ' Ribu ' + terbilang(n % 1000);
    return (hasil + ' Rupiah').replace(/\s+/g, ' ').trim();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto no-print-bg">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Top actions bar (hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-emerald-950 text-white">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-300" />
            <span className="font-semibold text-sm">Kuitansi Pembayaran Sah</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="print-area p-8 sm:p-10 bg-white border border-stone-200 m-4 rounded-lg text-stone-900">
          {/* Madrasah Kop Surat */}
          <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-900 flex items-center justify-center overflow-hidden shrink-0 border border-amber-500">
                <img
                  src="/src/assets/images/madrasah_emblem_logo_1792550360091.jpg"
                  alt="Logo MDTU"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-emerald-950">MDTU NURUL HIDAYAH</h2>
                <p className="text-xs text-stone-600 font-medium">MADRASAH DINIYAH TAKMILIYAH ULA</p>
                <p className="text-[11px] text-stone-500">
                  Kp. Dukuh Sari, Dusun Cigoong RT 03/01, Desa Sirnabaya, Kec. Rajadesa, Ciamis 46254
                </p>
                <p className="text-[10px] text-stone-500">Telp: 0823-1598-7599 · Email: nurulhidayah177@gmail.com</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded">
                KUITANSI RESMI
              </span>
              <p className="text-xs font-mono font-bold text-stone-700 mt-1">{receipt.receiptNumber}</p>
            </div>
          </div>

          {/* Receipt Details Table */}
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-3 py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Telah Terima Dari</span>
              <span className="col-span-2 font-bold text-stone-900">{receipt.studentName} (Santri)</span>
            </div>
            <div className="grid grid-cols-3 py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Tingkat / Kelas</span>
              <span className="col-span-2 font-medium text-stone-800">{receipt.className}</span>
            </div>
            <div className="grid grid-cols-3 py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Uang Sejumlah</span>
              <span className="col-span-2 font-bold text-emerald-900 text-base">
                {formatRupiah(receipt.amountPaid)}
              </span>
            </div>
            <div className="grid grid-cols-3 py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Terbilang</span>
              <span className="col-span-2 italic text-stone-700 bg-stone-50 p-2 rounded text-xs border border-stone-200">
                "{terbilang(receipt.amountPaid)}"
              </span>
            </div>
            <div className="grid grid-cols-3 py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Untuk Pembayaran</span>
              <span className="col-span-2 text-stone-800">
                {receipt.paymentTypeName} Periode <span className="font-semibold">{receipt.period}</span>
              </span>
            </div>
            <div className="grid grid-cols-3 py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Metode Pembayaran</span>
              <span className="col-span-2 text-stone-800 font-medium">{receipt.paymentMethod}</span>
            </div>
          </div>

          {/* Signatures & Verification Stamp */}
          <div className="mt-8 pt-4 flex items-end justify-between border-t border-stone-200">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Terverifikasi Elektronik & Sah</span>
              </div>
              <div className="p-2 border border-stone-200 rounded bg-stone-50 inline-block font-mono text-[10px] text-stone-500">
                Kode Verifikasi:
                <br />
                <span className="font-bold text-stone-800">{receipt.verificationCode}</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-xs text-stone-600">Rajadesa, {receipt.issuedDate}</p>
              <p className="text-xs font-semibold text-stone-800">Pengelola / Kepala Madrasah,</p>
              <div className="h-14 flex items-center justify-end">
                <span className="font-arabic text-xl text-emerald-900 font-bold opacity-80">عادل يوسف</span>
              </div>
              <p className="text-xs font-bold text-stone-900 underline">{receipt.issuedBy}</p>
              <p className="text-[10px] text-stone-500">MDTU Nurul Hidayah Ciamis</p>
            </div>
          </div>
        </div>

        {/* Modal footer close */}
        <div className="no-print px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

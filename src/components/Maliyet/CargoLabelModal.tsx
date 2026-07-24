import React from 'react';
import { Printer, X, Wrench, PackageCheck, Truck } from 'lucide-react';
import { Order } from '../../types';

interface CargoLabelModalProps {
  order: Order;
  onClose: () => void;
}

export const CargoLabelModal: React.FC<CargoLabelModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden print:p-0 print:shadow-none print:w-full print:max-w-none">
        
        {/* Screen Header (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-700" />
            <h3 className="font-bold text-base text-slate-800">
              Kargo & İmalat Etiketi Yazdır
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Label Layout */}
        <div className="p-8 space-y-6 font-sans border-4 border-dashed border-slate-800 m-4 rounded-xl bg-white print:border-4 print:m-0 print:rounded-none">
          
          {/* Label Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Wrench className="w-6 h-6 text-slate-900" />
                <span className="font-black text-xl tracking-tight uppercase">MARANGOZ ATÖLYESİ</span>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">Ahşap İmalat & Özel Zanaat Dükkanı</p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded bg-slate-900 text-white font-mono font-bold text-sm">
                {order.orderNo}
              </span>
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                Tarih: {new Date(order.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>

          {/* Receiver / Customer Information */}
          <div className="space-y-2 border-b-2 border-slate-800 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              ALICI / MÜŞTERİ BİLGİLERİ:
            </span>
            <div className="font-bold text-lg text-slate-900">
              {order.customerName}
            </div>
            {order.customerPhone && (
              <div className="text-xs font-mono font-bold text-slate-700">
                Tel: {order.customerPhone}
              </div>
            )}
            <div className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border border-slate-200">
              {order.customerAddress || 'Adres belirtilmedi.'}
            </div>
          </div>

          {/* Product & Platform Details */}
          <div className="grid grid-cols-2 gap-4 border-b-2 border-slate-800 pb-4 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">ÜRÜN:</span>
              <span className="font-bold text-slate-900 text-sm">{order.productName}</span>
              <span className="block text-slate-600 font-semibold mt-0.5">Adet: {order.quantity}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400 block">GÖNDERİM PLATFORMU:</span>
              <span className="font-bold text-slate-900 text-sm">{order.platform}</span>
              <span className="block font-bold text-emerald-700 mt-0.5 font-mono">
                {order.remainingPaymentTL === 0 ? 'Ödeme Tamamlandı' : `Kalan: ₺${order.remainingPaymentTL}`}
              </span>
            </div>
          </div>

          {/* Notes for Carrier / Workshop */}
          {order.notes && (
            <div className="text-xs text-slate-700 italic border-l-4 border-amber-600 pl-3 py-1">
              <strong>İmalat / Kargo Notu:</strong> {order.notes}
            </div>
          )}

          {/* Barcode Placeholder / Warning */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-2">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-slate-700" />
              <span>Hassas Ahşap Ürün - Kırılabilir / Islanmaz</span>
            </div>
            <span className="font-mono text-[10px]">Atölye Takip Kodu: #{order.id.slice(-6)}</span>
          </div>

        </div>

        {/* Screen Footer Actions (Hidden in Print) */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">
            A4 veya Termal Etiket Yazıcınızdan yazdırabilirsiniz.
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200 text-slate-700"
            >
              Kapat
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Etiketi Yazdır
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

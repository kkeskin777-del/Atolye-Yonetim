import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Printer, ShoppingBag, Clock, Truck, CheckCircle2, DollarSign, X } from 'lucide-react';
import { Order, OrderStatus, ProductCalculation, PlatformConfig } from '../../types';
import { ThemeOption } from '../../utils/themeConfig';
import { CargoLabelModal } from './CargoLabelModal';

interface SiparislerTabProps {
  orders: Order[];
  products: ProductCalculation[];
  platforms: PlatformConfig[];
  theme: ThemeOption;
  onAddOrder: (order: Order) => void;
  onUpdateOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  initialOrderModalData?: { productName: string; platform: string; priceTL: number } | null;
  onClearInitialModalData?: () => void;
}

export const SiparislerTab: React.FC<SiparislerTabProps> = ({
  orders,
  products,
  platforms,
  theme,
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder,
  initialOrderModalData,
  onClearInitialModalData,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(!!initialOrderModalData);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // Modal Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [productName, setProductName] = useState(initialOrderModalData?.productName || '');
  const [platform, setPlatform] = useState(initialOrderModalData?.platform || platforms[0]?.name || 'Trendyol');
  const [quantity, setQuantity] = useState(1);
  const [sellingPriceTL, setSellingPriceTL] = useState<number | ''>(initialOrderModalData?.priceTL || '');
  const [advancePaymentTL, setAdvancePaymentTL] = useState<number | ''>(0);
  const [status, setStatus] = useState<OrderStatus>('in_production');
  const [notes, setNotes] = useState('');

  // Handle open modal for new order
  const handleOpenNewModal = () => {
    setEditingOrder(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setProductName(products[0]?.name || '');
    setPlatform(platforms[0]?.name || 'Trendyol');
    setQuantity(1);
    setSellingPriceTL(products[0]?.platformQuotes[0]?.recommendedPriceTL || 1000);
    setAdvancePaymentTL(0);
    setStatus('in_production');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleEditModal = (ord: Order) => {
    setEditingOrder(ord);
    setCustomerName(ord.customerName);
    setCustomerPhone(ord.customerPhone || '');
    setCustomerAddress(ord.customerAddress || '');
    setProductName(ord.productName);
    setPlatform(ord.platform);
    setQuantity(ord.quantity);
    setSellingPriceTL(ord.sellingPriceTL);
    setAdvancePaymentTL(ord.advancePaymentTL);
    setStatus(ord.status);
    setNotes(ord.notes || '');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    if (onClearInitialModalData) onClearInitialModalData();
  };

  const totalAmount = (Number(sellingPriceTL) || 0) * Number(quantity);
  const remainingPayment = Math.max(0, totalAmount - (Number(advancePaymentTL) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !productName.trim() || Number(sellingPriceTL) <= 0) {
      alert('Lütfen Müşteri Adı, Ürün Adı ve Satış Fiyatını giriniz!');
      return;
    }

    if (editingOrder) {
      const updated: Order = {
        ...editingOrder,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        productName: productName.trim(),
        platform,
        quantity: Number(quantity),
        sellingPriceTL: Number(sellingPriceTL),
        advancePaymentTL: Number(advancePaymentTL) || 0,
        remainingPaymentTL: remainingPayment,
        status,
        notes: notes.trim(),
        updatedAt: new Date().toISOString(),
      };
      onUpdateOrder(updated);
    } else {
      const newOrderNo = `SIP-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
      const newOrd: Order = {
        id: 'ord-' + Date.now(),
        orderNo: newOrderNo,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        productName: productName.trim(),
        platform,
        quantity: Number(quantity),
        sellingPriceTL: Number(sellingPriceTL),
        advancePaymentTL: Number(advancePaymentTL) || 0,
        remainingPaymentTL: remainingPayment,
        status,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddOrder(newOrd);
    }

    handleModalClose();
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'all' ? true : ord.status === statusFilter;
    const matchesSearch =
      ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.orderNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (st: OrderStatus) => {
    switch (st) {
      case 'in_production':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Üretimde
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <Truck className="w-3 h-3 text-blue-600" /> Kargoda
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Teslim Edildi
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${theme.textPrimaryClass}`}>
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              Sipariş Yönetimi & Takibi ({orders.length})
            </h2>
            <p className={`text-xs mt-0.5 ${theme.textSecondaryClass}`}>
              Yeni sipariş kartı oluşturun, durumunu takip edin, kargo etiketi bastırın.
            </p>
          </div>

          <button
            onClick={handleOpenNewModal}
            className={`px-5 py-2.5 rounded-xl ${theme.buttonPrimaryClass} font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-transform`}
          >
            <Plus className="w-4 h-4" /> Yeni Sipariş Oluştur
          </button>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-500/10">
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Tümü ({orders.length})
            </button>

            <button
              onClick={() => setStatusFilter('in_production')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'in_production'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Üretimde ({orders.filter((o) => o.status === 'in_production').length})
            </button>

            <button
              onClick={() => setStatusFilter('shipped')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'shipped'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Kargoda ({orders.filter((o) => o.status === 'shipped').length})
            </button>

            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'delivered'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Teslim Edildi ({orders.filter((o) => o.status === 'delivered').length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Sipariş no, müşteri veya ürün ara..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5"
            />
          </div>
        </div>
      </div>

      {/* Order List Table */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm overflow-hidden`}>
        {filteredOrders.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">
            Gösterilecek sipariş bulunamadı.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-500/20 text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-bold">Sipariş kODU / Müşteri</th>
                  <th className="py-2.5 px-3 font-bold">Ürün & Platform</th>
                  <th className="py-2.5 px-2 font-bold text-center">Adet</th>
                  <th className="py-2.5 px-3 font-bold text-right">Toplam Fiyat</th>
                  <th className="py-2.5 px-3 font-bold text-right">Kapora / Kalan</th>
                  <th className="py-2.5 px-3 font-bold text-center">Durum</th>
                  <th className="py-2.5 px-2 text-center w-28">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-500/10">
                {filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => handleEditModal(ord)}
                  >
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[11px] font-bold text-amber-700 dark:text-amber-400 block">
                        {ord.orderNo}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                        {ord.customerName}
                      </span>
                      {ord.customerPhone && (
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {ord.customerPhone}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {ord.productName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        {ord.platform}
                      </span>
                    </td>

                    <td className="py-3.5 px-2 text-center font-bold font-mono">
                      {ord.quantity}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      ₺{(ord.sellingPriceTL * ord.quantity).toLocaleString('tr-TR')}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        Kapora: ₺{ord.advancePaymentTL}
                      </span>
                      <span className="block text-[11px] font-bold text-amber-700 dark:text-amber-300 font-mono">
                        Kalan: ₺{ord.remainingPaymentTL}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(ord.status)}
                      </div>
                    </td>

                    <td
                      className="py-3.5 px-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setPrintingOrder(ord)}
                          className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-500/10 transition-colors"
                          title="Kargo Etiketi Yazdır"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditModal(ord)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-500/10 transition-colors"
                          title="Düzenle"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteOrder(ord.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create or Edit Order */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-xl my-8 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-2xl overflow-hidden`}>
            
            <div className={`px-6 py-4 border-b ${theme.borderClass} flex items-center justify-between`}>
              <h3 className={`font-bold text-base ${theme.textPrimaryClass}`}>
                {editingOrder ? 'Sipariş Düzenle / Kart Detayı' : 'Yeni Sipariş Kartı Oluştur'}
              </h3>
              <button
                onClick={handleModalClose}
                className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Müşteri Adı Soyadı *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Müşteri Telefon No
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0532 555 1234"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1">
                  Müşteri Teslimat Adresi
                </label>
                <textarea
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Atatürk Cad. No:42 D:3, Kadıköy / İstanbul"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Masif Meşe Yemek Masası"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Satış Platformu *
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 font-semibold text-xs"
                  >
                    {platforms.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                    <option value="Atölyeden Elden Satış">Atölyeden Elden Satış</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Adet *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 font-mono font-bold text-xs text-center"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Birim Fiyat (TL) *
                  </label>
                  <input
                    type="number"
                    required
                    value={sellingPriceTL}
                    onChange={(e) => setSellingPriceTL(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 font-mono font-bold text-xs text-center"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Alınan Kapora (TL)
                  </label>
                  <input
                    type="number"
                    value={advancePaymentTL}
                    onChange={(e) => setAdvancePaymentTL(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 font-mono font-bold text-xs text-center text-emerald-600"
                  />
                </div>
              </div>

              {/* Automatic Calculation Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between font-mono font-bold">
                <span>Toplam Tutar: ₺{totalAmount.toLocaleString('tr-TR')}</span>
                <span className="text-amber-800 dark:text-amber-300">
                  Kalan Tahsilat: ₺{remainingPayment.toLocaleString('tr-TR')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Sipariş Durumu *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 font-bold text-xs"
                  >
                    <option value="in_production">Üretimde</option>
                    <option value="shipped">Kargoda</option>
                    <option value="delivered">Teslim Edildi (Otomatik Gelir Yazar)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Sipariş Notları
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Örn: Özel isim kazınacak..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-500/20">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 rounded-xl font-semibold hover:bg-black/10 dark:hover:bg-white/10"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl ${theme.buttonPrimaryClass} font-bold shadow-md`}
                >
                  {editingOrder ? 'Siparişi Güncelle' : 'Siparişi Kaydet'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Cargo Label Printer Modal */}
      {printingOrder && (
        <CargoLabelModal
          order={printingOrder}
          onClose={() => setPrintingOrder(null)}
        />
      )}

    </div>
  );
};

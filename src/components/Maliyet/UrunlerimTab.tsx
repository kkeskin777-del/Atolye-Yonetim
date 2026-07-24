import React, { useState } from 'react';
import { Package, Search, Trash2, ChevronDown, ChevronUp, ShoppingBag, ExternalLink, Calendar, Wrench } from 'lucide-react';
import { ProductCalculation } from '../../types';
import { ThemeOption } from '../../utils/themeConfig';

interface UrunlerimTabProps {
  products: ProductCalculation[];
  theme: ThemeOption;
  onDeleteProduct: (id: string) => void;
  onCreateOrderFromProduct: (product: ProductCalculation, platformName: string, priceTL: number) => void;
}

export const UrunlerimTab: React.FC<UrunlerimTabProps> = ({
  products,
  theme,
  onDeleteProduct,
  onCreateOrderFromProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div>
          <h2 className={`text-base font-bold flex items-center gap-2 ${theme.textPrimaryClass}`}>
            <Package className="w-5 h-5 text-amber-600" />
            Kayıtlı Ürünlerim & Maliyet Arşivi ({products.length})
          </h2>
          <p className={`text-xs mt-0.5 ${theme.textSecondaryClass}`}>
            Hesaplama sekmesinde ürettiğiniz tüm ahşap ürünlerin reçeteleri ve satış fiyatı matrisleri.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ürün veya kategori ara..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl ${theme.cardClass} border ${theme.borderClass}`}>
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-bold">Kayıtlı Ürün Bulunmuyor</p>
          <p className="text-xs text-slate-500 mt-1">
            "Hesaplama Sekmesi" alanından imal ettiğiniz ahşap ürünlerin maliyetlerini hesaplayıp kaydedebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProducts.map((prod) => {
            const isExpanded = expandedId === prod.id;

            return (
              <div
                key={prod.id}
                className={`rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm overflow-hidden transition-all`}
              >
                {/* Main Card Summary */}
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-500/10">
                  <div className="flex items-center gap-4">
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover border border-amber-500/20 shadow-sm flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                        <Wrench className="w-8 h-8" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300">
                          {prod.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(prod.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>

                      <h3 className={`text-base font-bold mt-1 ${theme.textPrimaryClass}`}>
                        {prod.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {prod.materials.length} Farklı Hammadde, {prod.expenses.length} Sarf Kalemi
                      </p>
                    </div>
                  </div>

                  {/* Pricing Badges */}
                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <span className="block text-[10px] uppercase text-slate-400 font-bold">
                        Yalın İmalat Maliyeti
                      </span>
                      <span className="text-lg font-extrabold font-mono text-amber-700 dark:text-amber-400">
                        ₺{prod.totalBaseCostTL.toLocaleString('tr-TR')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : prod.id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-colors flex items-center gap-1"
                      >
                        {isExpanded ? 'Detayları Gizle' : 'Reçete & Platform Fiyatları'}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Ürünü Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 bg-black/5 dark:bg-white/5 space-y-6">
                    
                    {/* Materials & Expenses Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Materials List */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Hammadde & Ahşap Reçetesi:
                        </h4>
                        <div className="space-y-1.5 text-xs">
                          {prod.materials.map((m) => (
                            <div
                              key={m.id}
                              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                            >
                              <div>
                                <span className="font-bold">{m.materialName}</span>
                                <span className="text-[11px] text-slate-400 block">
                                  {m.widthCm}x{m.heightCm} cm ({m.quantity} Adet)
                                </span>
                              </div>
                              <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                                ₺{m.calculatedCostTL.toLocaleString('tr-TR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* General Expenses List */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Sarf & Genel Gider Payları:
                        </h4>
                        <div className="space-y-1.5 text-xs">
                          {prod.expenses.map((e) => (
                            <div
                              key={e.id}
                              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                            >
                              <div>
                                <span className="font-bold">{e.expenseName}</span>
                                <span className="text-[11px] text-slate-400 block">
                                  Miktar: {e.quantity}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                ₺{e.calculatedCostTL.toLocaleString('tr-TR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Platform Quote Matrix */}
                    <div className="space-y-3 pt-4 border-t border-slate-500/10">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        Platform Bazlı Önerilen Satış Fiyatları & Sipariş Oluşturma:
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {prod.platformQuotes.map((q, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                              q.isEtsy
                                ? 'bg-purple-500/10 border-purple-500/30'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span>{q.platformName}</span>
                              <span className="text-xs text-slate-400">
                                Kom: %{q.commissionPercent}
                              </span>
                            </div>

                            <div className="flex items-baseline justify-between pt-1">
                              <span className="text-slate-500">Önerilen Fiyat:</span>
                              <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                                ₺{q.recommendedPriceTL.toLocaleString('tr-TR')}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-500/10">
                              <span>Atölye Net Karı:</span>
                              <span className="font-bold font-mono text-emerald-700 dark:text-emerald-300">
                                ₺{q.netProfitTL}
                              </span>
                            </div>

                            <button
                              onClick={() => onCreateOrderFromProduct(prod, q.platformName, q.recommendedPriceTL)}
                              className="w-full mt-2 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Bu Fiyattan Sipariş Aç
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {prod.notes && (
                      <div className="text-xs text-slate-500 italic p-3 rounded-xl bg-black/5 dark:bg-white/5">
                        Not: {prod.notes}
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { Plus, Trash2, Calculator, Save, Image as ImageIcon, Sparkles, AlertCircle, ShoppingBag, DollarSign, CheckCircle2 } from 'lucide-react';
import { RawMaterial, GeneralExpenseItem, PlatformConfig, ProductMaterialUsage, ProductExpenseUsage, PlatformQuoteResult, ProductCalculation } from '../../types';
import { ThemeOption } from '../../utils/themeConfig';

interface CalculationTabProps {
  rawMaterials: RawMaterial[];
  generalExpenses: GeneralExpenseItem[];
  platforms: PlatformConfig[];
  theme: ThemeOption;
  usdRate: number;
  onSaveProduct: (product: ProductCalculation) => void;
}

export const CalculationTab: React.FC<CalculationTabProps> = ({
  rawMaterials,
  generalExpenses,
  platforms,
  theme,
  usdRate,
  onSaveProduct,
}) => {
  // Section 1: Product Basics
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Masa');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Section 2: Selected Materials
  const [selectedMaterials, setSelectedMaterials] = useState<ProductMaterialUsage[]>([
    {
      id: 'm-1',
      materialId: rawMaterials[0]?.id || '',
      materialName: rawMaterials[0]?.name || 'Varsayılan Ahşap',
      widthCm: 90,
      heightCm: 180,
      quantity: 1,
      unitPricePerCm2: rawMaterials[0]?.pricePerCm2TL || 0.08,
      calculatedCostTL: (90 * 180 * 1 * (rawMaterials[0]?.pricePerCm2TL || 0.08)),
    },
  ]);

  // Section 3: Selected General Expenses
  const [selectedExpenses, setSelectedExpenses] = useState<ProductExpenseUsage[]>([
    {
      id: 'e-1',
      expenseId: generalExpenses[0]?.id || '',
      expenseName: generalExpenses[0]?.name || 'Ahşap Tutkalı',
      quantity: 1,
      unitPriceTL: generalExpenses[0]?.unitPriceTL || 140,
      calculatedCostTL: generalExpenses[0]?.unitPriceTL || 140,
    },
  ]);

  // Custom Editable Platforms
  const [activePlatforms, setActivePlatforms] = useState<PlatformConfig[]>(platforms);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Helper: Material row update
  const handleMaterialChange = (id: string, field: keyof ProductMaterialUsage, value: any) => {
    setSelectedMaterials((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        const updated = { ...row, [field]: value };

        // If material selected changed
        if (field === 'materialId') {
          const mat = rawMaterials.find((m) => m.id === value);
          if (mat) {
            updated.materialName = mat.name;
            updated.unitPricePerCm2 = mat.pricePerCm2TL;
          }
        }

        const area = Number(updated.widthCm) * Number(updated.heightCm);
        updated.calculatedCostTL = Number((area * Number(updated.quantity) * Number(updated.unitPricePerCm2)).toFixed(2));
        return updated;
      })
    );
  };

  const handleAddMaterialRow = () => {
    const firstMat = rawMaterials[0];
    const newRow: ProductMaterialUsage = {
      id: 'm-' + Date.now(),
      materialId: firstMat?.id || '',
      materialName: firstMat?.name || 'Hammadde',
      widthCm: 50,
      heightCm: 50,
      quantity: 1,
      unitPricePerCm2: firstMat?.pricePerCm2TL || 0.05,
      calculatedCostTL: Number((2500 * 1 * (firstMat?.pricePerCm2TL || 0.05)).toFixed(2)),
    };
    setSelectedMaterials((prev) => [...prev, newRow]);
  };

  const handleRemoveMaterialRow = (id: string) => {
    setSelectedMaterials((prev) => prev.filter((r) => r.id !== id));
  };

  // Helper: Expense row update
  const handleExpenseChange = (id: string, field: keyof ProductExpenseUsage, value: any) => {
    setSelectedExpenses((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        const updated = { ...row, [field]: value };
        if (field === 'expenseId') {
          const exp = generalExpenses.find((e) => e.id === value);
          if (exp) {
            updated.expenseName = exp.name;
            updated.unitPriceTL = exp.unitPriceTL;
          }
        }

        updated.calculatedCostTL = Number((Number(updated.quantity) * Number(updated.unitPriceTL)).toFixed(2));
        return updated;
      })
    );
  };

  const handleAddExpenseRow = () => {
    const firstExp = generalExpenses[0];
    const newRow: ProductExpenseUsage = {
      id: 'e-' + Date.now(),
      expenseId: firstExp?.id || '',
      expenseName: firstExp?.name || 'Genel Gider',
      quantity: 1,
      unitPriceTL: firstExp?.unitPriceTL || 50,
      calculatedCostTL: firstExp?.unitPriceTL || 50,
    };
    setSelectedExpenses((prev) => [...prev, newRow]);
  };

  const handleRemoveExpenseRow = (id: string) => {
    setSelectedExpenses((prev) => prev.filter((r) => r.id !== id));
  };

  // Totals
  const totalMaterialCostTL = selectedMaterials.reduce((acc, curr) => acc + (curr.calculatedCostTL || 0), 0);
  const totalExpenseCostTL = selectedExpenses.reduce((acc, curr) => acc + (curr.calculatedCostTL || 0), 0);
  const totalBaseCostTL = totalMaterialCostTL + totalExpenseCostTL;

  // Platform calculations
  // Formula:
  // Target Net Profit TL = p.netProfitTargetTL
  // Let Selling Price = SP
  // Commission TL = SP * (Comm % / 100)
  // VAT TL = SP * (VAT % / 100)
  // Custom Tax TL (for Etsy) = SP * (CustomTax % / 100)
  // Total Deductions % = Comm % + VAT % + CustomTax %
  // Net Profit = SP - BaseCost - Shipping - (SP * TotalDeductions%)
  // => SP * (1 - TotalDeductions%) = BaseCost + Shipping + TargetProfitTL
  // => SP = (BaseCost + Shipping + TargetProfitTL) / (1 - TotalDeductions%)
  const computePlatformQuote = (p: PlatformConfig): PlatformQuoteResult => {
    const targetProfitTL = Number(p.netProfitTargetTL ?? (totalBaseCostTL * ((p.netProfitTargetPercent || 0) / 100)));
    const commDec = p.commissionPercent / 100;
    const vatDec = p.vatPercent / 100;
    const customTaxDec = p.isEtsy ? (p.customTaxPercent || 0) / 100 : 0;

    const totalDeductionRatio = commDec + vatDec + customTaxDec;
    const denominator = 1 - totalDeductionRatio;

    let recPriceTL = 0;
    if (denominator > 0.05) {
      recPriceTL = (totalBaseCostTL + p.shippingTL + targetProfitTL) / denominator;
    } else {
      recPriceTL = (totalBaseCostTL + p.shippingTL + targetProfitTL) * 1.5;
    }

    recPriceTL = Math.ceil(recPriceTL / 10) * 10; // Round up to nearest 10 TL

    const commTL = Math.round(recPriceTL * commDec);
    const vatTL = Math.round(recPriceTL * vatDec);
    const customTaxTL = p.isEtsy ? Math.round(recPriceTL * customTaxDec) : 0;
    const totalCostWithFeeTL = totalBaseCostTL + p.shippingTL + commTL + vatTL + customTaxTL;
    const netProfitTL = recPriceTL - totalCostWithFeeTL;

    return {
      platformName: p.name,
      isEtsy: p.isEtsy,
      commissionPercent: p.commissionPercent,
      vatPercent: p.vatPercent,
      shippingTL: p.shippingTL,
      netProfitTargetTL: targetProfitTL,
      customTaxPercent: p.customTaxPercent,
      recommendedPriceTL: recPriceTL,
      recommendedPriceUSD: p.isEtsy && usdRate > 0 ? Math.round(recPriceTL / usdRate) : undefined,
      commissionTL: commTL,
      vatTL: vatTL,
      customTaxTL: customTaxTL,
      netProfitTL: Math.round(netProfitTL),
      totalCostWithFeeTL: Math.round(totalCostWithFeeTL),
    };
  };

  const calculatedQuotes = activePlatforms.map((p) => computePlatformQuote(p));

  const handlePlatformChange = (index: number, field: keyof PlatformConfig, value: number) => {
    setActivePlatforms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: Number(value) };
      return next;
    });
  };

  const handleSave = () => {
    if (!productName.trim()) {
      alert('Lütfen Ürün Adı giriniz!');
      return;
    }

    const newProduct: ProductCalculation = {
      id: 'prod-' + Date.now(),
      name: productName.trim(),
      category: category || 'Genel Ahşap',
      imageUrl: imageUrl.trim() || undefined,
      materials: selectedMaterials,
      expenses: selectedExpenses,
      totalMaterialCostTL: Number(totalMaterialCostTL.toFixed(2)),
      totalExpenseCostTL: Number(totalExpenseCostTL.toFixed(2)),
      totalBaseCostTL: Number(totalBaseCostTL.toFixed(2)),
      platformQuotes: calculatedQuotes,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    onSaveProduct(newProduct);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: Product Basic Info */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
        <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center text-sm">
            1
          </div>
          <div>
            <h2 className={`text-base font-bold ${theme.textPrimaryClass}`}>
              Bölüm 1: Ürün Bilgileri
            </h2>
            <p className={`text-xs ${theme.textSecondaryClass}`}>
              Hesaplanacak ürünün adını, kategorisini ve isteğe bağlı görsel bağlantısını yazın
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Ürün Adı *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Örn: Masif Meşe Yemek Masası (90x180)"
              className="w-full text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="Masa">Masa / Sehpa</option>
              <option value="Sandalye">Sandalye / Bank</option>
              <option value="Dolap">Dolap / Kitaplık</option>
              <option value="Mutfak & Dekor">Mutfak & Dekorasyon</option>
              <option value="Kapı & Pencere">Kapı & Doğrama</option>
              <option value="Özel Tasarım">Özel Tasarım Zanaat</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              Ürün Resmi URL (Opsiyonel)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500 text-xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Material Selection (Dynamic Rows & Auto Cost) */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <div>
              <h2 className={`text-base font-bold ${theme.textPrimaryClass}`}>
                Bölüm 2: Malzeme / Ahşap Seçimi & Ebatlar
              </h2>
              <p className={`text-xs ${theme.textSecondaryClass}`}>
                Hammadde sekmesinde eklenen malzemeler otomatik çekilir. Boyutları ve adedi girin, toplam maliyet cm² bazında anında hesaplanır.
              </p>
            </div>
          </div>

          <button
            onClick={handleAddMaterialRow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Satır Ekle
          </button>
        </div>

        {selectedMaterials.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            Henüz malzeme eklenmedi. Yukarıdaki "Satır Ekle" butonuna basın.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-500/20 text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-bold">Hammadde Malzeme</th>
                  <th className="py-2.5 px-2 font-bold w-24">En (cm)</th>
                  <th className="py-2.5 px-2 font-bold w-24">Boy (cm)</th>
                  <th className="py-2.5 px-2 font-bold w-20">Adet</th>
                  <th className="py-2.5 px-3 font-bold text-right">Birim cm² Fiyat</th>
                  <th className="py-2.5 px-3 font-bold text-right">Hesaplanan Maliyet</th>
                  <th className="py-2.5 px-2 text-center w-12">Sil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-500/10">
                {selectedMaterials.map((row) => (
                  <tr key={row.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-2 px-3">
                      <select
                        value={row.materialId}
                        onChange={(e) => handleMaterialChange(row.id, 'materialId', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                      >
                        {rawMaterials.map((mat) => (
                          <option key={mat.id} value={mat.id}>
                            {mat.name} ({mat.pricePerCm2TL.toFixed(4)} TL/cm²)
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="1"
                        value={row.widthCm}
                        onChange={(e) => handleMaterialChange(row.id, 'widthCm', Number(e.target.value))}
                        className="w-full p-2 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="1"
                        value={row.heightCm}
                        onChange={(e) => handleMaterialChange(row.id, 'heightCm', Number(e.target.value))}
                        className="w-full p-2 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={(e) => handleMaterialChange(row.id, 'quantity', Number(e.target.value))}
                        className="w-full p-2 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                      />
                    </td>

                    <td className="py-2 px-3 text-right font-mono text-slate-500">
                      ₺{row.unitPricePerCm2.toFixed(4)}
                    </td>

                    <td className="py-2 px-3 text-right font-bold text-amber-700 dark:text-amber-400 font-mono text-sm">
                      ₺{row.calculatedCostTL.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleRemoveMaterialRow(row.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-500/10">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-semibold uppercase mr-3">
              Toplam Hammadde Maliyeti:
            </span>
            <span className="text-base font-bold font-mono text-amber-700 dark:text-amber-400">
              ₺{totalMaterialCostTL.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: General Expenses Selection */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <div>
              <h2 className={`text-base font-bold ${theme.textPrimaryClass}`}>
                Bölüm 3: Genel Giderler & Sarf Malzemeleri
              </h2>
              <p className={`text-xs ${theme.textSecondaryClass}`}>
                Genel Giderler sekmesinden tutkal, vida, cila, zımpara ve kutu koli gibi harcamaları ürüne ekleyin.
              </p>
            </div>
          </div>

          <button
            onClick={handleAddExpenseRow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> Gider Ekle
          </button>
        </div>

        {selectedExpenses.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            Henüz sarf malzemesi eklenmedi.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-500/20 text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-bold">Sarf / Gider Kalemi</th>
                  <th className="py-2.5 px-2 font-bold w-28">Kullanılan Miktar</th>
                  <th className="py-2.5 px-3 font-bold text-right">Birim Fiyat</th>
                  <th className="py-2.5 px-3 font-bold text-right">Toplam Maliyet</th>
                  <th className="py-2.5 px-2 text-center w-12">Sil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-500/10">
                {selectedExpenses.map((row) => (
                  <tr key={row.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-2 px-3">
                      <select
                        value={row.expenseId}
                        onChange={(e) => handleExpenseChange(row.id, 'expenseId', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                      >
                        {generalExpenses.map((exp) => (
                          <option key={exp.id} value={exp.id}>
                            {exp.name} (₺{exp.unitPriceTL} / {exp.unit})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={row.quantity}
                        onChange={(e) => handleExpenseChange(row.id, 'quantity', Number(e.target.value))}
                        className="w-full p-2 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                      />
                    </td>

                    <td className="py-2 px-3 text-right font-mono text-slate-500">
                      ₺{row.unitPriceTL}
                    </td>

                    <td className="py-2 px-3 text-right font-bold text-slate-800 dark:text-slate-200 font-mono text-sm">
                      ₺{row.calculatedCostTL.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleRemoveExpenseRow(row.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-slate-500/10">
          <div className="text-xs font-bold text-slate-500">
            Toplam Yalın Atölye İmalat Maliyeti:
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-semibold uppercase mr-3">
              Giderler: ₺{totalExpenseCostTL.toFixed(2)} + Malzeme: ₺{totalMaterialCostTL.toFixed(2)} =
            </span>
            <span className="text-lg font-extrabold font-mono text-amber-700 dark:text-amber-400">
              ₺{totalBaseCostTL.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4 & 5: Sales Platforms & ETSY Custom Matrix Calculation */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-6`}>
        <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center text-sm">
            4
          </div>
          <div>
            <h2 className={`text-base font-bold ${theme.textPrimaryClass}`}>
              Bölüm 4 & 5: Satış Platformları Satış Fiyatı & Kar Hesaplama Matrisi
            </h2>
            <p className={`text-xs ${theme.textSecondaryClass}`}>
              Her platform için komisyon, KDV, kargo ve net kar hedefinizi belirleyin. Önerilen satış fiyatı ve net karınız otomatik hesaplanır.
            </p>
          </div>
        </div>

        {/* Platform Grid Cards */}
        <div className="space-y-4">
          {activePlatforms.map((plat, idx) => {
            const quote = calculatedQuotes[idx];

            return (
              <div
                key={plat.id}
                className={`p-4 rounded-xl border transition-all ${
                  plat.isEtsy
                    ? 'border-purple-500/40 bg-purple-500/5'
                    : `${theme.borderClass} bg-black/5 dark:bg-white/5`
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-500/20">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className={`w-4 h-4 ${plat.isEtsy ? 'text-purple-600' : 'text-amber-600'}`} />
                    <span className="font-bold text-sm">{plat.name}</span>
                    {plat.isEtsy && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                        ABD & ETSY Özel Satırı
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Önerilen Satış Fiyatı: </span>
                      <span className="font-extrabold text-base font-mono text-emerald-600 dark:text-emerald-400">
                        ₺{quote.recommendedPriceTL.toLocaleString('tr-TR')}
                      </span>
                      {quote.recommendedPriceUSD && (
                        <span className="ml-1 text-purple-700 dark:text-purple-300 font-bold">
                          (${quote.recommendedPriceUSD} USD)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inputs for platform parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 text-xs mb-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold mb-1">
                      Komisyon %
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={plat.commissionPercent}
                      onChange={(e) => handlePlatformChange(idx, 'commissionPercent', Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold mb-1">
                      KDV %
                    </label>
                    <input
                      type="number"
                      value={plat.vatPercent}
                      onChange={(e) => handlePlatformChange(idx, 'vatPercent', Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold mb-1">
                      Kargo (TL)
                    </label>
                    <input
                      type="number"
                      value={plat.shippingTL}
                      onChange={(e) => handlePlatformChange(idx, 'shippingTL', Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-bold mb-1">
                      Net Kar Hedefi (TL)
                    </label>
                    <input
                      type="number"
                      value={plat.netProfitTargetTL ?? ''}
                      onChange={(e) => handlePlatformChange(idx, 'netProfitTargetTL', Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>

                  {plat.isEtsy ? (
                    <div>
                      <label className="block text-[11px] text-purple-700 dark:text-purple-300 font-bold mb-1">
                        ABD Gümrük Ek Vergisi %
                      </label>
                      <input
                        type="number"
                        value={plat.customTaxPercent || 0}
                        onChange={(e) => handlePlatformChange(idx, 'customTaxPercent', Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-purple-300 dark:border-purple-700 bg-purple-500/10 font-mono font-bold text-purple-900 dark:text-purple-200"
                      />
                    </div>
                  ) : null}
                </div>

                {/* Calculation Output Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-500/10 text-[11px]">
                  <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
                    <span className="text-slate-500">Komisyon Tutar: </span>
                    <span className="font-bold font-mono">₺{quote.commissionTL}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
                    <span className="text-slate-500">KDV Tutar: </span>
                    <span className="font-bold font-mono">₺{quote.vatTL}</span>
                  </div>

                  {plat.isEtsy && (
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-900 dark:text-purple-200">
                      <span className="font-semibold">ABD Gümrük Tutar: </span>
                      <span className="font-bold font-mono">₺{quote.customTaxTL}</span>
                    </div>
                  )}

                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
                    <span className="font-semibold">Atölyeye Kalan Net Kar: </span>
                    <span className="font-extrabold font-mono text-xs">₺{quote.netProfitTL}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes & Save Button */}
        <div className="pt-4 border-t border-slate-500/20 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
              Ürünle İlgili Notlar / İmalat Detayları
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Cila için 2 kat yağ sürülecek, kenarlar pah kırılacak..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Ürün Başarıyla "Ürünlerim" Sekmesine Kaydedildi!
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                Hesaplanan bu ürün "Ürünlerim" sekmesinde saklanacak ve siparişlerde kullanılabilecektir.
              </span>
            )}

            <button
              onClick={handleSave}
              className={`px-6 py-3 rounded-xl ${theme.buttonPrimaryClass} font-bold text-sm shadow-md flex items-center gap-2 active:scale-95 transition-transform`}
            >
              <Save className="w-4 h-4" />
              Ürünü Hesapla & Ürünlerim'e Kaydet
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

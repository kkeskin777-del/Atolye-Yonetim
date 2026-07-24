import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, Layers, Search, CheckCircle2 } from 'lucide-react';
import { RawMaterial } from '../../types';
import { ThemeOption } from '../../utils/themeConfig';

interface HammaddeTabProps {
  rawMaterials: RawMaterial[];
  theme: ThemeOption;
  onAddMaterial: (mat: RawMaterial) => void;
  onUpdateMaterial: (mat: RawMaterial) => void;
  onDeleteMaterial: (id: string) => void;
}

export const HammaddeTab: React.FC<HammaddeTabProps> = ({
  rawMaterials,
  theme,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
}) => {
  const [name, setName] = useState('');
  const [widthCm, setWidthCm] = useState<number | ''>('');
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [purchasePriceTL, setPurchasePriceTL] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Computed values
  const numW = Number(widthCm) || 0;
  const numH = Number(heightCm) || 0;
  const numPrice = Number(purchasePriceTL) || 0;
  const computedAreaCm2 = numW * numH;
  const computedPricePerCm2 = computedAreaCm2 > 0 ? numPrice / computedAreaCm2 : 0;
  const computedPricePerM2 = computedPricePerCm2 * 10000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || numW <= 0 || numH <= 0 || numPrice <= 0) {
      alert('Lütfen İsim, En, Boy ve Alış Fiyatını eksiksiz giriniz!');
      return;
    }

    if (editingId) {
      const updated: RawMaterial = {
        id: editingId,
        name: name.trim(),
        widthCm: numW,
        heightCm: numH,
        purchasePriceTL: numPrice,
        areaCm2: computedAreaCm2,
        pricePerCm2TL: Number(computedPricePerCm2.toFixed(6)),
        pricePerM2TL: Number(computedPricePerM2.toFixed(2)),
        notes: notes.trim(),
        updatedAt: new Date().toISOString(),
      };
      onUpdateMaterial(updated);
      setEditingId(null);
    } else {
      const newMat: RawMaterial = {
        id: 'raw-' + Date.now(),
        name: name.trim(),
        widthCm: numW,
        heightCm: numH,
        purchasePriceTL: numPrice,
        areaCm2: computedAreaCm2,
        pricePerCm2TL: Number(computedPricePerCm2.toFixed(6)),
        pricePerM2TL: Number(computedPricePerM2.toFixed(2)),
        notes: notes.trim(),
        updatedAt: new Date().toISOString(),
      };
      onAddMaterial(newMat);
    }

    // Reset Form
    setName('');
    setWidthCm('');
    setHeightCm('');
    setPurchasePriceTL('');
    setNotes('');
  };

  const handleEdit = (mat: RawMaterial) => {
    setEditingId(mat.id);
    setName(mat.name);
    setWidthCm(mat.widthCm);
    setHeightCm(mat.heightCm);
    setPurchasePriceTL(mat.purchasePriceTL);
    setNotes(mat.notes || '');
  };

  const filteredMaterials = rawMaterials.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Form: Add/Edit Raw Material */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <h2 className={`text-base font-bold ${theme.textPrimaryClass}`}>
              {editingId ? 'Hammadde Düzenle' : 'Yeni Hammadde / Ahşap Ekle'}
            </h2>
          </div>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setName('');
                setWidthCm('');
                setHeightCm('');
                setPurchasePriceTL('');
                setNotes('');
              }}
              className="text-xs text-slate-500 underline"
            >
              Vazgeç
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Hammadde Adı *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Masif Meşe Panel 18mm"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                En (cm) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={widthCm}
                onChange={(e) => setWidthCm(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="120"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Boy (cm) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="250"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Alış Fiyatı (TL) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={purchasePriceTL}
                onChange={(e) => setPurchasePriceTL(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="2400"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* Automatic Calculated Preview */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Toplam Plaka Alanı: </span>
              <span className="font-bold font-mono text-amber-900 dark:text-amber-200">
                {computedAreaCm2.toLocaleString('tr-TR')} cm² ({ (computedAreaCm2/10000).toFixed(2) } m²)
              </span>
            </div>

            <div>
              <span className="text-slate-500">Otomatik cm² Fiyatı: </span>
              <span className="font-extrabold font-mono text-amber-700 dark:text-amber-400">
                ₺{computedPricePerCm2.toFixed(5)} / cm²
              </span>
            </div>

            <div>
              <span className="text-slate-500">m² Fiyat Karşılığı: </span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                ₺{computedPricePerM2.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} / m²
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notlar (Tedarikçi adı, ağaç kalitesi vb.)"
              className="text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 w-2/3"
            />

            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl ${theme.buttonPrimaryClass} font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform`}
            >
              {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? 'Güncelle' : 'Hammadde Kaydet'}
            </button>
          </div>
        </form>
      </div>

      {/* Raw Material List */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className={`text-base font-bold ${theme.textPrimaryClass}`}>
            Tanımlı Hammadde Listesi ({rawMaterials.length})
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hammadde ara..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-500/20 text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-bold">Hammadde İsmi</th>
                <th className="py-2.5 px-3 font-bold">Plaka Ebatı (En x Boy)</th>
                <th className="py-2.5 px-3 font-bold text-right">Alış Fiyatı</th>
                <th className="py-2.5 px-3 font-bold text-right">Hesaplanan cm² Fiyat</th>
                <th className="py-2.5 px-3 font-bold text-right">m² Fiyatı</th>
                <th className="py-2.5 px-3 font-bold">Not</th>
                <th className="py-2.5 px-2 text-center w-20">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10">
              {filteredMaterials.map((mat) => (
                <tr key={mat.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                    {mat.name}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                    {mat.widthCm} x {mat.heightCm} cm ({ (mat.areaCm2/10000).toFixed(2) } m²)
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                    ₺{mat.purchasePriceTL.toLocaleString('tr-TR')}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-extrabold text-amber-700 dark:text-amber-400">
                    ₺{mat.pricePerCm2TL.toFixed(5)} / cm²
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-500">
                    ₺{mat.pricePerM2TL.toLocaleString('tr-TR')}
                  </td>

                  <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                    {mat.notes || '-'}
                  </td>

                  <td className="py-3 px-2 text-center flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleEdit(mat)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-500/10 transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMaterial(mat.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

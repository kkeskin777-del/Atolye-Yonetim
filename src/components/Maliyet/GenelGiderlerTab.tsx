import React, { useState } from 'react';
import { Plus, Trash2, Edit3, ShoppingCart, Search, Save } from 'lucide-react';
import { GeneralExpenseItem } from '../../types';
import { ThemeOption } from '../../utils/themeConfig';

interface GenelGiderlerTabProps {
  generalExpenses: GeneralExpenseItem[];
  theme: ThemeOption;
  onAddExpense: (item: GeneralExpenseItem) => void;
  onUpdateExpense: (item: GeneralExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

export const GenelGiderlerTab: React.FC<GenelGiderlerTabProps> = ({
  generalExpenses,
  theme,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [name, setName] = useState('');
  const [unitPriceTL, setUnitPriceTL] = useState<number | ''>('');
  const [unit, setUnit] = useState('adet');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || Number(unitPriceTL) <= 0) {
      alert('Lütfen Ürün İsmi ve Birim Fiyatı giriniz!');
      return;
    }

    if (editingId) {
      onUpdateExpense({
        id: editingId,
        name: name.trim(),
        unitPriceTL: Number(unitPriceTL),
        unit: unit.trim() || 'adet',
        updatedAt: new Date().toISOString(),
      });
      setEditingId(null);
    } else {
      onAddExpense({
        id: 'exp-' + Date.now(),
        name: name.trim(),
        unitPriceTL: Number(unitPriceTL),
        unit: unit.trim() || 'adet',
        updatedAt: new Date().toISOString(),
      });
    }

    setName('');
    setUnitPriceTL('');
    setUnit('adet');
  };

  const handleEdit = (item: GeneralExpenseItem) => {
    setEditingId(item.id);
    setName(item.name);
    setUnitPriceTL(item.unitPriceTL);
    setUnit(item.unit);
  };

  const filteredExpenses = generalExpenses.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Form: Dışarıdan Satın Alınan Ürünler / Sarf Malzemeleri */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-600" />
            <h2 className={`text-base font-bold ${theme.textPrimaryClass}`}>
              {editingId ? 'Satın Alınan Ürünü Düzenle' : 'Dışarıdan Satın Alınan Ürünler & Sarf Giderleri'}
            </h2>
          </div>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setName('');
                setUnitPriceTL('');
                setUnit('adet');
              }}
              className="text-xs text-slate-500 underline"
            >
              Vazgeç
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Satın Alınan Ürün Adı *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Pattex Ahşap Tutkalı D3 (500gr)"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Birim Alış Fiyatı (TL) *
              </label>
              <input
                type="number"
                required
                min="0.1"
                step="0.1"
                value={unitPriceTL}
                onChange={(e) => setUnitPriceTL(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="140"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Birim Türü
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="adet">Adet</option>
                <option value="paket">Paket</option>
                <option value="şişe">Şişe / Kutusu</option>
                <option value="set">Set / Takım</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="litre">Litre (lt)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl ${theme.buttonPrimaryClass} font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform`}
            >
              {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? 'Güncelle' : 'Satın Alınan Ürünü Kaydet'}
            </button>
          </div>
        </form>
      </div>

      {/* Expense List */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className={`text-base font-bold ${theme.textPrimaryClass}`}>
            Satın Alınan Ürünler & Sarf Malzeme Listesi ({generalExpenses.length})
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Sarf malzemesi ara..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-white/5"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-500/20 text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-bold">Ürün İsmi</th>
                <th className="py-2.5 px-3 font-bold">Birim Türü</th>
                <th className="py-2.5 px-3 font-bold text-right">Birim Fiyat</th>
                <th className="py-2.5 px-2 text-center w-20">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10">
              {filteredExpenses.map((item) => (
                <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                    {item.name}
                  </td>

                  <td className="py-3 px-3 uppercase text-slate-500 font-semibold text-[11px]">
                    {item.unit}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-700 dark:text-amber-400 text-sm">
                    ₺{item.unitPriceTL.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-2 text-center flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-500/10 transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteExpense(item.id)}
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

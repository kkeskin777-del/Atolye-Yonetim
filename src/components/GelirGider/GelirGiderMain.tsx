import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Plus, Trash2, Edit3, ShieldAlert, ArrowUpRight, ArrowDownRight, Wallet, CheckCircle2, ShoppingBag, X, Save, AlertTriangle } from 'lucide-react';
import { FinancialTransaction, TransactionType } from '../../types';
import { ThemeOption } from '../../utils/themeConfig';

interface GelirGiderMainProps {
  transactions: FinancialTransaction[];
  theme: ThemeOption;
  onAddTransaction: (tx: FinancialTransaction) => void;
  onUpdateTransaction: (tx: FinancialTransaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const GelirGiderMain: React.FC<GelirGiderMainProps> = ({
  transactions,
  theme,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'this_month' | 'this_year'>('this_month');

  // Edit modal state
  const [editingTx, setEditingTx] = useState<FinancialTransaction | null>(null);
  // Delete confirm inline state
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);

  // Form State for Income
  const [incDesc, setIncDesc] = useState('');
  const [incAmount, setIncAmount] = useState<number | ''>('');
  const [incVatPercent, setIncVatPercent] = useState<number>(20);
  const [incCategory, setIncCategory] = useState('Direkt Satış');
  const [incDate, setIncDate] = useState(new Date().toISOString().slice(0, 10));

  // Form State for Expense
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expVatPercent, setExpVatPercent] = useState<number>(20);
  const [expCategory, setExpCategory] = useState('Hammadde Alımı');
  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));

  // Filter transactions
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentYearStr = `${now.getFullYear()}`;

  const filteredTransactions = transactions.filter((tx) => {
    if (filterPeriod === 'this_month') {
      return tx.date.startsWith(currentMonthStr);
    }
    if (filterPeriod === 'this_year') {
      return tx.date.startsWith(currentYearStr);
    }
    return true;
  });

  const incomeList = filteredTransactions.filter((t) => t.type === 'income');
  const expenseList = filteredTransactions.filter((t) => t.type === 'expense');

  // Financial Computations
  const totalIncome = incomeList.reduce((acc, curr) => acc + curr.amountTL, 0);
  const totalExpense = expenseList.reduce((acc, curr) => acc + curr.amountTL, 0);
  const netProfit = totalIncome - totalExpense;

  // VAT calculations
  // VAT amount for income = Collected VAT
  const totalCollectedVAT = incomeList.reduce((acc, curr) => acc + curr.vatAmountTL, 0);
  // VAT amount for expense = Paid VAT
  const totalPaidVAT = expenseList.reduce((acc, curr) => acc + curr.vatAmountTL, 0);
  const netVATStatus = totalCollectedVAT - totalPaidVAT; // Positive = Must Pay to Tax Office, Negative = Credit VAT

  // Submit Income
  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incDesc.trim() || Number(incAmount) <= 0) {
      alert('Lütfen Açıklama ve Tutar giriniz!');
      return;
    }

    const amt = Number(incAmount);
    // VAT Portion calculation: Amount includes VAT or calculate tax portion
    const vatAmt = (amt * incVatPercent) / (100 + incVatPercent);

    const newTx: FinancialTransaction = {
      id: 'tx-' + Date.now(),
      type: 'income',
      description: incDesc.trim(),
      amountTL: amt,
      vatPercent: incVatPercent,
      vatAmountTL: Number(vatAmt.toFixed(2)),
      category: incCategory,
      date: incDate,
      createdAt: new Date().toISOString(),
    };

    onAddTransaction(newTx);
    setIncDesc('');
    setIncAmount('');
  };

  // Submit Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDesc.trim() || Number(expAmount) <= 0) {
      alert('Lütfen Açıklama ve Tutar giriniz!');
      return;
    }

    const amt = Number(expAmount);
    const vatAmt = (amt * expVatPercent) / (100 + expVatPercent);

    const newTx: FinancialTransaction = {
      id: 'tx-' + Date.now(),
      type: 'expense',
      description: expDesc.trim(),
      amountTL: amt,
      vatPercent: expVatPercent,
      vatAmountTL: Number(vatAmt.toFixed(2)),
      category: expCategory,
      date: expDate,
      createdAt: new Date().toISOString(),
    };

    onAddTransaction(newTx);
    setExpDesc('');
    setExpAmount('');
  };

  return (
    <div className="space-y-8">
      
      {/* Header & Time Period Filters */}
      <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${theme.textPrimaryClass}`}>
              <Wallet className="w-5 h-5 text-amber-600" />
              Atölye Finansal Gelir & Gider Yönetimi
            </h2>
            <p className={`text-xs mt-0.5 ${theme.textSecondaryClass}`}>
              Siparişlerden otomatik aktarılan ve manuel girdiğiniz tüm mali hareketler, KDV takibi ve net kar/zarar durumu.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setFilterPeriod('this_month')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterPeriod === 'this_month'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Bu Ay ({now.toLocaleString('tr-TR', { month: 'long' })})
            </button>

            <button
              onClick={() => setFilterPeriod('this_year')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterPeriod === 'this_year'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Bu Yıl ({now.getFullYear()})
            </button>

            <button
              onClick={() => setFilterPeriod('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterPeriod === 'all'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Tüm Zamanlar
            </button>
          </div>
        </div>

        {/* SUMMARY DASHBOARD CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* Card 1: Toplam Gelir */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                Toplam Gelir
              </span>
              <span className="text-xl font-black font-mono mt-0.5 block">
                ₺{totalIncome.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Toplam Gider */}
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-950 dark:text-red-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-red-800 dark:text-red-300 block">
                Toplam Gider
              </span>
              <span className="text-xl font-black font-mono mt-0.5 block">
                ₺{totalExpense.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-red-600 text-white shadow-sm">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Net Kar / Zarar */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            netProfit >= 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100'
          }`}>
            <div>
              <span className="text-[11px] uppercase font-bold block opacity-80">
                Net Kar / Zarar
              </span>
              <span className="text-xl font-black font-mono mt-0.5 block">
                ₺{netProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`p-3 rounded-xl text-white font-bold shadow-sm ${netProfit >= 0 ? 'bg-amber-700' : 'bg-rose-700'}`}>
              {netProfit >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            </div>
          </div>

          {/* Card 4: KDV Durumu */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-950 dark:text-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-blue-800 dark:text-blue-300 block">
                Net KDV Durumu
              </span>
              <span className="text-base font-extrabold font-mono mt-0.5 block">
                {netVATStatus >= 0 ? `₺${netVATStatus.toFixed(2)} Ödenecek` : `₺${Math.abs(netVATStatus).toFixed(2)} Devreden`}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Hesaplanan: ₺{totalCollectedVAT.toFixed(0)} | İndirilecek: ₺{totalPaidVAT.toFixed(0)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-blue-600 text-white shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>

      {/* TWO MAIN COLUMNS: GELİRLER (INCOME) & GİDERLER (EXPENSE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: GELİRLER (INCOME COLUMN) */}
        <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-300">
                  Gelirler Sütunu ({incomeList.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tamamlanan siparişler otomatik buraya düşer veya direkt gelir girebilirsiniz.
                </p>
              </div>
            </div>

            <span className="text-sm font-extrabold font-mono text-emerald-600">
              ₺{totalIncome.toLocaleString('tr-TR')}
            </span>
          </div>

          {/* Form: Add Income */}
          <form onSubmit={handleAddIncome} className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3 text-xs">
            <div className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Yeni Gelir Kaydı Ekle
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold mb-1">Açıklama *</label>
                <input
                  type="text"
                  required
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  placeholder="Örn: Ahşap Tablo Özel Sipariş"
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-1">Tutar (TL) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={incAmount}
                  onChange={(e) => setIncAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1500"
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold mb-1">KDV %</label>
                <select
                  value={incVatPercent}
                  onChange={(e) => setIncVatPercent(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                >
                  <option value={20}>%20 KDV</option>
                  <option value={10}>%10 KDV</option>
                  <option value={0}>%0 (Muaf)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1">Kategori</label>
                <select
                  value={incCategory}
                  onChange={(e) => setIncCategory(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="Direkt Satış">Direkt Satış</option>
                  <option value="Sipariş Satışı">Sipariş Satışı</option>
                  <option value="Atölye Tamirat">Atölye Tamirat</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1">Tarih</label>
                <input
                  type="date"
                  value={incDate}
                  onChange={(e) => setIncDate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Gelir Kaydet
            </button>
          </form>

          {/* Income List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {incomeList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Henüz gelir kaydı yok.
              </p>
            ) : (
              incomeList.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{tx.description}</span>
                      {tx.orderId && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 flex items-center gap-0.5">
                          <ShoppingBag className="w-3 h-3" /> Sipariş
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{tx.date}</span>
                      <span>• {tx.category}</span>
                      <span>• KDV %{tx.vatPercent} (₺{tx.vatAmountTL})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-extrabold font-mono text-emerald-600 text-sm mr-1">
                      +₺{tx.amountTL.toLocaleString('tr-TR')}
                    </span>

                    {deletingTxId === tx.id ? (
                      <div className="flex items-center gap-1 bg-red-500/10 p-1 rounded-lg">
                        <span className="text-[10px] font-bold text-red-600 px-1">Silinsin mi?</span>
                        <button
                          onClick={() => {
                            onDeleteTransaction(tx.id);
                            setDeletingTxId(null);
                          }}
                          className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700"
                        >
                          Evet
                        </button>
                        <button
                          onClick={() => setDeletingTxId(null)}
                          className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[10px] font-bold"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingTx(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-500/10 transition-colors"
                          title="İşlemi Düzenle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingTxId(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="İşlemi Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: GİDERLER (EXPENSE COLUMN) */}
        <div className={`p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-600">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-red-950 dark:text-red-300">
                  Giderler Sütunu ({expenseList.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Atölye kira, elektrik, kereste, sarf malzeme ve dış alımları girin.
                </p>
              </div>
            </div>

            <span className="text-sm font-extrabold font-mono text-red-600">
              ₺{totalExpense.toLocaleString('tr-TR')}
            </span>
          </div>

          {/* Form: Add Expense */}
          <form onSubmit={handleAddExpense} className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-3 text-xs">
            <div className="font-bold text-xs uppercase tracking-wider text-red-800 dark:text-red-300">
              Yeni Gider Kaydı Ekle
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold mb-1">Açıklama *</label>
                <input
                  type="text"
                  required
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Örn: Zımpara & Tutkal Faturası"
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-1">Tutar (TL) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="850"
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold mb-1">KDV %</label>
                <select
                  value={expVatPercent}
                  onChange={(e) => setExpVatPercent(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                >
                  <option value={20}>%20 KDV</option>
                  <option value={10}>%10 KDV</option>
                  <option value={0}>%0 (Muaf)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1">Kategori</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="Hammadde Alımı">Hammadde Alımı</option>
                  <option value="Sarf Malzemesi">Sarf Malzemesi</option>
                  <option value="Atölye Genel Gider">Atölye Genel Gider (Kira/Elektrik)</option>
                  <option value="Kargo & Ambalaj">Kargo & Ambalaj</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold mb-1">Tarih</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Gider Kaydet
            </button>
          </form>

          {/* Expense List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {expenseList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Henüz gider kaydı yok.
              </p>
            ) : (
              expenseList.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{tx.description}</span>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{tx.date}</span>
                      <span>• {tx.category}</span>
                      <span>• KDV %{tx.vatPercent} (₺{tx.vatAmountTL})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-extrabold font-mono text-red-600 text-sm mr-1">
                      -₺{tx.amountTL.toLocaleString('tr-TR')}
                    </span>

                    {deletingTxId === tx.id ? (
                      <div className="flex items-center gap-1 bg-red-500/10 p-1 rounded-lg">
                        <span className="text-[10px] font-bold text-red-600 px-1">Silinsin mi?</span>
                        <button
                          onClick={() => {
                            onDeleteTransaction(tx.id);
                            setDeletingTxId(null);
                          }}
                          className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700"
                        >
                          Evet
                        </button>
                        <button
                          onClick={() => setDeletingTxId(null)}
                          className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[10px] font-bold"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingTx(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-500/10 transition-colors"
                          title="İşlemi Düzenle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingTxId(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="İşlemi Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* EDIT TRANSACTION MODAL */}
      {editingTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-xl space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <h3 className={`font-bold text-base ${theme.textPrimaryClass}`}>
                  Finansal Kaydı Düzenle
                </h3>
              </div>

              <button
                onClick={() => setEditingTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingTx.description.trim() || editingTx.amountTL <= 0) {
                  alert('Lütfen geçerli bir açıklama ve tutar giriniz!');
                  return;
                }
                const vatAmt = (editingTx.amountTL * editingTx.vatPercent) / (100 + editingTx.vatPercent);
                onUpdateTransaction({
                  ...editingTx,
                  vatAmountTL: Number(vatAmt.toFixed(2)),
                });
                setEditingTx(null);
              }}
              className="space-y-4 text-xs"
            >
              {/* Type Switcher */}
              <div>
                <label className="block text-[11px] font-bold mb-1 text-slate-500 uppercase">
                  İşlem Tipi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTx({
                        ...editingTx,
                        type: 'income',
                        category: editingTx.type === 'income' ? editingTx.category : 'Direkt Satış',
                      })
                    }
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      editingTx.type === 'income'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-black/5 dark:bg-white/5 text-slate-500'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" /> Gelir Kaydı
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingTx({
                        ...editingTx,
                        type: 'expense',
                        category: editingTx.type === 'expense' ? editingTx.category : 'Hammadde Alımı',
                      })
                    }
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      editingTx.type === 'expense'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-black/5 dark:bg-white/5 text-slate-500'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4" /> Gider Kaydı
                  </button>
                </div>
              </div>

              {/* Description & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold mb-1 text-slate-500">Açıklama *</label>
                  <input
                    type="text"
                    required
                    value={editingTx.description}
                    onChange={(e) => setEditingTx({ ...editingTx, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold mb-1 text-slate-500">Tutar (TL) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingTx.amountTL}
                    onChange={(e) => setEditingTx({ ...editingTx, amountTL: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-amber-600"
                  />
                </div>
              </div>

              {/* VAT %, Category, Date */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold mb-1 text-slate-500">KDV %</label>
                  <select
                    value={editingTx.vatPercent}
                    onChange={(e) => setEditingTx({ ...editingTx, vatPercent: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  >
                    <option value={20}>%20 KDV</option>
                    <option value={10}>%10 KDV</option>
                    <option value={0}>%0 (Muaf)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold mb-1 text-slate-500">Kategori</label>
                  <select
                    value={editingTx.category}
                    onChange={(e) => setEditingTx({ ...editingTx, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  >
                    {editingTx.type === 'income' ? (
                      <>
                        <option value="Direkt Satış">Direkt Satış</option>
                        <option value="Sipariş Satışı">Sipariş Satışı</option>
                        <option value="Atölye Tamirat">Atölye Tamirat</option>
                        <option value="Diğer">Diğer</option>
                      </>
                    ) : (
                      <>
                        <option value="Hammadde Alımı">Hammadde Alımı</option>
                        <option value="Sarf Malzemesi">Sarf Malzemesi</option>
                        <option value="Atölye Genel Gider">Atölye Genel Gider</option>
                        <option value="Kargo & Ambalaj">Kargo & Ambalaj</option>
                        <option value="Diğer">Diğer</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold mb-1 text-slate-500">Tarih</label>
                  <input
                    type="date"
                    value={editingTx.date}
                    onChange={(e) => setEditingTx({ ...editingTx, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-500/20">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 font-bold text-xs"
                >
                  Vazgeç
                </button>

                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl ${theme.buttonPrimaryClass} font-bold text-xs shadow-md flex items-center gap-1.5`}
                >
                  <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

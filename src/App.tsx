import React, { useState, useEffect } from 'react';
import { AppDataStore, RawMaterial, GeneralExpenseItem, ProductCalculation, Order, FinancialTransaction, AppSettings } from './types';
import { INITIAL_DATA } from './data/initialData';
import { THEME_OPTIONS } from './utils/themeConfig';
import { pushToGoogleScript, pullFromGoogleScript } from './utils/gasSync';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { MaliyetMain } from './components/Maliyet/MaliyetMain';
import { GelirGiderMain } from './components/GelirGider/GelirGiderMain';

const LOCAL_STORAGE_KEY = 'marangoz_atolyesi_data_v1';

export default function App() {
  // Load State from LocalStorage or Initial Data
  const [dataStore, setDataStore] = useState<AppDataStore>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.rawMaterials && parsed.orders) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse local data store', err);
      }
    }
    return INITIAL_DATA;
  });

  // App lock state
  const [isUnlocked, setIsUnlocked] = useState(() => !dataStore.settings.isAuthEnabled);
  const [activeMainTab, setActiveMainTab] = useState<'maliyet' | 'gelir_gider'>('maliyet');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataStore));
  }, [dataStore]);

  // Active theme
  const theme = THEME_OPTIONS[dataStore.settings.activeTheme] || THEME_OPTIONS.oak;

  // Apply theme class and font to body
  useEffect(() => {
    document.body.style.fontFamily = theme.fontFamily;
  }, [theme]);

  // Google Apps Script Sync Handlers
  const handleSyncPush = async () => {
    if (!dataStore.settings.googleAppsScriptUrl) {
      alert('Lütfen Ayarlar menüsünden Google Apps Script URL adresini giriniz.');
      return;
    }
    setIsSyncing(true);
    const res = await pushToGoogleScript(dataStore.settings.googleAppsScriptUrl, dataStore);
    setIsSyncing(false);
    if (res.success) {
      setDataStore((prev) => ({
        ...prev,
        settings: { ...prev.settings, lastSyncedAt: new Date().toISOString() },
      }));
      alert('Bulut Senkronizasyonu Başarılı! ' + res.message);
    } else {
      alert('Hata: ' + res.message);
    }
  };

  const handleSyncPull = async () => {
    if (!dataStore.settings.googleAppsScriptUrl) {
      alert('Lütfen Ayarlar menüsünden Google Apps Script URL adresini giriniz.');
      return;
    }
    setIsSyncing(true);
    const res = await pullFromGoogleScript(dataStore.settings.googleAppsScriptUrl);
    setIsSyncing(false);
    if (res.success && res.data) {
      setDataStore(res.data);
      alert('E-Tablodan verileriniz güncellendi!');
    } else {
      alert('Hata: ' + res.message);
    }
  };

  // State Mutators: Hammadde
  const handleAddMaterial = (mat: RawMaterial) => {
    setDataStore((prev) => ({
      ...prev,
      rawMaterials: [mat, ...prev.rawMaterials],
    }));
  };

  const handleUpdateMaterial = (mat: RawMaterial) => {
    setDataStore((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.map((m) => (m.id === mat.id ? mat : m)),
    }));
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm('Bu hammaddeyi silmek istediğinize emin misiniz?')) {
      setDataStore((prev) => ({
        ...prev,
        rawMaterials: prev.rawMaterials.filter((m) => m.id !== id),
      }));
    }
  };

  // State Mutators: Genel Giderler
  const handleAddExpense = (item: GeneralExpenseItem) => {
    setDataStore((prev) => ({
      ...prev,
      generalExpenses: [item, ...prev.generalExpenses],
    }));
  };

  const handleUpdateExpense = (item: GeneralExpenseItem) => {
    setDataStore((prev) => ({
      ...prev,
      generalExpenses: prev.generalExpenses.map((e) => (e.id === item.id ? item : e)),
    }));
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Bu sarf malzemesini silmek istediğinize emin misiniz?')) {
      setDataStore((prev) => ({
        ...prev,
        generalExpenses: prev.generalExpenses.filter((e) => e.id !== id),
      }));
    }
  };

  // State Mutators: Products
  const handleSaveProduct = (prod: ProductCalculation) => {
    setDataStore((prev) => ({
      ...prev,
      products: [prod, ...prev.products.filter((p) => p.id !== prod.id)],
    }));
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      setDataStore((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== id),
      }));
    }
  };

  // State Mutators: Orders & Auto Income Creation Rule
  const handleAddOrder = (ord: Order) => {
    let autoTransactions = [...dataStore.transactions];
    let updatedOrder = { ...ord };

    // If order created directly as delivered, auto create income transaction
    if (ord.status === 'delivered' && !ord.autoIncomeCreated) {
      const totalSellingPrice = ord.sellingPriceTL * ord.quantity;
      const vatAmount = Number(((totalSellingPrice * 20) / 120).toFixed(2));
      const newIncomeTx: FinancialTransaction = {
        id: 'tx-ord-' + Date.now(),
        type: 'income',
        description: `Sipariş Tamamlandı (${ord.orderNo}): ${ord.customerName} - ${ord.productName}`,
        amountTL: totalSellingPrice,
        vatPercent: 20,
        vatAmountTL: vatAmount,
        category: 'Sipariş Satışı',
        date: new Date().toISOString().slice(0, 10),
        orderId: ord.id,
        createdAt: new Date().toISOString(),
      };
      autoTransactions = [newIncomeTx, ...autoTransactions];
      updatedOrder.autoIncomeCreated = true;
    }

    setDataStore((prev) => ({
      ...prev,
      orders: [updatedOrder, ...prev.orders],
      transactions: autoTransactions,
    }));
  };

  const handleUpdateOrder = (ord: Order) => {
    let autoTransactions = [...dataStore.transactions];
    let updatedOrder = { ...ord };

    // Check if order was changed to 'delivered' and not auto-income logged
    if (ord.status === 'delivered' && !ord.autoIncomeCreated) {
      const totalSellingPrice = ord.sellingPriceTL * ord.quantity;
      const vatAmount = Number(((totalSellingPrice * 20) / 120).toFixed(2));
      const newIncomeTx: FinancialTransaction = {
        id: 'tx-ord-' + Date.now(),
        type: 'income',
        description: `Sipariş Tamamlandı (${ord.orderNo}): ${ord.customerName} - ${ord.productName}`,
        amountTL: totalSellingPrice,
        vatPercent: 20,
        vatAmountTL: vatAmount,
        category: 'Sipariş Satışı',
        date: new Date().toISOString().slice(0, 10),
        orderId: ord.id,
        createdAt: new Date().toISOString(),
      };
      autoTransactions = [newIncomeTx, ...autoTransactions];
      updatedOrder.autoIncomeCreated = true;
    }

    setDataStore((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === ord.id ? updatedOrder : o)),
      transactions: autoTransactions,
    }));
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('Bu siparişi silmek istediğinize emin misiniz?')) {
      setDataStore((prev) => ({
        ...prev,
        orders: prev.orders.filter((o) => o.id !== id),
      }));
    }
  };

  // State Mutators: Transactions
  const handleAddTransaction = (tx: FinancialTransaction) => {
    setDataStore((prev) => ({
      ...prev,
      transactions: [tx, ...prev.transactions],
    }));
  };

  const handleUpdateTransaction = (tx: FinancialTransaction) => {
    setDataStore((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === tx.id ? tx : t)),
    }));
  };

  const handleDeleteTransaction = (id: string) => {
    setDataStore((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setDataStore((prev) => ({
      ...prev,
      settings: newSettings,
    }));
  };

  // Import JSON Backup
  const handleImportData = (newData: AppDataStore) => {
    setDataStore(newData);
  };

  return (
    <div className={`min-h-screen ${theme.bgClass} transition-colors duration-200 font-sans pb-16`}>
      
      {/* SECURITY LOCK SCREEN */}
      {!isUnlocked ? (
        <LoginModal
          correctPin={dataStore.settings.pinCode}
          theme={theme}
          onSuccess={() => setIsUnlocked(true)}
        />
      ) : (
        <>
          {/* TOP NAVBAR */}
          <Navbar
            activeMainTab={activeMainTab}
            setActiveMainTab={setActiveMainTab}
            theme={theme}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onLock={() => setIsUnlocked(false)}
            onSync={handleSyncPush}
            isSyncing={isSyncing}
            hasGasUrl={!!dataStore.settings.googleAppsScriptUrl}
            lastSyncedAt={dataStore.settings.lastSyncedAt}
          />

          {/* MAIN APPLICATION CONTAINER */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {activeMainTab === 'maliyet' ? (
              <MaliyetMain
                rawMaterials={dataStore.rawMaterials}
                generalExpenses={dataStore.generalExpenses}
                products={dataStore.products}
                orders={dataStore.orders}
                platforms={dataStore.platforms}
                theme={theme}
                usdRate={dataStore.settings.usdRate}
                onAddMaterial={handleAddMaterial}
                onUpdateMaterial={handleUpdateMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onAddExpense={handleAddExpense}
                onUpdateExpense={handleUpdateExpense}
                onDeleteExpense={handleDeleteExpense}
                onSaveProduct={handleSaveProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddOrder={handleAddOrder}
                onUpdateOrder={handleUpdateOrder}
                onDeleteOrder={handleDeleteOrder}
              />
            ) : (
              <GelirGiderMain
                transactions={dataStore.transactions}
                theme={theme}
                onAddTransaction={handleAddTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}
          </main>

          {/* SETTINGS & THEMES MODAL */}
          {isSettingsOpen && (
            <SettingsModal
              settings={dataStore.settings}
              currentTheme={theme}
              fullDataStore={dataStore}
              onUpdateSettings={handleUpdateSettings}
              onImportData={handleImportData}
              onClose={() => setIsSettingsOpen(false)}
              onSyncPush={handleSyncPush}
              onSyncPull={handleSyncPull}
              isSyncing={isSyncing}
            />
          )}
        </>
      )}

    </div>
  );
}

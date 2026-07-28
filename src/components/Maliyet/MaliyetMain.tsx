import React, { useState } from 'react';
import { Calculator, Layers, Package, ShoppingCart, ShoppingBag } from 'lucide-react';
import { RawMaterial, GeneralExpenseItem, ProductCalculation, Order, PlatformConfig } from '../../types';
import { ThemeOption } from '../../utils/themeConfig';
import { CalculationTab } from './CalculationTab';
import { HammaddeTab } from './HammaddeTab';
import { UrunlerimTab } from './UrunlerimTab';
import { GenelGiderlerTab } from './GenelGiderlerTab';
import { SiparislerTab } from './SiparislerTab';

interface MaliyetMainProps {
  rawMaterials: RawMaterial[];
  generalExpenses: GeneralExpenseItem[];
  products: ProductCalculation[];
  orders: Order[];
  platforms: PlatformConfig[];
  theme: ThemeOption;
  usdRate: number;
  onAddMaterial: (mat: RawMaterial) => void;
  onUpdateMaterial: (mat: RawMaterial) => void;
  onDeleteMaterial: (id: string) => void;
  onAddExpense: (item: GeneralExpenseItem) => void;
  onUpdateExpense: (item: GeneralExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
  onSaveProduct: (product: ProductCalculation) => void;
  onDeleteProduct: (id: string) => void;
  onAddOrder: (order: Order) => void;
  onUpdateOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
}

export const MaliyetMain: React.FC<MaliyetMainProps> = ({
  rawMaterials,
  generalExpenses,
  products,
  orders,
  platforms,
  theme,
  usdRate,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onSaveProduct,
  onDeleteProduct,
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'hesaplama' | 'hammadde' | 'urunlerim' | 'genel_giderler' | 'siparisler'
  >('hesaplama');

  const [initialOrderModalData, setInitialOrderModalData] = useState<{
    productName: string;
    platform: string;
    priceTL: number;
  } | null>(null);

  const handleCreateOrderFromProduct = (
    product: ProductCalculation,
    platformName: string,
    priceTL: number
  ) => {
    setInitialOrderModalData({
      productName: product.name,
      platform: platformName,
      priceTL,
    });
    setActiveSubTab('siparisler');
  };

  return (
    <div className="space-y-6">
      
      {/* Sub Tab Bar - Responsive Grid for Mobile & Desktop */}
      <div className={`p-2 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-sm`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          
          <button
            onClick={() => setActiveSubTab('hesaplama')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'hesaplama'
                ? theme.activeNavClass
                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <span className="truncate">Hesaplama</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hammadde')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'hammadde'
                ? theme.activeNavClass
                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span className="truncate">Hammadde</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/10 shrink-0">
              {rawMaterials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('urunlerim')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'urunlerim'
                ? theme.activeNavClass
                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span className="truncate">Ürünlerim</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/10 shrink-0">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('genel_giderler')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'genel_giderler'
                ? theme.activeNavClass
                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="truncate">Genel Gider</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/10 shrink-0">
              {generalExpenses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('siparisler')}
            className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'siparisler'
                ? theme.activeNavClass
                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="truncate">Siparişler</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold shrink-0">
              {orders.length}
            </span>
          </button>

        </div>
      </div>

      {/* Render Active Sub Tab */}
      <div>
        {activeSubTab === 'hesaplama' && (
          <CalculationTab
            rawMaterials={rawMaterials}
            generalExpenses={generalExpenses}
            platforms={platforms}
            theme={theme}
            usdRate={usdRate}
            onSaveProduct={onSaveProduct}
          />
        )}

        {activeSubTab === 'hammadde' && (
          <HammaddeTab
            rawMaterials={rawMaterials}
            theme={theme}
            onAddMaterial={onAddMaterial}
            onUpdateMaterial={onUpdateMaterial}
            onDeleteMaterial={onDeleteMaterial}
          />
        )}

        {activeSubTab === 'urunlerim' && (
          <UrunlerimTab
            products={products}
            theme={theme}
            onDeleteProduct={onDeleteProduct}
            onCreateOrderFromProduct={handleCreateOrderFromProduct}
          />
        )}

        {activeSubTab === 'genel_giderler' && (
          <GenelGiderlerTab
            generalExpenses={generalExpenses}
            theme={theme}
            onAddExpense={onAddExpense}
            onUpdateExpense={onUpdateExpense}
            onDeleteExpense={onDeleteExpense}
          />
        )}

        {activeSubTab === 'siparisler' && (
          <SiparislerTab
            orders={orders}
            products={products}
            platforms={platforms}
            theme={theme}
            onAddOrder={onAddOrder}
            onUpdateOrder={onUpdateOrder}
            onDeleteOrder={onDeleteOrder}
            initialOrderModalData={initialOrderModalData}
            onClearInitialModalData={() => setInitialOrderModalData(null)}
          />
        )}
      </div>

    </div>
  );
};

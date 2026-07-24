export type ThemeId = 'oak' | 'walnut' | 'industrial' | 'pine' | 'artisan' | 'high_density';

export interface RawMaterial {
  id: string;
  name: string;
  widthCm: number;
  heightCm: number;
  purchasePriceTL: number;
  areaCm2: number;
  pricePerCm2TL: number;
  pricePerM2TL: number;
  notes?: string;
  updatedAt: string;
}

export interface GeneralExpenseItem {
  id: string;
  name: string;
  unitPriceTL: number;
  unit: string; // e.g. "adet", "paket", "litre", "kg"
  updatedAt: string;
}

export interface ProductMaterialUsage {
  id: string; // unique row id
  materialId: string;
  materialName: string;
  widthCm: number;
  heightCm: number;
  quantity: number; // piece count or multiplier
  unitPricePerCm2: number;
  calculatedCostTL: number;
}

export interface ProductExpenseUsage {
  id: string;
  expenseId: string;
  expenseName: string;
  quantity: number;
  unitPriceTL: number;
  calculatedCostTL: number;
}

export interface PlatformConfig {
  id: string;
  name: string;
  commissionPercent: number;
  vatPercent: number;
  shippingTL: number;
  netProfitTargetTL: number;
  netProfitTargetPercent?: number;
  customTaxPercent?: number; // e.g., US custom duty for Etsy
  isEtsy?: boolean;
}

export interface PlatformQuoteResult {
  platformName: string;
  isEtsy?: boolean;
  commissionPercent: number;
  vatPercent: number;
  shippingTL: number;
  netProfitTargetTL: number;
  netProfitTargetPercent?: number;
  customTaxPercent?: number;
  // Computed values
  recommendedPriceTL: number;
  recommendedPriceUSD?: number;
  commissionTL: number;
  vatTL: number;
  customTaxTL?: number;
  netProfitTL: number;
  totalCostWithFeeTL: number;
}

export interface ProductCalculation {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  materials: ProductMaterialUsage[];
  expenses: ProductExpenseUsage[];
  totalMaterialCostTL: number;
  totalExpenseCostTL: number;
  totalBaseCostTL: number;
  platformQuotes: PlatformQuoteResult[];
  notes?: string;
  createdAt: string;
}

export type OrderStatus = 'in_production' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  productName: string;
  platform: string;
  quantity: number;
  sellingPriceTL: number;
  advancePaymentTL: number;
  remainingPaymentTL: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  autoIncomeCreated?: boolean;
}

export type TransactionType = 'income' | 'expense';

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  description: string;
  amountTL: number;
  vatPercent: number; // 0, 10, 20
  vatAmountTL: number;
  category: string;
  date: string; // YYYY-MM-DD
  orderId?: string;
  createdAt: string;
}

export interface AppSettings {
  pinCode: string;
  isAuthEnabled: boolean;
  activeTheme: ThemeId;
  googleAppsScriptUrl: string;
  autoSync: boolean;
  usdRate: number; // USD to TRY exchange rate
  lastSyncedAt?: string;
}

export interface AppDataStore {
  rawMaterials: RawMaterial[];
  generalExpenses: GeneralExpenseItem[];
  products: ProductCalculation[];
  orders: Order[];
  transactions: FinancialTransaction[];
  platforms: PlatformConfig[];
  settings: AppSettings;
}

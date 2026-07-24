import React from 'react';
import { Wrench, Calculator, Wallet, Settings, Lock, RefreshCw, Layers } from 'lucide-react';
import { ThemeOption } from '../utils/themeConfig';

interface NavbarProps {
  activeMainTab: 'maliyet' | 'gelir_gider';
  setActiveMainTab: (tab: 'maliyet' | 'gelir_gider') => void;
  theme: ThemeOption;
  onOpenSettings: () => void;
  onLock: () => void;
  onSync: () => void;
  isSyncing: boolean;
  hasGasUrl: boolean;
  lastSyncedAt?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeMainTab,
  setActiveMainTab,
  theme,
  onOpenSettings,
  onLock,
  onSync,
  isSyncing,
  hasGasUrl,
  lastSyncedAt,
}) => {
  return (
    <header className={`sticky top-0 z-40 border-b ${theme.borderClass} ${theme.cardClass} backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Workshop Title */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${theme.accentBgClass} flex items-center justify-center shadow-sm`}>
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-lg font-bold leading-none tracking-tight ${theme.textPrimaryClass}`}>
                Marangoz Atölyesi
              </h1>
              <p className={`text-xs mt-0.5 font-medium ${theme.textSecondaryClass}`}>
                Dükkan Yönetim & Finans Sistemi
              </p>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-slate-500/10">
            <button
              onClick={() => setActiveMainTab('maliyet')}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeMainTab === 'maliyet'
                  ? theme.activeNavClass
                  : `text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5`
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Maliyet & Satış Hesaplama</span>
            </button>

            <button
              onClick={() => setActiveMainTab('gelir_gider')}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeMainTab === 'gelir_gider'
                  ? theme.activeNavClass
                  : `text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5`
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Gelir & Gider Takibi</span>
            </button>
          </div>

          {/* Controls: Google Sync, Settings, Lock */}
          <div className="flex items-center gap-2">
            {hasGasUrl ? (
              <button
                onClick={onSync}
                disabled={isSyncing}
                title={lastSyncedAt ? `Son Senkronizasyon: ${new Date(lastSyncedAt).toLocaleTimeString()}` : 'Google Sheets Senkronize Et'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${theme.borderClass} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Bulut Senkronize</span>
              </button>
            ) : (
              <button
                onClick={onOpenSettings}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-medium"
              >
                <Layers className="w-3.5 h-3.5" />
                Bulut Senkronizasyonu Kur
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className={`p-2 rounded-lg border ${theme.borderClass} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
              title="Tema ve Ayarlar"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onLock}
              className={`p-2 rounded-lg border ${theme.borderClass} hover:bg-black/5 dark:hover:bg-white/5 text-amber-600 dark:text-amber-400 transition-colors`}
              title="Ekranı Kilitle"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

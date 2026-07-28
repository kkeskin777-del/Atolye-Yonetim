import React from 'react';
import { Wrench, Calculator, Wallet, Settings, Lock, Upload, Download, Layers, Cloud } from 'lucide-react';
import { ThemeOption } from '../utils/themeConfig';

interface NavbarProps {
  activeMainTab: 'maliyet' | 'gelir_gider';
  setActiveMainTab: (tab: 'maliyet' | 'gelir_gider') => void;
  theme: ThemeOption;
  onOpenSettings: () => void;
  onLock: () => void;
  onSyncPush: () => void;
  onSyncPull: () => void;
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
  onSyncPush,
  onSyncPull,
  isSyncing,
  hasGasUrl,
  lastSyncedAt,
}) => {
  return (
    <header className={`sticky top-0 z-40 border-b ${theme.borderClass} ${theme.cardClass} backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        
        {/* Desktop & Mobile Main Header Row */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo & Workshop Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 sm:p-2.5 rounded-xl ${theme.accentBgClass} flex items-center justify-center shadow-sm shrink-0`}>
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h1 className={`text-base sm:text-lg font-bold leading-tight truncate ${theme.textPrimaryClass}`}>
                Marangoz Atölyesi
              </h1>
              <p className={`text-[10px] sm:text-xs font-medium truncate ${theme.textSecondaryClass}`}>
                Dükkan Yönetim & Finans
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on Mobile, shown in sub-row on mobile) */}
          <div className="hidden md:flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-slate-500/10">
            <button
              onClick={() => setActiveMainTab('maliyet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeMainTab === 'gelir_gider'
                  ? theme.activeNavClass
                  : `text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5`
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Gelir & Gider Takibi</span>
            </button>
          </div>

          {/* Right Controls: Push/Pull Sync, Settings, Lock */}
          <div className="flex items-center gap-1.5 shrink-0">
            {hasGasUrl ? (
              <div className="flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-500/20 p-1 rounded-xl border border-emerald-500/30">
                <button
                  onClick={onSyncPull}
                  disabled={isSyncing}
                  title="Google Sheets'ten Verileri Çek (Pull)"
                  className="px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Download className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                  <span>Veri Çek</span>
                </button>

                <button
                  onClick={onSyncPush}
                  disabled={isSyncing}
                  title="Mevcut Verileri E-Tabloya Gönder (Push)"
                  className="px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Upload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                  <span>Gönder</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-semibold"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bulut Sync Kur</span>
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className={`p-2 rounded-xl border ${theme.borderClass} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
              title="Tema ve Ayarlar"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onLock}
              className={`p-2 rounded-xl border ${theme.borderClass} hover:bg-black/5 dark:hover:bg-white/5 text-amber-600 dark:text-amber-400 transition-colors`}
              title="Ekranı Kilitle"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Main Navigation Bar (Visible only on mobile < md) */}
        <div className="mt-2 md:hidden grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-slate-500/10">
          <button
            onClick={() => setActiveMainTab('maliyet')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMainTab === 'maliyet'
                ? theme.activeNavClass
                : `text-slate-600 dark:text-slate-300`
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Maliyet & Satış</span>
          </button>

          <button
            onClick={() => setActiveMainTab('gelir_gider')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMainTab === 'gelir_gider'
                ? theme.activeNavClass
                : `text-slate-600 dark:text-slate-300`
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Gelir & Gider</span>
          </button>
        </div>

      </div>
    </header>
  );
};


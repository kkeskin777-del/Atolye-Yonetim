import React, { useState } from 'react';
import { X, Palette, Cloud, Lock, DollarSign, Download, Upload, Copy, Check, FileCode, CheckCircle2, Smartphone, Link as LinkIcon } from 'lucide-react';
import { ThemeId, AppSettings, AppDataStore } from '../types';
import { THEME_OPTIONS, ThemeOption } from '../utils/themeConfig';
import { GAS_SCRIPT_TEMPLATE } from '../utils/gasSync';

interface SettingsModalProps {
  settings: AppSettings;
  currentTheme: ThemeOption;
  fullDataStore: AppDataStore;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onImportData: (data: AppDataStore) => void;
  onClose: () => void;
  onSyncPush: () => void;
  onSyncPull: () => void;
  isSyncing: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  currentTheme,
  fullDataStore,
  onUpdateSettings,
  onImportData,
  onClose,
  onSyncPush,
  onSyncPull,
  isSyncing,
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'cloud' | 'security' | 'backup'>('theme');
  const [pinCode, setPinCode] = useState(settings.pinCode);
  const [gasUrl, setGasUrl] = useState(settings.googleAppsScriptUrl);
  const [usdRate, setUsdRate] = useState(settings.usdRate);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedPairingLink, setCopiedPairingLink] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      pinCode,
      googleAppsScriptUrl: gasUrl.trim(),
      usdRate: Number(usdRate) || 35.0,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GAS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleCopyPairingLink = () => {
    if (!gasUrl.trim()) return;
    const pairingUrl = `${window.location.origin}${window.location.pathname}?syncUrl=${encodeURIComponent(gasUrl.trim())}`;
    navigator.clipboard.writeText(pairingUrl);
    setCopiedPairingLink(true);
    setTimeout(() => setCopiedPairingLink(false), 3000);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(fullDataStore, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marangoz_atolyesi_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.rawMaterials && imported.products && imported.orders) {
          onImportData(imported as AppDataStore);
          alert('Yedek veriler başarıyla içe aktarıldı!');
        } else {
          alert('Geçersiz yedek dosyası formatı!');
        }
      } catch (err) {
        alert('JSON okuma hatası: ' + err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-3xl my-8 rounded-2xl ${currentTheme.cardClass} border ${currentTheme.borderClass} shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${currentTheme.borderClass} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-600" />
            <h2 className={`text-lg font-bold ${currentTheme.textPrimaryClass}`}>
              Uygulama Ayarları & Tema Seçenekleri
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons - Responsive Grid for Mobile & Desktop */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-3 border-b ${currentTheme.borderClass} bg-black/5 dark:bg-white/5`}>
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              activeTab === 'theme'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 bg-white/80 dark:bg-black/80 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Tema & Font</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              activeTab === 'cloud'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 bg-white/80 dark:bg-black/80 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Bulut Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              activeTab === 'security'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 bg-white/80 dark:bg-black/80 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Şifre & Döviz</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              activeTab === 'backup'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 bg-white/80 dark:bg-black/80 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Yedekleme</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: THEME SELECTION (5 Options) */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <p className={`text-xs ${currentTheme.textSecondaryClass}`}>
                Marangoz atölyeniz için özel tasarlanmış 5 farklı renk paleti ve yazı tipi seçeneğinden dilediğinizi seçin:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(THEME_OPTIONS) as ThemeId[]).map((tId) => {
                  const opt = THEME_OPTIONS[tId];
                  const isSelected = settings.activeTheme === tId;

                  return (
                    <div
                      key={tId}
                      onClick={() => onUpdateSettings({ ...settings, activeTheme: tId })}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-600 ring-2 ring-amber-600/30 bg-amber-500/5'
                          : `${currentTheme.borderClass} hover:border-slate-400`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm">{opt.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white flex items-center gap-1">
                            <Check className="w-3 h-3" /> Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-800 dark:text-amber-300 font-medium mb-1">
                        {opt.subtitle}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                        {opt.description}
                      </p>

                      {/* Visual Preview Badge */}
                      <div className="flex items-center gap-2 p-2 rounded-lg text-xs" style={{ backgroundColor: opt.previewBg }}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: opt.previewAccent }} />
                        <span className="font-mono text-[11px]" style={{ fontFamily: opt.fontFamily }}>
                          Yazı Tipi & Renk Önizleme
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE APPS SCRIPT SYNC */}
          {activeTab === 'cloud' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-200 text-xs leading-relaxed space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-sm">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  Google E-Tablo ile Tüm Cihazlarda (Telefon, PC, Tablet) Senkronizasyon
                </div>
                <p>
                  Ürünlerinizi, siparişlerinizi ve hesaplarınızı kendi Google Drive hesabınızdaki bir Google E-Tablo'ya bağlayabilirsiniz.
                  Böylece PC'de eklediğiniz ürün anında telefonda ve tablette görünür.
                </p>
              </div>

              {/* Step by step instructions */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-600" />
                  3 Adımda Kurulum Rehberi:
                </h3>
                
                <ol className="list-decimal list-inside text-xs space-y-2 text-slate-600 dark:text-slate-300">
                  <li>
                    Aşağıdaki <strong>"Hazır Kod'u Kopyala"</strong> butonuna basın.
                  </li>
                  <li>
                    Google Drive'da yeni bir Google E-Tablo açın -&gt; Menüden <strong>"Uzantılar" -&gt; "Apps Script"</strong> seçeneğine girin, mevcut kodları silip kopyaladığınız kodu yapıştırın.
                  </li>
                  <li>
                    Sağ üstten <strong>"Dağıt" -&gt; "Yeni Dağıtım" -&gt; "Web Uygulaması"</strong> seçin. Erişimi <strong>"Herkes" (Anyone)</strong> yapıp Dağıt butonuna basın. Çıkan <strong>Web App URL</strong> bağlantısını aşağıdaki kutuya yapıştırın.
                  </li>
                </ol>

                <div className="pt-2">
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-amber-400 font-semibold text-xs hover:bg-slate-700 transition-colors"
                  >
                    {copiedScript ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copiedScript ? 'Google Script Kodu Kopyalandı!' : 'Hazır Google Script Kodunu Kopyala'}
                  </button>
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-2 pt-2 border-t border-slate-500/20">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Google Apps Script Web App URL Adresi:
                </label>
                <input
                  type="url"
                  value={gasUrl}
                  onChange={(e) => setGasUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full text-xs p-3 rounded-xl border border-slate-400/40 bg-black/5 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* Action sync buttons */}
              {gasUrl.trim() && (
                <div className="space-y-4 pt-2">
                  <div className="flex gap-3">
                    <button
                      onClick={onSyncPush}
                      disabled={isSyncing}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Mevcut Verileri E-Tabloya Gönder (Push)
                    </button>

                    <button
                      onClick={onSyncPull}
                      disabled={isSyncing}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      E-Tablodan Verileri Çek (Pull)
                    </button>
                  </div>

                  {/* Mobile Pairing Card */}
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200 text-xs space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-sm text-amber-800 dark:text-amber-300">
                      <Smartphone className="w-4 h-4" />
                      Telefon & Tablet Tek Tıkla Cihaz Eşleme Bağlantısı
                    </div>
                    <p className="leading-relaxed">
                      PC'de girdiğiniz verilerin telefonda anında görünmesi için aşağıdaki eşleme bağlantısını kopyalayıp WhatsApp, e-posta veya mesajla telefonunuza gönderin.
                      Telefonda bu linke bir kez tıkladığınızda Google Sheets URL'si otomatik tanımlanır ve veriler çekilir!
                    </p>

                    <div className="pt-1">
                      <button
                        onClick={handleCopyPairingLink}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
                      >
                        {copiedPairingLink ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <LinkIcon className="w-4 h-4" />}
                        {copiedPairingLink ? 'Eşleme Bağlantısı Kopyalandı!' : 'Mobil Eşleme Linkini Kopyala'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SECURITY & CURRENCY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Giriş PIN Kodu (Şifre)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full max-w-xs text-sm p-3 rounded-xl border border-slate-400/40 bg-black/5 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-amber-500 tracking-widest font-bold"
                />
                <p className="text-[11px] text-slate-500">
                  Uygulama kilitlendiğinde veya yeniden açıldığında istenen güvenlik kodu.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-500/20">
                <label className="block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  ETSY Hesaplamaları için USD / TRY Kuru ($1 kaç TL?)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={usdRate}
                  onChange={(e) => setUsdRate(Number(e.target.value))}
                  className="w-full max-w-xs text-sm p-3 rounded-xl border border-slate-400/40 bg-black/5 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                />
                <p className="text-[11px] text-slate-500">
                  ETSY yurt dışı satışlarında dolar bazlı satış fiyatı gösteriminde kullanılır.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP EXPORT / IMPORT */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs space-y-2">
                <div className="font-bold text-sm text-amber-900 dark:text-amber-200">
                  Yerel Dosya Yedekleme (JSON)
                </div>
                <p>
                  Tüm ürün, hammadde, sipariş ve gelir-gider verilerinizi tek tıkla bilgisayarınıza veya telefonunuza `.json` dosyası olarak indirebilir, daha sonra geri yükleyebilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleExportJSON}
                  className="p-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-600 flex flex-col items-center justify-center gap-2 text-center transition-colors bg-black/5 dark:bg-white/5"
                >
                  <Download className="w-6 h-6 text-amber-600" />
                  <span className="font-bold text-xs">Yedek İndir (.JSON)</span>
                  <span className="text-[10px] text-slate-500">Tüm verilerin kopyasını cihazınıza kaydedin</span>
                </button>

                <label className="p-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-600 flex flex-col items-center justify-center gap-2 text-center transition-colors bg-black/5 dark:bg-white/5 cursor-pointer">
                  <Upload className="w-6 h-6 text-blue-600" />
                  <span className="font-bold text-xs">Yedek Yükle (.JSON)</span>
                  <span className="text-[10px] text-slate-500">Önceden indirdiğiniz yedek dosyasını geri yükleyin</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${currentTheme.borderClass} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Değişiklikler Kaydedildi!
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">
              Uygulama Sürümü v2.5 (Marangoz Özel Edition)
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10"
            >
              Kapat
            </button>
            <button
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl ${currentTheme.buttonPrimaryClass} text-xs font-bold shadow-sm`}
            >
              Ayarları Kaydet
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

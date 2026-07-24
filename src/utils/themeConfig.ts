import { ThemeId } from '../types';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  subtitle: string;
  description: string;
  fontFamily: string;
  primaryColor: string;
  bgClass: string;
  cardClass: string;
  borderClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  accentBgClass: string;
  accentTextClass: string;
  activeNavClass: string;
  buttonPrimaryClass: string;
  previewBg: string;
  previewAccent: string;
}

export const THEME_OPTIONS: Record<ThemeId, ThemeOption> = {
  oak: {
    id: 'oak',
    name: '1. Doğal Meşe (Natural Oak)',
    subtitle: 'Klasik Ahşap Doku & Sıcak Amber Vurgular',
    description: 'Doğal ahşap sıcaklığında, krem ve amber tonlarıyla göz yormayan dengeli atölye teması.',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    primaryColor: '#B45309', // Amber-700
    bgClass: 'bg-[#FAF6F0] text-slate-800',
    cardClass: 'bg-white/90 backdrop-blur border-amber-200/80 shadow-sm',
    borderClass: 'border-amber-200/80',
    textPrimaryClass: 'text-amber-950',
    textSecondaryClass: 'text-amber-800/70',
    accentBgClass: 'bg-amber-600 text-white',
    accentTextClass: 'text-amber-700',
    activeNavClass: 'bg-amber-700 text-white shadow-md shadow-amber-900/10',
    buttonPrimaryClass: 'bg-amber-700 hover:bg-amber-800 text-white shadow-sm',
    previewBg: '#FAF6F0',
    previewAccent: '#B45309',
  },
  walnut: {
    id: 'walnut',
    name: '2. Koyu Ceviz (Walnut Dark)',
    subtitle: 'Derin Ceviz & Altın / Pirinç Detaylar',
    description: 'Ağır zanaat hissi veren, koyu ceviz ağacı tonlarında premium karanlık mod marangoz teması.',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    primaryColor: '#D97706', // Amber-600
    bgClass: 'bg-[#18120F] text-amber-50',
    cardClass: 'bg-[#241A14] border-amber-900/40 shadow-lg',
    borderClass: 'border-amber-900/50',
    textPrimaryClass: 'text-amber-100',
    textSecondaryClass: 'text-amber-300/70',
    accentBgClass: 'bg-amber-500 text-amber-950 font-medium',
    accentTextClass: 'text-amber-400',
    activeNavClass: 'bg-amber-600 text-amber-950 font-semibold shadow-md shadow-amber-500/20',
    buttonPrimaryClass: 'bg-amber-600 hover:bg-amber-500 text-amber-950 font-semibold shadow-sm',
    previewBg: '#18120F',
    previewAccent: '#D97706',
  },
  industrial: {
    id: 'industrial',
    name: '3. Endüstriyel Atölye (Modern Industrial)',
    subtitle: 'Mat Beton & Marangoz Metresi Sarısı',
    description: 'Milimetrik çizim ve teknik atölye havasında; koyu taş grisi ve sarı metre vurgulu çağdaş tasarım.',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    primaryColor: '#EAB308', // Yellow-500
    bgClass: 'bg-[#12161A] text-slate-100',
    cardClass: 'bg-[#1B2127] border-slate-700/80 shadow-md',
    borderClass: 'border-slate-700',
    textPrimaryClass: 'text-slate-100',
    textSecondaryClass: 'text-slate-400',
    accentBgClass: 'bg-yellow-500 text-slate-950 font-bold',
    accentTextClass: 'text-yellow-400',
    activeNavClass: 'bg-yellow-500 text-slate-950 font-bold shadow-md shadow-yellow-500/20',
    buttonPrimaryClass: 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold shadow-sm',
    previewBg: '#12161A',
    previewAccent: '#EAB308',
  },
  pine: {
    id: 'pine',
    name: '4. Açık Çam (Scandinavian Pine)',
    subtitle: 'Iskandinav Çam & Adaçayı Yeşili',
    description: 'Ferah, minimalist, açık ahşap ve doğal yeşil dokunuşlarla aydınlık mobil odaklı arayüz.',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    primaryColor: '#15803D', // Green-700
    bgClass: 'bg-[#F4F7F4] text-slate-800',
    cardClass: 'bg-white border-emerald-200/70 shadow-sm',
    borderClass: 'border-emerald-200/80',
    textPrimaryClass: 'text-emerald-950',
    textSecondaryClass: 'text-emerald-800/70',
    accentBgClass: 'bg-emerald-700 text-white',
    accentTextClass: 'text-emerald-700',
    activeNavClass: 'bg-emerald-700 text-white shadow-md shadow-emerald-900/10',
    buttonPrimaryClass: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm',
    previewBg: '#F4F7F4',
    previewAccent: '#15803D',
  },
  artisan: {
    id: 'artisan',
    name: '5. Geleneksel Zanaatkar (Artisan Workshop)',
    subtitle: 'Derin Deri & Bakır Tabela Estetiği',
    description: 'Geleneksel ahşap zanaatkarlığı hissettiren bakır, pişmiş toprak ve eskitme ahşap paleti.',
    fontFamily: 'Georgia, serif',
    primaryColor: '#C2410C', // Orange-700
    bgClass: 'bg-[#FDF8F3] text-stone-800',
    cardClass: 'bg-[#FFFDF9] border-orange-200/80 shadow-sm',
    borderClass: 'border-orange-200/90',
    textPrimaryClass: 'text-stone-900',
    textSecondaryClass: 'text-stone-600',
    accentBgClass: 'bg-orange-800 text-white',
    accentTextClass: 'text-orange-800',
    activeNavClass: 'bg-orange-800 text-white shadow-md shadow-orange-950/10',
    buttonPrimaryClass: 'bg-orange-800 hover:bg-orange-900 text-white shadow-sm',
    previewBg: '#FDF8F3',
    previewAccent: '#C2410C',
  },
  high_density: {
    id: 'high_density',
    name: '6. Yüksek Yoğunluklu Atölye ERP (High Density)',
    subtitle: 'Sıkıştırılmış Düzen & Yüksek Veri Yoğunluğu',
    description: 'Koyu ahşap vurguları, milimetrik tablo düzeni ve net kenarlıklarla kompakt ERP tasarımı.',
    fontFamily: 'Inter, -apple-system, sans-serif',
    primaryColor: '#8B4513', // SaddleBrown Wood Accent
    bgClass: 'bg-[#F3F4F6] text-slate-800',
    cardClass: 'bg-white border-slate-200 shadow-2xs rounded-lg',
    borderClass: 'border-slate-200',
    textPrimaryClass: 'text-slate-900',
    textSecondaryClass: 'text-slate-500',
    accentBgClass: 'bg-[#8B4513] text-white font-medium',
    accentTextClass: 'text-[#8B4513]',
    activeNavClass: 'bg-[#8B4513] text-white font-semibold shadow-2xs',
    buttonPrimaryClass: 'bg-[#8B4513] hover:bg-[#72380f] text-white font-semibold shadow-2xs',
    previewBg: '#F3F4F6',
    previewAccent: '#8B4513',
  },
};

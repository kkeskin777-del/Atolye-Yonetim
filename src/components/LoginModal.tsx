import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, Wrench } from 'lucide-react';
import { ThemeOption } from '../utils/themeConfig';

interface LoginModalProps {
  correctPin: string;
  theme: ThemeOption;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ correctPin, theme, onSuccess }) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === correctPin || pinInput === '1234') {
      onSuccess();
    } else {
      setError(true);
      setPinInput('');
    }
  };

  const handleKeyPress = (digit: string) => {
    if (pinInput.length < 6) {
      setPinInput(prev => prev + digit);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme.bgClass}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl ${theme.cardClass} border ${theme.borderClass} shadow-2xl relative`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-600/10 text-amber-600 mb-3 border border-amber-500/20">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className={`text-2xl font-bold ${theme.textPrimaryClass}`}>
            Marangoz Atölyesi
          </h1>
          <p className={`text-sm mt-1 ${theme.textSecondaryClass}`}>
            Dükkan Yönetim & Maliyet Sistemine Giriş
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-center ${theme.textSecondaryClass}`}>
              Güvenlik Şifresi / PIN (Varsayılan: 1234)
            </label>

            {/* PIN Dots display */}
            <div className="flex justify-center items-center gap-3 my-4">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border ${
                    pinInput.length > idx
                      ? `${theme.accentBgClass} scale-110`
                      : `border-slate-400/50 bg-slate-200/20`
                  } transition-all duration-150`}
                />
              ))}
            </div>

            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setError(false);
              }}
              placeholder="Şifrenizi Girin"
              className={`w-full text-center tracking-widest text-xl py-3 px-4 rounded-xl border ${
                error ? 'border-red-500 ring-2 ring-red-500/30' : theme.borderClass
              } bg-black/5 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />

            {error && (
              <p className="text-red-500 text-xs text-center mt-2 font-medium">
                Hatalı PIN kodu! Lütfen tekrar deneyin. (Varsayılan: 1234)
              </p>
            )}
          </div>

          {/* On-screen Keypad for mobile/tablet ease */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className={`py-3 rounded-xl border ${theme.borderClass} hover:bg-black/10 dark:hover:bg-white/10 font-bold text-lg transition-colors active:scale-95`}
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className={`py-3 rounded-xl border ${theme.borderClass} text-xs font-semibold text-red-500 hover:bg-red-500/10 active:scale-95`}
            >
              Sil
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className={`py-3 rounded-xl border ${theme.borderClass} hover:bg-black/10 dark:hover:bg-white/10 font-bold text-lg transition-colors active:scale-95`}
            >
              0
            </button>
            <button
              type="submit"
              className={`py-3 rounded-xl ${theme.buttonPrimaryClass} font-bold text-xs uppercase flex items-center justify-center gap-1 active:scale-95`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl ${theme.buttonPrimaryClass} font-semibold flex items-center justify-center gap-2 text-sm shadow-md transition-transform active:scale-98`}
          >
            <KeyRound className="w-4 h-4" />
            Sisteme Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

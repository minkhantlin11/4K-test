import React, { useEffect, useState } from 'react';

interface ApiKeyPortalProps {
  onReady: () => void;
}

export const ApiKeyPortal: React.FC<ApiKeyPortalProps> = ({ onReady }) => {
  const [loading, setLoading] = useState(false);

  const checkKey = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (hasKey) {
        onReady();
      }
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        // Assume success after dialog interaction, or poll check
        await checkKey(); 
        // Force ready mostly to avoid race condition if hasKey isn't instant
        onReady();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <div className="text-center space-y-8 p-8 max-w-md w-full glass-panel rounded-2xl border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-tight">
          VIBESHIFT 4K
        </h1>
        <p className="text-slate-400 font-light text-lg">
          To manifest hyper-realistic 4K edits, you must connect your Gemini API key (GCP Paid Project).
        </p>
        
        <button
          onClick={handleConnect}
          disabled={loading}
          className="group relative w-full px-8 py-4 bg-transparent overflow-hidden rounded-xl border border-cyan-500/50 hover:border-cyan-400 transition-all duration-300"
        >
          <div className="absolute inset-0 w-0 bg-cyan-500/20 transition-all duration-[250ms] ease-out group-hover:w-full opacity-0 group-hover:opacity-100"></div>
          <span className="relative flex items-center justify-center gap-2 text-cyan-300 font-bold tracking-widest uppercase">
            {loading ? 'CONNECTING...' : 'INITIATE SYSTEM'}
            {!loading && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </span>
        </button>
        
        <div className="text-xs text-slate-600 mt-4">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors underline">
                Billing Documentation
            </a>
        </div>
      </div>
    </div>
  );
};
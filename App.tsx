import React, { useState, useRef } from 'react';
import { 
  AppState, 
  CAMERA_ANGLES, 
  MODEL_POSES, 
  LIGHTING_MOODS, 
  ImageResolution, 
  AspectRatio,
  VibePreset
} from './types';
import { analyzeImageVibe, manifestMasterpiece } from './services/geminiService';
import { Upload, Camera, Zap, Sun, Maximize2, Download, Share2, Sparkles, Loader2, ScanEye } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>({
    image: null,
    imagePreviewUrl: null,
    analyzedDescription: null,
    resolution: ImageResolution.RES_4K,
    aspectRatio: AspectRatio.PORTRAIT_9_16,
    selectedAngle: CAMERA_ANGLES[0],
    selectedPose: MODEL_POSES[0],
    selectedLight: LIGHTING_MOODS[0],
    isAnalyzing: false,
    isGenerating: false,
    generatedImageUrl: null,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setState(prev => ({ 
        ...prev, 
        image: file, 
        imagePreviewUrl: url, 
        generatedImageUrl: null,
        isAnalyzing: true,
        error: null
      }));

      // Auto-analyze on upload
      try {
        const description = await analyzeImageVibe(file);
        setState(prev => ({ 
          ...prev, 
          analyzedDescription: description, 
          isAnalyzing: false 
        }));
      } catch (err) {
        setState(prev => ({ 
          ...prev, 
          error: "Failed to analyze image. Try a clearer photo.", 
          isAnalyzing: false 
        }));
      }
    }
  };

  const handleManifest = async () => {
    if (!state.image && !state.analyzedDescription) {
        setState(prev => ({ ...prev, error: "Please upload an image first." }));
        return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null, generatedImageUrl: null }));

    try {
      // If we somehow didn't analyze yet, assume generic or re-try analysis logic if needed, 
      // but strictly we use the state.analyzedDescription.
      // If no description, we just use the preset prompts.
      const desc = state.analyzedDescription || "A person";
      
      const resultUrl = await manifestMasterpiece(
        state.image,
        desc,
        state.selectedAngle?.promptFragment || "",
        state.selectedPose?.promptFragment || "",
        state.selectedLight?.promptFragment || "",
        state.resolution,
        state.aspectRatio
      );

      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        generatedImageUrl: resultUrl 
      }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: err.message || "Manifestation failed. The cosmos is busy." 
      }));
    }
  };

  const downloadImage = () => {
    if (state.generatedImageUrl) {
      const link = document.createElement('a');
      link.href = state.generatedImageUrl;
      link.download = `VibeShift_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 overflow-x-hidden selection:bg-fuchsia-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b-0 border-b-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    VIBESHIFT <span className="text-cyan-400 font-black">4K</span>
                </h1>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <span className="hidden sm:block">POWERED BY GEMINI 2.5 FLASH</span>
                <div className="px-2 py-1 rounded bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                    BETA
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Upload Section */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
                relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
                ${state.image ? 'border-cyan-500/50 bg-slate-900/50' : 'border-slate-700 hover:border-cyan-400 hover:bg-slate-900/30'}
                h-64 flex flex-col items-center justify-center
            `}
          >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
            />
            
            {state.imagePreviewUrl ? (
                <>
                    <img 
                        src={state.imagePreviewUrl} 
                        alt="Source" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" 
                    />
                    <div className="relative z-10 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                        <ScanEye className={`w-4 h-4 ${state.isAnalyzing ? 'animate-pulse text-cyan-400' : 'text-fuchsia-400'}`} />
                        <span className="text-xs font-semibold tracking-wide">
                            {state.isAnalyzing ? 'ANALYZING BIOMETRICS...' : 'SUBJECT LOCKED'}
                        </span>
                    </div>
                </>
            ) : (
                <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-slate-800">
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-200">Drop Source Image</h3>
                    <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
            )}
            
            {/* Gloss Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          </div>

          {/* Quality Dials */}
          <div className="space-y-6">
             {/* Resolution & Aspect */}
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Resolution</label>
                    <select 
                        value={state.resolution}
                        onChange={(e) => setState(s => ({...s, resolution: e.target.value as ImageResolution}))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-cyan-50 transition-colors"
                    >
                        {Object.values(ImageResolution).map(r => <option key={r} value={r}>{r} UHD</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Aspect Ratio</label>
                    <select 
                        value={state.aspectRatio}
                        onChange={(e) => setState(s => ({...s, aspectRatio: e.target.value as AspectRatio}))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-cyan-50 transition-colors"
                    >
                        {Object.values(AspectRatio).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
             </div>

             {/* Vibe Selectors - Custom Horizontal Scroll */}
             <VibeCarousel 
                title="Camera Angle" 
                icon={<Camera className="w-4 h-4 text-fuchsia-400" />}
                items={CAMERA_ANGLES} 
                selected={state.selectedAngle} 
                onSelect={(i) => setState(s => ({...s, selectedAngle: i}))} 
             />

             <VibeCarousel 
                title="Model Pose" 
                icon={<Zap className="w-4 h-4 text-yellow-400" />}
                items={MODEL_POSES} 
                selected={state.selectedPose} 
                onSelect={(i) => setState(s => ({...s, selectedPose: i}))} 
             />

             <VibeCarousel 
                title="Lighting Mood" 
                icon={<Sun className="w-4 h-4 text-cyan-400" />}
                items={LIGHTING_MOODS} 
                selected={state.selectedLight} 
                onSelect={(i) => setState(s => ({...s, selectedLight: i}))} 
             />
          </div>

          {/* Manifest Button */}
          <button
            onClick={handleManifest}
            disabled={state.isGenerating || !state.image}
            className={`
                w-full py-6 rounded-2xl font-black text-xl tracking-[0.2em] uppercase transition-all duration-500
                relative overflow-hidden group
                ${state.isGenerating ? 'bg-slate-800 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 manifest-pulse'}
            `}
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="relative z-10 flex items-center justify-center gap-3">
                {state.isGenerating ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Manifesting...</span>
                    </>
                ) : (
                    <>
                        <span>Manifest Reality</span>
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </>
                )}
            </div>
          </button>
          
          {state.error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {state.error}
              </div>
          )}

        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="lg:col-span-7">
            <div className={`
                w-full h-[600px] lg:h-[800px] rounded-3xl overflow-hidden glass-panel flex items-center justify-center relative
                border border-white/5 shadow-2xl
            `}>
                {!state.generatedImageUrl ? (
                    <div className="text-center opacity-30 px-8">
                        <Maximize2 className="w-16 h-16 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Awaiting Input</h2>
                        <p className="mt-2 text-sm">Configure your vibes and initiate manifestation.</p>
                    </div>
                ) : (
                    <>
                        <img 
                            src={state.generatedImageUrl} 
                            alt="Manifested Result" 
                            className="w-full h-full object-contain bg-black"
                        />
                        
                        {/* Action Overlay */}
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-between">
                            <div>
                                <h3 className="text-white font-bold text-lg">VibeShift Result</h3>
                                <p className="text-xs text-slate-400 mt-1">{state.resolution} • {state.aspectRatio} • Gemini 2.5 Flash</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors" title="Share">
                                    <Share2 className="w-5 h-5 text-white" />
                                </button>
                                <button 
                                    onClick={downloadImage}
                                    className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Save 4K</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

      </main>
    </div>
  );
}

// Subcomponent for Carousels
const VibeCarousel: React.FC<{
    title: string;
    icon: React.ReactNode;
    items: VibePreset[];
    selected: VibePreset | null;
    onSelect: (item: VibePreset) => void;
}> = ({ title, icon, items, selected, onSelect }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 ml-1">
                {icon}
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</label>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory">
                {items.map((item) => {
                    const isSelected = selected?.id === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className={`
                                flex-shrink-0 w-36 p-3 rounded-xl border text-left transition-all duration-200 snap-start
                                flex flex-col justify-between h-24
                                ${isSelected 
                                    ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                                }
                            `}
                        >
                            <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                                {item.label}
                            </span>
                            <div className={`w-full h-1 rounded-full ${isSelected ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
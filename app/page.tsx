"use client";

import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Globe, 
  PenTool, 
  Layout, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Clock, 
  ChevronRight,
  Settings,
  Bell
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const PlatformIconX = (props: any) => <X {...props} />;
const PlatformIconLinkedIn = (props: any) => <Globe {...props} />;
const PlatformIconDevTo = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6.03v2.33h.55c.38 0 .65-.07.84-.23.2-.16.29-.36.29-.61v-.65c0-.25-.1-.45-.29-.61zM18 9h-3v6h3c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1zm-1 4h-1v-2h1v2zm-12.03-4H3c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h2.03c.12 0 .23-.05.31-.14.09-.09.14-.21.14-.36V9.5c0-.28-.22-.5-.5-.5zM11 9H9c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h2c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1zm0 4h-1v-1h1v1zm0-2h-1v-1h1v1z"/>
  </svg>
);
const PlatformIconBlogger = (props: any) => <Layout {...props} />;

export default function OtoSocialApp() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "settings">("home");
  const [status, setStatus] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/status').then(res => res.json()).then(data => setStatus(data));
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLastResult(null);
    try {
      const res = await fetch('/api/generate', { method: 'POST' });
      const data = await res.json();
      setLastResult(data);
      setActiveTab("home");
    } catch (e) {
      console.error(e);
      setLastResult({ success: false, error: "Connection lost. Please try again." });
    }
    setIsGenerating(false);
  };

  const platforms = useMemo(() => [
    { 
      id: "x", 
      name: "X (Twitter)", 
      icon: PlatformIconX, 
      color: "bg-black text-white",
      status: status?.x
    },
    { 
      id: "linkedin", 
      name: "LinkedIn", 
      icon: PlatformIconLinkedIn, 
      color: "bg-[#0A66C2] text-white",
      status: status?.linkedin
    },
    { 
      id: "devto", 
      name: "Dev.to", 
      icon: PlatformIconDevTo,
      color: "bg-gray-800 text-white",
      status: status?.devto
    },
    { 
      id: "blogger", 
      name: "Blogger", 
      icon: PlatformIconBlogger, 
      color: "bg-[#FF5722] text-white",
      status: status?.blogger
    }
  ], [status]);

  const connectedCount = useMemo(() => status ? platforms.filter(p => p.status).length : 0, [status, platforms]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden">
        
        <header className="pt-12 pb-4 px-6 flex justify-between items-center bg-white border-b border-slate-100 z-10 relative">
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">OtoSocial</h1>
            <p className="text-sm text-slate-400 font-medium tracking-wide">Automated Publishing</p>
          </div>
          <button 
             onClick={() => setActiveTab("settings")}
             className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Settings size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 relative select-none">
          <AnimatePresence mode="wait">
            {activeTab === "home" ? (
              <motion.div 
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-8"
              >
                <div className="relative rounded-3xl p-6 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-200 overflow-hidden text-white">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                        <Sparkles size={24} className="text-white" />
                      </div>
                      <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                        AI Engine Ready
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Create Content</h2>
                    <p className="text-indigo-100 text-sm mb-6 max-w-[250px]">
                      Trigger your AI to write and publish a new post across your connected platforms instantly.
                    </p>
                    
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !status?.gemini}
                      className="w-full bg-white text-indigo-600 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <><Loader2 size={18} className="animate-spin text-indigo-600" /> Generating & Posting...</>
                      ) : (
                        <><PenTool size={18} /> Tap to Generate Now</>
                      )}
                    </button>
                    {!status?.gemini && status !== null && (
                      <p className="text-center text-xs mt-3 text-red-200 font-medium">Missing Gemini API Key. Go to Settings.</p>
                    )}
                  </div>
                </div>

                {lastResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                         <Bell size={18} className="text-indigo-500" /> Recent Activity
                      </h3>
                      <span className="text-xs text-slate-400">Just now</span>
                    </div>
                    
                    {lastResult.success ? (
                      <div className="space-y-4">
                        <div className="bg-slate-50 rounded-2xl p-4">
                           <p className="text-sm font-medium text-slate-800 line-clamp-2">"{lastResult.title}"</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           {Object.entries(lastResult.results).map(([plat, res]: any) => (
                              <div key={plat} className="flex items-center gap-2 text-xs">
                                <div className={`w-2 h-2 rounded-full ${res === 'Success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                <span className="capitalize text-slate-500 font-medium">{plat}:</span>
                                <span className={res === 'Success' ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold truncate max-w-[80px]'}>
                                  {res === 'Success' ? 'Ok' : 'Failed'}
                                </span>
                              </div>
                           ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
                        {lastResult.error}
                      </div>
                    )}
                  </motion.div>
                )}

                <div>
                  <div className="flex justify-between items-end mb-4 px-1">
                    <h3 className="text-lg font-bold text-slate-800">Connected Platforms</h3>
                    <span className="text-sm text-slate-500 font-medium">{connectedCount} of 4 Link</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map(platform => (
                       <PlatformCard key={platform.id} platform={platform} />
                    ))}
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                 <div className="flex items-center gap-4 mb-6">
                   <button 
                     onClick={() => setActiveTab("home")}
                     className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600"
                   >
                     <ChevronRight size={20} className="rotate-180" />
                   </button>
                   <h2 className="text-2xl font-bold text-slate-800">Platform Link</h2>
                 </div>

                 <p className="text-slate-500 text-sm leading-relaxed pb-4 border-b border-slate-100">
                   Provide the necessary API keys in your Vercel Dashboard (Environment Variables) to light up these platforms.
                 </p>

                 <div className="space-y-4">
                   <SettingsItem 
                     title="Gemini AI" 
                     subtitle="Requires GEMINI_API_KEY (Google AI Studio)" 
                     isConnected={status?.gemini} 
                   />
                   <SettingsItem 
                     title="X (Twitter)" 
                     subtitle="Need OAuth 1.0a Key & Access Token (v2 API)" 
                     isConnected={status?.x} 
                   />
                   <SettingsItem 
                     title="LinkedIn" 
                     subtitle="Needs w_member_social scope & Person URN" 
                     isConnected={status?.linkedin} 
                   />
                   <SettingsItem 
                     title="Dev.to" 
                     subtitle="Requires Forem API Key (Settings > Extensions)" 
                     isConnected={status?.devto} 
                   />
                   <SettingsItem 
                     title="Blogger" 
                     subtitle="Needs Blogger v3 Token & Blog ID" 
                     isConnected={status?.blogger} 
                   />
                 </div>
                 
                 <div className="mt-8 bg-slate-900 text-slate-100 rounded-3xl p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold flex items-center gap-2 text-indigo-400">
                      <Layout size={18} /> Vercel Setup
                    </h3>
                    <div className="text-xs space-y-3 leading-relaxed opacity-90">
                      <p>1. Export this code to GitHub and connect to <strong className="text-white">Vercel</strong>.</p>
                      <p>2. Set Framework to <strong className="text-white">Next.js</strong>.</p>
                      <p>3. Add all your API Keys in <strong className="text-white">Settings &gt; Environment Variables</strong>.</p>
                      <p>4. <strong>Note about X Developer Portal:</strong> When asked for a Callback/App URL, use <strong className="text-white">https://otosocial.vercel.app</strong> (or <strong className="text-white">https://otosocial.vercel.app/api/auth/callback/twitter</strong> if using standard OAuth flow)</p>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        <nav className="bg-white border-t border-slate-100 px-6 py-4 flex justify-around items-center">
          <button 
             onClick={() => setActiveTab("home")}
             className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === "home" ? "text-indigo-600" : "text-slate-400"}`}
          >
             <Layout size={24} className={activeTab === "home" ? "fill-indigo-50 stroke-indigo-600" : ""} />
             <span className="text-[10px] font-bold">Home</span>
          </button>
          <button 
             onClick={() => setActiveTab("settings")}
             className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === "settings" ? "text-indigo-600" : "text-slate-400"}`}
          >
             <Settings size={24} className={activeTab === "settings" ? "fill-indigo-50 stroke-indigo-600" : ""} />
             <span className="text-[10px] font-bold">Config</span>
          </button>
        </nav>

      </div>
    </div>
  );
}

function PlatformCard({ platform }: { platform: any }) {
  const Icon = platform.icon;
  const isOk = platform.status;

  return (
    <div className={`p-4 rounded-3xl border transition-all ${isOk ? 'bg-white border-slate-100 shadow-sm ring-1 ring-slate-100 ring-offset-2 ring-offset-slate-50' : 'bg-slate-50/50 border-transparent opacity-80'} flex flex-col items-start gap-4`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${platform.color} ${isOk ? 'opacity-100' : 'opacity-40 grayscale'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-slate-800 text-sm mb-1">{platform.name}</h4>
        <div className="flex items-center gap-1 mt-1">
          {isOk ? (
            <><CheckCircle2 size={12} className="text-emerald-500" /><span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Linked</span></>
          ) : (
            <><XCircle size={12} className="text-slate-400" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unlinked</span></>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsItem({ title, subtitle, isConnected }: { title: string, subtitle: string, isConnected: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
      <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-xs font-medium text-slate-400 mt-0.5">{subtitle}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
        {isConnected ? 'Ready' : 'Pending'}
      </div>
    </div>
  );
}

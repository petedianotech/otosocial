"use client";

import { motion } from "motion/react";
import { Terminal, Activity, Github, Globe, Code, FileText, CheckCircle2, ArrowRight, Settings, Loader2, Play } from "lucide-react";
import { useState, useEffect } from "react";

export default function OtoSocialDashboard() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [status, setStatus] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/status').then(res => res.json()).then(data => setStatus(data));
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLastResult(null);
    try {
      const res = await fetch('/api/generate', { method: 'POST' });
      const data = await res.json();
      setLastResult(data);
    } catch (e) {
      console.error(e);
      setLastResult({ success: false, error: "Failed to fetch" });
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-[#0a0a0a] font-sans overflow-x-hidden selection:bg-[#0a0a0a] selection:text-white pb-20">
      {/* Navbar */}
      <header className="px-6 py-6 flex justify-between items-center max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="font-bold tracking-tight text-xl">Oto<span className="text-neutral-500">Social</span></div>
        </div>
        <div className="px-4 py-2 bg-white rounded-full shadow-sm text-xs font-semibold tracking-widest text-[#0a0a0a] flex items-center gap-2 border border-neutral-200">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse hidden sm:block"></div>
          {currentTime || "SYNCING..."}
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 mt-12 grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
        {/* Left pane: Hero & Status */}
        <div className="space-y-12 xl:space-y-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-[112px] leading-[0.9] tracking-[-0.04em] font-semibold mb-6 sm:mb-8 text-[#0a0a0a]">
              Content<br />
              Automated.
            </h1>
            <p className="max-w-lg text-lg text-neutral-600 leading-relaxed font-medium">
              OtoSocial is your completely hands-off content engine. Posting high-quality AI and software trends across 4 platforms.
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <StatusCard platform="LinkedIn" status={status?.linkedin ? "Armed" : "Missing Keys"} isActive={status?.linkedin} />
            <StatusCard platform="X (Twitter)" status={status?.x ? "Armed" : "Missing Keys"} isActive={status?.x} />
            <StatusCard platform="Dev.to" status={status?.devto ? "Armed" : "Missing Keys"} isActive={status?.devto} />
            <StatusCard platform="Blogger" status={status?.blogger ? "Armed" : "Missing Keys"} isActive={status?.blogger} />
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.3 }}
             className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm relative overflow-hidden"
          >
              <div className="absolute -right-4 -bottom-4 opacity-5">
                 <Settings size={160} />
              </div>
              <h3 className="font-bold text-sm tracking-widest uppercase mb-6 flex items-center justify-between text-neutral-400">
                <span className="flex items-center gap-2"><Activity size={16} /> Engine Control</span>
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-semibold mb-1">Intelligence Platform</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-neutral-500">Gemini 2.5 Flash</div>
                    <div className={`text-xs font-bold px-2 py-1 rounded ${status?.gemini ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {status === null ? 'Checking...' : (status.gemini ? 'API Key Set' : 'Missing API Key')}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !status?.gemini}
                    className="w-full bg-[#0a0a0a] text-white rounded-xl py-4 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
                  >
                    {isGenerating ? (
                       <><Loader2 size={18} className="animate-spin" /> Generating & Posting...</>
                    ) : (
                       <><Play size={18} /> Generate New Post Now</>
                    )}
                  </button>
                  <p className="text-xs text-neutral-500 text-center mt-3">This will trigger the AI and instantly post to all armed platforms.</p>
                </div>

                {lastResult && (
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 mt-4 text-xs overflow-hidden">
                    <div className="font-bold mb-2">Last Run Result:</div>
                    {lastResult.success ? (
                      <div className="space-y-2">
                        <div><strong className="text-emerald-600">Success!</strong> Generated title:</div>
                        <div className="italic text-neutral-600 truncate">"{lastResult.title}"</div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           <div><strong>X:</strong> {lastResult.results.x}</div>
                           <div><strong>LinkedIn:</strong> {lastResult.results.linkedin}</div>
                           <div><strong>Dev.to:</strong> {lastResult.results.devto}</div>
                           <div><strong>Blogger:</strong> {lastResult.results.blogger}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-500 font-mono break-words">{lastResult.error}</div>
                    )}
                  </div>
                )}
              </div>
          </motion.div>

        </div>

        {/* Right pane: Setup guide & Action */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.7, delay: 0.1 }}
           className="bg-[#0a0a0a] text-white rounded-[40px] p-8 sm:p-10 md:p-14 relative"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Cloudflare Pages Guide</h2>
            <p className="text-neutral-400">Deploy this engine to Cloudflare Pages for a robust, scheduled content generator.</p>
          </div>

          <div className="space-y-10">
            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center shrink-0 font-bold">1</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Export Code to Cloudflare</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Use the 'Export to GitHub' feature, then connect that repository to <strong className="text-white">Cloudflare Pages</strong>. Make sure it detects the framework as Next.js.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center shrink-0 font-bold bg-white text-black">2</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Configure Environment Variables</h4>
                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                  In your Cloudflare Pages dashboard (Settings &gt; Environment variables), add the following secrets:
                </p>
                <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5 font-mono text-[11px] sm:text-xs text-neutral-300 space-y-1 overflow-x-auto">
                  <div className="text-emerald-400 font-bold mb-2"># AI Configuration</div>
                  <div className="mb-4">GEMINI_API_KEY</div>
                  
                  <div className="text-blue-400 font-bold mb-2"># LinkedIn</div>
                  <div>LINKEDIN_ACCESS_TOKEN & LINKEDIN_PERSON_URN</div>
                  
                  <div className="text-neutral-400 font-bold mb-2 mt-4"># X (Formerly Twitter)</div>
                  <div>X_CONSUMER_KEY & X_CONSUMER_SECRET</div>
                  <div className="mb-4">X_ACCESS_TOKEN & X_ACCESS_TOKEN_SECRET</div>
                  
                  <div className="text-orange-400 font-bold mb-2"># Blogger & Dev.to</div>
                  <div>BLOGGER_ACCESS_TOKEN & BLOGGER_BLOG_ID</div>
                  <div>DEVTO_API_KEY</div>
                </div>
                <div className="mt-4 text-xs text-neutral-500">
                  <p className="mb-1"><strong className="text-neutral-400">Where to find keys:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong className="text-neutral-300 font-bold text-white">X (Twitter):</strong> Set App Permissions to <span className="text-emerald-400">"Read and Write"</span> in developer portal. <br/><span className="text-[10px] text-orange-400 font-bold uppercase mt-1 block tracking-tight">⚠️ CRITICAL: Use the "OAuth 1.0a" Access Tokens. You must REGENERATE them after changing permissions. X Developer Portal callback URL doesn't matter since we use PIN/token.</span></li>
                    <li><strong className="text-neutral-300 font-bold text-white">LinkedIn:</strong> 
                      <ol className="list-decimal pl-4 mt-1 space-y-1 text-[11px]">
                        <li>Create app at LinkedIn Developers. Set OAuth 2.0 Auth Redirect URL to your Cloudflare/Vercel URL.</li>
                        <li>Enable <span className="text-emerald-400">"Share on LinkedIn"</span> in the Products tab.</li>
                        <li>Use Token Generator to get token. Set URN as <code className="text-blue-400">urn:li:person:ID</code>.</li>
                      </ol>
                    </li>
                    <li><strong className="text-neutral-300">Dev.to:</strong> Go to Settings &gt; Extensions and generate a Forem API Key.</li>
                    <li><strong className="text-neutral-300">Blogger:</strong> Use OAuth Playground (Blogger v3) for a token. Provide your Blog ID (found in Blogger URL).</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center shrink-0 font-bold">3</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Setup Cloudflare Cron</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  In Cloudflare Pages, you can use Cron Triggers by creating a <code className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-300">wrangler.toml</code> file or configuring a third-party ping service (like cron-job.org) to make a POST request to <code className="text-emerald-400">https://your-domain.com/api/generate</code> on your desired schedule.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function StatusCard({ platform, status, isActive }: { platform: string, status: string, isActive?: boolean }) {
  return (
    <div className={`bg-white p-6 rounded-3xl border ${isActive ? 'border-emerald-200' : 'border-neutral-200 opacity-60'} shadow-sm transition-all`}>
      <div className="flex justify-between items-start mb-6">
        <Globe size={24} className={isActive ? "text-emerald-500" : "text-neutral-300"} />
        <div className="flex items-center gap-2">
          {isActive && <div className="w-2 h-2 rounded-full bg-emerald-500 hidden sm:block"></div>}
          <span className={`text-[11px] font-bold ${isActive ? 'text-emerald-600' : 'text-neutral-400'} uppercase tracking-widest`}>{status}</span>
        </div>
      </div>
      <div className="font-semibold text-neutral-800">{platform}</div>
    </div>
  );
}


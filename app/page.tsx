"use client";

import { motion } from "motion/react";
import { Terminal, Activity, Github, Globe, Code, FileText, CheckCircle2, ArrowRight, Settings } from "lucide-react";
import { useState, useEffect } from "react";

export default function OtoSocialDashboard() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
              OtoSocial is your completely hands-off content engine. Posting high-quality AI and software trends across 4 platforms, 4 times a day.
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <StatusCard platform="LinkedIn" status="Armed" />
            <StatusCard platform="X (Twitter)" status="Armed" />
            <StatusCard platform="Dev.to" status="Armed" />
            <StatusCard platform="Blogger" status="Armed" />
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
              <h3 className="font-bold text-sm tracking-widest uppercase mb-6 flex items-center gap-2 text-neutral-400">
                <Activity size={16} /> Schedule & Engine
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-semibold mb-1">Intelligence Platform</div>
                  <div className="text-sm text-neutral-500">Gemini 3.1 Flash Lite + Imagen 4</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Live Search Grounding</div>
                  <div className="text-sm text-emerald-600 font-medium">Enabled (2026 Trends)</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-3">Cron Actuations (UTC)</div>
                  <div className="flex flex-wrap gap-2 font-mono text-xs text-neutral-600">
                    <span className="bg-neutral-100 px-3 py-1.5 rounded-md">06:00</span>
                    <span className="bg-neutral-100 px-3 py-1.5 rounded-md">10:00</span>
                    <span className="bg-neutral-100 px-3 py-1.5 rounded-md">13:00</span>
                    <span className="bg-neutral-100 px-3 py-1.5 rounded-md">18:00</span>
                  </div>
                </div>
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
            <h2 className="text-3xl font-bold tracking-tight mb-4">Deployment Guide</h2>
            <p className="text-neutral-400">The engine goes live as soon as your GitHub repository is configured.</p>
          </div>

          <div className="space-y-10">
            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center shrink-0 font-bold">1</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Export Code to GitHub</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">Use the Share menu to export this project directly to GitHub. The workflow file (<code className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-300">.github/workflows/schedule.yml</code>) is already generated and included.</p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center shrink-0 font-bold bg-white text-black">2</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Configure Repository Secrets</h4>
                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                  AI Studio injects your Gemini keys into previews automatically. However, for GitHub Actions to run autonomously, you <strong>MUST</strong> add these to your GitHub repo settings (Settings &gt; Secrets and variables &gt; Actions):
                </p>
                <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5 font-mono text-[11px] sm:text-xs text-neutral-300 space-y-1 overflow-x-auto">
                  <div className="text-emerald-400 font-bold mb-2"># AI Configuration</div>
                  <div className="mb-4">GEMINI_API_KEY</div>
                  
                  <div className="text-blue-400 font-bold mb-2"># LinkedIn</div>
                  <div>LINKEDIN_ACCESS_TOKEN</div>
                  <div className="mb-4">LINKEDIN_PERSON_URN</div>
                  
                  <div className="text-neutral-400 font-bold mb-2"># X (Formerly Twitter)</div>
                  <div>X_CONSUMER_KEY & X_CONSUMER_SECRET</div>
                  <div className="mb-4">X_ACCESS_TOKEN & X_ACCESS_TOKEN_SECRET</div>
                  
                  <div className="text-orange-400 font-bold mb-2"># Blogger & Dev.to</div>
                  <div>BLOGGER_ACCESS_TOKEN & BLOGGER_BLOG_ID</div>
                  <div>DEVTO_API_KEY</div>
                </div>
                <div className="mt-4 text-xs text-neutral-500">
                  <p className="mb-1"><strong className="text-neutral-400">Where to find keys:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong className="text-neutral-300">X (Twitter):</strong> Requires "Read and Write" app permissions in <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" className="text-emerald-500 hover:underline">X Developer Portal</a>. (If you change to Read/Write, you MUST regenerate your Access Token).</li>
                    <li><strong className="text-neutral-300">Dev.to:</strong> Go to <a href="https://dev.to/settings/extensions" target="_blank" className="text-emerald-500 hover:underline">Settings &gt; Extensions</a> and generate a Forem API Key.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center shrink-0 font-bold">3</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Engage Autopilot</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Once secrets are in place, your GitHub Action will trigger precisely at 6AM, 10AM, 1PM, and 6PM UTC.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
               <div className="flex items-center gap-3">
                 <FileText size={16} className="text-neutral-500" />
                 <span className="text-xs uppercase tracking-widest font-semibold text-neutral-500">System Verified</span>
               </div>
               <span className="text-xs text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full w-fit">Production Ready</span>
            </div>
            <button className="w-full bg-white text-[#0a0a0a] rounded-full py-4 px-6 font-bold flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
              <span>Export to GitHub</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function StatusCard({ platform, status }: { platform: string, status: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <Globe size={24} className="text-neutral-300" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 hidden sm:block"></div>
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">{status}</span>
        </div>
      </div>
      <div className="font-semibold text-neutral-800">{platform}</div>
    </div>
  );
}

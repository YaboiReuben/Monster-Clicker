
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Cloud, Cpu, Code, Server, FileCode, Database, Send, Zap, ZapOff, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

const SYSTEM_PROMPT = `Act as an expert Cloudflare Workers senior engineer. You have deep knowledge of:
1. The Workers Runtime (V8 isolates, Fetch API, Streams).
2. Wrangler CLI for deployment and local development.
3. Durable Objects for stateful, low-latency applications.
4. Cloudflare KV and D1 for high-performance edge storage.
5. Workers AI for running machine learning models at the edge.
6. Security best practices (Environment variables, CORS, JWT).

Provide performant, standard-compliant code. Always prefer 'export default { fetch }' syntax. Use TypeScript for all examples. Optimize for low cold-start latency.`;

const API_SERVER_TEMPLATE = (route: string) => `
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === "${route}") {
      return Response.json({ 
        success: true, 
        message: "Welcome to the ${route} endpoint!",
        timestamp: Date.now()
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};
`;

const GEMINI_PROXY_TEMPLATE = `
export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const geminiUrl = "https://generativelanguage.googleapis.com" + url.pathname + url.search;

    // Preserve original request headers but update host and authorization
    const newHeaders = new Headers(request.headers);
    newHeaders.set("x-goog-api-key", env.GEMINI_API_KEY);

    try {
      const response = await fetch(geminiUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.body,
        redirect: 'follow'
      });

      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    } catch (e) {
      return Response.json({ error: "Failed to proxy to Gemini" }, { status: 500 });
    }
  }
};
`;

const KV_TEMPLATE = `
export default {
  async fetch(request, env) {
    const key = "user:session";
    
    // Write data
    await env.MY_KV.put(key, JSON.stringify({ active: true }));
    
    // Read data
    const value = await env.MY_KV.get(key, { type: "json" });
    
    return Response.json(value);
  }
};
`;

const DURABLE_OBJECT_TEMPLATE = `
export class ChatRoom {
  state: DurableObjectState;
  sessions: WebSocket[] = [];

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    this.sessions.push(server);

    server.accept();
    server.addEventListener("message", (msg) => {
      this.sessions.forEach(s => s.send(msg.data));
    });

    return new Response(null, { status: 101, webSocket: client });
  }
}

export default {
  async fetch(request, env) {
    let id = env.CHAT_DO.idFromName("global");
    let obj = env.CHAT_DO.get(id);
    return obj.fetch(request);
  }
};
`;

const DevHub: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('prompt');
  const [copied, setCopied] = useState(false);
  const [apiRoute, setApiRoute] = useState('/api/hello');
  const [fixerInput, setFixerInput] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFixer = (input: string) => {
    let fixed = input;
    fixed = fixed.replace(/process\.env\.(\w+)/g, 'env.$1');
    fixed = fixed.replace(/const fs = require\(['"]fs['"]\);?/g, '// fs is not available on Cloudflare Workers. Use env.KV_NAMESPACE or env.R2_BUCKET.');
    fixed = fixed.replace(/res\.send\(/g, 'return new Response(');
    return fixed;
  };

  const tabs = [
    { id: 'prompt', label: 'System Prompt', icon: Terminal },
    { id: 'api', label: 'API Generator', icon: Code },
    { id: 'gemini', label: 'Gemini Proxy', icon: Zap },
    { id: 'kv', label: 'KV Storage', icon: Database },
    { id: 'do', label: 'Durable Objects', icon: Server },
    { id: 'fullstack', label: 'Fullstack App', icon: FileCode },
    { id: 'wrangler', label: 'Wrangler Guide', icon: Cloud },
    { id: 'fixer', label: 'Compatibility Fixer', icon: ShieldCheck },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[1000] bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center p-6 font-sans text-slate-200"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        className="w-full max-w-6xl h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex"
      >
        {/* Sidebar */}
        <div className="w-64 bg-slate-950/50 border-r border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <Cloud className="w-8 h-8 text-orange-500" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-display font-black text-white uppercase">Cloudflare</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Dev Hub v1.0</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-tight group ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-orange-500 group-hover:text-white'}`} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-800 bg-black/20">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Runtime Status
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#32CD32] animate-pulse" />
                <span className="text-[10px] font-bold text-[#32CD32] uppercase">Isolated Engine Ready</span>
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-black/10">
            <h3 className="font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X className="w-8 h-8" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'prompt' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed italic">Use this prompt to turn any LLM into a high-level Cloudflare Workers specialist. Optimized for code generation and infrastructure planning.</p>
                    <div className="relative group">
                      <pre className="p-6 bg-black rounded-xl text-xs font-mono text-cyan-400 overflow-x-auto border border-slate-800">
                        {SYSTEM_PROMPT}
                      </pre>
                      <button onClick={() => copyToClipboard(SYSTEM_PROMPT)} className="absolute top-4 right-4 bg-slate-800 p-2 rounded-lg hover:bg-orange-500 transition-all flex items-center gap-2 text-[10px] font-black uppercase text-white shadow-lg">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy Prompt'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'api' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Route Configuration</label>
                      <input 
                        type="text" 
                        value={apiRoute} 
                        onChange={(e) => setApiRoute(e.target.value)}
                        className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-cyan-400 font-mono text-sm focus:border-orange-500 transition-colors"
                      />
                      <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
                        Generates a boilerplate Worker API that handles specific routing using the native Fetch API.
                      </div>
                    </div>
                    <div className="relative">
                      <pre className="h-full p-6 bg-black rounded-xl text-[10px] font-mono text-cyan-300 overflow-x-auto border border-slate-800">
                        {API_SERVER_TEMPLATE(apiRoute)}
                      </pre>
                      <button onClick={() => copyToClipboard(API_SERVER_TEMPLATE(apiRoute))} className="absolute top-4 right-4 bg-slate-800/80 p-2 rounded-lg hover:bg-orange-500 transition-all">
                        {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'gemini' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="bg-orange-950/20 border border-orange-500/20 p-4 rounded-xl flex items-center gap-4">
                    <Zap className="w-6 h-6 text-orange-500" />
                    <span className="text-xs font-bold text-orange-200">Securely proxy Gemini API requests to keep your API keys hidden from the frontend.</span>
                  </div>
                  <div className="relative">
                    <pre className="p-6 bg-black rounded-xl text-xs font-mono text-cyan-400 overflow-x-auto border border-slate-800">
                      {GEMINI_PROXY_TEMPLATE}
                    </pre>
                    <button onClick={() => copyToClipboard(GEMINI_PROXY_TEMPLATE)} className="absolute top-4 right-4 bg-slate-800 p-2 rounded-lg hover:bg-orange-500 transition-all">
                      {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'kv' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
                     <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Database className="w-4 h-4 text-orange-500" /> Edge Key-Value Storage</h4>
                     <p className="text-xs text-slate-400 mb-6 italic">Binding requirement: Add "kv_namespaces" to your wrangler.toml before using.</p>
                     <div className="relative">
                        <pre className="p-6 bg-black rounded-xl text-xs font-mono text-cyan-400 overflow-x-auto border border-slate-800">
                          {KV_TEMPLATE}
                        </pre>
                        <button onClick={() => copyToClipboard(KV_TEMPLATE)} className="absolute top-4 right-4 bg-slate-800 p-2 rounded-lg hover:bg-orange-500 transition-all">
                          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                        </button>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'do' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                    <span className="text-xs font-bold text-blue-200 uppercase flex items-center gap-2"><Server className="w-4 h-4" /> STATEFUL EDGE COMPUTING</span>
                  </div>
                  <div className="relative">
                    <pre className="p-6 bg-black rounded-xl text-[10px] font-mono text-cyan-400 overflow-x-auto border border-slate-800">
                      {DURABLE_OBJECT_TEMPLATE}
                    </pre>
                    <button onClick={() => copyToClipboard(DURABLE_OBJECT_TEMPLATE)} className="absolute top-4 right-4 bg-slate-800 p-2 rounded-lg hover:bg-orange-500 transition-all">
                      {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'fullstack' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                        <h4 className="text-sm font-bold text-white mb-4">Vite + Cloudflare Boilerplate</h4>
                        <ol className="text-xs text-slate-400 space-y-4 list-decimal list-inside">
                           <li>Install Wrangler: <code className="text-orange-400">npm install -g wrangler</code></li>
                           <li>Init project: <code className="text-orange-400">npm create cloudflare@latest</code></li>
                           <li>Choose <span className="text-white">"Frameworky" -> "Vite"</span></li>
                           <li>Run dev: <code className="text-orange-400">npm run dev</code></li>
                           <li>Deploy: <code className="text-orange-400">npx wrangler deploy</code></li>
                        </ol>
                     </div>
                     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center items-center text-center">
                        <FileCode className="w-12 h-12 text-slate-700 mb-4" />
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Wrangler Config Example</h5>
                        <code className="text-[10px] font-mono text-cyan-900 bg-black/40 p-2 rounded">
                          name = "my-app"<br/>
                          main = "src/index.ts"<br/>
                          compatibility_date = "2024-04-03"
                        </code>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wrangler' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                   <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Cloud className="w-6 h-6 text-white" />
                         </div>
                         <h4 className="text-2xl font-display font-black text-white uppercase italic">Deployment Guide</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">1. Local Setup</h5>
                            <div className="p-4 bg-black rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-500">
                               npx wrangler login<br/>
                               npx wrangler init my-worker
                            </div>
                         </div>
                         <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">2. Secret Management</h5>
                            <div className="p-4 bg-black rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-500">
                               npx wrangler secret put API_KEY
                            </div>
                         </div>
                         <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">3. Deployment</h5>
                            <div className="p-4 bg-black rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-500">
                               npx wrangler deploy
                            </div>
                         </div>
                         <div className="space-y-4 flex flex-col justify-end">
                            <a href="https://developers.cloudflare.com/workers" target="_blank" className="bg-orange-500 hover:bg-orange-400 text-white p-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-500/10">
                               Official Documentation <ExternalLink className="w-4 h-4" />
                            </a>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'fixer' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                   <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#32CD32]" /> Worker Compatibility Tool</h4>
                      <p className="text-xs text-slate-400 mb-4 italic">Paste your standard Node.js code below to transform it into a Worker-compatible format.</p>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Input Node.js Code</span>
                            <textarea 
                               value={fixerInput} 
                               onChange={(e) => setFixerInput(e.target.value)}
                               placeholder="const api = process.env.KEY; ..."
                               className="w-full h-48 bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 focus:border-cyan-500 transition-colors resize-none"
                            />
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Worker Compatible Output</span>
                            <div className="w-full h-48 bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-500 overflow-y-auto whitespace-pre">
                               {handleFixer(fixerInput) || '// Output will appear here...'}
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DevHub;

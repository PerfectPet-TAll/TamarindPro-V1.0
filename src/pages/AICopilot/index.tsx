import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  Trash2, 
  Globe, 
  ArrowUpRight, 
  Loader2, 
  TrendingUp, 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  User,
  Lightbulb,
  Terminal,
  Clock,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  groundingChunks?: { title: string; uri: string }[];
  isOffline?: boolean;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  { label: 'Analyze Sales Trend', icon: TrendingUp, text: 'Analyze our TamarindPro sales operations trends this year and identify top-performing export destinations.' },
  { label: 'Generate Export Docs', icon: FileText, text: 'Give me a draft of a TamarindPro international Commercial Invoice for shipping sweet tamarind candies to China.' },
  { label: 'Verify Category Code', icon: Lightbulb, text: 'What is the correct product category code for TamarindPro fresh tamarind vs tamarind paste?' },
  { label: 'Sync Database Status', icon: RefreshCw, text: 'How does the Google Sheets integration update the stock balances of TamarindPro warehouses?' }
];

export default function AICopilotPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "สวัสดีครับ! ยินดีต้อนรับสู่ศูนย์บริการ **TamarindPro AI Copilot** แบบเต็มจออัจฉริยะ\n\nผมพร้อมให้คำแนะนำในคู่มือการใช้งานระบบ, การวิเคราะห์ข้อมูลการขาย, การจัดการส่งออก (Export Logistics), กิจกรรมการดูแลลูกค้า และเอกสารตรวจสอบการส่งออกของผลิตภัณฑ์มะขามและผลไม้แปรรูป TamarindPro ทั่วโลกครับ\n\n💡 **ความสามารถพิเศษ:** ฉันขับเคลื่อนด้วยระบบวิจัยข้อมูลแบบเรียลไทม์ **Google Search Grounding** สามารถถามราคามะขามสากล ข่าวนำเข้าส่งออก หรือเงื่อนไขศุลกากรปัจจุบันได้ทันทีครับ!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userText = textToSend;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: 'user', text: userText, timestamp: timeStr }]);
    setLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userText }),
      });

      const data = await response.json();
      const assistantTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.text || 'ไม่ได้รับการตอบกลับจากเซิร์ฟเวอร์',
          groundingChunks: data.groundingChunks || [],
          isOffline: data.isOffline,
          timestamp: assistantTimeStr
        },
      ]);
    } catch (err) {
      console.error(err);
      const errTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
          timestamp: errTimeStr
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const txt = input;
    setInput('');
    handleSend(txt);
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  const clearChat = () => {
    Swal.fire({
      title: 'Reset Session?',
      text: 'Do you want to clear your current conversation history?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f47729',
      cancelButtonColor: '#627680',
      confirmButtonText: 'Yes, clear it'
    }).then((result) => {
      if (result.isConfirmed) {
        setMessages([
          {
            role: 'assistant',
            text: "สวัสดีครับ! ยินดีต้อนรับสู่ศูนย์บริการ **TamarindPro AI Copilot** แบบเต็มจออัจฉริยะ\n\nผมพร้อมให้คำแนะนำในคู่มือการใช้งานระบบ, การวิเคราะห์ข้อมูลการขาย, การจัดการส่งออก (Export Logistics), กิจกรรมการดูแลลูกค้า และเอกสารตรวจสอบการส่งออกของผลิตภัณฑ์มะขามและผลไม้แปรรูป TamarindPro ทั่วโลกครับ\n\n💡 **ความสามารถพิเศษ:** ฉันขับเคลื่อนด้วยระบบวิจัยข้อมูลแบบเรียลไทม์ **Google Search Grounding** สามารถถามราคามะขามสากล ข่าวนำเข้าส่งออก หรือเงื่อนไขศุลกากรปัจจุบันได้ทันทีครับ!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
        ]);
        Swal.fire('Cleared!', 'Your chat thread has been reset.', 'success');
      }
    });
  };

  return (
    <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent">
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#e2d1c3] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel 
          isOpen={isGuideOpen} 
          onClose={() => setIsGuideOpen(false)}
          title="TAMARINDPRO GUIDE"
          desc="ระบบผู้ช่วยวิเคราะห์ข้อมูลสินค้าและการจัดส่งข้ามพรมแดนอัจฉริยะแบบ Real-Time"
          sections={[
              {
                  id: "1",
                  title: "ระบบคัดแยกคำสั่งซื้อและวิเคราะห์เทรนด์สินค้า (TamarindPro AI Capabilities)",
                  icon: "Sparkles",
                  iconColor: "#f47729",
                  description: "ระบบ AI Copilot ได้รับการเทรนมาเป็นพิเศษร่วมกับฟังก์ชัน Google Search Grounding:",
                  bullets: [
                      { icon: "Globe", iconColor: "#5da7b3", title: "Live Grounding", text: "ดึงราคารับซื้อสากล พิกัดภาษีนำเข้า หรือกฎหมายศุลกากรล่าสุดของประเทศปลายทางส่งตรงแบบสดใหม่" },
                      { icon: "FileText", iconColor: "#af7a2b", title: "Document Format Guide", text: "ตรวจและร่างแพตเทิร์นเอกสารขนส่ง ใบกักกันพืช ใบเสนอราคาสำหรับการส่งออกมะขามยอดนิยม" }
                  ]
              },
              {
                  id: "2",
                  title: "คู่มือแชตและคำสั่งสวอปด่วน (Interactive Commands)",
                  icon: "HelpCircle",
                  iconColor: "#af7a2b",
                  description: "โต้ตอบคำสั่งและสรุปงานสำคัญด้วยแชตอัจฉริยะแบบไร้รอยต่อ:",
                  bullets: [
                      { icon: "Send", iconColor: "#606934", title: "Operator Chat", text: "พิมพ์คุยกับ Copilot หรือคัดลอกไฟล์/แผ่นข้อมูลมาวางวิเคราะห์การจัดการส่งออกได้เรียลไทม์" },
                      { icon: "Lightbulb", iconColor: "#ffa64a", title: "Quick Suggestions", text: "สามารถกดใช้แถบ Prompt สำเร็จรูปจากหน้าจอล่างสุด เพื่อประหยัดเวลาพิมพ์เมื่อต้องทำธุรกรรมสถิติ" }
                  ]
              }
          ]} 
      />

      {/* Header section */}
      <div className="px-4 sm:px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 bg-transparent">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <Sparkles size={28} strokeWidth={2.5} className="text-[#f47729]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
              AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">COPILOT</span> NODE
            </h3>
            <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
              INTELLIGENT BUSINESS & OPERATIONS CO-DRIVER
            </p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl border border-slate-200 hover:border-red-200 transition-all text-xs font-black uppercase tracking-wider shadow-sm shrink-0"
        >
          <Trash2 size={14} /> Clear Dialogue
        </button>
      </div>

      {/* Main interactive area split into Sidebar hints and Widescreen Chat */}
      <div className="px-4 sm:px-8 mt-2 pb-6 flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-[500px]">
          
          {/* LEFT: Guidance Bento Box */}
          <div className="xl:col-span-1 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#e2d1c3]/60 shadow-md h-full space-y-4">
              <h4 className="text-[12px] font-black uppercase text-[#2e3118] tracking-widest flex items-center gap-2 pb-2 border-b border-slate-100">
                <Terminal size={14} className="text-[#f47729]" />
                COPILOT PROTOCOLS
              </h4>
              
              <div className="space-y-3.5">
                <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100/50">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Globe size={15} className="animate-spin duration-[4000ms]" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Search Grounding</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    Automatically executes Google queries to ground output in factual, real-world events.
                  </p>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100/50">
                  <div className="flex items-center gap-2 text-orange-850">
                    <Sparkles size={15} className="text-orange-600" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Export Operations</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    Capable of analyzing warehousing logic, stock layouts, categories, and inventory configurations.
                  </p>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-[#1f2a44]/5 to-slate-100 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 size={15} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Format Guides</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    Instructs on standard schemas, document naming rules, and synchronization triggers.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Current node environment</span>
                <div className="flex items-center gap-2 mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-mono font-black text-slate-600 tracking-wider">ACTIVE ONLINE (3000)</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Professional Widescreen Chat Area */}
          <div className="xl:col-span-3 flex flex-col bg-white rounded-3xl border border-[#e2d1c3]/60 shadow-lg overflow-hidden flex-1 min-h-[500px]">
            {/* Thread Header */}
            <div className="px-6 py-3.5 bg-[#f8f9fa] border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2e3118] flex items-center gap-2">
                <Bot size={14} className="text-[#f47729]" />
                TAMARIND COPILOT INTELLIGENT DIALOGUE
              </span>
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                Gemini 3.5 Active
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#faf9f8]">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role !== 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1f2a44] to-[#2e3118] flex items-center justify-center text-[#af7a2b] shrink-0 font-black text-xs shadow border border-white/20">
                      TC
                    </div>
                  )}
                  <div className="flex flex-col max-w-[80%] space-y-1">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 px-1 uppercase tracking-wider justify-between">
                      <span>{m.role === 'user' ? 'SYSTEM OPERATOR' : 'TAMARIND COPILOT'}</span>
                      <span className="opacity-60 flex items-center gap-1"><Clock size={9}/> {m.timestamp}</span>
                    </div>
                    <div className={`px-5 py-4 rounded-[22px] text-[12px] leading-relaxed border shadow-sm whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[#2e3118] text-white rounded-tr-none border-[#2e3118]'
                        : m.isOffline
                        ? 'bg-amber-50 text-amber-900 border-amber-200 rounded-tl-none'
                        : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>

                    {/* Google Grounding Metadata if returned */}
                    {m.groundingChunks && m.groundingChunks.length > 0 && (
                      <div className="mt-2.5 p-3.5 bg-slate-55 rounded-2xl border border-slate-100 space-y-2">
                        <p className="text-[9.5px] text-slate-400 font-extrabold uppercase leading-none flex items-center gap-1.5">
                          <Globe size={11} className="text-[#f47729] animate-pulse" /> RELIABLE EXTERNAL REFERENCES:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {m.groundingChunks.map((chunk, cIdx) => (
                            <a
                              key={cIdx}
                              href={chunk.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-orange-500/10 text-slate-700 hover:text-[#f47729] rounded-xl text-[10px] font-bold transition-all border border-slate-200 hover:border-orange-500/30 shadow-xs"
                            >
                              <span className="max-w-[200px] truncate">{chunk.title}</span>
                              <ArrowUpRight size={11} className="text-[#f47729]" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#f47729] shrink-0 font-black text-xs shadow-sm">
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1f2a44] to-[#2e3118] flex items-center justify-center text-[#af7a2b] shrink-0 font-black text-xs shadow border border-white/20 animate-pulse">
                    TC
                  </div>
                  <div className="flex px-5 py-4 rounded-[22px] text-[12px] bg-white border border-slate-100 text-slate-500 font-extrabold items-center gap-2.5 rounded-tl-none shadow-sm">
                    <Loader2 size={15} className="animate-spin text-[#f47729]" />
                    Analyzing & scouring the web in real-time...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Suggestions Toolbar right above input */}
            <div className="px-6 py-2.5 bg-slate-50/80 border-t border-slate-100">
              <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar scrollbar-none">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 shrink-0 bg-slate-100/80 px-2 py-1 rounded">
                  <Lightbulb size={10} className="text-amber-500" /> SUGGESTION:
                </span>
                {SUGGESTED_PROMPTS.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(p.text)}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#f47729]/10 text-slate-700 hover:text-[#f47729] rounded-xl text-[10.5px] font-bold border border-slate-200 hover:border-[#f47729]/40 hover:-translate-y-0.5 transition-all shadow-xs cursor-pointer select-none whitespace-nowrap"
                    >
                      <Icon size={12} strokeWidth={2.5} className="text-[#f47729]" />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input form */}
            <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Sales, OEM procurement, Packing list details, or Google Sheets Sync configurations..."
                disabled={loading}
                className="flex-1 h-[48px] px-4 rounded-xl border border-[#e2d1c3] font-bold text-[12px] outline-none shadow-inner bg-slate-50/50 focus:bg-white focus:border-[#f47729] transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-6 h-[48px] bg-[#2e3118] hover:bg-[#1f2a44] text-[#af7a2b] hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 font-black text-[11px] uppercase tracking-widest"
              >
                <Send size={15} />
                Send
              </button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}

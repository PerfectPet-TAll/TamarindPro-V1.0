import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  Trash2, 
  Globe, 
  ArrowUpRight, 
  Loader2, 
  TrendingUp, 
  FileText, 
  RefreshCw, 
  Lightbulb 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  groundingChunks?: { title: string; uri: string }[];
  isOffline?: boolean;
}

const SUGGESTED_PROMPTS = [
  { label: 'Analyze Sales', icon: TrendingUp, text: 'Analyze our sales operations trends this year and identify top-performing channels.' },
  { label: 'Export Gen', icon: FileText, text: 'Give me a template draft of an international commercial invoice with container booking details.' },
  { label: 'Sync DB', icon: RefreshCw, text: 'What is the current status of the Google Sheets sync and how do I format the procurement schema?' }
];

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "สวัสดีครับ! ผมคือ **Tamarind Copilot** ผู้ช่วยอัจฉริยะระบบการขายและการส่งออก\n\n💡 ผมพร้อมให้การช่วยเหลือผ่านระบบค้นหาและวิเคราะห์ข่าวสารความรู้อินเทอร์เน็ตสด ๆ ด้วย **Google Search Grounding** ค้นข้อมูล ข่าวสาร นโยบาย ระเบียบการส่งออกต่าง ๆ ในโลกความเป็นจริงได้เรียลไทม์ทันทีครับ!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const userText = customText || input;
    if (!userText.trim() || loading) return;

    if (!customText) {
      setInput('');
    }
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
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
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.text || 'ไม่ได้รับการตอบกลับจากเซิร์ฟเวอร์',
          groundingChunks: data.groundingChunks || [],
          isOffline: data.isOffline,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('คุณต้องการรีเซ็ตการสนทนาทั้งหมดหรือไม่?')) {
      setMessages([
        {
          role: 'assistant',
          text: "สวัสดีครับ! ผมคือ **Tamarind Copilot** ผู้ช่วยอัจฉริยะระบบการขายและการส่งออก\n\n💡 ผมพร้อมให้การช่วยเหลือผ่านระบบค้นหาและวิเคราะห์ข่าวสารความรู้อินเทอร์เน็ตสด ๆ ด้วย **Google Search Grounding** ค้นข้อมูล ข่าวสาร นโยบาย ระเบียบการส่งออกต่าง ๆ ในโลกความเป็นจริงได้เรียลไทม์ทันทีครับ!",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        id="copilot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[180] w-14 h-14 bg-gradient-to-tr from-[#f47729] via-[#ad7332] to-[#af7a2b] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer group border-2 border-white/20"
        title="Open Tamarind Copilot"
      >
        <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20 group-hover:opacity-40"></div>
        {isOpen ? <X size={24} strokeWidth={2.5} /> : <Sparkles size={24} strokeWidth={2.5} className="animate-pulse" />}
      </button>

      {/* Copilot Drawer Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="copilot-drawer-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-5 z-[180] w-[90vw] sm:w-[480px] h-[580px] bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-[#adb2b0]/30 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-[#202024]/10 via-transparent to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f47729] to-[#af7a2b] flex items-center justify-center text-white shadow-md border border-white/20">
                  <Bot size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[14px] uppercase tracking-wider text-[#2e3118] flex items-center gap-1.5 leading-none">
                    Tamarind Copilot <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black tracking-normal">GROUNDING ACTIVE</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 leading-none flex items-center gap-1">
                    <Globe size={11} className="text-[#f47729]" /> Real-time search connection
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="รีเซ็ตบทสนทนา"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-[#f47729] hover:bg-orange-50 rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Message Pane */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar bg-[#faf9f8]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#2e3118] flex items-center justify-center text-[#af7a2b] shrink-0 font-black text-xs shadow-inner uppercase">
                      TC
                    </div>
                  )}
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={`px-4 py-3 rounded-2xl text-[12px] leading-relaxed shadow-sm border border-slate-100/50 whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-[#2e3118] text-white rounded-br-none font-bold'
                          : m.isOffline
                          ? 'bg-amber-50 text-amber-900 rounded-bl-none border-amber-200 shadow-sm'
                          : 'bg-white text-slate-800 rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* Grounding Web References (If Any) */}
                    {m.groundingChunks && m.groundingChunks.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] text-slate-400 font-black uppercase leading-none mb-1.5 flex items-center gap-1">
                          <Globe size={11} className="text-[#f47729]" /> แหล่งข้อมูลอ้างอิง:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.groundingChunks.map((chunk, cIdx) => (
                            <a
                              key={cIdx}
                              href={chunk.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#f47729]/10 text-slate-700 hover:text-[#f47729] rounded-lg text-[9.5px] font-bold decoration-transparent transition-all border border-slate-200 hover:border-[#f47729]/40 shadow-sm select-none cursor-pointer"
                            >
                              <span className="max-w-[140px] truncate">{chunk.title}</span>
                              <ArrowUpRight size={10} strokeWidth={2.5} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#2e3118] flex items-center justify-center text-[#af7a2b] shrink-0 font-black text-xs shadow-inner uppercase animate-pulse">
                    TC
                  </div>
                  <div className="flex px-4 py-3 rounded-2xl text-[12px] bg-white border border-slate-100 text-slate-500 font-bold items-center gap-2 rounded-bl-none shadow-sm">
                    <Loader2 size={14} className="animate-spin text-[#f47729]" />
                    กำลังค้นสแกนอินเทอร์เน็ตสดและวิเคราะห์คำตอบ...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Suggestions Toolbar */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar scrollbar-none">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-0.5 shrink-0 bg-slate-205/60 px-1.5 py-0.5 rounded">
                  <Lightbulb size={9} className="text-amber-500" /> SUGGEST:
                </span>
                {SUGGESTED_PROMPTS.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(undefined, p.text)}
                      disabled={loading}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#f47729]/10 text-slate-700 hover:text-[#f47729] rounded-xl text-[10px] font-bold border border-slate-200 hover:border-[#f47729]/40 transition-all shadow-xs cursor-pointer select-none whitespace-nowrap animate-fadeIn"
                    >
                      <Icon size={10} strokeWidth={2.5} className="text-[#f47729]" />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="พิมพ์ถามข้อมูล นโยบาย การจัดส่งออกต่างประเทศ..."
                disabled={loading}
                className="flex-1 h-[44px] px-4 rounded-xl border border-[#adb2b0]/40 font-bold text-[12px] outline-none shadow-inner bg-slate-50 focus:bg-white focus:border-[#f47729] transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-11 h-11 bg-[#2e3118] hover:bg-[#091d38] text-[#af7a2b] hover:text-white rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-[#2e3118] disabled:hover:text-[#af7a2b]"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Loader2, TrendingUp, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  isOffline?: boolean;
}

export function FactoryPOCopilot({ items, isOpen, onClose }: { items: any[], isOpen: boolean, onClose: () => void }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hello! I am the **Factory PO Optimization Assistant**. I have analyzed your current Purchase Orders and am ready to suggest optimization strategies based on market trends, supplier performance, and inventory health. How can I assist you today?"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      // Pass the items context directly inside the prompt
      const contextPrompt = `
Context: Here is the current Factory Purchase Order data:
${JSON.stringify(items.map(i => ({ product: i.product, quantity: i.quantity, totalValue: i.totalValue, status: i.status })), null, 2)}

User Question: ${userText}
      `;

      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: contextPrompt }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.text || 'No response from server.',
          isOffline: data.isOffline,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Error connecting to server. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed top-[70px] right-0 bottom-0 w-[400px] z-[150] shadow-2xl flex flex-col bg-slate-50 border-l border-slate-200"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f47729] to-[#af7a2b] flex items-center justify-center text-white shadow-md">
                <Sparkles size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-extrabold text-[14px] uppercase tracking-wider text-[#2e3118] flex items-center gap-1.5 leading-none">
                  PO Insights AI
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 leading-none flex items-center gap-1">
                  <TrendingUp size={11} className="text-[#f47729]" /> Market Trends & Optimization
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-[#f47729] hover:bg-orange-50 rounded-lg transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar bg-[#F9F7F6]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#111f42] flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                    <Bot size={14} />
                  </div>
                )}
                <div className="flex flex-col max-w-[85%]">
                  <div
                    className={`px-4 py-3 rounded-2xl text-[12px] leading-relaxed shadow-sm border border-slate-100/50 whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[#111f42] text-white rounded-br-none font-bold'
                        : m.isOffline
                        ? 'bg-amber-50 text-amber-900 rounded-bl-none border-amber-200'
                        : 'bg-white text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#111f42] flex items-center justify-center text-white shrink-0.5 shadow-sm">
                  <Bot size={14} />
                </div>
                <div className="flex px-4 py-3 rounded-2xl text-[12px] bg-white border border-slate-100 text-slate-500 font-bold items-center gap-2 rounded-bl-none shadow-sm">
                  <Loader2 size={14} className="animate-spin text-[#f47729]" />
                  Analyzing market trends...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar scrollbar-none">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-0.5 shrink-0">
                <Lightbulb size={10} className="text-amber-500" />
              </span>
              <button
                onClick={() => handleSend(undefined, "What are the most demanded products on this PO cycle?")}
                disabled={loading}
                className="inline-flex items-center shrink-0 px-2.5 py-1.5 bg-slate-50 hover:bg-[#f47729]/10 text-slate-700 hover:text-[#f47729] rounded-xl text-[10px] font-bold border border-slate-200 transition-all cursor-pointer select-none"
              >
                Identify Demand
              </button>
              <button
                onClick={() => handleSend(undefined, "Identify slow-moving products that could risk capital freeze based on current market trends.")}
                disabled={loading}
                className="inline-flex items-center shrink-0 px-2.5 py-1.5 bg-slate-50 hover:bg-[#f47729]/10 text-slate-700 hover:text-[#f47729] rounded-xl text-[10px] font-bold border border-slate-200 transition-all cursor-pointer select-none"
              >
                Capital Risks
              </button>
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for PO insights..."
              disabled={loading}
              className="flex-1 h-[44px] px-4 rounded-xl border border-slate-200 font-bold text-[12px] outline-none shadow-inner bg-slate-50 focus:bg-white focus:border-[#f47729] transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 bg-[#111f42] hover:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

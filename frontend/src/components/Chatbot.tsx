'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { FAQ_CHATBOT } from '@/lib/data';

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  time: Date;
}

const QUICK_REPLIES = ['Services proposés', 'Tarifs', 'Contact', 'Offres d\'emploi'];

function getAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const key in FAQ_CHATBOT) {
    const entry = FAQ_CHATBOT[key];
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return ' Je n\'ai pas bien compris. Essayez : **services**, **tarifs**, **contact**, **emploi** ou **équipe**. Vous pouvez aussi écrire à contact@novatech.solutions !';
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: 'bot',
      text: ' Bonjour ! Je suis **NovaBot**, l\'assistant NovaTech. Comment puis-je vous aider aujourd\'hui ?',
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), type: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise(r => setTimeout(r, 700 + Math.random() * 500));

    const answer = getAnswer(text);
    setTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: answer, time: new Date() }]);
    if (!open) setUnread(n => n + 1);
  };

  const renderText = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setOpen(o => !o); setMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-glow-lg"
        style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)]"
            style={{ maxHeight: minimized ? 'auto' : '520px', background: 'var(--bg)' }}
          >

            <div className="flex items-center gap-3 p-4"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-white text-sm">NovaBot</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/70 text-xs">En ligne</span>
                </div>
              </div>
              <button
                onClick={() => setMinimized(m => !m)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {!minimized && (
              <>
                
                <div className="h-72 overflow-y-auto p-4 space-y-3" style={{ background: 'var(--bg)' }}>
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.type === 'bot' && (
                        <div className="w-7 h-7 rounded-full bg-brand-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-brand-500" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.type === 'user'
                            ? 'text-white rounded-br-sm'
                            : 'rounded-bl-sm'
                        }`}
                        style={msg.type === 'user'
                          ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }
                          : { background: 'var(--bg-2)', color: 'var(--fg)' }}
                        dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                      />
                      {msg.type === 'user' && (
                        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {typing && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-7 h-7 rounded-full bg-brand-500/10 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-brand-500" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: 'var(--bg-2)' }}>
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="px-3 pb-2 flex gap-1.5 flex-wrap" style={{ background: 'var(--bg)' }}>
                  {QUICK_REPLIES.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--border)] hover:border-brand-500 hover:text-brand-500 transition-all"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="p-3 border-t border-[var(--border)]" style={{ background: 'var(--bg)' }}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && send(input)}
                      placeholder="Posez votre question..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-[var(--bg-2)]"
                      style={{ color: 'var(--fg)' }}
                    />
                    <button
                      onClick={() => send(input)}
                      disabled={!input.trim()}
                      className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all"
                      style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

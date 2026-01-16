import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Sparkles, Bot, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const TetChatbot: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: 'Xin chào! Tôi là Trợ lý Tết 2026. Bạn cần gợi ý lời chúc, xem ngày tốt hay tìm công thức món ngon ngày Tết?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Create chat session with system instruction
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Bạn là một trợ lý AI vui vẻ, hóm hỉnh chuyên về Tết Cổ Truyền Việt Nam, đặc biệt là năm Bính Ngọ 2026 (Năm Con Ngựa).
          - Phong cách: Nhiệt tình, dùng từ ngữ mang lại may mắn, tài lộc.
          - Kiến thức: Phong tục, món ăn, lời chúc, tử vi vui.
          - Luôn kết thúc câu trả lời bằng một lời chúc ngắn gọn hoặc icon may mắn.`,
        }
      });

      // Prepare history for context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Create a placeholder for the bot's response
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

      // Stream response
      const resultStream = await chat.sendMessageStream({ 
        message: input 
      });

      let fullText = '';
      
      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullText += text;
          setMessages(prev => 
            prev.map(msg => msg.id === botMsgId ? { ...msg, text: fullText } : msg)
          );
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Mạng bị nghẽn do pháo hoa nhiều quá! Thử lại chút nữa nha.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-tet-red/20 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-3 p-6 pb-2 z-10">
        <button onClick={() => navigate(-1)} className="p-2 glass-panel rounded-full text-white/70 hover:text-white">
            <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-serif font-bold text-white flex items-center gap-2">
             Trợ Lý Tết AI <Sparkles size={16} className="text-tet-gold" />
          </h1>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online • Gemini 3 Flash
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar z-10">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md shadow-lg
              ${msg.role === 'user' 
                ? 'bg-gradient-to-br from-tet-red to-rose-700 text-white rounded-tr-sm' 
                : 'bg-white/10 border border-white/10 text-white rounded-tl-sm'}
            `}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-tet-gold text-xs font-bold uppercase tracking-wider opacity-70">
                   <Bot size={12} /> Trợ Lý 2026
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 pt-2 z-20">
        <div className="glass-panel p-2 rounded-[2rem] flex items-center gap-2 pl-4 focus-within:ring-2 ring-tet-gold/50 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi về lời chúc, món ăn, ngày tốt..."
            className="flex-1 bg-transparent text-white placeholder-white/30 outline-none h-10"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-tet-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} className={input.trim() ? 'text-tet-red' : 'text-gray-400'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TetChatbot;
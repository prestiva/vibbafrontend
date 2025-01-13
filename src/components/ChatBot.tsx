import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  isBot: boolean;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const updateParentSize = () => {
      if (window.parent !== window) {
        const isMobile = window.innerWidth <= 768;
        const chatWidth = isMobile ? '92vw' : '380px';
        const chatHeight = isMobile ? '80vh' : '580px';
        
        window.parent.postMessage({
          type: 'chatResize',
          isOpen,
          width: isOpen ? chatWidth : '64px',
          height: isOpen ? chatHeight : '64px'
        }, '*');
      }
    };

    updateParentSize();
    window.addEventListener('resize', updateParentSize);

    if (isOpen && !hasWelcomed) {
      setHasWelcomed(true);
      setMessages([{ 
        text: "👋 Hello this is Ice, how can I help you?",
        isBot: true 
      }]);
    }

    return () => window.removeEventListener('resize', updateParentSize);
  }, [isOpen, hasWelcomed]);

  const fetchBotResponse = async (userMessage: string) => {
    try {
      const response = await fetch(`https://prestiva-vibbabackend.hf.space/getResponse?question=${encodeURIComponent(userMessage)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      return text.replace(/^"|"$/g, '').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    } catch (error) {
      console.error('Error fetching response:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsTyping(true);
    
    try {
      const botResponse = await fetchBotResponse(userMessage);
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: 'Sorry, I cannot connect to the server at the moment. Please try again later.',
        isBot: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedMessage = async (message: string) => {
    setMessages(prev => [...prev, { text: message, isBot: false }]);
    setIsTyping(true);
    
    try {
      const botResponse = await fetchBotResponse(message);
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: 'Sorry, I cannot connect to the server at the moment. Please try again later.',
        isBot: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedMessages = [
    "Can you please tell me about Ice Venkatesh?",
    "Can you please explain 4-M1?",
    "Can you please tell me about Shakuntala Devi?"
  ];

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const chatWindowWidth = isMobile ? 'w-[92vw]' : 'w-[350px]';
  const chatWindowHeight = isMobile ? 'h-[80vh]' : 'h-[520px]';

  return (
    <div className="fixed bottom-0 right-0">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #fcbc18 0%, #2b8894 100%)'
          }}
        >
          <MessageCircle size={24} className="text-white" />
        </button>
      ) : (
        <div className={`bg-white rounded-lg shadow-xl ${chatWindowWidth} ${chatWindowHeight} flex flex-col`}>
          <div className="rounded-t-lg flex justify-between items-center p-4"
               style={{ background: 'linear-gradient(135deg, #fcbc18 0%, #2b8894 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles size={20} className="text-white animate-pulse" />
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              </div>
              <h3 className="font-semibold text-white text-lg tracking-wide">Ice AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                {message.isBot && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2"
                       style={{ background: '#2b8894' }}>
                    <Sparkles size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800 rounded-tl-none'
                      : 'text-white rounded-tr-none'
                  }`}
                  style={{ 
                    background: message.isBot ? '#f8f9fa' : '#2b8894'
                  }}
                >
                  <div className={`prose prose-sm max-w-none leading-relaxed ${
                    message.isBot 
                      ? 'text-gray-800 prose-headings:text-gray-900 prose-p:text-gray-800' 
                      : 'text-white prose-invert prose-p:text-white/95'
                  }`}>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2"
                     style={{ background: '#2b8894' }}>
                  <Sparkles size={16} />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-2 rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 py-3" style={{ background: 'linear-gradient(to bottom, #f8f9fa, white)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-[#2b8894]" />
                <p className="text-sm font-semibold text-gray-700">Suggested Questions</p>
              </div>
              <div className="space-y-2">
                {suggestedMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedMessage(message)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-white border-2 border-gray-100 hover:border-[#2b8894] hover:shadow-md transition-all duration-200 text-sm text-gray-700 flex items-center gap-3 group relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(to right, white, #f8f9fa)'
                    }}
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#fcbc18] to-[#2b8894] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <span className="flex-1">{message}</span>
                      <ArrowRight size={14} className="text-[#2b8894] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2b8894]/50 text-gray-700 placeholder-gray-500"
              />
              <button
                type="submit"
                className="text-white rounded-full p-2 transition-colors disabled:opacity-50"
                style={{ background: '#2b8894' }}
                disabled={!input.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

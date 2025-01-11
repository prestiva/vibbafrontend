'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  text: string
  isUser: boolean
}

const LoadingDots = () => (
  <div className="flex space-x-1 items-center">
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
  </div>
)

const formatMessage = (text: string) => {
  return text.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768
      const openHeight = isMobile ? window.innerHeight : 500
      const openWidth = isMobile ? window.innerWidth : 400
      window.parent.postMessage({ 
        type: isOpen ? 'openChat' : 'closeChat', 
        height: isOpen ? openHeight : 80, 
        width: isOpen ? openWidth : 80 
      }, '*');
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, { text: formatMessage(inputMessage), isUser: true }])
      setInputMessage('')
      setIsLoading(true)

      try {
        const encodedQuestion = encodeURIComponent(inputMessage)
        const response = await fetch(`https://rauhan-vibbaai.hf.space/getResponse?question=${encodedQuestion}`)
        
        if (!response.ok) {
          throw new Error('Failed to get response from API')
        }

        let data = await response.text()
        data = data.replace(/^"(.*)"$/, '$1')
        data = formatMessage(data)
        setMessages(prev => [...prev, { text: data, isUser: false }])
      } catch (error) {
        console.error('Error fetching response:', error)
        setMessages(prev => [...prev, { text: "Sorry, I couldn't process your request. Please try again.", isUser: false }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className={`fixed bottom-0 right-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-full h-full sm:w-[400px] sm:h-[500px] sm:bottom-6 sm:right-6' : 'w-16 h-16 bottom-6 right-6'}`}>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl transition-all duration-300 p-0 relative overflow-hidden group hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #fcbc18 0%, #2b8894 100%)',
            boxShadow: '0 8px 20px rgba(43, 136, 148, 0.3)',
          }}
        >
          <MessageCircle 
            size={24} 
            className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110" 
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
            }}
          />
        </Button>
      ) : (
        <Card className="w-full h-full flex flex-col shadow-2xl border border-primary/10 overflow-hidden rounded-none sm:rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 sm:py-4 sm:px-6" style={{
            background: 'linear-gradient(to right, #fcbc18 0%, #2b8894 100%)'
          }}>
            <div className="flex items-center space-x-3">
              <Bot size={24} className="text-white filter drop-shadow-md" />
              <CardTitle className="text-white text-lg sm:text-xl font-bold tracking-wide" style={{
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>Vibba AI</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 bg-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[80%] shadow-md overflow-hidden ${
                    message.isUser
                      ? 'bg-gradient-to-br from-[#fcbc18] to-[#e7a916] text-white'
                      : 'bg-gradient-to-br from-[#2b8894] to-[#247885] text-white'
                  }`}
                  style={{
                    boxShadow: message.isUser 
                      ? '0 4px 12px rgba(252, 188, 24, 0.2)' 
                      : '0 4px 12px rgba(43, 136, 148, 0.2)'
                  }}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-[#2b8894] to-[#247885] text-white p-3 rounded-2xl shadow-md">
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="border-t border-primary/10 p-3 sm:p-4">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2 sm:gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow rounded-full border-primary/20 focus:border-primary focus:ring-primary shadow-sm"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-all duration-300 group hover:scale-105 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #fcbc18 0%, #2b8894 100%)',
                }}
                disabled={isLoading}
              >
                <Send size={18} className="text-white transition-transform duration-300 group-hover:scale-110" style={{
                  filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.2))',
                }} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}


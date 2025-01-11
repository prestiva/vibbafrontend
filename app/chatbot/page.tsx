'use client'

import ChatbotWidget from '../components/ChatbotWidget'

export default function ChatbotPage() {
  return (
    <div className="w-full h-full overflow-hidden">
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
      `}</style>
      <ChatbotWidget />
    </div>
  )
}


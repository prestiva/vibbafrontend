'use client'

import React, { useState, useEffect } from 'react'
import ChatbotWidget from '../components/ChatbotWidget'

export default function EmbedPage() {
  const [position, setPosition] = useState({ bottom: '24px', right: '24px' })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'openChat') {
        setIsOpen(true)
      } else if (event.data.type === 'closeChat') {
        setIsOpen(false)
      } else if (event.data.type === 'setPosition') {
        setPosition(event.data.position)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div 
      style={{
        position: 'fixed',
        ...position,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        <ChatbotWidget />
      </div>
    </div>
  )
}


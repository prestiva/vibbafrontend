'use client'

import { useEffect } from 'react'

export default function ResizeScript() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type) {
        if (event.data.type === 'openChat' || event.data.type === 'closeChat') {
          window.parent.postMessage({ type: 'resize', height: event.data.height }, '*')
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return null
}


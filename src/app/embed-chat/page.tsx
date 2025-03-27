// app/embed-chat/page.tsx
'use client'

import ChatWidget from '@/components/chat-widget'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EmbedChatPage() {
  const searchParams = useSearchParams()
  const lang = searchParams.get('lang') || 'id'
  const theme = searchParams.get('theme') || 'light'
  const greeting = searchParams.get('greeting') || 'Halo! Ada yang bisa saya bantu?'

  const [message, setMessage] = useState('')

  useEffect(() => {
    document.documentElement.lang = lang
    document.body.style.backgroundColor = theme === 'dark' ? '#111' : '#fff'
    setMessage(greeting)
  }, [lang, theme, greeting])

  return (
    <div style={{ height: '100vh', margin: 0 }}>
      <ChatWidget
        initialGreeting={message}
        userAvatar="https://i.pravatar.cc/40?u=user"
        botAvatar="https://i.pravatar.cc/40?u=bot"
        autoOpenDelay={500}
        authToken='supersecrettoken123'
        bubbleStyle={{
          user: {
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: 12,
            padding: '8px 12px',
            lineHeight: 1.5,
            fontSize: 14,
            maxWidth: '85%',
          },
          bot: {
            backgroundColor: '#f5f5f5',
            color: '#333',
            borderRadius: 12,
            padding: '8px 12px',
            lineHeight: 1.5,
            fontSize: 14,
            maxWidth: '85%',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          },
        }}
      />
    </div>
  )
}
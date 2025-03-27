'use client'
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(() => import('@/components/chat-widget'), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <ChatWidget />
    </div>
  )
}
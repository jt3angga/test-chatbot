/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useRef, useState } from 'react';
import Chat, { Bubble, MessageProps } from '@chatui/core';
import '@chatui/core/dist/index.css';
import { useChat } from '@/hooks/use-chat';

interface ChatWidgetProps {
  initialGreeting?: string;
  userAvatar?: string;
  botAvatar?: string;
  bubbleStyle?: {
    user?: React.CSSProperties;
    bot?: React.CSSProperties;
  };
  autoOpenDelay?: number;
  storageKey?: string;
  authToken?: string;
}

export default function ChatWidget({
  initialGreeting,
  userAvatar,
  botAvatar,
  bubbleStyle = {},
  autoOpenDelay = 0,
  storageKey = 'chat-history',
  authToken,
}: ChatWidgetProps) {
  const { messages, sendMessage, appendMsg, resetList } = useChat({ token: authToken });
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const [visible, setVisible] = useState(autoOpenDelay === 0);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        resetList(JSON.parse(saved));
      } catch (e) {
        console.warn('Gagal load chat dari localStorage', e);
      }
    } else if (initialGreeting) {
      appendMsg({
        type: 'text',
        content: { text: initialGreeting },
        position: 'left',
      });
    }
  }, [initialGreeting, resetList, appendMsg, storageKey]);

  // useEffect(() => {
  //   if (!soundRef.current) {
  //     soundRef.current = new Audio('/notify.mp3');
  //   }
  //   const lastMsg = messages[messages.length - 1];
  //   if (lastMsg?.position === 'left') {
  //     soundRef.current?.play().catch(() => { });
  //   }
  // }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  useEffect(() => {
    if (autoOpenDelay > 0) {
      const timer = setTimeout(() => setVisible(true), autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [autoOpenDelay]);

  const renderMessageContent = (msg: MessageProps) => {
    const isUser = msg.position === 'right';
    const avatar = isUser ? userAvatar : botAvatar;
    const bubbleCustomStyle = isUser ? bubbleStyle.user : bubbleStyle.bot;

    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        {!isUser && avatar && (
          <img src={avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
        )}
        <Bubble content={msg.content.text} style={bubbleCustomStyle} />
        {isUser && avatar && (
          <img src={avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
        )}
      </div>
    );
  };

  if (!visible) return null;

  return (
    <>
      <audio ref={soundRef} src="/notify.mp3" preload="auto" />
      <Chat
        navbar={{ title: 'Chatbot' }}
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={(_, val) => sendMessage(val)}
      />
    </>
  );
}
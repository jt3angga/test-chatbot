// hooks/useChat.ts
import { useMessages } from '@chatui/core';
import { useCallback } from 'react';

interface UseChatOptions {
  token?: string;
}

export function useChat(options?: UseChatOptions) {
  const {
    messages,
    appendMsg,
    setTyping,
    updateMsg,
    deleteMsg,
    resetList,
  } = useMessages([]);

  const sendMessage = useCallback(
    async (val: string) => {
      if (!val?.trim()) return;

      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      setTyping(true);

      try {
        const response = await fetch('https://chat.anggasaputra.com/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(options?.token && { Authorization: options.token }),
          },
          body: JSON.stringify({ message: val }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');
        let botMessage = '';
        let done = false;

        appendMsg({
          type: 'text',
          content: { text: '' },
          position: 'left',
          _id: 'bot-stream',
        });

        while (!done && reader) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunk = decoder.decode(value, { stream: !done });

          const lines = chunk
            .split('\n')
            .filter((line) => line.trim().startsWith('data: '));

          for (const line of lines) {
            const jsonStr = line.replace(/^data: /, '').trim();
            if (jsonStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed?.choices?.[0]?.delta?.content;
              if (content) {
                botMessage += content;
                updateMsg('bot-stream', {
                  type: 'text',
                  content: { text: botMessage },
                  position: 'left',
                });
              }
            } catch (err) {
              console.error('Parse error:', err);
            }
          }
        }

        deleteMsg('bot-stream');
        appendMsg({
          type: 'text',
          content: { text: botMessage },
          position: 'left',
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        appendMsg({
          type: 'text',
          content: { text: 'Terjadi kesalahan saat menghubungi server.' },
          position: 'left',
        });
      } finally {
        setTyping(false);
      }
    },
    [appendMsg, setTyping, updateMsg, deleteMsg, options?.token]
  );

  return {
    messages,
    sendMessage,
    appendMsg,
    setTyping,
    resetList,
  };
}

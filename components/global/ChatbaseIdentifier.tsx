'use client';

import { useEffect } from 'react';
import { getChatbaseToken } from '@/actions/chatbase-auth';

declare global {
  interface Window {
    chatbase?: (...args: any[]) => void;
  }
}

export default function ChatbaseIdentifier() {
  useEffect(() => {
    let isMounted = true;

    async function authenticateChatbase() {
      try {
        const token = await getChatbaseToken();
        if (token && isMounted && typeof window !== 'undefined' && window.chatbase) {
          window.chatbase('identify', { token });
        }
      } catch (err) {
        console.error('[ChatbaseIdentifier] Error during user identification:', err);
      }
    }

    authenticateChatbase();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}

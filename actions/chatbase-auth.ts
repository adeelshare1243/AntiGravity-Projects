'use server';

import jwt from 'jsonwebtoken';
import { createClient } from '@/lib/supabase/server';

/**
 * Server Action: Generate a secure signed JWT for Chatbase identity verification
 * Encrypts authenticated Supabase user identity using CHATBOT_IDENTITY_SECRET
 */
export async function getChatbaseToken(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const secret = process.env.CHATBOT_IDENTITY_SECRET;
    if (!secret) {
      console.warn('[getChatbaseToken] CHATBOT_IDENTITY_SECRET is not configured in environment.');
      return null;
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
      },
      secret,
      {
        expiresIn: '1h',
      }
    );

    return token;
  } catch (err: unknown) {
    console.error('[getChatbaseToken] Error generating Chatbase JWT:', err);
    return null;
  }
}

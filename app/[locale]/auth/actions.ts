'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface AuthActionResult {
  error?: string
  success?: boolean
  message?: string
}

/**
 * Server Action: Log in with Email and Password
 */
export async function login(formData: FormData): Promise<AuthActionResult | void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/account'

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

/**
 * Server Action: Sign up with Email, Password, and Full Name
 */
export async function signup(formData: FormData): Promise<AuthActionResult | void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If user is immediately signed in (e.g. email confirmations disabled)
  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/account')
  }

  // If email confirmation is required
  return {
    success: true,
    message: 'Check your email for a confirmation link to finish logging in.',
  }
}

/**
 * Server Action: Log out the current user session
 */
export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/')
}

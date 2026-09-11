import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  // If "next" is in search params, use it as the redirection destination (defaults to /dashboard)
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user && user.email) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email.split('@')[0]
        const provider = user.app_metadata?.provider || 'oauth'

        await prisma.user
          .upsert({
            where: { email: user.email.toLowerCase() },
            update: {
              name: fullName,
              fullName: fullName,
              authProvider: provider,
            },
            create: {
              id: user.id,
              email: user.email.toLowerCase(),
              name: fullName,
              fullName: fullName,
              authProvider: provider,
              status: 'ACTIVE',
            },
          })
          .catch((e) => console.error('[Auth Callback] User sync error:', e))
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // We can be on a local localhost environment
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    console.error('[Auth Callback Error] Code exchange failed:', error)
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user with the provided code.`)
}

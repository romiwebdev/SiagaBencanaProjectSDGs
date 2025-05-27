import { createSupabaseClient } from '@/lib/supabase'

export default async function handler(req, res) {
  const { code } = req.query
  const supabase = createSupabaseClient()

  try {
    if (code) {
      // Tangani OAuth callback
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) throw error
      
      // Set cookie untuk session
      res.setHeader('Set-Cookie', [
        `sb-access-token=${data.session.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
        `sb-refresh-token=${data.session.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
      ])
      
      return res.redirect('/')
    }

    // Mulai OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${req.headers.origin}/auth/callback`
      }
    })

    if (error) throw error
    return res.redirect(data.url)

  } catch (error) {
    console.error('Authentication error:', error)
    return res.redirect('/error?message=Authentication failed')
  }
}

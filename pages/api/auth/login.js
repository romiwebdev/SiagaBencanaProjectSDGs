import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${req.headers.origin}/auth/callback`
    }
  });

  res.redirect(data.url); // Redirect ke Google login
}

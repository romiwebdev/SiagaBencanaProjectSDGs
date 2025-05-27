// pages/auth/callback.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    // Supabase akan otomatis mengatur session dari hash token (#access_token)
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error(error);
        router.replace('/error?message=gagal-login');
      } else {
        router.replace('/admin'); // atau ke halaman sesuai role
      }
    });
  }, []);

  return <p>Mengautentikasi...</p>;
}

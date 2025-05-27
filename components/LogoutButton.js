import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut(); // sign out di client
    router.push('/');              // redirect ke halaman utama
  };

  return (
    <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
      Logout
    </button>
  );
}

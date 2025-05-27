import { supabase } from './supabase';

// Daftar email admin - bisa dipindahkan ke environment variables
const ADMIN_EMAILS = [
  'rominmuh230@gmail.com',
  'admin@bojonegoro.go.id',
  'bencana@bojonegoro.go.id'
];

export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting profile:', error.message);
    return null;
  }
};

export const upsertProfile = async (user) => {
  try {
    const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        is_admin: isAdmin,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error upserting profile:', error.message);
    return null;
  }
};
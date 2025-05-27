import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('kecamatan')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return res.status(200).json(data || []);
    } catch (error) {
      console.error('Error fetching kecamatan data:', error);
      return res.status(500).json({ 
        error: 'Gagal memuat data kecamatan',
        details: error.message 
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, lat, lng } = req.body;
      
      if (!name || !lat || !lng) {
        return res.status(400).json({ 
          error: 'Data tidak lengkap. Harus menyertakan name, lat, dan lng' 
        });
      }

      const { data, error } = await supabase
        .from('kecamatan')
        .insert([{ name, lat, lng }])
        .select();

      if (error) throw error;

      return res.status(201).json({ 
        message: 'Data kecamatan berhasil ditambahkan',
        data: data[0] 
      });
    } catch (error) {
      console.error('Error adding kecamatan:', error);
      return res.status(500).json({ 
        error: 'Gagal menambahkan data kecamatan',
        details: error.message 
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ 
          error: 'ID kecamatan harus disertakan' 
        });
      }

      const { error } = await supabase
        .from('kecamatan')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ 
        message: 'Kecamatan berhasil dihapus'
      });
    } catch (error) {
      console.error('Error deleting kecamatan:', error);
      return res.status(500).json({ 
        error: 'Gagal menghapus data kecamatan',
        details: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
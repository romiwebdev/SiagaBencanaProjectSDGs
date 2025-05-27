import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { year } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Hitung total kecamatan
    const { count: totalKecamatan } = await supabase
      .from('kecamatan')
      .select('*', { count: 'exact', head: true });

    // Hitung statistik bencana
    const { data: disasterData, error: disasterError } = await supabase
      .from('bencana')
      .select('banjir, gempa_bumi, tanah_longsor')
      .eq('tahun', year);

    if (disasterError) throw disasterError;

    let totalBanjir = 0;
    let totalGempa = 0;
    let totalLongsor = 0;
    let totalDesaTerdampak = 0; // Diubah perhitungannya

    disasterData.forEach(item => {
      // Hitung total per jenis bencana
      const banjir = item.banjir || 0;
      const gempa = item.gempa_bumi || 0;
      const longsor = item.tanah_longsor || 0;
      
      totalBanjir += banjir;
      totalGempa += gempa;
      totalLongsor += longsor;
      
      // Hitung total desa terdampak (jumlah semua kejadian)
      totalDesaTerdampak += banjir + gempa + longsor;
    });

    return res.status(200).json({
      totalKecamatan,
      totalDesaTerdampak, // Sekarang berisi total semua kejadian
      totalBanjir,
      totalGempa,
      totalLongsor
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ 
      error: 'Gagal memuat statistik',
      details: error.message
    });
  }
}
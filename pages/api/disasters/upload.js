import { supabase } from '../../../lib/supabase';
import { parse } from 'papaparse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { year, csvData } = req.body;

    if (!year || !csvData) {
      return res.status(400).json({ error: 'Year and CSV data are required' });
    }

    // Parse CSV
    const { data: csvRows, errors } = parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Invalid CSV format' });
    }

    // Gabungkan data berdasarkan kecamatan dan tahun
    const disastersMap = new Map();

    csvRows.forEach(row => {
      const kecamatan = `Kecamatan ${row.Kecamatan}`.trim();
      if (!kecamatan || kecamatan === 'Kecamatan') return;

      const key = `${kecamatan}_${year}`;
      const banjir = parseInt(row['Jumlah Desa/Kelurahan yang Mengalami Bencana Alam - Banjir']) || 0;
      const gempa_bumi = parseInt(row['Jumlah Desa/Kelurahan yang Mengalami Bencana Alam - Gempa Bumi']) || 0;
      const tanah_longsor = parseInt(row['Jumlah Desa/Kelurahan yang Mengalami Bencana Alam - Tanah Longsor']) || 0;

      if (!disastersMap.has(key)) {
        disastersMap.set(key, {
          kecamatan,
          tahun: parseInt(year),
          banjir: 0,
          gempa_bumi: 0,
          tanah_longsor: 0,
        });
      }

      const existing = disastersMap.get(key);
      existing.banjir += banjir;
      existing.gempa_bumi += gempa_bumi;
      existing.tanah_longsor += tanah_longsor;
    });

    const disastersData = Array.from(disastersMap.values());

    // Upsert data tanpa konflik duplikat
    const { data, error } = await supabase
      .from('bencana')
      .upsert(disastersData, {
        onConflict: 'kecamatan,tahun',
      })
      .select();

    if (error) {
      console.error('Error upserting data:', error);
      return res.status(500).json({ 
        error: error.message,
        details: error.details
      });
    }

    return res.status(200).json({ 
      message: `Data bencana tahun ${year} berhasil diupload/diperbarui`,
      count: disastersData.length,
      affectedRows: data.length
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

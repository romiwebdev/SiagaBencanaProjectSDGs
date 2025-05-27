import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { year } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        // Read operation
        const { data, error } = await supabase
          .from('bencana')
          .select('*')
          .eq('tahun', year);

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        // Format data sesuai kebutuhan frontend
        const formattedData = data.map(item => ({
          id: item.id,
          kecamatan: item.kecamatan,
          Banjir: item.banjir,
          Gempa_Bumi: item.gempa_bumi,
          Tanah_Longsor: item.tanah_longsor,
          tahun: item.tahun
        }));

        return res.status(200).json(formattedData);

      case 'POST':
        // Create operation
        const { kecamatan, Banjir, Gempa_Bumi, Tanah_Longsor } = req.body;
        
        const { data: newData, error: insertError } = await supabase
          .from('bencana')
          .insert([{
            kecamatan,
            banjir: Banjir || 0,
            gempa_bumi: Gempa_Bumi || 0,
            tanah_longsor: Tanah_Longsor || 0,
            tahun: year
          }])
          .select();

        if (insertError) {
          return res.status(500).json({ error: insertError.message });
        }

        return res.status(201).json(newData[0]);

      case 'PUT':
        // Update operation
        const { id, ...updateData } = req.body;
        
        const { data: updatedData, error: updateError } = await supabase
          .from('bencana')
          .update({
            kecamatan: updateData.kecamatan,
            banjir: updateData.Banjir || 0,
            gempa_bumi: updateData.Gempa_Bumi || 0,
            tanah_longsor: updateData.Tanah_Longsor || 0
          })
          .eq('id', id)
          .select();

        if (updateError) {
          return res.status(500).json({ error: updateError.message });
        }

        return res.status(200).json(updatedData[0]);

      case 'DELETE':
        // Delete operation
        const { id: deleteId } = req.body;
        
        const { error: deleteError } = await supabase
          .from('bencana')
          .delete()
          .eq('id', deleteId);

        if (deleteError) {
          return res.status(500).json({ error: deleteError.message });
        }

        return res.status(200).json({ message: 'Data berhasil dihapus' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
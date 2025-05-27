import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminTable() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    kecamatan: '',
    jenis_bencana: '',
    deskripsi: '',
    tahun: '',
    status: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('laporan')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (report) => {
    setEditingId(report.id);
    setEditForm({
      kecamatan: report.kecamatan,
      jenis_bencana: report.jenis_bencana,
      deskripsi: report.deskripsi,
      tahun: report.tahun,
      status: report.status
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const adjustBencanaData = async (report, action) => {
    try {
      // 1. Check if bencana data exists for this kecamatan and year
      const { data: existingData, error: fetchError } = await supabase
        .from('bencana')
        .select('*')
        .eq('kecamatan', report.kecamatan)
        .eq('tahun', report.tahun)
        .single();

      if (fetchError && !fetchError.details.includes('0 rows')) {
        throw fetchError;
      }

      if (existingData) {
        // 2. Calculate adjustment (add or remove)
        const adjustment = action === 'remove' ? -1 : 1;

        const updateData = {
          banjir: report.jenis_bencana === 'banjir' ?
            Math.max(0, existingData.banjir + adjustment) : existingData.banjir,
          gempa_bumi: report.jenis_bencana === 'gempa_bumi' ?
            Math.max(0, existingData.gempa_bumi + adjustment) : existingData.gempa_bumi,
          tanah_longsor: report.jenis_bencana === 'tanah_longsor' ?
            Math.max(0, existingData.tanah_longsor + adjustment) : existingData.tanah_longsor
        };

        // 3. Update bencana data
        const { error: updateError } = await supabase
          .from('bencana')
          .update(updateData)
          .eq('id', existingData.id);

        if (updateError) throw updateError;

        // 4. Delete record if all counts are zero
        if (updateData.banjir === 0 && updateData.gempa_bumi === 0 && updateData.tanah_longsor === 0) {
          const { error: deleteError } = await supabase
            .from('bencana')
            .delete()
            .eq('id', existingData.id);

          if (deleteError) throw deleteError;
        }
      } else if (action === 'add') {
        // 5. Create new record if adding and doesn't exist
        const insertData = {
          kecamatan: report.kecamatan,
          banjir: report.jenis_bencana === 'banjir' ? 1 : 0,
          gempa_bumi: report.jenis_bencana === 'gempa_bumi' ? 1 : 0,
          tanah_longsor: report.jenis_bencana === 'tanah_longsor' ? 1 : 0,
          tahun: report.tahun
        };

        const { error: insertError } = await supabase
          .from('bencana')
          .insert([insertData]);

        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error('Error adjusting bencana data:', err);
      throw err;
    }
  };

  const handleEditSubmit = async (id) => {
    try {
      setLoading(true);
      const originalReport = reports.find(r => r.id === id);

      // Update report in database
      const { error } = await supabase
        .from('laporan')
        .update(editForm)
        .eq('id', id);

      if (error) throw error;

      // Handle bencana data adjustments
      if (originalReport.status === 'diverifikasi' && editForm.status === 'ditolak') {
        await adjustBencanaData(originalReport, 'remove');
      } else if (originalReport.status === 'ditolak' && editForm.status === 'diverifikasi') {
        await adjustBencanaData(editForm, 'add');
      }

      setEditingId(null);
      await fetchReports(); // Refresh data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const verifyReport = async (report) => {
    try {
      setLoading(true);

      // Update report status
      const { error: updateError } = await supabase
        .from('laporan')
        .update({ status: 'diverifikasi' })
        .eq('id', report.id);

      if (updateError) throw updateError;

      // Add to bencana data
      await adjustBencanaData(report, 'add');

      await fetchReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const rejectReport = async (id) => {
    try {
      setLoading(true);
      const report = reports.find(r => r.id === id);

      // Update report status
      const { error } = await supabase
        .from('laporan')
        .update({ status: 'ditolak' })
        .eq('id', id);

      if (error) throw error;

      // Remove from bencana data if previously verified
      if (report.status === 'diverifikasi') {
        await adjustBencanaData(report, 'remove');
      }

      await fetchReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;

    try {
      setLoading(true);
      const report = reports.find(r => r.id === id);

      // Coba hapus dari database
      const { error } = await supabase
        .from('laporan')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Jika statusnya diverifikasi, kurangi data bencana
      if (report.status === 'diverifikasi') {
        await adjustBencanaData(report, 'remove');
      }

      // Update state hanya jika berhasil hapus dari DB
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError('Gagal menghapus laporan: ' + err.message);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };


  if (loading && reports.length === 0) return <p>Memuat...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-4">
      {/* Warning message for verified data */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Data yang sudah diverifikasi tidak dapat dikembalikan ke status "menunggu". Harap periksa dengan teliti sebelum melakukan verifikasi.
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Bencana</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === report.id ? (
                    <input
                      type="text"
                      name="kecamatan"
                      value={editForm.kecamatan}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    report.kecamatan
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === report.id ? (
                    <select
                      name="jenis_bencana"
                      value={editForm.jenis_bencana}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    >
                      <option value="banjir">Banjir</option>
                      <option value="gempa_bumi">Gempa Bumi</option>
                      <option value="tanah_longsor">Tanah Longsor</option>
                    </select>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {report.jenis_bencana}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === report.id ? (
                    <textarea
                      name="deskripsi"
                      value={editForm.deskripsi}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    report.deskripsi
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === report.id ? (
                    <input
                      type="number"
                      name="tahun"
                      value={editForm.tahun}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1 w-20"
                    />
                  ) : (
                    report.tahun
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === report.id ? (
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    >
                      <option value="menunggu">Menunggu</option>
                      <option value="diverifikasi">Diverifikasi</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  ) : (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'diverifikasi' ? 'bg-green-100 text-green-800' :
                      report.status === 'ditolak' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {report.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {editingId === report.id ? (
                    <>
                      <button
                        onClick={() => handleEditSubmit(report.id)}
                        className="text-green-600 hover:text-green-900"
                        disabled={loading}
                      >
                        Simpan
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={loading}
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(report)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      {report.status === 'menunggu' && (
                        <>
                          <button
                            onClick={() => verifyReport(report)}
                            className="text-green-600 hover:text-green-900"
                            disabled={loading}
                          >
                            Verifikasi
                          </button>
                          <button
                            onClick={() => rejectReport(report.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
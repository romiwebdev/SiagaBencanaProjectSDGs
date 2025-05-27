import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ReportForm({ onCancel }) {
  const [form, setForm] = useState({
    kecamatan: '',
    jenis_bencana: '',
    deskripsi: '',
    tahun: new Date().getFullYear()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Dapatkan user yang sedang login
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Anda harus login untuk mengirim laporan');
      }

      // Kirim data ke tabel laporan
      const { error } = await supabase
        .from('laporan')
        .insert([{
          kecamatan: form.kecamatan,
          jenis_bencana: form.jenis_bencana,
          deskripsi: form.deskripsi,
          tahun: form.tahun,
          user_id: user.id
        }]);

      if (error) throw error;

      setSuccess('Laporan berhasil dikirim dan akan ditinjau oleh admin');
      setForm({
        kecamatan: '',
        jenis_bencana: '',
        deskripsi: '',
        tahun: new Date().getFullYear()
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
        <select
          name="kecamatan"
          value={form.kecamatan}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Pilih Kecamatan</option>
          <option value="Kecamatan Margomulyo">Margomulyo</option>
          <option value="Kecamatan Ngraho">Ngraho</option>
          <option value="Kecamatan Tambakrejo">Tambakrejo</option>
          <option value="Kecamatan Ngambon">Ngambon</option>
          <option value="Kecamatan Sekar">Sekar</option>
          <option value="Kecamatan Bubulan">Bubulan</option>
          <option value="Kecamatan Gondang">Gondang</option>
          <option value="Kecamatan Temayang">Temayang</option>
          <option value="Kecamatan Sugihwaras">Sugihwaras</option>
          <option value="Kecamatan Kedungadem">Kedungadem</option>
          <option value="Kecamatan Kepohbaru">Kepohbaru</option>
          <option value="Kecamatan Baureno">Baureno</option>
          <option value="Kecamatan Kanor">Kanor</option>
          <option value="Kecamatan Sumberejo">Sumberejo</option>
          <option value="Kecamatan Balen">Balen</option>
          <option value="Kecamatan Sukosewu">Sukosewu</option>
          <option value="Kecamatan Kapas">Kapas</option>
          <option value="Kecamatan Bojonegoro">Bojonegoro</option>
          <option value="Kecamatan Trucuk">Trucuk</option>
          <option value="Kecamatan Dander">Dander</option>
          <option value="Kecamatan Ngasem">Ngasem</option>
          <option value="Kecamatan Kalitidu">Kalitidu</option>
          <option value="Kecamatan Malo">Malo</option>
          <option value="Kecamatan Purwosari">Purwosari</option>
          <option value="Kecamatan Padangan">Padangan</option>
          <option value="Kecamatan Kasiman">Kasiman</option>
          <option value="Kecamatan Kedewan">Kedewan</option>

        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Jenis Bencana</label>
        <select
          name="jenis_bencana"
          value={form.jenis_bencana}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Pilih Jenis Bencana</option>
          <option value="banjir">Banjir</option>
          <option value="gempa_bumi">Gempa Bumi</option>
          <option value="tanah_longsor">Tanah Longsor</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
        <textarea
          name="deskripsi"
          value={form.deskripsi}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tahun</label>
        <input
          type="number"
          name="tahun"
          value={form.tahun}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 text-green-800 rounded">
          {success}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
          disabled={isSubmitting}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
        </button>
      </div>
    </form>
  );
}
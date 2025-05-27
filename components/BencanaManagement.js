import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function BencanaManagement() {
  const [bencanaData, setBencanaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentId, setCurrentId] = useState(null); 
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalAction, setModalAction] = useState('add');
  
  // Form data
  const [formData, setFormData] = useState({
    kecamatan: '',
    banjir: 0,
    gempa_bumi: 0,
    tanah_longsor: 0,
    tahun: new Date().getFullYear()
  });

  // Fetch data bencana
  const fetchBencanaData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bencana')
        .select('*')
        .order('tahun', { ascending: false })
        .order('kecamatan', { ascending: true });

      if (error) throw error;

      setBencanaData(data || []);

      // Extract unique years
      const uniqueYears = [...new Set(data.map(item => item.tahun))].sort((a, b) => b - a);
      setYears(uniqueYears);
      setSelectedYear(uniqueYears[0] || new Date().getFullYear());

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter data by selected year
  useEffect(() => {
    if (selectedYear) {
      setFilteredData(
        bencanaData.filter(item => item.tahun === parseInt(selectedYear))
      );
    }
  }, [selectedYear, bencanaData]);

  // Load data on component mount
  useEffect(() => {
    fetchBencanaData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'kecamatan' ? value : parseInt(value) || 0
    });
  };

  // Open modal for adding new data
  const openAddModal = () => {
    setFormData({
      kecamatan: '',
      banjir: 0,
      gempa_bumi: 0,
      tanah_longsor: 0,
      tahun: selectedYear || new Date().getFullYear()
    });
    setModalTitle('Tambah Data Bencana');
    setModalAction('add');
    setIsModalOpen(true);
  };

  // Open modal for editing data
  const openEditModal = (record) => {
    setFormData({
      kecamatan: record.kecamatan,
      banjir: record.banjir,
      gempa_bumi: record.gempa_bumi,
      tanah_longsor: record.tanah_longsor,
      tahun: record.tahun
    });
    setModalTitle('Edit Data Bencana');
    setModalAction('edit');
    setCurrentId(record.id); // Now properly defined
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (modalAction === 'edit') {
        // Update existing record
        const { error } = await supabase
          .from('bencana')
          .update(formData)
          .eq('id', currentId);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('bencana')
          .insert([formData]);

        if (error) throw error;
      }

      // Close modal and refresh data
      setIsModalOpen(false);
      await fetchBencanaData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete record with confirmation modal
  const confirmDelete = (id) => {
    setCurrentId(id);
    setModalTitle('Konfirmasi Hapus Data');
    setModalAction('delete');
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('bencana')
        .delete()
        .eq('id', currentId);

      if (error) throw error;
      
      setIsModalOpen(false);
      await fetchBencanaData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !bencanaData.length) return <p>Memuat data...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">Manajemen Data Bencana</h2>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Tahun:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
          >
            + Tambah Data
          </button>
        </div>
      </div>

      {/* Tabel data bencana */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banjir</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gempa Bumi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanah Longsor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.kecamatan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.banjir}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.gempa_bumi}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.tanah_longsor}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada data untuk tahun {selectedYear}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit/Delete */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        {modalAction === 'delete' ? (
          <div className="space-y-4">
            <p>Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
                disabled={loading}
              >
                {loading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kecamatan</label>
              <input
                type="text"
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tahun</label>
              <input
                type="number"
                name="tahun"
                value={formData.tahun}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                min="2000"
                max="2100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Jumlah Banjir</label>
              <input
                type="number"
                name="banjir"
                value={formData.banjir}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Jumlah Gempa Bumi</label>
              <input
                type="number"
                name="gempa_bumi"
                value={formData.gempa_bumi}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Jumlah Tanah Longsor</label>
              <input
                type="number"
                name="tanah_longsor"
                value={formData.tanah_longsor}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : modalAction === 'edit' ? 'Update' : 'Simpan'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
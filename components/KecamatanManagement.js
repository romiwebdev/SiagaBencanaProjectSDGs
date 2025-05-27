import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function KecamatanManagement() {
  const [kecamatanList, setKecamatanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalAction, setModalAction] = useState('add');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: ''
  });

  useEffect(() => {
    fetchKecamatan();
  }, []);

  const fetchKecamatan = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('kecamatan')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setKecamatanList(data || []);
    } catch (error) {
      setError('Gagal memuat data kecamatan: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal for adding new kecamatan
  const openAddModal = () => {
    setFormData({
      name: '',
      lat: '',
      lng: ''
    });
    setModalTitle('Tambah Kecamatan Baru');
    setModalAction('add');
    setIsModalOpen(true);
  };

  // Open modal for editing kecamatan
  const openEditModal = (kecamatan) => {
    setFormData({
      name: kecamatan.name,
      lat: kecamatan.lat,
      lng: kecamatan.lng
    });
    setModalTitle('Edit Data Kecamatan');
    setModalAction('edit');
    setCurrentId(kecamatan.id);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (modalAction === 'edit') {
        // Update existing kecamatan
        const { error } = await supabase
          .from('kecamatan')
          .update(formData)
          .eq('id', currentId);

        if (error) throw error;
        setSuccess('Data kecamatan berhasil diperbarui');
      } else {
        // Insert new kecamatan
        const { error } = await supabase
          .from('kecamatan')
          .insert([formData]);

        if (error) throw error;
        setSuccess('Kecamatan berhasil ditambahkan');
      }

      setIsModalOpen(false);
      fetchKecamatan();
    } catch (error) {
      setError(`Gagal ${modalAction === 'edit' ? 'memperbarui' : 'menambahkan'} kecamatan: ` + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm delete
  const confirmDelete = (id) => {
    setCurrentId(id);
    setModalTitle('Konfirmasi Hapus Kecamatan');
    setModalAction('delete');
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('kecamatan')
        .delete()
        .eq('id', currentId);

      if (error) throw error;

      setSuccess('Kecamatan berhasil dihapus');
      setIsModalOpen(false);
      fetchKecamatan();
    } catch (error) {
      setError('Gagal menghapus kecamatan: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manajemen Kecamatan</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          + Tambah Kecamatan
        </button>
      </div>

      {/* Daftar Kecamatan */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Daftar Kecamatan</h3>
        {isLoading && kecamatanList.length === 0 ? (
          <p>Memuat data...</p>
        ) : error ? (
          <div className="text-red-600 bg-red-100 p-3 rounded">{error}</div>
        ) : kecamatanList.length === 0 ? (
          <p>Tidak ada data kecamatan</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kecamatanList.map((kecamatan) => (
                  <tr key={kecamatan.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{kecamatan.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{kecamatan.lat}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{kecamatan.lng}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(kecamatan)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(kecamatan.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isLoading}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit/Delete */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        {modalAction === 'delete' ? (
          <div className="space-y-4">
            <p>Apakah Anda yakin ingin menghapus kecamatan ini?</p>
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
                disabled={isLoading}
              >
                {isLoading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Kecamatan</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nama Kecamatan"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input
                  type="text"
                  name="lat"
                  value={formData.lat}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contoh: -7.12345"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input
                  type="text"
                  name="lng"
                  value={formData.lng}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contoh: 112.12345"
                  required
                />
              </div>
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
                disabled={isLoading}
              >
                {isLoading ? 'Menyimpan...' : modalAction === 'edit' ? 'Update' : 'Simpan'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Notifikasi */}
      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          {success}
        </div>
      )}
    </div>
  );
}
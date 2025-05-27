import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Impor dinamis
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function Map({ year }) {
  const [leaflet, setLeaflet] = useState(null);
  const [disastersData, setDisastersData] = useState([]);
  const [kecamatanData, setKecamatanData] = useState([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load leaflet
    import('leaflet').then(L => {
      setLeaflet(L.default);
    });

    // Fungsi untuk mengambil data kecamatan dari Supabase
    const fetchKecamatanData = async () => {
      try {
        const response = await fetch('/api/kecamatan');
        if (!response.ok) throw new Error('Gagal memuat data kecamatan');
        const data = await response.json();
        setKecamatanData(data);
      } catch (err) {
        console.error('Error fetching kecamatan data:', err);
        setError('Gagal memuat data wilayah kecamatan');
      }
    };

    // Fungsi untuk mengambil data bencana dari API
    const fetchDisasterData = async () => {
      try {
        const response = await fetch(`/api/disasters/${year}`);
        if (!response.ok) throw new Error('Gagal memuat data bencana');
        const data = await response.json();
        setDisastersData(data);
      } catch (err) {
        console.error(`Data untuk tahun ${year} tidak ditemukan`, err);
        setDisastersData([]);
        setError(`Gagal memuat data bencana tahun ${year}`);
      }
    };

    // Memuat kedua data secara paralel
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchKecamatanData(), fetchDisasterData()]);
      setLoading(false);
    };

    loadAllData();
  }, [year]);

  const getMarkerColor = (totalImpact) => {
    if (totalImpact > 5) return 'red';
    if (totalImpact > 2) return 'orange';
    return 'green';
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!leaflet || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Memuat data {year}...</p>
      </div>
    );
  }

  // Gabungkan data kecamatan dengan data bencana
  const combinedData = kecamatanData.map(kec => {
    const disaster = disastersData.find(d => d.kecamatan === kec.name) || {
      Banjir: 0,
      Gempa_Bumi: 0,
      Tanah_Longsor: 0,
    };
    
    return {
      ...kec,
      disasters: disaster,
      totalImpact: parseInt(disaster.Banjir) + parseInt(disaster.Gempa_Bumi) + parseInt(disaster.Tanah_Longsor)
    };
  });

  return (
    <div className="relative">
      <MapContainer 
        center={[-7.15, 111.85]} 
        zoom={10} 
        className="h-[500px] w-full rounded-lg z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {combinedData.map((kec, idx) => (
          <Marker
            key={idx}
            position={[kec.lat, kec.lng]}
            eventHandlers={{
              click: () => setSelectedKecamatan(kec),
            }}
            icon={leaflet.icon({
              iconUrl: `/images/marker-icon-2x-${getMarkerColor(kec.totalImpact)}.png`,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [0, -41],
            })}
          >
            <Popup className="rounded-lg shadow-xl">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-2">{kec.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banjir:</span>
                    <span className="font-semibold">{kec.disasters.Banjir || 0} desa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gempa Bumi:</span>
                    <span className="font-semibold">{kec.disasters.Gempa_Bumi || 0} desa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanah Longsor:</span>
                    <span className="font-semibold">{kec.disasters.Tanah_Longsor || 0} desa</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-primary">{kec.totalImpact} desa</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Tahun: {year}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
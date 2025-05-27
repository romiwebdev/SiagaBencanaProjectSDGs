import Map from '../components/Map';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showLegend, setShowLegend] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState({
    totalKecamatan: 0,
    totalDesaTerdampak: 0,
    totalBanjir: 0,
    totalGempa: 0,
    totalLongsor: 0,
    loading: true,
    error: null
  });
  
  const fetchStats = async (year) => {
    setStats(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/stats/${year}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      // Debug: Log data yang diterima
      console.log('Data statistik diterima:', data);
      
      setStats({
        ...data,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  };
  // Daftar tahun yang tersedia
  const availableYears = [2021, 2024, 2025];



  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowLegend(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    fetchStats(selectedYear);
  }, [selectedYear]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          {/* Title Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                  Peta Sebaran Bencana
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  Real-time monitoring wilayah Kabupaten Bojonegoro
                </p>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Year Selector */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>Data {year}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Legend Toggle */}
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">
                {showLegend ? 'Sembunyikan' : 'Tampilkan'} Legenda
              </span>
              <span className="sm:hidden">Legenda</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mt-6 opacity-80"></div>

        {/* Legend Section */}
        {showLegend && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
              Tingkat Dampak Bencana
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { color: 'green', level: 'Rendah', range: '0-2 desa', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
                { color: 'yellow', level: 'Sedang', range: '3-5 desa', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
                { color: 'red', level: 'Tinggi', range: '6+ desa', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
                { color: 'marker', level: 'Lokasi', range: 'Klik detail', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' }
              ].map((item, idx) => (
                <div key={idx} className={`${item.bg} ${item.border} border p-3 rounded-lg transition-all duration-200 hover:shadow-sm`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {item.color === 'marker' ? (
                      <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-sm"></div>
                    ) : (
                      <div className={`w-4 h-4 bg-${item.color}-500 rounded-full`}></div>
                    )}
                    <span className={`font-medium text-sm ${item.text}`}>{item.level}</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.range}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <Map year={selectedYear} />
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Ringkasan Statistik</h2>
            <p className="text-sm text-slate-600">Data bencana tahun {selectedYear}</p>
          </div>
        </div>

        {/* Baris Pertama: Total Kecamatan dan Desa Terdampak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 text-sm sm:text-base mb-1">
                Total Kecamatan
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {stats.loading ? '...' : stats.totalKecamatan}
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Wilayah administrasi Kabupaten Bojonegoro
              </p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-orange-800 text-sm sm:text-base mb-1">
                Desa Terdampak
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
                {stats.loading ? '...' : stats.totalDesaTerdampak}
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Desa yang mengalami bencana
              </p>
            </div>
          </div>
        </div>

        {/* Baris Kedua: Total per Jenis Bencana */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 text-sm sm:text-base mb-1">
                Total Banjir
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                {stats.loading ? '...' : stats.totalBanjir}
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Desa yang terdampak banjir
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 text-sm sm:text-base mb-1">
                Total Gempa Bumi
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-2">
                {stats.loading ? '...' : stats.totalGempa}
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Desa yang terdampak gempa bumi
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-red-800 text-sm sm:text-base mb-1">
                Total Tanah Longsor
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">
                {stats.loading ? '...' : stats.totalLongsor}
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Desa yang terdampak tanah longsor
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">
                Data terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-4 text-xs text-slate-500">
              <span>• Banjir</span>
              <span>• Gempa Bumi</span>
              <span>• Tanah Longsor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}  
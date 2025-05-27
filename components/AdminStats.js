import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalReports: 0,
    statusCounts: {
      menunggu: 0,
      diverifikasi: 0,
      ditolak: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch
    fetchStats();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('reports_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'laporan' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get total reports count
      const { count: totalReports } = await supabase
        .from('laporan')
        .select('*', { count: 'exact', head: true });

      // Get status counts
      const { data: statusData, error: statusError } = await supabase
        .from('laporan')
        .select('status');
      
      if (statusError) throw statusError;

      const statusCounts = {
        menunggu: statusData.filter(r => r.status === 'menunggu').length,
        diverifikasi: statusData.filter(r => r.status === 'diverifikasi').length,
        ditolak: statusData.filter(r => r.status === 'ditolak').length
      };

      setStats({
        totalReports: totalReports || 0,
        statusCounts
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: "Total Laporan", 
      value: stats.totalReports, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "blue",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700"
    },
    { 
      title: "Menunggu", 
      value: stats.statusCounts.menunggu, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "yellow",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700"
    },
    { 
      title: "Diverifikasi", 
      value: stats.statusCounts.diverifikasi, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: "green",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700"
    },
    { 
      title: "Ditolak", 
      value: stats.statusCounts.ditolak, 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M5.636 5.636l3.536 3.536m0 5.656l-3.536 3.536" />
        </svg>
      ),
      color: "red",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700"
    }
  ];

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-100 border border-gray-200 p-4 md:p-5 rounded-xl animate-pulse h-24" />
      ))}
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
      Error: {error}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className={`${stat.bg} ${stat.border} border p-4 md:p-5 rounded-xl hover:shadow-sm transition-all`}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-xs md:text-sm font-medium ${stat.text}`}>{stat.title}</p>
              <p className={`text-2xl md:text-3xl font-bold mt-1 ${stat.text}`}>
                {stat.value.toLocaleString()}
              </p>
            </div>
            <div className={`p-2 md:p-3 rounded-lg bg-${stat.color}-100`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
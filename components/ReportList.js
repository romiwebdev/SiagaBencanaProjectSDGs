import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setReports([]);
        return;
      }

      const { data, error } = await supabase
        .from('laporan')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Memuat laporan...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Anda belum memiliki laporan</p>
        </div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="border rounded-lg p-4">
            <div className="flex justify-between">
              <h3 className="font-medium">
                {report.kecamatan} - {report.jenis_bencana} ({report.tahun})
              </h3>
              <span className={`px-2 text-xs rounded-full ${
                report.status === 'diverifikasi' ? 'bg-green-100 text-green-800' :
                report.status === 'ditolak' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {report.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{report.deskripsi}</p>
            <p className="mt-2 text-xs text-gray-500">
              {new Date(report.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ReportForm from '../components/ReportForm';
import ReportList from '../components/ReportList';

export default function Laporkan() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p className="text-center py-10 text-slate-500">Memuat...</p>;
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl p-6 text-center shadow border">
        <h2 className="text-xl font-bold text-slate-900">Silakan Login Terlebih Dahulu</h2>
        <p className="text-slate-600 mt-2">Anda perlu login untuk mengakses halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow border text-center">
        <h2 className="text-xl font-bold text-slate-900">Laporkan Kejadian Bencana</h2>
        <p className="text-sm text-slate-600 mt-1 mb-4">Bantu masyarakat dengan melaporkan kejadian di sekitarmu</p>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          Laporkan Bencana Baru
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Formulir Laporan</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-red-500">
                ×
              </button>
            </div>
            <ReportForm onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Laporan Terkini</h3>
        <ReportList />
      </div>
    </div>
  );
}

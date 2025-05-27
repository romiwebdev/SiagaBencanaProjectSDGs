import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminStats from '../components/AdminStats';
import AdminTable from '../components/AdminTable';
import KecamatanManagement from '../components/KecamatanManagement';
import { supabase } from '@/lib/supabase';
import UploadDisasterData from '../components/UploadDisasterData';
import BencanaManagement from '../components/BencanaManagement';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('reports');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      if (!user || user.email !== adminEmail) {
        router.push('/');
      }
    };
    checkAccess();
  }, []);

  const handleUserManagementClick = () => {
    window.open('https://supabase.com/dashboard/project/swtxrpyggqxokqmhehpw/auth/users', '_blank');
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 py-4 md:py-6">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200/60 p-4 md:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0..." />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard Admin</h1>
            <p className="text-sm text-slate-600">Manajemen laporan bencana Kabupaten Bojonegoro</p>
          </div>
        </div>

        {/* Tab */}
        <div className="flex border-b border-slate-200 mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'reports' ? 'text-red-600 border-b-2 border-red-500' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Laporan Bencana
          </button>
          <button
            onClick={() => setActiveTab('bencana')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'bencana' ? 'text-red-600 border-b-2 border-red-500' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Data Bencana
          </button>
          <button
            onClick={() => setActiveTab('kecamatan')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'kecamatan' ? 'text-red-600 border-b-2 border-red-500' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Manajemen Kecamatan
          </button>
          <button
            onClick={handleUserManagementClick}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'users' ? 'text-red-600 border-b-2 border-red-500' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Manajemen Pengguna
          </button>
        </div>
        <div className="w-full bg-gradient-to-r from-red-500 to-orange-500 h-0.5 md:h-1 rounded-full opacity-80"></div>
      </div>

      {activeTab === 'reports' ? (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload Data Bencana</span>
            </button>
          </div>
          <AdminStats />
          <AdminTable />

          {showUploadModal && (
            <UploadDisasterData
              onClose={() => setShowUploadModal(false)}
            />
          )}
        </>
      ) : activeTab === 'bencana' ? (
        <BencanaManagement />
      ) : activeTab === 'kecamatan' ? (
        <KecamatanManagement />
      ) : null}
    </div>
  );
}
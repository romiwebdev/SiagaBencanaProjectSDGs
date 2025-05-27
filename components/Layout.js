import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import LogoutButton from './LogoutButton';

const NavLink = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-out group ${
        isActive 
          ? 'text-slate-900' 
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300 ease-out ${
        isActive ? 'w-full' : 'w-0 group-hover:w-full'
      }`} />
    </Link>
  );
};

const MobileNavLink = ({ href, children, onClick }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-base font-medium border-l-4 transition-all duration-200 ${
        isActive 
          ? 'bg-red-50 text-red-700 border-red-500' 
          : 'text-slate-700 border-transparent hover:bg-slate-50 hover:border-slate-300'
      }`}
    >
      {children}
    </Link>
  );
};

const FooterLink = ({ href, children }) => {
  return (
    <Link 
      href={href} 
      className="text-slate-400 hover:text-white transition-colors duration-200 text-sm leading-relaxed"
    >
      {children}
    </Link>
  );
};

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isAdmin = user?.email === 'rominmuh230@gmail.com'; // ganti dengan email admin yang valid

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur border-b border-slate-200/60 shadow-sm' 
          : 'bg-white/80 backdrop-blur border-b border-slate-200/40'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    SiagaBencana
                  </h1>
                  <p className="text-xs text-slate-500 -mt-0.5">Kab. Bojonegoro</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="/">Beranda</NavLink>
              <NavLink href="/laporkan">Laporkan</NavLink>
              {isAdmin && <NavLink href="/admin">Dashboard</NavLink>}
              {!user ? (
                <NavLink href="/api/auth/login">Login</NavLink>
              ) : (
                <LogoutButton />
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden bg-white border-t border-slate-200 transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-2">
            <MobileNavLink href="/" onClick={closeMobileMenu}>Beranda</MobileNavLink>
            <MobileNavLink href="/laporkan" onClick={closeMobileMenu}>Laporkan</MobileNavLink>
            {isAdmin && <MobileNavLink href="/admin" onClick={closeMobileMenu}>Dashboard</MobileNavLink>}
            {!user ? (
              <MobileNavLink href="/api/auth/login" onClick={closeMobileMenu}>Login</MobileNavLink>
            ) : (
              <LogoutButton />
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-800">SiagaBencana Bojonegoro</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-slate-600 hover:text-red-600 transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-red-600 transition-colors">
                Syarat & Ketentuan
              </a>
              <span className="text-xs text-slate-400">v2.1.0</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} SiagaBencana Bojonegoro. Hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

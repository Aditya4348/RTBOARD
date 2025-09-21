import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h27" /></svg>;
const OrgIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375M9 12h6.375M9 17.25h6.375M12 3c-1.105 0-2.09.2-3 .5m6 0c.91-.3 1.895-.5 3-.5m-6 18c-1.105 0-2.09-.2-3-.5m6 0c.91.3 1.895.5 3 .5" /></svg>;
const BoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
const AnnounceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688 0-1.25-.562-1.25-1.25s.562-1.25 1.25-1.25h3.32c.688 0 1.25.562 1.25 1.25s-.562 1.25-1.25 1.25h-3.32zM9 19.5v-2.25m6 2.25v-2.25M12 17.25v2.25m-6.75-6.75h13.5c.621 0 1.125-.504 1.125-1.125v-6.75c0-.621-.504-1.125-1.125-1.125h-13.5c-.621 0-1.125.504-1.125 1.125v6.75c0 .621.504 1.125 1.125 1.125z" /></svg>;
const SuggestionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>;


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavItem {
    path: string;
    label: string;
    icon: JSX.Element;
    allowedRoles: UserRole[];
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon />, allowedRoles: [UserRole.KETUA, UserRole.SEKRETARIS, UserRole.BENDAHARA, UserRole.WARGA] },
    { path: '/data-warga', label: 'Data Warga', icon: <UsersIcon />, allowedRoles: [UserRole.KETUA, UserRole.SEKRETARIS] },
    { path: '/surat-pengantar', label: 'Surat Pengantar', icon: <MailIcon />, allowedRoles: [UserRole.KETUA, UserRole.SEKRETARIS] },
    { path: '/keuangan', label: 'Laporan Keuangan', icon: <MoneyIcon />, allowedRoles: [UserRole.KETUA, UserRole.BENDAHARA] },
    { path: '/iuran', label: 'Iuran Warga', icon: <MoneyIcon />, allowedRoles: [UserRole.KETUA, UserRole.BENDAHARA] },
    { path: '/agenda', label: 'Agenda Kegiatan', icon: <CalendarIcon />, allowedRoles: [UserRole.KETUA, UserRole.SEKRETARIS, UserRole.WARGA] },
    { path: '/struktur-organisasi', label: 'Struktur Organisasi', icon: <OrgIcon />, allowedRoles: [UserRole.KETUA, UserRole.SEKRETARIS] },
    { path: '/inventaris', label: 'Inventaris RT', icon: <BoxIcon />, allowedRoles: [UserRole.KETUA, UserRole.SEKRETARIS, UserRole.BENDAHARA] },
    { path: '/pengumuman', label: 'Pengumuman', icon: <AnnounceIcon />, allowedRoles: [UserRole.KETUA, UserRole.SEKRETARIS, UserRole.BENDAHARA, UserRole.WARGA] },
    { path: '/kotak-saran', label: 'Kotak Saran', icon: <SuggestionIcon />, allowedRoles: [UserRole.KETUA, UserRole.SEKRETARIS, UserRole.BENDAHARA, UserRole.WARGA] },
  ];
  
  const filteredNavItems = user ? navItems.filter(item => item.allowedRoles.includes(user.role)) : [];

  return (
    <>
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen w-64 lg:w-72 overflow-y-auto no-scrollbar flex flex-col bg-slate-800 text-slate-200 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-white">RT Digital</h1>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul>
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-2 my-1 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-300'
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-3 font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
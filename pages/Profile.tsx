import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="text-center text-slate-500 dark:text-slate-400">Loading user data...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Profil Saya</h1>
            
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 md:p-8 max-w-2xl mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                    <img 
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-300 dark:ring-blue-500"
                        src={`https://i.pravatar.cc/150?u=${user.username}`} 
                        alt="Profile" 
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.namaLengkap}</h2>
                        <p className="text-md text-slate-500 dark:text-slate-400">@{user.username}</p>
                        <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            {user.role}
                        </span>
                    </div>
                </div>
                
                <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Nama Lengkap</dt>
                            <dd className="mt-1 text-sm text-slate-900 dark:text-white">{user.namaLengkap}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Username</dt>
                            <dd className="mt-1 text-sm text-slate-900 dark:text-white">{user.username}</dd>
                        </div>
                         <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Jabatan</dt>
                            <dd className="mt-1 text-sm text-slate-900 dark:text-white">{user.role}</dd>
                        </div>
                         {user.noKK && (
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Nomor KK</dt>
                                <dd className="mt-1 text-sm text-slate-900 dark:text-white">{user.noKK}</dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
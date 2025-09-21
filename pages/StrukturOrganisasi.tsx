import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Pengurus } from '../types';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const StrukturOrganisasiPage: React.FC = () => {
    const { pengurus, setPengurus } = useData();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPengurus, setCurrentPengurus] = useState<Pengurus | null>(null);

    const canManage = user?.role === UserRole.KETUA || user?.role === UserRole.SEKRETARIS;

    const handleOpenModal = (p: Pengurus | null) => {
        setCurrentPengurus(p || { id: '', jabatan: '', nama: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPengurus(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPengurus) return;

        const isEditing = pengurus.some(p => p.id === currentPengurus.id);
        if (isEditing) {
            setPengurus(pengurus.map(p => p.id === currentPengurus.id ? currentPengurus : p));
        } else {
            setPengurus([...pengurus, { ...currentPengurus, id: `pengurus-${Date.now()}` }]);
        }
        handleCloseModal();
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('Yakin ingin menghapus data pengurus ini?')){
            setPengurus(pengurus.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Struktur Organisasi RT</h1>
                {canManage && (
                    <button onClick={() => handleOpenModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        Tambah Pengurus
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Jabatan</th>
                            <th scope="col" className="px-6 py-3">Nama</th>
                            {canManage && <th scope="col" className="px-6 py-3 text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {pengurus.map(p => (
                            <tr key={p.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{p.jabatan}</td>
                                <td className="px-6 py-4">{p.nama}</td>
                                {canManage && (
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleOpenModal(p)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Hapus</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {canManage && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentPengurus?.id ? 'Edit Pengurus' : 'Tambah Pengurus'}>
                    {currentPengurus && (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Jabatan</label>
                                <input type="text" value={currentPengurus.jabatan} onChange={e => setCurrentPengurus({ ...currentPengurus, jabatan: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nama</label>
                                <input type="text" value={currentPengurus.nama} onChange={e => setCurrentPengurus({ ...currentPengurus, nama: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 font-semibold">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Simpan</button>
                            </div>
                        </form>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default StrukturOrganisasiPage;
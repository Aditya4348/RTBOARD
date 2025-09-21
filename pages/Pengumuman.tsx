import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Pengumuman } from '../types';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const PengumumanPage: React.FC = () => {
    const { pengumuman, setPengumuman } = useData();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPengumuman, setCurrentPengumuman] = useState<Pengumuman | null>(null);

    const canManage = user?.role === UserRole.KETUA || user?.role === UserRole.SEKRETARIS;

    const handleOpenModal = (p: Pengumuman | null) => {
        setCurrentPengumuman(p || { id: '', judul: '', isi: '', tanggal: new Date().toISOString().split('T')[0], penulis: user?.namaLengkap || '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPengumuman(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPengumuman) return;

        const isEditing = pengumuman.some(p => p.id === currentPengumuman.id);
        if (isEditing) {
            setPengumuman(pengumuman.map(p => p.id === currentPengumuman.id ? currentPengumuman : p));
        } else {
            setPengumuman([...pengumuman, { ...currentPengumuman, id: `pengumuman-${Date.now()}` }]);
        }
        handleCloseModal();
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('Yakin ingin menghapus pengumuman ini?')){
            setPengumuman(pengumuman.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Pengumuman</h1>
                {canManage && (
                    <button onClick={() => handleOpenModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        Buat Pengumuman
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {pengumuman.sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).map(p => (
                    <div key={p.id} className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{p.judul}</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Diposting pada {new Date(p.tanggal).toLocaleDateString('id-ID')} oleh {p.penulis}
                                </p>
                            </div>
                            {canManage && (
                                <div className="flex-shrink-0 ml-4 space-x-3">
                                    <button onClick={() => handleOpenModal(p)} className="font-medium text-slate-500 hover:text-blue-500 text-sm">Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="font-medium text-slate-500 hover:text-red-500 text-sm">Hapus</button>
                                </div>
                            )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-4 whitespace-pre-wrap">{p.isi}</p>
                    </div>
                ))}
            </div>

            {canManage && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentPengumuman?.id ? 'Edit Pengumuman' : 'Buat Pengumuman'}>
                    {currentPengumuman && (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Judul</label>
                                <input type="text" value={currentPengumuman.judul} onChange={e => setCurrentPengumuman({ ...currentPengumuman, judul: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Isi Pengumuman</label>
                                <textarea rows={5} value={currentPengumuman.isi} onChange={e => setCurrentPengumuman({ ...currentPengumuman, isi: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
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

export default PengumumanPage;
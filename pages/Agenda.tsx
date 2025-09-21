import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Agenda } from '../types';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const AgendaPage: React.FC = () => {
    const { agenda, setAgenda } = useData();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [currentAgenda, setCurrentAgenda] = useState<Agenda | null>(null);

    const canManage = user?.role === UserRole.KETUA || user?.role === UserRole.SEKRETARIS;

    const handleOpenModal = (a: Agenda | null) => {
        setCurrentAgenda(a || { id: '', judul: '', tanggal: '', deskripsi: '', dokumentasi: [] });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentAgenda(null);
    };
    
    const handleOpenDetail = (a: Agenda) => {
        setCurrentAgenda(a);
        setIsDetailOpen(true);
    };
    
    const handleCloseDetail = () => {
        setIsDetailOpen(false);
        setCurrentAgenda(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentAgenda) return;

        const isEditing = agenda.some(a => a.id === currentAgenda.id);
        if (isEditing) {
            setAgenda(agenda.map(a => a.id === currentAgenda.id ? currentAgenda : a));
        } else {
            setAgenda([...agenda, { ...currentAgenda, id: `agenda-${Date.now()}` }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Yakin ingin menghapus agenda ini?')) {
            setAgenda(agenda.filter(a => a.id !== id));
        }
    };
    
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && currentAgenda) {
            const files = Array.from(e.target.files);
            const readers = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });
            Promise.all(readers).then(images => {
                setCurrentAgenda({ ...currentAgenda, dokumentasi: [...(currentAgenda.dokumentasi || []), ...images]});
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Agenda & Kegiatan</h1>
                {canManage && (
                    <button onClick={() => handleOpenModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        Tambah Agenda
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agenda.sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).map(a => (
                    <div key={a.id} className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{a.judul}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{new Date(a.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-slate-600 dark:text-slate-300">{a.deskripsi.substring(0, 100)}...</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <button onClick={() => handleOpenDetail(a)} className="text-blue-600 font-semibold hover:underline">Lihat Detail</button>
                            {canManage && (
                                <div className="space-x-3">
                                    <button onClick={() => handleOpenModal(a)} className="font-medium text-slate-500 hover:text-blue-500">Edit</button>
                                    <button onClick={() => handleDelete(a.id)} className="font-medium text-slate-500 hover:text-red-500">Hapus</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentAgenda?.id ? 'Edit Agenda' : 'Tambah Agenda'}>
                {currentAgenda && (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium dark:text-slate-300">Judul</label>
                            <input type="text" value={currentAgenda.judul} onChange={e => setCurrentAgenda({ ...currentAgenda, judul: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-slate-300">Tanggal</label>
                            <input type="date" value={currentAgenda.tanggal} onChange={e => setCurrentAgenda({ ...currentAgenda, tanggal: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-slate-300">Deskripsi</label>
                            <textarea value={currentAgenda.deskripsi} onChange={e => setCurrentAgenda({ ...currentAgenda, deskripsi: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium dark:text-slate-300">Upload Dokumentasi</label>
                            <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {currentAgenda.dokumentasi?.map((img, i) => <img key={i} src={img} alt="dokumentasi" className="h-16 w-16 object-cover rounded-md" />)}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 font-semibold">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Simpan</button>
                        </div>
                    </form>
                )}
            </Modal>
            
            <Modal isOpen={isDetailOpen} onClose={handleCloseDetail} title={currentAgenda?.judul || 'Detail Agenda'}>
                {currentAgenda && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(currentAgenda.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-slate-700 dark:text-slate-300">{currentAgenda.deskripsi}</p>
                        <h4 className="font-bold dark:text-white">Dokumentasi:</h4>
                        <div className="flex flex-wrap gap-4">
                            {currentAgenda.dokumentasi && currentAgenda.dokumentasi.length > 0 ? (
                                currentAgenda.dokumentasi.map((img, i) => <img key={i} src={img} alt={`Dokumentasi ${i+1}`} className="w-full md:w-1/2 rounded-lg object-cover" />)
                            ) : <p className="text-slate-500 dark:text-slate-400">Tidak ada dokumentasi.</p>}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AgendaPage;
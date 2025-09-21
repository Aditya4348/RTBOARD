import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Inventaris } from '../types';
import Modal from '../components/Modal';

const InventarisPage: React.FC = () => {
    const { inventaris, setInventaris } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Inventaris | null>(null);

    const handleOpenModal = (item: Inventaris | null) => {
        setCurrentItem(item || { id: '', namaBarang: '', jumlah: 1, kondisi: 'Baik' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem) return;

        const isEditing = inventaris.some(i => i.id === currentItem.id);
        if (isEditing) {
            setInventaris(inventaris.map(i => i.id === currentItem.id ? currentItem : i));
        } else {
            setInventaris([...inventaris, { ...currentItem, id: `inv-${Date.now()}` }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Yakin ingin menghapus barang ini dari inventaris?')){
            setInventaris(inventaris.filter(i => i.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Inventaris RT</h1>
                <button onClick={() => handleOpenModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                    Tambah Barang
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama Barang</th>
                            <th scope="col" className="px-6 py-3">Jumlah</th>
                            <th scope="col" className="px-6 py-3">Kondisi</th>
                            <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventaris.map(item => (
                            <tr key={item.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.namaBarang}</td>
                                <td className="px-6 py-4">{item.jumlah}</td>
                                <td className="px-6 py-4">{item.kondisi}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleOpenModal(item)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentItem?.id ? 'Edit Inventaris' : 'Tambah Inventaris'}>
                {currentItem && (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Barang</label>
                            <input type="text" value={currentItem.namaBarang} onChange={e => setCurrentItem({ ...currentItem, namaBarang: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah</label>
                            <input type="number" min="1" value={currentItem.jumlah} onChange={e => setCurrentItem({ ...currentItem, jumlah: parseInt(e.target.value) || 1 })} className="mt-1 block w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kondisi</label>
                            <select value={currentItem.kondisi} onChange={e => setCurrentItem({ ...currentItem, kondisi: e.target.value as any })} className="mt-1 block w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required>
                                <option>Baik</option>
                                <option>Rusak</option>
                                <option>Perbaikan</option>
                            </select>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 font-semibold">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Simpan</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default InventarisPage;
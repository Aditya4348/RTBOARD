import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Transaksi, TipeTransaksi } from '../types';
import Modal from '../components/Modal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KeuanganPage: React.FC = () => {
    const { transaksi, setTransaksi } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTransaksi, setNewTransaksi] = useState<Omit<Transaksi, 'id'>>({
        tanggal: new Date().toISOString().split('T')[0],
        tipe: TipeTransaksi.PEMASUKAN,
        keterangan: '',
        jumlah: 0,
    });

    const totalPemasukan = useMemo(() => transaksi.filter(t => t.tipe === TipeTransaksi.PEMASUKAN).reduce((sum, t) => sum + t.jumlah, 0), [transaksi]);
    const totalPengeluaran = useMemo(() => transaksi.filter(t => t.tipe === TipeTransaksi.PENGELUARAN).reduce((sum, t) => sum + t.jumlah, 0), [transaksi]);
    const saldo = totalPemasukan - totalPengeluaran;

    const chartData = useMemo(() => {
        const monthlyData: { [key: string]: { name: string, Pemasukan: number, Pengeluaran: number } } = {};
        transaksi.forEach(t => {
            const month = new Date(t.tanggal).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyData[month]) {
                monthlyData[month] = { name: month, Pemasukan: 0, Pengeluaran: 0 };
            }
            if (t.tipe === TipeTransaksi.PEMASUKAN) {
                monthlyData[month].Pemasukan += t.jumlah;
            } else {
                monthlyData[month].Pengeluaran += t.jumlah;
            }
        });
        return Object.values(monthlyData);
    }, [transaksi]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntry: Transaksi = { ...newTransaksi, id: `trans-${Date.now()}` };
        setTransaksi([...transaksi, newEntry].sort((a,b)=> new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
        setNewTransaksi({
            tanggal: new Date().toISOString().split('T')[0],
            tipe: TipeTransaksi.PEMASUKAN,
            keterangan: '',
            jumlah: 0,
        });
        handleCloseModal();
    };
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Keuangan RT</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"><h3 className="font-bold text-slate-500 dark:text-slate-400">Total Pemasukan</h3><p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">{formatCurrency(totalPemasukan)}</p></div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"><h3 className="font-bold text-slate-500 dark:text-slate-400">Total Pengeluaran</h3><p className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">{formatCurrency(totalPengeluaran)}</p></div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"><h3 className="font-bold text-slate-500 dark:text-slate-400">Saldo Akhir</h3><p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-1">{formatCurrency(saldo)}</p></div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Grafik Keuangan Bulanan</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value as number)} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="Pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg">
                <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Catatan Transaksi</h2>
                    <button onClick={handleOpenModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                        Tambah Transaksi
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Tanggal</th>
                                <th scope="col" className="px-6 py-3">Keterangan</th>
                                <th scope="col" className="px-6 py-3">Tipe</th>
                                <th scope="col" className="px-6 py-3 text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaksi.map(t => (
                                <tr key={t.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                    <td className="px-6 py-4">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4">{t.keterangan}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.tipe === TipeTransaksi.PEMASUKAN ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{t.tipe}</span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-medium ${t.tipe === TipeTransaksi.PEMASUKAN ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(t.jumlah)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Tambah Transaksi Baru">
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal</label>
                        <input type="date" value={newTransaksi.tanggal} onChange={e => setNewTransaksi({...newTransaksi, tanggal: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipe Transaksi</label>
                        <select value={newTransaksi.tipe} onChange={e => setNewTransaksi({...newTransaksi, tipe: e.target.value as TipeTransaksi})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" required>
                            <option value={TipeTransaksi.PEMASUKAN}>Pemasukan</option>
                            <option value={TipeTransaksi.PENGELUARAN}>Pengeluaran</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Keterangan</label>
                        <input type="text" value={newTransaksi.keterangan} onChange={e => setNewTransaksi({...newTransaksi, keterangan: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah (Rp)</label>
                        <input type="number" value={newTransaksi.jumlah} onChange={e => setNewTransaksi({...newTransaksi, jumlah: parseInt(e.target.value) || 0})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 font-semibold">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default KeuanganPage;
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Saran } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const KotakSaranPage: React.FC = () => {
    const { saran, setSaran } = useData();
    const { user } = useAuth();
    const [newSaran, setNewSaran] = useState('');
    const [isAnonim, setIsAnonim] = useState(true);

    const isPengurus = user?.role !== UserRole.WARGA;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSaran.trim()) return;

        const saranBaru: Saran = {
            id: `saran-${Date.now()}`,
            pengirim: isAnonim ? 'Anonim' : user?.namaLengkap || 'Anonim',
            isi: newSaran,
            tanggal: new Date().toISOString().split('T')[0]
        };
        setSaran([...saran, saranBaru]);
        setNewSaran('');
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('Yakin ingin menghapus saran ini?')){
            setSaran(saran.filter(s => s.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Kotak Saran</h1>
            
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Kirimkan Saran Anda</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea 
                        rows={4}
                        value={newSaran}
                        onChange={e => setNewSaran(e.target.value)}
                        placeholder="Tulis saran, kritik, atau masukan Anda di sini..."
                        className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        required
                    />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="anonim"
                                type="checkbox"
                                checked={isAnonim}
                                onChange={e => setIsAnonim(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="anonim" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
                                Kirim sebagai Anonim
                            </label>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                            Kirim Saran
                        </button>
                    </div>
                </form>
            </div>

            {isPengurus && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Daftar Saran Masuk</h2>
                    {saran.sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).map(s => (
                        <div key={s.id} className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{s.isi}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                                        Dari: <span className="font-medium">{s.pengirim}</span> | Tanggal: {new Date(s.tanggal).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                                <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 text-sm ml-4 flex-shrink-0 font-medium">Hapus</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KotakSaranPage;
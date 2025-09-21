import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';

const IuranPage: React.FC = () => {
    const { iuran, setIuran } = useData();
    const [year, setYear] = useState(new Date().getFullYear());

    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => 
        new Date(0, i).toLocaleString('id-ID', { month: 'long' })
    ), []);

    const handleToggleIuran = (noKK: string, bulan: string) => {
        const bulanKey = `${bulan.toLowerCase()}-${year}`;
        setIuran(prevIuran => 
            prevIuran.map(w => {
                if (w.noKK === noKK) {
                    const updatedIuran = { ...w.iuran, [bulanKey]: !w.iuran[bulanKey] };
                    return { ...w, iuran: updatedIuran };
                }
                return w;
            })
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Iuran Warga</h1>

            <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <label className="font-medium text-slate-700 dark:text-slate-300">Tahun:</label>
                <select 
                    value={year} 
                    onChange={e => setYear(parseInt(e.target.value))}
                    className="px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                </select>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 sticky left-0 bg-slate-50 dark:bg-slate-700">Kepala Keluarga</th>
                            {months.map(month => (
                                <th key={month} scope="col" className="px-6 py-3 text-center">{month}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {iuran.map(warga => (
                            <tr key={warga.noKK} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-800">{warga.namaKepalaKeluarga}</td>
                                {months.map(month => {
                                    const bulanKey = `${month.toLowerCase()}-${year}`;
                                    const hasPaid = warga.iuran[bulanKey];
                                    return (
                                        <td key={month} className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleToggleIuran(warga.noKK, month)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors
                                                    ${hasPaid ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                                            >
                                                {hasPaid ? '✓' : '✗'}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IuranPage;
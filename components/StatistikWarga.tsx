import React, { useMemo } from 'react';
import { Warga, AnggotaKeluarga } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface Props {
  warga: Warga[];
}

const StatistikWarga: React.FC<Props> = ({ warga }) => {
  // Flatten semua anggota
  const semuaAnggota = useMemo(() => warga.flatMap(w => w.anggota), [warga]);
  
  // Hitung usia
  const getAge = (tanggalLahir: string) => {
    if (!tanggalLahir) return 0;
    const birthDate = new Date(tanggalLahir);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  // Distribusi usia
  const kelompokUsia = { '0-12':0, '13-17':0, '18-25':0, '26-40':0, '41-60':0, '60+':0 };
  semuaAnggota.forEach(a => {
    const age = getAge(a.tanggalLahir);
    if (age <= 12) kelompokUsia['0-12']++;
    else if (age <= 17) kelompokUsia['13-17']++;
    else if (age <= 25) kelompokUsia['18-25']++;
    else if (age <= 40) kelompokUsia['26-40']++;
    else if (age <= 60) kelompokUsia['41-60']++;
    else kelompokUsia['60+']++;
  });

  const dataUsia = Object.entries(kelompokUsia).map(([key, value]) => ({ usia: key, jumlah: value }));

  // Distribusi jenis kelamin
  const jenisKelamin: Record<string, number> = { 'Laki-laki': 0, 'Perempuan': 0 };
  semuaAnggota.forEach(a => {
    if (a.jenisKelamin) jenisKelamin[a.jenisKelamin] = (jenisKelamin[a.jenisKelamin] || 0) + 1;
  });
  const dataKelamin = Object.entries(jenisKelamin).map(([key, value]) => ({ name: key, value }));

  const COLORS = ['#0088FE', '#FF8042'];

  // Distribusi pendidikan
  const pendidikan: Record<string, number> = {};
  semuaAnggota.forEach(a => {
    if (a.pendidikan) pendidikan[a.pendidikan] = (pendidikan[a.pendidikan] || 0) + 1;
  });
  const dataPendidikan = Object.entries(pendidikan).map(([key, value]) => ({ pendidikan: key, jumlah: value }));

  return (
     <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Distribusi Usia</h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={dataUsia} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="usia" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#cbd5e1" }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#cbd5e1" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="jumlah" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1E40AF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Jenis Kelamin</h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={dataKelamin}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {dataKelamin.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-1 lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Tingkat Pendidikan</h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={dataPendidikan} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="pendidikan"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#cbd5e1" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="jumlah" fill="url(#greenGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistikWarga;

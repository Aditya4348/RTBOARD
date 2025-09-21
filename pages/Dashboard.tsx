import { React, useMemo } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { TipeTransaksi } from "../types";
import { Link } from "react-router-dom";
import StatistikWarga from "@/components/StatistikWarga";

const StatCard = ({ title, value, icon, colorClass }) => (
  <div
    className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center space-x-4`}
  >
    <div className={`p-3 rounded-full ${colorClass.bg}`}>{icon}</div>
    <div>
      <h3 className="font-medium text-slate-500 dark:text-slate-400">
        {title}
      </h3>
      <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
        {value}
      </p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { warga, transaksi, pengumuman, agenda } = useData();

  // Flatten semua anggota
  const semuaAnggota = useMemo(() => warga.flatMap((w) => w.anggota), [warga]);

  // Total jiwa
  const totalJiwa = semuaAnggota.length;

  const totalPemasukan = transaksi
    .filter((t) => t.tipe === TipeTransaksi.PEMASUKAN)
    .reduce((sum, t) => sum + t.jumlah, 0);
  const totalPengeluaran = transaksi
    .filter((t) => t.tipe === TipeTransaksi.PENGELUARAN)
    .reduce((sum, t) => sum + t.jumlah, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  const upcomingAgenda = agenda
    .filter((a) => new Date(a.tanggal) >= new Date())
    .sort(
      (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
    )
    .slice(0, 3);

  const latestPengumuman = [...pengumuman]
    .sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">
          Selamat datang kembali, {user?.namaLengkap}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Warga"
          value={`${warga.length} KK`}
          colorClass={{ bg: "bg-blue-100 dark:bg-blue-900" }}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600 dark:text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Kas RT"
          value={new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(saldo)}
          colorClass={{ bg: "bg-green-100 dark:bg-green-900" }}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600 dark:text-green-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Agenda Terdekat"
          value={`${upcomingAgenda.length} Agenda`}
          colorClass={{ bg: "bg-indigo-100 dark:bg-indigo-900" }}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <StatCard
          title="Jumlah Jiwa"
          value={`${totalJiwa} Jiwa`}
          colorClass={{ bg: "bg-indigo-100 dark:bg-indigo-900" }}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M9 10a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          }
        />
      </div>

      <StatistikWarga warga={warga} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
          <h3 className="font-bold text-xl mb-4 text-slate-800 dark:text-white">
            Pengumuman Terbaru
          </h3>
          <ul className="space-y-4">
            {latestPengumuman.length > 0 ? (
              latestPengumuman.map((p) => (
                <li
                  key={p.id}
                  className="border-b border-slate-200 dark:border-slate-700 pb-3 last:border-b-0"
                >
                  <Link
                    to="/pengumuman"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {p.judul}
                  </Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {p.isi.substring(0, 80)}...
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    {new Date(p.tanggal).toLocaleDateString("id-ID")}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400">
                Tidak ada pengumuman.
              </p>
            )}
          </ul>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
          <h3 className="font-bold text-xl mb-4 text-slate-800 dark:text-white">
            Agenda Akan Datang
          </h3>
          <ul className="space-y-4">
            {upcomingAgenda.length > 0 ? (
              upcomingAgenda.map((a) => (
                <li
                  key={a.id}
                  className="border-b border-slate-200 dark:border-slate-700 pb-3 last:border-b-0"
                >
                  <Link
                    to="/agenda"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {a.judul}
                  </Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(a.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400">
                Tidak ada agenda terdekat.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

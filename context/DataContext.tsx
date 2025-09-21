import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { 
  User, UserRole, Warga, Surat, Transaksi, Agenda, Pengurus, 
  Inventaris, Pengumuman, Saran, IuranWarga 
} from '../types';

// Initial Data Seeding
export const initialUsers: User[] = [
  { id: 'user-1', username: 'ketua', password: 'password', role: UserRole.KETUA, namaLengkap: 'Budi Santoso' },
  { id: 'user-2', username: 'sekretaris', password: 'password', role: UserRole.SEKRETARIS, namaLengkap: 'Citra Lestari' },
  { id: 'user-3', username: 'bendahara', password: 'password', role: UserRole.BENDAHARA, namaLengkap: 'Dana Wijaya' },
  { id: 'user-4', username: 'warga', password: 'password', role: UserRole.WARGA, namaLengkap: 'Eko Prasetyo', noKK: '3201234567890001' },
];

const initialWarga: Warga[] = [
    { 
      id: '3201234567890001', 
      kepalaKeluarga: 'Eko Prasetyo', 
      alamat: 'Jl. Merdeka No. 1',
      rt: '001', rw: '005', kelurahanDesa: 'Sukamaju', kecamatan: 'Cibadak', kotaKabupaten: 'Bogor', provinsi: 'Jawa Barat', kodePos: '16710',
      anggota: [{
        id: 'warga-1', nama: 'Eko Prasetyo', nik: '3201234567890001', jenisKelamin: 'Laki-laki', tempatLahir: 'Bogor', tanggalLahir: '1980-01-15', agama: 'Islam', pendidikan: 'S1', jenisPekerjaan: 'Karyawan Swasta', statusHubungan: 'Kepala Keluarga'
      }]
    },
    { 
      id: '3201234567890002', 
      kepalaKeluarga: 'Siti Aminah', 
      alamat: 'Jl. Merdeka No. 2', 
      rt: '001', rw: '005', kelurahanDesa: 'Sukamaju', kecamatan: 'Cibadak', kotaKabupaten: 'Bogor', provinsi: 'Jawa Barat', kodePos: '16710',
      anggota: [{
        id: 'warga-2', nama: 'Siti Aminah', nik: '3201234567890002', jenisKelamin: 'Perempuan', tempatLahir: 'Jakarta', tanggalLahir: '1985-05-20', agama: 'Islam', pendidikan: 'SMA', jenisPekerjaan: 'Ibu Rumah Tangga', statusHubungan: 'Kepala Keluarga'
      }]
    },
];

const initialPengurus: Pengurus[] = [
    { id: 'p-1', jabatan: 'Ketua RT', nama: 'Budi Santoso' },
    { id: 'p-2', jabatan: 'Sekretaris', nama: 'Citra Lestari' },
    { id: 'p-3', jabatan: 'Bendahara', nama: 'Dana Wijaya' },
];

interface DataContextType {
  warga: Warga[]; setWarga: React.Dispatch<React.SetStateAction<Warga[]>>;
  surat: Surat[]; setSurat: React.Dispatch<React.SetStateAction<Surat[]>>;
  transaksi: Transaksi[]; setTransaksi: React.Dispatch<React.SetStateAction<Transaksi[]>>;
  iuran: IuranWarga[]; setIuran: React.Dispatch<React.SetStateAction<IuranWarga[]>>;
  agenda: Agenda[]; setAgenda: React.Dispatch<React.SetStateAction<Agenda[]>>;
  pengurus: Pengurus[]; setPengurus: React.Dispatch<React.SetStateAction<Pengurus[]>>;
  inventaris: Inventaris[]; setInventaris: React.Dispatch<React.SetStateAction<Inventaris[]>>;
  pengumuman: Pengumuman[]; setPengumuman: React.Dispatch<React.SetStateAction<Pengumuman[]>>;
  saran: Saran[]; setSaran: React.Dispatch<React.SetStateAction<Saran[]>>;
  users: User[]; setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
  const [warga, setWarga] = useLocalStorage<Warga[]>('warga', initialWarga);
  const [surat, setSurat] = useLocalStorage<Surat[]>('surat', []);
  const [transaksi, setTransaksi] = useLocalStorage<Transaksi[]>('transaksi', []);
  const [iuran, setIuran] = useLocalStorage<IuranWarga[]>('iuran', initialWarga.map(w => ({ noKK: w.id, namaKepalaKeluarga: w.kepalaKeluarga, iuran: {} })));
  const [agenda, setAgenda] = useLocalStorage<Agenda[]>('agenda', []);
  const [pengurus, setPengurus] = useLocalStorage<Pengurus[]>('pengurus', initialPengurus);
  const [inventaris, setInventaris] = useLocalStorage<Inventaris[]>('inventaris', []);
  const [pengumuman, setPengumuman] = useLocalStorage<Pengumuman[]>('pengumuman', []);
  const [saran, setSaran] = useLocalStorage<Saran[]>('saran', []);

  const value = {
    warga, setWarga,
    surat, setSurat,
    transaksi, setTransaksi,
    iuran, setIuran,
    agenda, setAgenda,
    pengurus, setPengurus,
    inventaris, setInventaris,
    pengumuman, setPengumuman,
    saran, setSaran,
    users, setUsers
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
export enum UserRole {
  KETUA = "Ketua RT",
  SEKRETARIS = "Sekretaris",
  BENDAHARA = "Bendahara",
  WARGA = "Warga",
}

export interface User {
  id: string;
  username: string;
  password?: string; // Should be hashed in a real app
  role: UserRole;
  namaLengkap: string;
  noKK?: string; // Link to a family card
}

export interface AnggotaKeluarga {
  id: string;
  nama: string;
  nik: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan' | '';
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  agama: string;
  pendidikan: string;
  jenisPekerjaan: string;
  statusHubungan: string;
}

export interface Warga {
  id: string; // Nomor KK
  kepalaKeluarga: string;
  alamat: string;
  rt: string;
  rw: string;
  kelurahanDesa: string;
  kecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  anggota: AnggotaKeluarga[];
  fileKK?: string; // base64 representation of the image
}

export enum JenisSurat {
  KTP = "Pengantar KTP",
  KK = "Pengantar KK",
  SKTM = "Keterangan Tidak Mampu (SKTM)",
  DOMISILI = "Keterangan Domisili",
  NIKAH = "Pengantar Nikah",
}

export interface Surat {
  id: string;
  nomorSurat: string;
  jenisSurat: JenisSurat;
  tanggal: string;
  pemohon: {
    nama: string;
    nik: string;
    noKK: string;
  };
  keperluan: string;
}

export enum TipeTransaksi {
  PEMASUKAN = "Pemasukan",
  PENGELUARAN = "Pengeluaran",
}

export interface Transaksi {
  id: string;
  tanggal: string;
  tipe: TipeTransaksi;
  keterangan: string;
  jumlah: number;
}

export interface IuranBulanan {
  [bulan: string]: boolean; // e.g., "januari-2024": true
}

export interface IuranWarga {
  noKK: string;
  namaKepalaKeluarga: string;
  iuran: IuranBulanan;
}

export interface Agenda {
  id: string;
  judul: string;
  tanggal: string;
  deskripsi: string;
  dokumentasi?: string[]; // array of base64 image strings
}

export interface Pengurus {
  id: string;
  jabatan: string;
  nama: string;
}

export interface Inventaris {
  id: string;
  namaBarang: string;
  jumlah: number;
  kondisi: "Baik" | "Rusak" | "Perbaikan";
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  penulis: string;
}

export interface Saran {
  id: string;
  pengirim: string; // "Anonim" or username
  isi: string;
  tanggal: string;
}
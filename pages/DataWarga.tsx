import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Warga, AnggotaKeluarga } from '../types';
import Modal from '../components/Modal';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const initialWargaState: Warga = {
    id: '', kepalaKeluarga: '', alamat: '', rt: '', rw: '', kelurahanDesa: '', kecamatan: '', kotaKabupaten: '', provinsi: '', kodePos: '',
    anggota: [{ id: `new-${Date.now()}`, nama: '', nik: '', jenisKelamin: '', tempatLahir: '', tanggalLahir: '', agama: '', pendidikan: '', jenisPekerjaan: '', statusHubungan: 'Kepala Keluarga' }]
};

const DataWargaPage: React.FC = () => {
    const { warga, setWarga } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentWarga, setCurrentWarga] = useState<Warga | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWarga = useMemo(() => {
        return warga.filter(w =>
            w.kepalaKeluarga.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.id.includes(searchTerm)
        );
    }, [warga, searchTerm]);

    const handleOpenModal = (wargaData: Warga | null) => {
        if (wargaData) {
            setCurrentWarga(wargaData);
            setIsEditing(true);
        } else {
            setCurrentWarga(JSON.parse(JSON.stringify(initialWargaState))); // Deep copy
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentWarga(null);
        setIsEditing(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWarga) return;

        if (!isEditing && warga.some(w => w.id === currentWarga.id)) {
            alert('Nomor KK sudah ada.');
            return;
        }

        setWarga(prevWarga => {
            const newWarga = isEditing
                ? prevWarga.map(w => w.id === currentWarga.id ? currentWarga : w)
                : [...prevWarga, currentWarga];
            return newWarga.sort((a,b) => a.kepalaKeluarga.localeCompare(b.kepalaKeluarga));
        });
        
        handleCloseModal();
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('Apakah Anda yakin ingin menghapus data warga ini?')){
            setWarga(warga.filter(w => w.id !== id));
        }
    };
    
    const handleAnggotaChange = (index: number, field: keyof AnggotaKeluarga, value: string) => {
        if (!currentWarga) return;
        const newAnggota = [...currentWarga.anggota];
        newAnggota[index] = { ...newAnggota[index], [field]: value };
        
        let newCurrentWarga = { ...currentWarga, anggota: newAnggota };
        if (field === 'nama' && newAnggota[index].statusHubungan === 'Kepala Keluarga') {
            newCurrentWarga.kepalaKeluarga = value;
        }

        setCurrentWarga(newCurrentWarga);
    };

    const addAnggota = () => {
        if (!currentWarga) return;
        setCurrentWarga({
            ...currentWarga,
            anggota: [...currentWarga.anggota, { id: `new-${Date.now()}`, nama: '', nik: '', jenisKelamin: '', tempatLahir: '', tanggalLahir: '', agama: '', pendidikan: '', jenisPekerjaan: '', statusHubungan: '' }]
        });
    };
    
    const removeAnggota = (index: number) => {
        if (!currentWarga || currentWarga.anggota.length <= 1) return;
        const newAnggota = currentWarga.anggota.filter((_, i) => i !== index);
        setCurrentWarga({ ...currentWarga, anggota: newAnggota });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        setIsOcrModalOpen(false);
        
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            try {
                const responseSchema = {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: 'Nomor Kartu Keluarga (16 digit)' },
                    kepalaKeluarga: { type: Type.STRING },
                    alamat: { type: Type.STRING },
                    rt: { type: Type.STRING },
                    rw: { type: Type.STRING },
                    kelurahanDesa: { type: Type.STRING },
                    kecamatan: { type: Type.STRING },
                    kotaKabupaten: { type: Type.STRING },
                    provinsi: { type: Type.STRING },
                    kodePos: { type: Type.STRING },
                    anggota: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          nik: { type: Type.STRING, description: 'Nomor Induk Kependudukan (16 digit)' },
                          nama: { type: Type.STRING },
                          jenisKelamin: { type: Type.STRING, enum: ['Laki-laki', 'Perempuan'] },
                          tempatLahir: { type: Type.STRING },
                          tanggalLahir: { type: Type.STRING, description: 'Format YYYY-MM-DD' },
                          agama: { type: Type.STRING },
                          pendidikan: { type: Type.STRING },
                          jenisPekerjaan: { type: Type.STRING },
                          statusHubungan: { type: Type.STRING },
                        },
                      },
                    },
                  },
                };

                const imagePart = { inlineData: { mimeType: file.type, data: base64String } };
                const textPart = { text: "Ekstrak semua informasi dari gambar Kartu Keluarga ini. Pastikan NIK dan No. KK 16 digit. Format tanggal lahir YYYY-MM-DD." };
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [imagePart, textPart] },
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: responseSchema,
                    },
                });

                const parsedData = JSON.parse(response.text);
                
                // Add unique IDs for anggota
                if(parsedData.anggota) {
                    parsedData.anggota = parsedData.anggota.map(a => ({...a, id: `new-${Date.now()}-${Math.random()}`}));
                }

                setCurrentWarga(parsedData);
                setIsEditing(false);
                setIsModalOpen(true);

            } catch (error) {
                console.error("Error processing KK image:", error);
                alert("Gagal memproses gambar KK. Pastikan gambar jelas dan coba lagi.");
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Manajemen Data Warga</h1>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <input
                    type="text"
                    placeholder="Cari berdasarkan Nama atau No. KK..."
                    className="w-full md:w-1/3 px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsOcrModalOpen(true)} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" /></svg>
                        Scan KK
                    </button>
                    <button onClick={() => handleOpenModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Tambah Warga
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">No. KK</th>
                            <th scope="col" className="px-6 py-3">Kepala Keluarga</th>
                            <th scope="col" className="px-6 py-3">Alamat</th>
                            <th scope="col" className="px-6 py-3">Jumlah Anggota</th>
                            <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWarga.map(w => (
                            <tr key={w.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{w.id}</td>
                                <td className="px-6 py-4">{w.kepalaKeluarga}</td>
                                <td className="px-6 py-4">{w.alamat}</td>
                                <td className="px-6 py-4">{w.anggota.length}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleOpenModal(w)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDelete(w.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? 'Edit Data Warga' : 'Tambah Data Warga'} size="xl">
                {currentWarga && (
                    <form onSubmit={handleSave} className="space-y-6">
                        <fieldset className="border border-slate-300 dark:border-slate-600 rounded-lg p-4">
                            <legend className="px-2 font-semibold text-slate-700 dark:text-slate-300">Data Kartu Keluarga</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nomor KK</label>
                                    <input type="text" value={currentWarga.id} onChange={e => setCurrentWarga({...currentWarga, id: e.target.value})} className="mt-1 block w-full input-style" required disabled={isEditing} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Kepala Keluarga</label>
                                    <input type="text" value={currentWarga.kepalaKeluarga} onChange={e => setCurrentWarga({...currentWarga, kepalaKeluarga: e.target.value})} className="mt-1 block w-full input-style" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Alamat</label>
                                    <input type="text" value={currentWarga.alamat} onChange={e => setCurrentWarga({...currentWarga, alamat: e.target.value})} className="mt-1 block w-full input-style" required />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:col-span-2">
                                    <div><label className="label-style">RT</label><input type="text" value={currentWarga.rt} onChange={e => setCurrentWarga({...currentWarga, rt: e.target.value})} className="input-style mt-1" /></div>
                                    <div><label className="label-style">RW</label><input type="text" value={currentWarga.rw} onChange={e => setCurrentWarga({...currentWarga, rw: e.target.value})} className="input-style mt-1" /></div>
                                    <div><label className="label-style">Kode Pos</label><input type="text" value={currentWarga.kodePos} onChange={e => setCurrentWarga({...currentWarga, kodePos: e.target.value})} className="input-style mt-1" /></div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="label-style">Kelurahan/Desa</label>
                                    <input type="text" value={currentWarga.kelurahanDesa} onChange={e => setCurrentWarga({...currentWarga, kelurahanDesa: e.target.value})} className="input-style mt-1" />
                                </div>
                                <div><label className="label-style">Kecamatan</label><input type="text" value={currentWarga.kecamatan} onChange={e => setCurrentWarga({...currentWarga, kecamatan: e.target.value})} className="input-style mt-1" /></div>
                                <div><label className="label-style">Kabupaten/Kota</label><input type="text" value={currentWarga.kotaKabupaten} onChange={e => setCurrentWarga({...currentWarga, kotaKabupaten: e.target.value})} className="input-style mt-1" /></div>
                                <div><label className="label-style">Provinsi</label><input type="text" value={currentWarga.provinsi} onChange={e => setCurrentWarga({...currentWarga, provinsi: e.target.value})} className="input-style mt-1" /></div>
                            </div>
                        </fieldset>

                        <fieldset className="border border-slate-300 dark:border-slate-600 rounded-lg p-4">
                            <legend className="px-2 font-semibold text-slate-700 dark:text-slate-300">Anggota Keluarga</legend>
                            <div className="space-y-4">
                            {currentWarga.anggota.map((anggota, index) => (
                                <div key={anggota.id} className="p-4 border rounded-md space-y-3 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-slate-800 dark:text-slate-200">Anggota {index + 1}</span>
                                      {currentWarga.anggota.length > 1 && <button type="button" onClick={() => removeAnggota(index)} className="text-red-500 text-sm font-semibold">Hapus</button>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className="label-style">Nama Lengkap</label><input type="text" placeholder="Nama Lengkap" value={anggota.nama} onChange={e => handleAnggotaChange(index, 'nama', e.target.value)} className="input-style mt-1" required /></div>
                                        <div><label className="label-style">NIK</label><input type="text" placeholder="NIK" value={anggota.nik} onChange={e => handleAnggotaChange(index, 'nik', e.target.value)} className="input-style mt-1" required /></div>
                                        <div><label className="label-style">Jenis Kelamin</label><select value={anggota.jenisKelamin} onChange={e => handleAnggotaChange(index, 'jenisKelamin', e.target.value)} className="input-style mt-1"><option value="">Pilih</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div>
                                        <div><label className="label-style">Tempat Lahir</label><input type="text" value={anggota.tempatLahir} onChange={e => handleAnggotaChange(index, 'tempatLahir', e.target.value)} className="input-style mt-1" /></div>
                                        <div><label className="label-style">Tanggal Lahir</label><input type="date" value={anggota.tanggalLahir} onChange={e => handleAnggotaChange(index, 'tanggalLahir', e.target.value)} className="input-style mt-1" /></div>
                                        <div><label className="label-style">Agama</label><input type="text" value={anggota.agama} onChange={e => handleAnggotaChange(index, 'agama', e.target.value)} className="input-style mt-1" /></div>
                                        <div><label className="label-style">Pendidikan</label><input type="text" value={anggota.pendidikan} onChange={e => handleAnggotaChange(index, 'pendidikan', e.target.value)} className="input-style mt-1" /></div>
                                        <div><label className="label-style">Jenis Pekerjaan</label><input type="text" value={anggota.jenisPekerjaan} onChange={e => handleAnggotaChange(index, 'jenisPekerjaan', e.target.value)} className="input-style mt-1" /></div>
                                        <div className="md:col-span-2"><label className="label-style">Status Hubungan</label><input type="text" value={anggota.statusHubungan} onChange={e => handleAnggotaChange(index, 'statusHubungan', e.target.value)} className="input-style mt-1" required /></div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addAnggota} className="text-sm font-semibold text-blue-600 hover:underline">+ Tambah Anggota</button>
                            </div>
                        </fieldset>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 font-semibold">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Simpan</button>
                        </div>
                    </form>
                )}
            </Modal>
            
            <Modal isOpen={isOcrModalOpen} onClose={() => setIsOcrModalOpen(false)} title="Scan Kartu Keluarga" size="md">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mt-4">Unggah Foto KK</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Pilih foto Kartu Keluarga yang jelas dan tidak buram untuk hasil terbaik.
                    </p>
                    <div className="mt-6">
                        <input type="file" id="kk-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                        <label htmlFor="kk-upload" className="cursor-pointer inline-flex justify-center w-full rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">
                            Pilih File Gambar
                        </label>
                    </div>
                </div>
            </Modal>
            
            {isProcessing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-center items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                    <p className="text-white text-lg mt-4 font-semibold">Menganalisis Gambar KK...</p>
                </div>
            )}
            <style>{`
                .input-style {
                    display: block;
                    width: 100%;
                    border-radius: 0.5rem;
                    border: 1px solid rgb(203 213 225 / 1);
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
                }
                .dark .input-style {
                    background-color: rgb(51 65 85 / 1);
                    border-color: rgb(71 85 105 / 1);
                    color: white;
                }
                .input-style:focus {
                    --tw-ring-color: rgb(59 130 246 / 1);
                    border-color: rgb(59 130 246 / 1);
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    box-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
                }
                .label-style {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: rgb(51 65 85 / 1);
                }
                .dark .label-style {
                    color: rgb(203 213 225 / 1);
                }
            `}</style>
        </div>
    );
};

export default DataWargaPage;
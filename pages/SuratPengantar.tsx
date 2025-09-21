import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { Surat, JenisSurat } from "../types";
import Modal from "../components/Modal";
import { jsPDF } from "jspdf";

const SuratPengantarPage: React.FC = () => {
  const { surat, setSurat, warga } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentSurat, setCurrentSurat] = useState<Surat | null>(null);
  const [newSuratData, setNewSuratData] = useState({
    noKK: "",
    jenisSurat: JenisSurat.KTP,
    keperluan: "",
  });

  const generateNomorSurat = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const count = surat.length + 1;
    return `${String(count).padStart(3, "0")}/RT01-RW05/${month}/${year}`;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const pemohonWarga = warga.find((w) => w.id === newSuratData.noKK);
    if (!pemohonWarga) {
      alert("Data warga tidak ditemukan.");
      return;
    }

    const kepalaKeluarga =
      pemohonWarga.anggota.find(
        (a) => a.statusHubungan.toLowerCase() === "kepala keluarga"
      ) || pemohonWarga.anggota[0];

    const newSurat: Surat = {
      id: `surat-${Date.now()}`,
      nomorSurat: generateNomorSurat(),
      jenisSurat: newSuratData.jenisSurat,
      tanggal: new Date().toISOString().split("T")[0],
      pemohon: {
        nama: kepalaKeluarga.nama,
        nik: kepalaKeluarga.nik,
        noKK: pemohonWarga.id,
      },
      keperluan: newSuratData.keperluan,
    };
    setSurat([...surat, newSurat]);
    handleCloseModal();
  };

  const handlePreview = (s: Surat) => {
    setCurrentSurat(s);
    setIsPreviewOpen(true);
  };


  const handleDownloadPdf = () => {
    if (!currentSurat) return;

    const doc = new jsPDF();

    // === KOP SURAT ===
    doc.setFontSize(14);
    doc.text("RUKUN TETANGGA 01 / RUKUN WARGA 05", 105, 15, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text("Kelurahan Contoh, Kecamatan Contoh, Kota Jakarta", 105, 20, {
      align: "center",
    });
    doc.line(20, 25, 190, 25);

    // === JUDUL SURAT ===
    doc.setFontSize(14);
    doc.text("SURAT PENGANTAR", 105, 40, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Nomor: ${currentSurat.nomorSurat}`, 105, 47, { align: "center" });

    // === ISI SURAT ===
    doc.setFontSize(12);
    doc.text(
      "Yang bertanda tangan di bawah ini, Ketua RT 01/RW 05, Kelurahan Contoh, Kecamatan Contoh, Kota Jakarta, dengan ini menerangkan bahwa:",
      20,
      65,
      { maxWidth: 170 }
    );

    // Data pemohon
    doc.text("Nama", 20, 80);
    doc.text(`: ${currentSurat.pemohon?.nama || "-"}`, 60, 80);

    doc.text("NIK", 20, 87);
    doc.text(`: ${currentSurat.pemohon?.nik || "-"}`, 60, 87);

    doc.text("No. KK", 20, 94);
    doc.text(`: ${currentSurat.pemohon?.noKK || "-"}`, 60, 94);

    // Keperluan
    doc.text(
      "Adalah benar warga kami dan yang bersangkutan mengajukan surat pengantar untuk keperluan:",
      20,
      110,
      { maxWidth: 170 }
    );

    doc.setFont("helvetica", "bold");
    doc.text(`"${currentSurat.keperluan}"`, 25, 120, { maxWidth: 160 });
    doc.setFont("helvetica", "normal");

    // Penutup
    doc.text(
      "Demikian surat pengantar ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.",
      20,
      135,
      { maxWidth: 170 }
    );

    // === TANDA TANGAN ===
    const today = new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc.text(`Jakarta, ${today}`, 140, 160);
    doc.text("Ketua RT 01/RW 05", 145, 170);
    doc.text("Budi Santoso", 145, 190);

    // === DOWNLOAD PDF ===
    doc.save(`Surat_Pengantar_${currentSurat.pemohon?.nama || "Pemohon"}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Surat Pengantar
        </h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Buat Surat Baru
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nomor Surat
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal
              </th>
              <th scope="col" className="px-6 py-3">
                Jenis Surat
              </th>
              <th scope="col" className="px-6 py-3">
                Pemohon
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {surat.map((s) => (
              <tr
                key={s.id}
                className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {s.nomorSurat}
                </td>
                <td className="px-6 py-4">
                  {new Date(s.tanggal).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4">{s.jenisSurat}</td>
                <td className="px-6 py-4">{s.pemohon.nama}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handlePreview(s)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Lihat & Unduh
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Buat Surat Pengantar Baru"
      >
        <form onSubmit={handleSave}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Pilih Warga (berdasarkan No. KK)
              </label>
              <select
                value={newSuratData.noKK}
                onChange={(e) =>
                  setNewSuratData({ ...newSuratData, noKK: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Pilih Warga --</option>
                {warga.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.kepalaKeluarga} - {w.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Jenis Surat
              </label>
              <select
                value={newSuratData.jenisSurat}
                onChange={(e) =>
                  setNewSuratData({
                    ...newSuratData,
                    jenisSurat: e.target.value as JenisSurat,
                  })
                }
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Object.values(JenisSurat).map((js) => (
                  <option key={js} value={js}>
                    {js}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Keperluan
              </label>
              <textarea
                value={newSuratData.keperluan}
                onChange={(e) =>
                  setNewSuratData({
                    ...newSuratData,
                    keperluan: e.target.value,
                  })
                }
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Buat Surat
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Pratinjau Surat"
      >
        {currentSurat && (
          <div className="text-sm text-slate-900 dark:text-slate-200 leading-relaxed">
            <div className="border p-6 rounded-lg bg-white dark:bg-slate-800 shadow-md">
              {/* === KOP SURAT === */}
              <div className="text-center border-b pb-2 mb-4">
                <h2 className="font-bold text-lg uppercase">
                  RUKUN TETANGGA 01 / RUKUN WARGA 05
                </h2>
                <p className="text-xs">Kelurahan Contoh, Kecamatan Contoh</p>
                <p className="text-xs">Kota Jakarta</p>
              </div>

              {/* === JUDUL SURAT === */}
              <h3 className="text-center font-bold underline mb-1">
                SURAT PENGANTAR
              </h3>
              <p className="text-center text-xs mb-6">
                Nomor: {currentSurat.nomorSurat}
              </p>

              {/* === ISI SURAT === */}
              <p className="mb-4">
                Yang bertanda tangan di bawah ini, Ketua RT 01/RW 05, Kelurahan
                Contoh, Kecamatan Contoh, Kota Jakarta, dengan ini menerangkan
                bahwa:
              </p>

              <table className="my-3">
                <tbody>
                  <tr>
                    <td className="pr-4">Nama</td>
                    <td>: {currentSurat.pemohon?.nama}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">NIK</td>
                    <td>: {currentSurat.pemohon?.nik}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">No. KK</td>
                    <td>: {currentSurat.pemohon?.noKK}</td>
                  </tr>
                </tbody>
              </table>

              <p className="mb-4">
                Adalah benar warga kami dan yang bersangkutan mengajukan surat
                pengantar untuk keperluan:
              </p>

              <p className="font-semibold mb-4">"{currentSurat.keperluan}"</p>

              <p className="mb-6">
                Demikian surat pengantar ini dibuat dengan sebenarnya untuk
                dapat dipergunakan sebagaimana mestinya.
              </p>

              {/* === TANDA TANGAN === */}
              <div className="flex justify-end mt-8">
                <div className="text-center">
                  <p>
                    Jakarta,{" "}
                    {new Date(currentSurat.tanggal).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p className="mt-1">Ketua RT 01/RW 05</p>
                  <div className="mt-12 font-bold underline">Budi Santoso</div>
                </div>
              </div>
            </div>

            {/* === TOMBOL UNDUH === */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleDownloadPdf()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Unduh PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SuratPengantarPage;

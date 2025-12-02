import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Info,
  Monitor,
  Trophy,
  DollarSign,
  Cpu,
  MemoryStick,
  HardDrive,
} from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import LaptopCard from "./LaptopCard";
import SpecItem from "../shared/SpecItem";
import DebugTable from "../shared/DebugTable";
import LaptopDetailModal from "./LaptopDetailModal";
import { MAJORS } from "../../utils/topsis";

const UserPanel = ({
  userState,
  setUserState,
  submitted,
  topsisResults,
  showDebug,
  setShowDebug,
  handleSubmit,
  selectedMajor,
}) => {
  const [selectedLaptop, setSelectedLaptop] = React.useState(null);

  return (
    <div className="space-y-12">
      {!submitted ? (
        <section className="max-w-2xl mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              Temukan Laptop Idealmu
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Sistem pendukung keputusan cerdas berbasis metode TOPSIS untuk
              mahasiswa.
            </p>
          </div>

          <Card className="text-left space-y-6 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan namamu..."
                value={userState.name}
                onChange={(e) =>
                  setUserState({ ...userState, name: e.target.value })
                }
              />
              <Select
                label="Jurusan Kuliah"
                value={userState.major}
                onChange={(e) =>
                  setUserState({ ...userState, major: e.target.value })
                }
                options={[
                  { value: "", label: "Pilih Jurusan..." },
                  ...MAJORS.map((m) => ({ value: m.id, label: m.name })),
                ]}
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full justify-center py-3 text-lg shadow-red-500/20 shadow-lg"
            >
              Lihat Rekomendasi <ChevronDown size={20} />
            </Button>
          </Card>
        </section>
      ) : (
        /* Results Section */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Greeting Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Halo,{" "}
                <span className="text-red-500 dark:text-red-400">
                  {userState.name}
                </span>
                !
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Berikut adalah rekomendasi laptop terbaik yang disesuaikan untuk
                kebutuhan jurusan{" "}
                <span className="text-slate-900 dark:text-slate-200 font-semibold">
                  {selectedMajor?.name}
                </span>
                .
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowDebug(!showDebug)}
              className="text-sm"
            >
              {showDebug ? <ChevronUp size={16} /> : <Info size={16} />}
              {showDebug ? "Sembunyikan Detail" : "Lihat Perhitungan"}
            </Button>
          </div>

          {topsisResults && topsisResults.length > 0 && (
            <div className="space-y-8">
              {/* Top Pick Hero */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <Card
                  onClick={() => setSelectedLaptop(topsisResults[0])}
                  className="relative bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row gap-8 items-center p-8 cursor-pointer hover:border-red-500/50 transition-colors"
                >
                  <div className="w-full md:w-1/3 aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {topsisResults[0].image ? (
                      <img
                        src={topsisResults[0].image}
                        alt={topsisResults[0].name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Monitor
                        size={64}
                        className="text-slate-400 dark:text-slate-600"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2 border border-emerald-200 dark:border-emerald-500/20">
                          <Trophy size={12} /> PERINGKAT #1
                        </div>
                        <h4 className="text-3xl font-bold text-slate-900 dark:text-white">
                          {topsisResults[0].name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Nilai Preferensi
                        </p>
                        <p className="text-2xl font-bold text-red-500 dark:text-red-400">
                          {topsisResults[0].preference.toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <SpecItem
                        icon={DollarSign}
                        label="Harga"
                        value={`Rp ${topsisResults[0].price.toLocaleString()}`}
                      />
                      <SpecItem
                        icon={Cpu}
                        label="CPU"
                        value={`${topsisResults[0].cpu} Cores`}
                      />
                      <SpecItem
                        icon={MemoryStick}
                        label="RAM"
                        value={`${topsisResults[0].ram} GB`}
                      />
                      <SpecItem
                        icon={HardDrive}
                        label="Storage"
                        value={`${topsisResults[0].storage} GB`}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Other Recommendations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topsisResults.slice(1).map((laptop, idx) => (
                  <LaptopCard
                    key={laptop.id}
                    laptop={laptop}
                    idx={idx}
                    onClick={() => setSelectedLaptop(laptop)}
                  />
                ))}
              </div>

              {/* Debug Tables */}
              {showDebug && (
                <div className="space-y-8 pt-8 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200">
                    Detail Perhitungan (TOPSIS)
                  </h3>

                  <DebugTable
                    title="1. Matriks Keputusan (X) & Konversi Crisp"
                    headers={[
                      "Alternatif",
                      "C1 (Cost)",
                      "C2 (Benefit)",
                      "C3 (Benefit)",
                      "C4 (Benefit)",
                      "C5 (Benefit)",
                    ]}
                    rows={topsisResults.map((l) => [
                      l.name,
                      l.scores.price,
                      l.scores.cpu,
                      l.scores.ram,
                      l.scores.storage,
                      l.scores.vram,
                    ])}
                  />

                  <DebugTable
                    title="2. Matriks Ternormalisasi (R)"
                    headers={[
                      "Alternatif",
                      "R1 (Price)",
                      "R2 (CPU)",
                      "R3 (RAM)",
                      "R4 (Storage)",
                      "R5 (VRAM)",
                    ]}
                    rows={topsisResults.map((l) => [
                      l.name,
                      l.normalized.price.toFixed(4),
                      l.normalized.cpu.toFixed(4),
                      l.normalized.ram.toFixed(4),
                      l.normalized.storage.toFixed(4),
                      l.normalized.vram.toFixed(4),
                    ])}
                  />

                  <DebugTable
                    title="3. Matriks Ternormalisasi Terbobot (Y)"
                    headers={["Alternatif", "Y1", "Y2", "Y3", "Y4", "Y5"]}
                    rows={topsisResults.map((l) => [
                      l.name,
                      l.weighted.price.toFixed(4),
                      l.weighted.cpu.toFixed(4),
                      l.weighted.ram.toFixed(4),
                      l.weighted.storage.toFixed(4),
                      l.weighted.vram.toFixed(4),
                    ])}
                  />

                  <DebugTable
                    title="4. Jarak Solusi Ideal & Nilai Preferensi (V)"
                    headers={[
                      "Alternatif",
                      "D+ (Positif)",
                      "D- (Negatif)",
                      "V (Preferensi)",
                    ]}
                    rows={topsisResults.map((l) => [
                      l.name,
                      l.distPos.toFixed(4),
                      l.distNeg.toFixed(4),
                      <span key="v" className="font-bold text-red-400">
                        {l.preference.toFixed(4)}
                      </span>,
                    ])}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <LaptopDetailModal
        laptop={selectedLaptop}
        onClose={() => setSelectedLaptop(null)}
      />
    </div>
  );
};

export default UserPanel;

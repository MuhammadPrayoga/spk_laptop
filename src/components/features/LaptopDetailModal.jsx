import React from "react";
import {
  X,
  Monitor,
  DollarSign,
  Cpu,
  MemoryStick,
  HardDrive,
  Zap,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import SpecItem from "../shared/SpecItem";

const LaptopDetailModal = ({ laptop, onClose }) => {
  if (!laptop) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 relative flex flex-col">
        {/* Header Image */}
        <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
          {laptop.image ? (
            <img
              src={laptop.image}
              alt={laptop.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Monitor size={64} className="text-slate-300 dark:text-slate-700" />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                Rekomendasi
              </span>
              {laptop.preference && (
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono font-bold">
                  Score: {laptop.preference.toFixed(4)}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              {laptop.name}
            </h2>
            <p className="text-2xl font-bold text-red-600 dark:text-red-500 mt-2">
              Rp {laptop.price.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <SpecItem
                icon={Cpu}
                label="Processor (CPU)"
                value={`${laptop.cpu} Cores`}
              />
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <SpecItem
                icon={MemoryStick}
                label="Memory (RAM)"
                value={`${laptop.ram} GB`}
              />
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <SpecItem
                icon={HardDrive}
                label="Storage"
                value={`${laptop.storage} GB`}
              />
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <SpecItem
                icon={Zap}
                label="Graphics (VRAM)"
                value={`${laptop.vram} GB`}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Tutup Detail
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LaptopDetailModal;

import React from "react";
import { Monitor } from "lucide-react";
import Card from "../ui/Card";

const LaptopCard = ({ laptop, idx, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="hover:border-red-400 dark:hover:border-red-600 transition-all duration-300 flex flex-col cursor-pointer group hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1"
    >
      <div className="w-full aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg mb-4 overflow-hidden border border-slate-200 dark:border-slate-800">
        {laptop.image ? (
          <img
            src={laptop.image}
            alt={laptop.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Monitor size={32} className="text-slate-300 dark:text-slate-700" />
          </div>
        )}
      </div>
      <div className="flex justify-between items-start mb-4">
        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center font-bold text-slate-500 border border-slate-200 dark:border-slate-700 text-sm">
          #{idx + 2}
        </div>
        <span className="text-sm font-mono text-slate-500">
          V: {laptop.preference.toFixed(4)}
        </span>
      </div>
      <h5 className="font-bold text-lg mb-4 truncate text-slate-900 dark:text-white">
        {laptop.name}
      </h5>
      <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mt-auto">
        <div className="flex justify-between">
          <span>Harga</span>
          <span className="text-slate-900 dark:text-slate-200">
            Rp {laptop.price.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Spek</span>
          <span className="text-slate-900 dark:text-slate-200">
            {laptop.cpu}C / {laptop.ram}GB / {laptop.storage}GB
          </span>
        </div>
      </div>
    </Card>
  );
};

export default LaptopCard;

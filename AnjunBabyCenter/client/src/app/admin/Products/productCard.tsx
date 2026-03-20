import { Product, useToggleProductAvailabilityMutation } from '@/state/api';
import React, { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

type cardItems = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

const ProductCard = ({ product, onEdit, onDelete }: cardItems) => {
  const mainImage = product.images?.find((img: any) => img.isMain)?.url || product.images?.[0]?.url || '/placeholder.svg';
  const [toggleAvailability] = useToggleProductAvailabilityMutation();

  // Local optimistic state for availability
  const [available, setAvailable] = useState(product.availability);
  const [toggling, setToggling] = useState(false);

  // Inline mini-toast state
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);

  const handleToggleAvailability = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !available;
    setAvailable(next); // optimistic
    setToggling(true);
    try {
      await toggleAvailability({ id: product.id, availability: next }).unwrap();
      setToast({ message: next ? 'Product is now Live ✓' : 'Product hidden from store', ok: next });
    } catch {
      setAvailable(!next); // revert on failure
      setToast({ message: 'Toggle failed — please retry', ok: false });
    } finally {
      setToggling(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="p-2 -m-2 group">
      <div className="relative bg-white rounded-[28px] border border-blue-50 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

        {/* Inline mini-toast */}
        {toast && (
          <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-lg whitespace-nowrap
          animate-in fade-in slide-in-from-top-2 duration-200
          ${toast.ok ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {toast.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {toast.message}
          </div>
        )}

        {/* Hidden watermark */}
        {!available && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <span className="bg-slate-800/80 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl rotate-[-8deg]">
              Hidden
            </span>
          </div>
        )}

        {/* Image */}
        <div className={`relative aspect-square w-full overflow-hidden bg-slate-50 ${!available ? 'opacity-60 grayscale-[0.4]' : ''}`}>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Availability badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm transition-colors duration-300
            ${available ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
              {available ? '● Active' : '● Draft'}
            </span>
          </div>

          {/* Quick availability toggle — top right corner */}
          <button
            onClick={handleToggleAvailability}
            disabled={toggling}
            title={available ? 'Click to hide from store' : 'Click to make live'}
            className={`absolute top-3 right-3 p-2 rounded-xl shadow-sm transition-all active:scale-90 z-20 border
            ${toggling ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:scale-110'}
            ${available
                ? 'bg-green-50 border-green-200 text-green-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-green-50 hover:border-green-200 hover:text-green-600'}`}
          >
            {toggling
              ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : available
                ? <Eye className="w-4 h-4" />
                : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <h3 className="font-black text-slate-800 line-clamp-2 leading-snug">{product.name}</h3>
            <p className="text-blue-600 font-black text-lg mt-1">Rs. {Number(product.price).toLocaleString()}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-bold text-sm active:scale-95"
            >
              <Edit size={15} /> Edit
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-95"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
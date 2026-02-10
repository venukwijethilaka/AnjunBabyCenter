import { Product } from '@/state/api'
import React from 'react'
import { Edit, Trash2 } from 'lucide-react'

type cardItems = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: cardItems) => {
  const mainImage = product.images?.find((img: any) => img.isMain)?.url || product.images?.[0]?.url || '/placeholder.svg';
  
  return (
    <div className="relative">
      <div className={`rounded-md p-4 shadow-md bg-white hover:shadow-xl transition-all duration-300 border border-pink-100/50
        ${!product.availability ? 'opacity-60 grayscale-[0.5] border-2 border-dashed border-gray-300' : ''}`}>
        
        {/* Watermark for Hidden Products */}
        {!product.availability && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <span className="bg-gray-800/80 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-xl rotate-[-10deg]">
              Hidden from Store
            </span>
          </div>
        )}

        <img 
          src={mainImage} 
          alt={product.name} 
          className="w-full h-48 object-cover rounded-md" 
        />
        <h3 className="font-bold mt-2 text-gray-800">{product.name}</h3>
        <p className="text-pink-600 font-semibold">${product.price}</p>
        
        {/* Availability Badge */}
        <div className="mt-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            product.availability 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {product.availability ? 'Active' : 'Draft / Hidden'}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => onEdit(product)} 
            className="flex-1 flex items-center justify-center gap-1 p-2 bg-white text-pink-700 border-pink-200 hover:bg-pink-100/60 hover:text-pink-900  rounded-md transition-colors text-sm font-medium shadow-sm"
          >
            <Edit size={16} /> Edit
          </button>
          <button 
            onClick={() => onDelete(product)} 
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-md transition-colors shadow-sm"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
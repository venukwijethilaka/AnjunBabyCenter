import { Product } from '@/state/api'
import React from 'react'
import { Edit, Trash2 } from 'lucide-react'

type cardItems = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}
const productCard = ({ product, onEdit, onDelete }: cardItems) => {
  const mainImage = product.images?.find((img: any) => img.isMain)?.url || product.images?.[0]?.url || '/placeholder.svg';
  
  return (
    <div className="relative"> {/* Added relative for watermark positioning */}
      <div className={`rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-all duration-300 
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
          className="w-full h-48 object-cover rounded" 
        />
        <h3 className="font-bold mt-2">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
        
        {/* Availability Badge */}
        <div className="mt-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.availability ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
            {product.availability ? 'Active' : 'Draft / Hidden'}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
           {/* Your existing edit/delete buttons */}
           <button onClick={() => onEdit(product)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
             <Edit size={16} /> Edit
           </button>
           <button onClick={() => onDelete(product)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
             <Trash2 size={18} />
           </button>
        </div>
      </div>
    </div>
  )
}

export default productCard
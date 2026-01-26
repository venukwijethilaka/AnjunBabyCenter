import { Product } from '@/state/api'
import React from 'react'
import { Edit, Trash2 } from 'lucide-react'

type cardItems = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const productCard = ({ product, onEdit, onDelete }: cardItems) => {
  return (
    <div>
        <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded" />
        <h3 className="font-bold mt-2">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
        <p className="text-sm text-gray-500">{product.description}</p>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default productCard
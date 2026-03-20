"use client"
import React from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'

interface DeleteProductModalProps {
  isOpen: boolean; onClose: () => void; onConfirm: () => void;
  productName?: string; productId?: number; isLoading?: boolean;
}

const DeleteProductModal = ({ isOpen, onClose, onConfirm, productName, productId, isLoading = false }: DeleteProductModalProps) => {
  const handleConfirm = async () => { try { await onConfirm() } catch (err) { console.error("Error in delete confirmation:", err) } }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-md p-8 space-y-6">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-50 rounded-[20px] flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800">Delete Product?</h2>
          <p className="text-slate-500 font-medium">
            You are about to permanently delete <span className="font-black text-slate-700">"{productName}"</span>.
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 rounded-2xl px-4 py-2.5 mt-2">
            <AlertTriangle size={16} />
            <p className="text-sm font-bold">This action cannot be undone.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 transition-all active:scale-95"
          >
            {isLoading ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteProductModal

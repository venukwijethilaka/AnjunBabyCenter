"use client"
import React from 'react'
import { X } from 'lucide-react'

interface DeleteProductModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  productName?: string
  productId?: number
  isLoading?: boolean
}

const DeleteProductModal = ({ isOpen, onClose, onConfirm, productName, productId, isLoading = false }: DeleteProductModalProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm()
    } catch (err) {
      console.error("Error in delete confirmation:", err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Delete Product</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete <span className="font-bold">{productName}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 text-white rounded py-2 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-300 text-black rounded py-2 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteProductModal

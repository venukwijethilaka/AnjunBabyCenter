"use client"
import React, { useState, useRef } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { Category } from '@/state/api'
import { IKContext, IKUpload } from "imagekitio-react"

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  categories?: Category[]
  isLoading?: boolean
}

const CreateProductModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories = [], 
  isLoading = false 
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    imageUrl: '',
    color: '',
    size: '',
    categoryId: '',
    availability: true,
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    discountPercentage: ''
  })

  const [isUploading, setIsUploading] = useState(false)
  
  // Using a standard ref to trigger the hidden file input
  const ikUploadRef = useRef<HTMLInputElement>(null)

  const authenticator = async () => {
    try {
      console.log("Fetching auth from:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/imagekit-auth`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/imagekit-auth`)
      if (!response.ok) throw new Error("Authentication failed")
      return await response.json()
    } catch (error) {
      throw new Error(`Authentication request failed: ${error}`)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const onUploadStart = () => setIsUploading(true)
  
  const onUploadSuccess = (res: any) => {
    setIsUploading(false)
    setFormData(prev => ({ ...prev, imageUrl: res.url }))
  }

  const onUploadError = (err: any) => {
    setIsUploading(false)
    console.error("Upload Error:", err)
    alert("Failed to upload image")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.imageUrl) {
      alert('Please upload an image first')
      return
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      categoryId: parseInt(formData.categoryId),
      discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null
    })
    
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* Image Upload Section */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-2">Product Image *</label>
              <IKContext 
                publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY} 
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL} 
                authenticator={authenticator}
              >
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-50 flex flex-col items-center justify-center">
                  {formData.imageUrl ? (
                    <div className="relative w-full">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, imageUrl: '' }))}
                        className="mt-2 text-sm text-red-600 font-semibold"
                      >
                        Remove & Replace
                      </button>
                    </div>
                  ) : (
                    <div className="py-4 w-full">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                          <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                          {/* Note: If inputRef still errors, you can use a normal button or style the input directly */}
                          <IKUpload
                            fileName="product.png"
                            onError={onUploadError}
                            onSuccess={onUploadSuccess}
                            onUploadStart={onUploadStart}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </IKContext>
            </div>

            {/* Form Fields Section */}
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {['availability', 'isFeatured', 'isTrending', 'isFlashSale'].map((field) => (
              <label key={field} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={field}
                  checked={(formData as any)[field]}
                  onChange={handleChange}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-sm capitalize">{field.replace('is', '')}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 sticky bottom-0 bg-white pt-4">
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="flex-1 bg-green-600 text-white rounded py-3 hover:bg-green-700 font-bold disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 rounded py-3 hover:bg-gray-300 font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProductModal
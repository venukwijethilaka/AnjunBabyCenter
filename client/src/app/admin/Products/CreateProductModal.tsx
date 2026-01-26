"use client"
import React, { useState } from 'react'
import { X, Upload } from 'lucide-react'

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  categories?: Array<{ id: number; name: string }>
  isLoading?: boolean
}

const CreateProductModal = ({ isOpen, onClose, onSubmit, categories = [], isLoading = false }: CreateProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    imageUrl: '',
    imageFile: null as File | null,
    color: '',
    size: '',
    categoryId: '',
    availability: true,
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    discountPercentage: ''
  })

  const [imagePreview, setImagePreview] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: file.name
      }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      alert('Product name is required')
      return
    }
    if (!formData.description.trim()) {
      alert('Description is required')
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Price must be greater than 0')
      return
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      alert('Quantity must be a positive number')
      return
    }
    if (!formData.imageFile) {
      alert('Image is required')
      return
    }
    if (!formData.categoryId) {
      alert('Category is required')
      return
    }
    
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      imageFile: formData.imageFile,
      imageUrl: formData.imageUrl,
      color: formData.color.trim() || null,
      size: formData.size.trim() || null,
      categoryId: parseInt(formData.categoryId),
      availability: formData.availability,
      isFeatured: formData.isFeatured,
      isTrending: formData.isTrending,
      isFlashSale: formData.isFlashSale,
      discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null
    })
    
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      imageUrl: '',
      imageFile: null,
      color: '',
      size: '',
      categoryId: '',
      availability: true,
      isFeatured: false,
      isTrending: false,
      isFlashSale: false,
      discountPercentage: ''
    })
    setImagePreview('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Product</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Image Upload Section */}
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-2">Product Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('')
                        setFormData(prev => ({ ...prev, imageFile: null, imageUrl: '' }))
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter product name"
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
                    placeholder="0.00"
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
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., Red, Blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., S, M, L"
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
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Discount %</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={4}
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Available</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Trending</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFlashSale"
                checked={formData.isFlashSale}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Flash Sale</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white rounded py-3 hover:bg-green-700 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-300 text-black rounded py-3 hover:bg-gray-400 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

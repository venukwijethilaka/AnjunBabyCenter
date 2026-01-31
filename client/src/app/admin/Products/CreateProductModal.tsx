"use client"
import React, { useState } from 'react'
import { X, Upload, Loader2, Star, Trash2 } from 'lucide-react'
import { Category } from '@/state/api'
import { IKContext, IKUpload } from "imagekitio-react"

interface ProductImage {
  url: string;
  isMain: boolean;
  altText?: string;
}

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  categories?: Category[]
  isLoading?: boolean
}
const INITIAL_STATE = {
  name: '',
  description: '',
  price: '',
  quantity: '',
  images: [],
  color: '',
  size: '',
  categoryId: '',
  availability: true,
  isFeatured: false,
  isTrending: false,
  isFlashSale: false,
  discountPercentage: ''
};
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
    images: [] as ProductImage[],
    color: '',
    size: '',
    categoryId: '',
    availability: true,
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    discountPercentage: ''
  })

  // --- DEV-FRIENDLY ERROR FOR MISSING ENV VARS ---
  if (
    !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    !process.env.NEXT_PUBLIC_IMAGEKIT_URL
  ) {
    return (
      <div className="fixed inset-0 bg-red-100 flex items-center justify-center z-50 p-4">
        <div className="text-red-700 text-center bg-white p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Image Uploader Not Configured</h2>
          <p>The `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` or `NEXT_PUBLIC_IMAGEKIT_URL` is missing.</p>
          <p className="mt-2 text-sm">Please add them to your <code className="bg-red-200 px-1 rounded">.env.local</code> file in the 'client' directory and restart the development server.</p>
        </div>
      </div>
    );
  }

  // Track how many files are currently uploading to prevent early form submission
  const [uploadingCount, setUploadingCount] = useState(0);

  const authenticator = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/imagekit/auth`)
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

  // --- IMAGE HANDLING LOGIC ---

  const onUploadStart = () => setUploadingCount(prev => prev + 1)
  
  const onUploadSuccess = (res: any) => {
    setUploadingCount(prev => Math.max(0, prev - 1))
    setFormData(prev => {
      const newImage: ProductImage = {
        url: res.url,
        // Set as main if it's the very first image uploaded
        isMain: prev.images.length === 0 
      }
      return { ...prev, images: [...prev.images, newImage] }
    })
  }

  const onUploadError = (err: any) => {
    setUploadingCount(prev => Math.max(0, prev - 1))
    alert("One of the images failed to upload.")
  }

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // If deleted image was the main one, make the next available image the main one
      if (prev.images[index]?.isMain && newImages.length > 0) {
        newImages[0].isMain = true;
      }
      return { ...prev, images: newImages };
    });
  }

  const setMainImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isMain: i === index 
      }))
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.images.length === 0) return alert('Please upload at least one image')
    if (uploadingCount > 0) return alert('Please wait for all images to finish uploading')

    onSubmit({
      name: formData.name.trim(),
    description: formData.description,
    price: parseFloat(formData.price),
    quantity: parseInt(formData.quantity),
    categoryId: parseInt(formData.categoryId),
    images: formData.images, // <--- Ensure this is plural 'images'
    color: formData.color,
    size: formData.size,
    availability: formData.availability,
    isFeatured: formData.isFeatured,
    isTrending: formData.isTrending,
    isFlashSale: formData.isFlashSale,
    discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null
    });
    setFormData(INITIAL_STATE);
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-5xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto pr-2 custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: MULTI-IMAGE GALLERY */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Product Gallery</label>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {formData.images.map((img, index) => (
                  <div key={index} className={`group relative aspect-square rounded-xl border-2 overflow-hidden bg-gray-50 transition-all ${img.isMain ? 'border-pink-500 ring-2 ring-pink-100' : 'border-gray-200'}`}>
                    <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                    
                    {img.isMain && (
                      <div className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm z-10">
                        Thumbnail
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => setMainImage(index)}
                        className={`p-2 rounded-full transition-colors ${img.isMain ? 'bg-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-pink-100'}`}
                        title="Mark as Main Thumbnail"
                      >
                        <Star size={16} fill={img.isMain ? "currentColor" : "none"} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
                        className="p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* UPLOAD TRIGGER BOX */}
                <IKContext 
                  publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY} 
                  urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL} 
                  authenticator={authenticator}
                >
                  <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all group">
                    {uploadingCount > 0 ? (
                      <div className="text-center">
                        <Loader2 className="animate-spin text-pink-500 mx-auto mb-1" size={24} />
                        <span className="text-[10px] text-gray-500 font-bold">{uploadingCount} uploading...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-gray-400 group-hover:text-pink-500 mb-1" size={24} />
                        <span className="text-[10px] text-gray-400 font-bold">Add Images</span>
                      </>
                    )}
                    <IKUpload
                      fileName="product.png"
                      multiple={true}
                      onError={onUploadError}
                      onSuccess={onUploadSuccess}
                      onUploadStart={onUploadStart}
                      className="hidden" 
                    />
                  </label>
                </IKContext>
              </div>
              <p className="text-[11px] text-gray-400 italic leading-tight">
                * You can select multiple images at once. Use the star to choose the main card image.
              </p>
            </div>

            {/* RIGHT COLUMN: FORM FIELDS */}
            <div className="col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none" step="0.01" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none bg-white" required>
                    <option value="">Select a category</option>
                    {categories.map((cat: Category) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none" rows={3} required />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {['availability', 'isFeatured', 'isTrending', 'isFlashSale'].map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" name={field} checked={(formData as any)[field]} onChange={handleChange} className="w-4 h-4 accent-pink-500" />
                    <span className="text-xs font-semibold text-gray-600 group-hover:text-pink-600 capitalize">{field.replace('is', '')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 sticky bottom-0 bg-white pt-4 border-t">
            <button
              type="submit"
              disabled={isLoading || uploadingCount > 0}
              className="flex-1 bg-pink-500 text-white rounded-xl py-4 hover:bg-pink-600 transition-all font-bold disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : uploadingCount > 0 ? `Uploading ${uploadingCount} files...` : 'Create Product'}
            </button>
            <button type="button" onClick={onClose} className="px-8 bg-gray-100 text-gray-600 rounded-xl py-4 hover:bg-gray-200 transition-all font-bold">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProductModal
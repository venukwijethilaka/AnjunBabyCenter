"use client"
import React, { useState, useEffect } from 'react'
import { X, Upload, Loader2, Star, Trash2 } from 'lucide-react'
import { Product, Category } from '@/state/api'
import { IKContext, IKUpload } from "imagekitio-react"

interface ProductImage {
  url: string;
  isMain: boolean;
  altText?: string;
}

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  product?: Product
  categories?: Category[]
  isLoading?: boolean
}

const EditProductModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product, 
  categories = [], 
  isLoading = false 
}: EditProductModalProps) => {
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

  const [uploadingCount, setUploadingCount] = useState(0);

  // Sync product data to form when modal opens
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name,
        description: product.description,
        price: String(product.price),
        quantity: String(product.quantity),
        images: product.images || [], // Now handling the array
        color: product.color || '',
        size: product.size || '',
        categoryId: String(product.categoryId),
        availability: product.availability,
        isFeatured: product.isFeatured,
        isTrending: product.isTrending,
        isFlashSale: product.isFlashSale,
        discountPercentage: product.discountPercentage ? String(product.discountPercentage) : ''
      })
    }
  }, [product, isOpen])

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
        isMain: prev.images.length === 0 
      }
      return { ...prev, images: [...prev.images, newImage] }
    })
  }

  const onUploadError = (err: any) => {
    setUploadingCount(prev => Math.max(0, prev - 1))
    alert("Upload failed.")
  }

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
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
  e.preventDefault();
  
  if (formData.images.length === 0) return alert('At least one image is required');
  if (uploadingCount > 0) return alert('Wait for uploads to finish');

  // Create a clean object for the API
  const submitData = {
    name: formData.name,
    description: formData.description,
    price: parseFloat(formData.price),
    quantity: parseInt(formData.quantity),
    color: formData.color || null,
    size: formData.size || null,
    categoryId: parseInt(formData.categoryId),
    availability: formData.availability,
    isFeatured: formData.isFeatured,
    isTrending: formData.isTrending,
    isFlashSale: formData.isFlashSale,
    discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null,
    // Map images to ensure only the necessary fields are sent
    images: formData.images.map(img => ({
      url: img.url,
      isMain: img.isMain,
      altText: formData.name
    }))
  };

  onSubmit(submitData); // Don't include ID here, handle it in the Page
}

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-5xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Product: {product?.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto pr-2 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* GALLERY SECTION */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Gallery</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {formData.images.map((img, index) => (
                  <div key={index} className={`group relative aspect-square rounded-xl border-2 overflow-hidden ${img.isMain ? 'border-blue-500' : 'border-gray-200'}`}>
                    <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                      <button type="button" onClick={() => setMainImage(index)} className="p-2 bg-white rounded-full">
                        <Star size={16} fill={img.isMain ? "#3b82f6" : "none"} className={img.isMain ? "text-blue-500" : "text-gray-600"} />
                      </button>
                      <button type="button" onClick={() => removeImage(index)} className="p-2 bg-white text-red-500 rounded-full">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <IKContext 
                  publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY} 
                  urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL} 
                  authenticator={authenticator}
                >
                  <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    {uploadingCount > 0 ? (
                      <Loader2 className="animate-spin text-blue-500" />
                    ) : (
                      <>
                        <Upload className="text-gray-400" size={24} />
                        <span className="text-[10px] font-bold text-gray-400">Add More</span>
                      </>
                    )}
                    <IKUpload fileName="edit_prod.png" multiple={true} onSuccess={onUploadSuccess} onUploadStart={onUploadStart} onError={onUploadError} className="hidden" />
                  </label>
                </IKContext>
              </div>
            </div>

            {/* FORM FIELDS SECTION */}
            <div className="col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded-lg" step="0.01" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border p-2 rounded-lg bg-white" required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded-lg" rows={3} required />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                {['availability', 'isFeatured', 'isTrending', 'isFlashSale'].map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name={field} checked={(formData as any)[field]} onChange={handleChange} className="accent-blue-600" />
                    <span className="text-xs font-semibold capitalize">{field.replace('is', '')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-4 border-t sticky bottom-0 bg-white">
            <button
              type="submit"
              disabled={isLoading || uploadingCount > 0}
              className="flex-1 bg-blue-600 text-white rounded-xl py-4 font-bold disabled:opacity-50"
            >
              {isLoading ? 'Saving Changes...' : 'Update Product'}
            </button>
            <button type="button" onClick={onClose} className="px-8 bg-gray-100 text-gray-600 rounded-xl py-4 font-bold">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProductModal
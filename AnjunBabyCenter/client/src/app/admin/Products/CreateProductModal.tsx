"use client"
import React, { useState } from 'react'
import { X, Upload, Loader2, Star, Trash2, Package } from 'lucide-react'
import { Category } from '@/state/api'
import { IKContext, IKUpload } from "imagekitio-react"
import RichTextEditor from '@/app/admin/(components)/RichTextEditor'

interface ProductImage { url: string; isMain: boolean; altText?: string; }

interface CreateProductModalProps {
  isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void;
  categories?: Category[]; isLoading?: boolean;
}

const INITIAL_STATE = { name: '', description: '', price: '', quantity: '', images: [], color: '', size: '', categoryId: '', availability: true, discountPercentage: '' };

const CreateProductModal = ({ isOpen, onClose, onSubmit, categories = [], isLoading = false }: CreateProductModalProps) => {
  const [formData, setFormData] = useState({ ...INITIAL_STATE, images: [] as ProductImage[] })
  const [uploadingCount, setUploadingCount] = useState(0);

  if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL) {
    return (
      <div className="fixed inset-0 bg-red-100 flex items-center justify-center z-50 p-4">
        <div className="text-red-700 text-center bg-white p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Image Uploader Not Configured</h2>
          <p>The ImageKit environment variables are missing in your <code className="bg-red-100 px-1 rounded">.env.local</code>.</p>
        </div>
      </div>
    );
  }

  const authenticator = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/imagekit/auth`)
    if (!response.ok) throw new Error("Authentication failed")
    return await response.json()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    else setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onUploadStart = () => setUploadingCount(prev => prev + 1)
  const onUploadSuccess = (res: any) => {
    setUploadingCount(prev => Math.max(0, prev - 1))
    setFormData(prev => { const newImg: ProductImage = { url: res.url, isMain: prev.images.length === 0 }; return { ...prev, images: [...prev.images, newImg] } })
  }
  const onUploadError = () => { setUploadingCount(prev => Math.max(0, prev - 1)); alert("Upload failed.") }
  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImgs = prev.images.filter((_, i) => i !== index);
      if (prev.images[index]?.isMain && newImgs.length > 0) newImgs[0].isMain = true;
      return { ...prev, images: newImgs };
    });
  }
  const setMainImage = (index: number) => setFormData(prev => ({ ...prev, images: prev.images.map((img, i) => ({ ...img, isMain: i === index })) }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.images.length === 0) return alert('Please upload at least one image')
    if (uploadingCount > 0) return alert('Please wait for all images to finish uploading')
    onSubmit({ name: formData.name.trim(), description: formData.description, price: parseFloat(formData.price), quantity: parseInt(formData.quantity), categoryId: parseInt(formData.categoryId), images: formData.images, color: formData.color, size: formData.size, availability: formData.availability, discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null });
    setFormData({ ...INITIAL_STATE, images: [] });
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] w-full max-w-5xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Add New Product</h2>
              <p className="text-sm text-slate-400 font-medium">Fill in the details to create a listing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-2xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* LEFT: Gallery */}
            <div className="col-span-1 space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Product Gallery</label>
              <div className="grid grid-cols-2 gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className={`group relative aspect-square rounded-2xl border-2 overflow-hidden bg-slate-50 transition-all ${img.isMain ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}>
                    <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                    {img.isMain && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm z-10">Main</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button type="button" onClick={() => setMainImage(index)} className={`p-2 rounded-full transition-colors ${img.isMain ? 'bg-blue-500 text-white' : 'bg-white text-slate-700 hover:bg-blue-100'}`}>
                        <Star size={15} fill={img.isMain ? "currentColor" : "none"} />
                      </button>
                      <button type="button" onClick={() => removeImage(index)} className="p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}

                <IKContext publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY} urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL} authenticator={authenticator}>
                  <label className="relative aspect-square border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                    {uploadingCount > 0 ? (
                      <div className="text-center">
                        <Loader2 className="animate-spin text-blue-500 mx-auto mb-1" size={24} />
                        <span className="text-[10px] text-slate-400 font-bold">{uploadingCount} uploading…</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-blue-300 group-hover:text-blue-500 mb-1 transition-colors" size={24} />
                        <span className="text-[10px] text-slate-400 font-bold">Add Images</span>
                      </>
                    )}
                    <IKUpload fileName="product.png" multiple={true} onError={onUploadError} onSuccess={onUploadSuccess} onUploadStart={onUploadStart} className="hidden" />
                  </label>
                </IKContext>
              </div>
              <p className="text-[11px] text-slate-400 italic leading-tight">* Select multiple images. Tap ★ to set the main thumbnail.</p>
            </div>

            {/* RIGHT: Fields */}
            <div className="col-span-2 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Product Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Baby Stroller Deluxe" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none font-semibold transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Price (Rs.) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-200 outline-none font-semibold transition-all" step="0.01" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Stock Qty *</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-200 outline-none font-semibold transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Color</label>
                  <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Navy Blue" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-200 outline-none font-semibold transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Size</label>
                  <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="e.g. M, 0-3 months" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-200 outline-none font-semibold transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Discount %</label>
                  <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-200 outline-none font-semibold transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category *</label>
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-200 outline-none font-semibold transition-all appearance-none" required>
                    <option value="">Select a category…</option>
                    {categories.map((cat: Category) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description *</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                  placeholder="Describe the product — bold key features, add bullet points for specs…"
                />
              </div>

              {/* Algorithm info banner — replaces the old boolean checkboxes */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-100 rounded-lg shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-black text-blue-800 mb-1">Smart Sections — Automatic</p>
                    <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
                      <span className="font-bold">Flash Sale</span> = active Promotional Offers ·&nbsp;
                      <span className="font-bold">New Arrivals</span> = added in last 30 days ·&nbsp;
                      <span className="font-bold">Trending</span> = most ordered in 14 days
                    </p>
                  </div>
                </div>

                {/* Only keep Availability toggle */}
                <div className="mt-3 pt-3 border-t border-blue-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
                    <span className="text-xs font-bold text-slate-600">Available (visible to customers)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100 sticky bottom-0 bg-white">
            <button type="submit" disabled={isLoading || uploadingCount > 0}
              className="flex-1 bg-blue-600 text-white rounded-2xl py-4 font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95">
              {isLoading ? 'Creating...' : uploadingCount > 0 ? `Uploading ${uploadingCount} files…` : 'Create Product'}
            </button>
            <button type="button" onClick={onClose} className="px-8 bg-slate-100 text-slate-600 rounded-2xl py-4 font-black hover:bg-slate-200 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProductModal
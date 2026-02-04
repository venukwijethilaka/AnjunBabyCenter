"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Plus, Edit3, Trash2, X, Image as ImageIcon, ChevronRight, Loader2, Upload } from "lucide-react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../../state/api";
import { IKContext, IKUpload } from "imagekitio-react";
import { Category } from "../../../state/api";

interface ImageKitUploadResponse {
  url: string;
}

export default function CategoryAdmin() {
  const { data: allCategories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedMainId, setSelectedMainId] = useState<number | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isMainCategory, setIsMainCategory] = useState(false);

  const mainCategories = useMemo(() => {
    return allCategories.filter((c) => !c.parentId);
  }, [allCategories]);

  const filteredSubCats = useMemo(() => {
    if (!selectedMainId) return [];
    return allCategories.filter((c) => c.parentId === selectedMainId);
  }, [allCategories, selectedMainId]);

  const selectedCategory = useMemo(() => {
    if (!selectedSubId) return null;
    return allCategories.find(c => c.id === selectedSubId);
  }, [allCategories, selectedSubId]);

  useEffect(() => {
    if (activeModal === 'update' && selectedCategory) {
      setCategoryName(selectedCategory.name);
      setImageUrl(selectedCategory.imageUrl || null);
      setSelectedMainId(selectedCategory.parentId || null);
      setIsMainCategory(!selectedCategory.parentId);
    } else {
      setCategoryName("");
      setImageUrl(null);
      setIsMainCategory(false);
    }
  }, [activeModal, selectedCategory]);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedMainId(null);
    setSelectedSubId(null);
    setCategoryName("");
    setImageUrl(null);
    setUploading(false);
    setIsMainCategory(false);
  };

  const authenticator = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/imagekit/auth`);
      if (!response.ok) throw new Error("Authentication failed");
      return await response.json();
    } catch (error) {
      throw new Error(`Authentication request failed: ${error}`);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) {
      alert("Please wait for the image to finish uploading.");
      return;
    }

    const parentId = isMainCategory ? null : selectedMainId;

    if (activeModal === 'add') {
      if (!categoryName || (!isMainCategory && !selectedMainId)) {
        alert("Name and parent category (for sub-categories) are required.");
        return;
      }
      await createCategory({ name: categoryName, parentId, imageUrl: imageUrl || undefined });
    } else if (activeModal === 'update') {
      if (!selectedSubId) {
        alert("Please select a category to update.");
        return;
      }
      await updateCategory({ id: selectedSubId, data: { name: categoryName, parentId, imageUrl: imageUrl || undefined } });
    } else if (activeModal === 'remove') {
      if (!selectedSubId) {
        alert("Please select a category to delete.");
        return;
      }
      await deleteCategory(selectedSubId);
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-700 tracking-tight">Category Management</h2>
            </div>
            
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
              <button 
                onClick={() => setActiveModal('add')} 
                className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-bold transition-all"
              >
                <Plus size={18} /> Add
              </button>
              <button 
                onClick={() => setActiveModal('update')} 
                className="flex items-center gap-2 px-5 py-2.5 text-blue-600 hover:bg-blue-60 rounded-xl text-sm font-bold transition-all"
              >
                <Edit3 size={18} /> Update
              </button>
              <button 
                onClick={() => setActiveModal('remove')} 
                className="flex items-center gap-2 px-5 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-all"
              >
                <Trash2 size={18} /> Remove
              </button>
            </div>
          </header>

          {/* Categories Grid */}
          <div className="space-y-12">
            {mainCategories.map((main) => (
              <section key={main.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-1.5 bg-pink-500 rounded-full" />
                  <h3 className="font text-gray-800 tracking-wide uppercase text-sm">{main.name}</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {allCategories.filter((c) => c.parentId === main.id).map((sub) => (
                    <div key={sub.id} className="group flex flex-col items-center text-center space-y-3">
                      <div className="relative w-24 h-24 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-md overflow-hidden">
                        {sub.imageUrl ? (
                          <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-pink-200 group-hover:text-pink-400 transition-colors" size={32} />
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-600 group-hover:text-pink-600 uppercase transition-colors">{sub.name}</span>
                    </div>
                  ))}
                  
                  {allCategories.filter((c) => c.parentId === main.id).length === 0 && (
                    <p className="text-xs italic text-gray-400 col-span-full">No sub-categories added yet.</p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* POPUP MODAL */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 capitalize">{activeModal} Category</h2>
              <p className="text-sm text-gray-500">Please fill in the details below</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-5">
              
              {(activeModal === 'add' || activeModal === 'update') && (
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="isMain" checked={isMainCategory} onChange={(e) => setIsMainCategory(e.target.checked)} />
                  <label htmlFor="isMain">Is Main Category</label>
                </div>
              )}

              {!isMainCategory && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">PARENT CATEGORY</label>
                  <select 
                    className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all"
                    value={selectedMainId || ""}
                    onChange={(e) => { setSelectedMainId(Number(e.target.value)); setSelectedSubId(null); }}
                    required={!isMainCategory}
                  >
                    <option value="">Select Main Category</option>
                    {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {(activeModal === 'update' || activeModal === 'remove') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">SUB-CATEGORY TO {activeModal.toUpperCase()}</label>
                  <select 
                    className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50 transition-all"
                    disabled={isMainCategory}
                    value={selectedSubId || ""}
                    onChange={(e) => setSelectedSubId(Number(e.target.value))}
                    required
                  >
                    <option value="">Select Sub-Category</option>
                    {filteredSubCats.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                  </select>
                </div>
              )}

              {(activeModal === 'add' || activeModal === 'update') && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">CATEGORY NAME</label>
                    <input 
                      placeholder="e.g. Newborn Essentials" 
                      className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all" 
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <IKContext
                    publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
                    urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL}
                    authenticator={authenticator}
                  >
                    <div className="group border-2 border-dashed border-gray-200 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer">
                      {uploading ? (
                        <Loader2 className="animate-spin text-pink-500" />
                      ) : imageUrl ? (
                        <img src={imageUrl} alt="Category" className="w-20 h-20 object-cover rounded-lg" />
                      ) : (
                        <>
                          <Upload className="text-gray-400 group-hover:text-pink-500" />
                          <span className="text-xs font-bold text-gray-400 group-hover:text-pink-500">Upload Icon/Image</span>
                        </>
                      )}
                      <IKUpload
                        fileName="category.png"
                        onError={() => setUploading(false)}
                        onSuccess={(res: ImageKitUploadResponse) => {
                          setImageUrl(res.url);
                          setUploading(false);
                        }}
                        onUploadStart={() => setUploading(true)}
                        className="hidden"
                      />
                    </div>
                  </IKContext>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isCreating || isUpdating || isDeleting || uploading}
                  className={`flex-1 py-4 rounded-xl text-white font-bold transition-all shadow-lg ${
                    activeModal === 'remove' ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-pink-500 hover:bg-pink-600 shadow-pink-100'
                  } disabled:opacity-50`}
                >
                  {isCreating || isUpdating || isDeleting ? <Loader2 className="animate-spin mx-auto" /> :
                   activeModal === 'add' ? 'Create Category' : 
                   activeModal === 'update' ? 'Save Changes' : 'Confirm Delete'}
                </button>
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Plus, Edit3, Trash2, X, Image as ImageIcon, Loader2, Upload } from "lucide-react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../../state/api";
import { IKContext, IKUpload } from "imagekitio-react";

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
  const [error, setError] = useState<string | null>(null);
  const [editingMain, setEditingMain] = useState(false);

  const uploadInputRef = useRef<HTMLInputElement>(null);

  const mainCategories = useMemo(() => allCategories.filter((c) => !c.parentId), [allCategories]);
  
  const filteredSubCats = useMemo(() => {
    if (!selectedMainId) return [];
    return allCategories.filter((c) => c.parentId === selectedMainId);
  }, [allCategories, selectedMainId]);

  const selectedCategoryForEdit = useMemo(() => {
    const idToFind = editingMain ? selectedMainId : selectedSubId;
    if (!idToFind) return null;
    return allCategories.find(c => c.id === idToFind);
  }, [allCategories, selectedMainId, selectedSubId, editingMain]);

  // Handle Body Scroll Locking when Modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeModal]);
  
  // Effect to reset state when modal is closed or its mode changes
  useEffect(() => {
    if (!activeModal) {
      setCategoryName("");
      setImageUrl(null);
      setSelectedMainId(null);
      setSelectedSubId(null);
      setIsMainCategory(false);
      setError(null);
      setEditingMain(false);
    } else {
        setError(null);
    }
  }, [activeModal]);

  useEffect(() => {
    if (activeModal === 'update' && selectedCategoryForEdit) {
      setCategoryName(selectedCategoryForEdit.name);
      setImageUrl(selectedCategoryForEdit.imageUrl || null);
      if (selectedCategoryForEdit.parentId) {
        setSelectedMainId(selectedCategoryForEdit.parentId);
        setIsMainCategory(false);
        setEditingMain(false);
      } else {
        setIsMainCategory(true);
        setEditingMain(true);
      }
    }
  }, [activeModal, selectedCategoryForEdit]);
  
  const closeModal = () => setActiveModal(null);

  const authenticator = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/imagekit/auth`);
      if (!response.ok) throw new Error("Authentication failed");
      return await response.json();
    } catch (error) {
      throw new Error(`Auth failed: ${error}`);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) {
        setError("Please wait for the image to finish uploading.");
        return;
    }
    const parentId = isMainCategory ? null : selectedMainId;

    try {
        let idToProcess;
        if(activeModal === 'update' || activeModal === 'remove'){
            idToProcess = editingMain ? selectedMainId : selectedSubId;
            if(!idToProcess){
                setError(`Please select a ${editingMain ? 'main category' : 'sub-category'} to ${activeModal}.`);
                return;
            }
        }

      switch (activeModal) {
        case 'add':
          await createCategory({ name: categoryName, parentId, imageUrl: imageUrl || undefined }).unwrap();
          break;
        case 'update':
          await updateCategory({ id: idToProcess!, data: { name: categoryName, parentId, imageUrl: imageUrl || undefined } }).unwrap();
          break;
        case 'remove':
          await deleteCategory(idToProcess!).unwrap();
          break;
      }
      closeModal();
    } catch (err: any) {
      setError(err.data?.message || 'An unknown error occurred.');
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-6">
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <ImageIcon className="text-gray-500" size={28} />
                <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => setActiveModal('add')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                    <Plus size={18} /> Add
                </button>
                <button onClick={() => setActiveModal('update')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <Edit3 size={18} /> Update
                </button>
                <button onClick={() => setActiveModal('remove')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <Trash2 size={18} /> Remove
                </button>
            </div>
        </header>

          {isLoadingCategories ? (
            <div className="text-center py-12">Loading categories...</div>
          ) : (
            <div className="space-y-8">
                {mainCategories.map((main) => (
                <section key={main.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <div className="h-8 w-1.5 bg-blue-500 rounded-full" />
                    <h3 className="font-bold text-gray-800 tracking-wide text-lg">{main.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                    {allCategories.filter(c => c.parentId === main.id).map((sub) => (
                        <div key={sub.id} className="group flex flex-col items-center text-center space-y-3">
                        <div className="relative w-24 h-24 rounded-full bg-gray-100 border-2 border-white shadow-md flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-lg overflow-hidden">
                            {sub.imageUrl ? <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={32} />}
                        </div>
                        <span className="text-sm font-semibold text-gray-600 group-hover:text-blue-600 uppercase">{sub.name}</span>
                        </div>
                    ))}
                    {allCategories.filter(c => c.parentId === main.id).length === 0 && <p className="text-sm italic text-gray-500 col-span-full">No sub-categories.</p>}
                    </div>
                </section>
                ))}
            </div>
          )}
        </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative my-auto">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 capitalize">{activeModal} Category</h2>
              <p className="text-sm text-gray-500">Manage your product categories.</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {(activeModal === 'update' || activeModal === 'remove') && (
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 ml-1">TYPE TO {activeModal.toUpperCase()}</label>
                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <input type="radio" id="editMain" name="editType" checked={editingMain} onChange={() => setEditingMain(true)} className="h-4 w-4 accent-blue-500"/>
                            <label htmlFor="editMain" className="text-sm font-medium text-gray-700">Main Category</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="radio" id="editSub" name="editType" checked={!editingMain} onChange={() => setEditingMain(false)} className="h-4 w-4 accent-blue-500"/>
                            <label htmlFor="editSub" className="text-sm font-medium text-gray-700">Sub-Category</label>
                        </div>
                    </div>
                </div>
              )}

              {(activeModal === 'add' && (
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                  <input type="checkbox" id="isMain" checked={isMainCategory} onChange={e => setIsMainCategory(e.target.checked)} className="h-4 w-4 accent-blue-500"/>
                  <label htmlFor="isMain" className="text-sm font-medium text-gray-700">Create as a Main Category</label>
                </div>
              ))}

              {((activeModal === 'add' && !isMainCategory) || ((activeModal === 'update' || activeModal === 'remove') && !editingMain)) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">PARENT CATEGORY</label>
                  <select value={selectedMainId || ""} onChange={e => { setSelectedMainId(Number(e.target.value)); setSelectedSubId(null); }} required={!isMainCategory && !editingMain} className="w-full p-3 rounded-xl border-gray-200 bg-gray-50 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-400">
                    <option value="">Select Parent...</option>
                    {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {(activeModal === 'update' || activeModal === 'remove') && !editingMain && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">SUB-CATEGORY TO {activeModal.toUpperCase()}</label>
                  <select value={selectedSubId || ""} onChange={e => setSelectedSubId(Number(e.target.value))} required disabled={!selectedMainId} className="w-full p-3 rounded-xl border-gray-200 bg-gray-50 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-400 disabled:opacity-50">
                    <option value="">Select Sub-Category...</option>
                    {filteredSubCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {(activeModal === 'update' || activeModal === 'remove') && editingMain && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">MAIN CATEGORY TO {activeModal.toUpperCase()}</label>
                  <select value={selectedMainId || ""} onChange={e => setSelectedMainId(Number(e.target.value))} required className="w-full p-3 rounded-xl border-gray-200 bg-gray-50 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-400">
                    <option value="">Select Main Category...</option>
                    {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {(activeModal === 'add' || activeModal === 'update') && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">CATEGORY NAME</label>
                    <input placeholder="e.g. Strollers" value={categoryName} onChange={e => setCategoryName(e.target.value)} required className="w-full p-3 rounded-xl border-gray-200 bg-gray-50 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-400"/>
                  </div>
                  <IKContext publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY} urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL} authenticator={authenticator}>
                    <label className="group border-2 border-dashed border-gray-200 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                      {uploading ? <Loader2 className="animate-spin text-blue-500" /> : imageUrl ? <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg" /> : <> <Upload className="text-gray-400" /> <span className="text-xs font-bold text-gray-400">Upload Image</span> </>}
                      <IKUpload fileName="category.png"
                        ref={uploadInputRef}
                        onError={() => setUploading(false)}
                        onSuccess={(res: ImageKitUploadResponse) => { setImageUrl(res.url); setUploading(false); }}
                        onUploadStart={() => setUploading(true)}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </IKContext>
                </>
              )}
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isCreating || isUpdating || isDeleting || uploading} className={`flex-1 py-3 rounded-xl text-white font-bold transition-all shadow-lg disabled:opacity-50 ${activeModal === 'remove' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {isCreating || isUpdating || isDeleting || uploading ? <Loader2 className="animate-spin mx-auto"/> : (activeModal === 'add' ? 'Create' : activeModal === 'update' ? 'Save' : 'Delete')}
                </button>
                <button type="button" onClick={closeModal} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
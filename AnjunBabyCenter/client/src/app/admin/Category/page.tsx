"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Plus, Edit3, Trash2, X, Image as ImageIcon, Loader2, Upload, List } from "lucide-react";
import {
  useGetCategoriesQuery, useCreateCategoryMutation,
  useUpdateCategoryMutation, useDeleteCategoryMutation,
} from "../../../state/api";
import { IKContext, IKUpload } from "imagekitio-react";

interface ImageKitUploadResponse { url: string; }

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

  const mainCategories = useMemo(() => (allCategories || []).filter((c) => !c.parentId), [allCategories]);
  const filteredSubCats = useMemo(() => {
    if (!selectedMainId) return [];
    return (allCategories || []).filter((c) => c.parentId === selectedMainId);
  }, [allCategories, selectedMainId]);

  const selectedCategoryForEdit = useMemo(() => {
    const idToFind = editingMain ? selectedMainId : selectedSubId;
    if (!idToFind) return null;
    return allCategories.find(c => c.id === idToFind);
  }, [allCategories, selectedMainId, selectedSubId, editingMain]);

  useEffect(() => {
    if (activeModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeModal]);

  useEffect(() => {
    if (!activeModal) { setCategoryName(""); setImageUrl(null); setSelectedMainId(null); setSelectedSubId(null); setIsMainCategory(false); setError(null); setEditingMain(false); }
    else setError(null);
  }, [activeModal]);

  useEffect(() => {
    if (activeModal === 'update' && selectedCategoryForEdit) {
      setCategoryName(selectedCategoryForEdit.name);
      setImageUrl(selectedCategoryForEdit.imageUrl || null);
      if (selectedCategoryForEdit.parentId) { setSelectedMainId(selectedCategoryForEdit.parentId); setIsMainCategory(false); setEditingMain(false); }
      else { setIsMainCategory(true); setEditingMain(true); }
    }
  }, [activeModal, selectedCategoryForEdit]);

  const closeModal = () => setActiveModal(null);

  const authenticator = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/imagekit/auth`);
    if (!response.ok) throw new Error("Authentication failed");
    return await response.json();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) { setError("Please wait for the image to finish uploading."); return; }
    const parentId = isMainCategory ? null : selectedMainId;
    try {
      let idToProcess;
      if (activeModal === 'update' || activeModal === 'remove') {
        idToProcess = editingMain ? selectedMainId : selectedSubId;
        if (!idToProcess) { setError(`Please select a ${editingMain ? 'main category' : 'sub-category'}.`); return; }
      }
      switch (activeModal) {
        case 'add': await createCategory({ name: categoryName, parentId, imageUrl: imageUrl || undefined }).unwrap(); break;
        case 'update': await updateCategory({ id: idToProcess!, data: { name: categoryName, parentId, imageUrl: imageUrl || undefined } }).unwrap(); break;
        case 'remove': await deleteCategory(idToProcess!).unwrap(); break;
      }
      closeModal();
    } catch (err: any) { setError(err.data?.message || 'An unknown error occurred.'); }
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">

        {/* ── Header ── */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <List className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">Categories</h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">{mainCategories.length} main categories</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveModal('add')} className="flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all">
              <Plus size={18} /> Add
            </button>
            <button onClick={() => setActiveModal('update')} className="flex items-center gap-2 px-5 py-3.5 bg-white border border-blue-100 text-blue-700 rounded-2xl font-bold hover:bg-blue-50 transition-all">
              <Edit3 size={16} /> Update
            </button>
            <button onClick={() => setActiveModal('remove')} className="flex items-center gap-2 px-5 py-3.5 bg-white border border-red-100 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-all">
              <Trash2 size={16} /> Remove
            </button>
          </div>
        </header>

        {/* ── Category List ── */}
        {isLoadingCategories ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
            <p className="text-blue-600 font-bold">Loading categories…</p>
          </div>
        ) : (
          <div className="space-y-6">
            {mainCategories.map((main) => {
              const subs = (allCategories || []).filter(c => c.parentId === main.id);
              return (
                <section key={main.id} className="bg-white rounded-[28px] border border-blue-50 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="h-8 w-1.5 bg-blue-500 rounded-full" />
                    <h3 className="font-black text-slate-800 text-lg tracking-tight">{main.name}</h3>
                    <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{subs.length} subcategories</span>
                  </div>
                  {subs.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-5">
                      {subs.map((sub) => (
                        <div key={sub.id} className="group flex flex-col items-center text-center gap-2 cursor-pointer">
                          <div className="relative w-20 h-20 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:border-blue-300 overflow-hidden">
                            {sub.imageUrl
                              ? <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" />
                              : <ImageIcon className="text-slate-300" size={28} />}
                          </div>
                          <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 uppercase transition-colors leading-tight line-clamp-2">{sub.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-slate-400">No sub-categories added yet.</p>
                  )}
                </section>
              );
            })}

            {mainCategories.length === 0 && (
              <div className="bg-white rounded-[28px] border border-blue-50 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
                <div className="p-5 bg-blue-50 rounded-[24px]">
                  <List className="text-blue-300 w-10 h-10" />
                </div>
                <p className="font-bold text-slate-500">No categories yet. Click Add to create one.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 relative my-auto">
            <button onClick={closeModal} className="absolute top-5 right-5 p-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-2xl transition-colors">
              <X size={18} />
            </button>
            <div className="mb-7">
              <h2 className="text-2xl font-black text-slate-800 capitalize">{activeModal} Category</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Manage your product categories.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {(activeModal === 'update' || activeModal === 'remove') && (
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Type to {activeModal}</label>
                  <div className="flex items-center gap-4 bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" id="editMain" name="editType" checked={editingMain} onChange={() => setEditingMain(true)} className="h-4 w-4 accent-blue-600" />
                      <span className="text-sm font-bold text-slate-700">Main Category</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" id="editSub" name="editType" checked={!editingMain} onChange={() => setEditingMain(false)} className="h-4 w-4 accent-blue-600" />
                      <span className="text-sm font-bold text-slate-700">Sub-Category</span>
                    </label>
                  </div>
                </div>
              )}

              {activeModal === 'add' && (
                <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
                  <input type="checkbox" id="isMain" checked={isMainCategory} onChange={e => setIsMainCategory(e.target.checked)} className="h-4 w-4 accent-blue-600" />
                  <label htmlFor="isMain" className="text-sm font-bold text-slate-700">Create as a Main Category</label>
                </div>
              )}

              {((activeModal === 'add' && !isMainCategory) || ((activeModal === 'update' || activeModal === 'remove') && !editingMain)) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Parent Category</label>
                  <select value={selectedMainId || ""} onChange={e => { setSelectedMainId(Number(e.target.value)); setSelectedSubId(null); }} required={!isMainCategory && !editingMain}
                    className="w-full p-3.5 rounded-2xl border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-300 outline-none">
                    <option value="">Select Parent…</option>
                    {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {(activeModal === 'update' || activeModal === 'remove') && !editingMain && (
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sub-Category to {activeModal}</label>
                  <select value={selectedSubId || ""} onChange={e => setSelectedSubId(Number(e.target.value))} required disabled={!selectedMainId}
                    className="w-full p-3.5 rounded-2xl border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-300 outline-none disabled:opacity-50">
                    <option value="">Select Sub-Category…</option>
                    {filteredSubCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {(activeModal === 'update' || activeModal === 'remove') && editingMain && (
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Main Category to {activeModal}</label>
                  <select value={selectedMainId || ""} onChange={e => setSelectedMainId(Number(e.target.value))} required
                    className="w-full p-3.5 rounded-2xl border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-300 outline-none">
                    <option value="">Select Main Category…</option>
                    {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {(activeModal === 'add' || activeModal === 'update') && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category Name</label>
                    <input placeholder="e.g. Strollers" value={categoryName} onChange={e => setCategoryName(e.target.value)} required
                      className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-300 outline-none transition-all" />
                  </div>
                  <IKContext publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY} urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL} authenticator={authenticator}>
                    <label className="group border-2 border-dashed border-blue-200 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                      {uploading
                        ? <Loader2 className="animate-spin text-blue-500" />
                        : imageUrl
                          ? <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-2xl shadow-sm" />
                          : <><Upload className="text-blue-300 group-hover:text-blue-500 transition-colors" /><span className="text-xs font-bold text-slate-400">Upload Image</span></>}
                      <IKUpload fileName="category.png" ref={uploadInputRef}
                        onError={() => setUploading(false)}
                        onSuccess={(res: ImageKitUploadResponse) => { setImageUrl(res.url); setUploading(false); }}
                        onUploadStart={() => setUploading(true)}
                        style={{ display: 'none' }} />
                    </label>
                  </IKContext>
                </>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-bold">{error}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isCreating || isUpdating || isDeleting || uploading}
                  className={`flex-1 py-3.5 rounded-2xl text-white font-black transition-all shadow-lg disabled:opacity-50 active:scale-95 ${activeModal === 'remove' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {isCreating || isUpdating || isDeleting || uploading
                    ? <Loader2 className="animate-spin mx-auto" />
                    : activeModal === 'add' ? 'Create' : activeModal === 'update' ? 'Save Changes' : 'Delete'}
                </button>
                <button type="button" onClick={closeModal} className="px-6 py-3.5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">
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
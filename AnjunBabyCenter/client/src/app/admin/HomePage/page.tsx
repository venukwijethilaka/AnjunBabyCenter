'use client';

import { useState, useRef } from 'react';
import {
  Plus, Edit2, Trash2, Image as ImageIcon, Upload,
  CheckCircle2, XCircle, Tag, Search, Calendar
} from 'lucide-react';
import ImageKit from 'imagekit-javascript';
import {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useGetProductsQuery,
  useGetAllOffersAdminQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  Banner,
  PromotionalOffer,
  Product
} from '@/state/api';

export default function AdminDisplayManagementPage() {
  const [activeTab, setActiveTab] = useState<'BANNERS' | 'OFFERS'>('BANNERS');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- BANNER STATE ---
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [boysImageUrl, setBoysImageUrl] = useState('');
  const [girlsImageUrl, setGirlsImageUrl] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [isUploadingBoys, setIsUploadingBoys] = useState(false);
  const [isUploadingGirls, setIsUploadingGirls] = useState(false);

  const boysFileInputRef = useRef<HTMLInputElement>(null);
  const girlsFileInputRef = useRef<HTMLInputElement>(null);

  // --- OFFER STATE ---
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<PromotionalOffer | null>(null);
  const [offerSearchTerm, setOfferSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerEndDate, setOfferEndDate] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  // --- API HOOKS ---
  const { data: banners = [], isLoading: bannersLoading, refetch: refetchBanners } = useGetAllBannersQuery();
  const { data: products = [] } = useGetProductsQuery();
  const { data: offers = [], refetch: refetchOffers } = useGetAllOffersAdminQuery();

  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const [createOffer] = useCreateOfferMutation();
  const [updateOffer] = useUpdateOfferMutation();
  const [deleteOffer] = useDeleteOfferMutation();

  // --- HELPERS ---
  const showNotif = (msg: string, type: 'success' | 'error') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- BANNER LOGIC ---
  const handleBannerUpload = async (file: File, type: 'boys' | 'girls') => {
    try {
      type === 'boys' ? setIsUploadingBoys(true) : setIsUploadingGirls(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/banners/imagekit/auth`);

      if (!res.ok) throw new Error('Could not authenticate with ImageKit backend. Check your server.');

      const ikAuth = await res.json();

      const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL || '',
      });

      const response = await imagekit.upload({
        file,
        fileName: `banner-${type}-${Date.now()}`,
        folder: '/banners',
        token: ikAuth.token,
        signature: ikAuth.signature,
        expire: ikAuth.expire,
      });

      type === 'boys' ? setBoysImageUrl(response.url) : setGirlsImageUrl(response.url);
      showNotif(`${type === 'boys' ? 'Boys' : 'Girls'} image uploaded!`, 'success');
    } catch (error: any) {
      console.error("Upload Error Details:", error);
      showNotif(`Upload failed: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      type === 'boys' ? setIsUploadingBoys(false) : setIsUploadingGirls(false);
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boysImageUrl && !girlsImageUrl) return showNotif('Please upload at least one image', 'error');

    try {
      if (editingBanner) {
        // Edit Mode: Update existing
        await updateBanner({
          id: editingBanner.id,
          imageUrl: editingBanner.title === 'BOYS_THEME' ? boysImageUrl : girlsImageUrl,
          link: bannerLink,
        }).unwrap();
      } else {
        // Create Mode: Create one for Boys (if exists) and one for Girls (if exists)
        if (boysImageUrl) {
          await createBanner({ title: 'BOYS_THEME', imageUrl: boysImageUrl, bannerPosition: 'HERO', isSlider: true, link: bannerLink, displayOrder: 0, isActive: true }).unwrap();
        }
        if (girlsImageUrl) {
          await createBanner({ title: 'GIRLS_THEME', imageUrl: girlsImageUrl, bannerPosition: 'HERO', isSlider: true, link: bannerLink, displayOrder: 0, isActive: true }).unwrap();
        }
      }
      showNotif('Banners saved successfully!', 'success');
      refetchBanners();
      closeBannerModal();
    } catch (error) {
      showNotif('Failed to save banners', 'error');
    }
  };

  const closeBannerModal = () => {
    setShowBannerModal(false);
    setEditingBanner(null);
    setBoysImageUrl('');
    setGirlsImageUrl('');
    setBannerLink('');
  };

  const openBannerEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerLink(banner.link || '');
    if (banner.title === 'BOYS_THEME') {
      setBoysImageUrl(banner.imageUrl);
      setGirlsImageUrl('');
    } else {
      setGirlsImageUrl(banner.imageUrl);
      setBoysImageUrl('');
    }
    setShowBannerModal(true);
  };

  // --- OFFER LOGIC ---
  const filteredProducts = (products || []).filter(p => p.name.toLowerCase().includes(offerSearchTerm.toLowerCase()));

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingOffer) return;
    if (!selectedProduct) return showNotif('Please select a product from the list', 'error');
    if (!offerPrice || !offerEndDate) return showNotif('Price and End Date are required', 'error');

    if (Number(offerPrice) >= Number(selectedProduct.price)) {
      return showNotif(`Offer price (Rs. ${offerPrice}) must be lower than the regular price (Rs. ${selectedProduct.price})!`, 'error');
    }

    try {
      setIsSubmittingOffer(true);

      const payload = {
        title: offerTitle || 'Special Flash Offer!',
        productId: selectedProduct.id,
        offerPrice: Number(offerPrice),
        endDate: new Date(offerEndDate).toISOString(),
        isActive: true,
      };

      editingOffer
        ? await updateOffer({ id: editingOffer.id, data: payload }).unwrap()
        : await createOffer(payload).unwrap();

      showNotif('Offer saved successfully!', 'success');
      refetchOffers();
      closeOfferModal();
    } catch (error) {
      showNotif('Failed to save offer', 'error');
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const closeOfferModal = () => {
    setShowOfferModal(false);
    setEditingOffer(null);
    setSelectedProduct(null);
    setOfferSearchTerm('');
    setOfferPrice('');
    setOfferEndDate('');
    setOfferTitle('');
  };

  const openOfferEdit = (offer: PromotionalOffer) => {
    setEditingOffer(offer);
    setSelectedProduct(offer.product || products.find(p => p.id === offer.productId) || null);
    setOfferSearchTerm(offer.product?.name || '');
    setOfferPrice(offer.offerPrice.toString());
    const date = new Date(offer.endDate);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    setOfferEndDate(date.toISOString().slice(0, 16));
    setOfferTitle(offer.title);
    setShowOfferModal(true);
  };

  if (bannersLoading) return <div className="min-h-full flex items-center justify-center text-blue-600 font-bold">Initializing System...</div>;

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      {/* NOTIFICATION */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 border shadow-2xl z-[60] rounded-2xl flex items-center gap-3 font-bold animate-in slide-in-from-top-5 ${notification.type === 'success' ? 'bg-white text-green-600 border-green-100' : 'bg-white text-red-600 border-red-100'
          }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          {notification.message}
        </div>
      )}

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8 flex flex-col">
        {/* HEADER & TABS */}
        <header className="mb-8 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 mb-6">
              <ImageIcon className="w-10 h-10 text-blue-600" />
              Storefront Displays
            </h1>
            <div className="flex gap-2 bg-slate-200 p-1.5 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab('BANNERS')}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'BANNERS' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Hero Banners
              </button>
              <button
                onClick={() => setActiveTab('OFFERS')}
                className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'OFFERS' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Tag className="w-4 h-4" /> Promotional Offers
              </button>
            </div>
          </div>

          <button
            onClick={() => activeTab === 'BANNERS' ? setShowBannerModal(true) : setShowOfferModal(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus /> {activeTab === 'BANNERS' ? 'Upload Banners' : 'Create Offer'}
          </button>
        </header>

        {/* MAIN LISTINGS AREA */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div>

            {/* BANNERS TABLE */}
            {activeTab === 'BANNERS' && (
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Image Preview</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Assigned Theme</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Navigation Link</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {banners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-slate-50/50">
                      <td className="px-8 py-4">
                        <img src={banner.imageUrl} className="w-40 h-16 object-cover rounded-xl border border-slate-100 shadow-sm" />
                      </td>
                      <td className="px-8 py-4">
                        {banner.title === 'BOYS_THEME'
                          ? <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black tracking-widest">BOYS</span>
                          : <span className="bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-xs font-black tracking-widest">GIRLS</span>
                        }
                      </td>
                      <td className="px-8 py-4 font-bold text-slate-500">{banner.link || 'None'}</td>
                      <td className="px-8 py-4 text-right">
                        <button onClick={() => openBannerEdit(banner)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl mr-2 transition-colors"><Edit2 className="w-5 h-5" /></button>
                        <button onClick={async () => { if (confirm('Remove this banner?')) { await deleteBanner(banner.id); refetchBanners(); } }} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                  {banners.length === 0 && (
                    <tr><td colSpan={4} className="p-10 text-center font-bold text-slate-400">No Banners uploaded yet.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {/* OFFERS TABLE */}
            {activeTab === 'OFFERS' && (
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Target Product</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Campaign Title</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Offer Price</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ends On</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-slate-50/50">
                      <td className="px-8 py-4 flex items-center gap-4">
                        <img
                          src={offer.product?.images?.find((img: any) => img.isMain)?.url || offer.product?.images?.[0]?.url || '/placeholder.png'}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-100"
                        />
                        <span className="font-bold text-slate-700 line-clamp-1">{offer.product?.name}</span>
                      </td>
                      <td className="px-8 py-4 font-bold text-slate-600">{offer.title}</td>
                      <td className="px-8 py-4 font-black text-blue-600">Rs. {Number(offer.offerPrice).toLocaleString()}</td>
                      <td className="px-8 py-4 font-bold text-slate-500">{new Date(offer.endDate).toLocaleDateString()}</td>
                      <td className="px-8 py-4 text-right">
                        <button onClick={() => openOfferEdit(offer)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl mr-2 transition-colors"><Edit2 className="w-5 h-5" /></button>
                        <button onClick={async () => { if (confirm('Remove this offer?')) { await deleteOffer(offer.id); refetchOffers(); } }} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                  {offers.length === 0 && (
                    <tr><td colSpan={5} className="p-10 text-center font-bold text-slate-400">No Active Offers.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT BANNER */}
      {/* ========================================================= */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl">
            <div className="p-8 border-b flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-800">{editingBanner ? 'Edit Banner' : 'Upload Banners'}</h2>
                <p className="text-sm font-bold text-slate-400 mt-1">Images contain all text. Just upload and set the link.</p>
              </div>
              <button onClick={closeBannerModal} className="p-2 hover:bg-slate-100 rounded-full"><XCircle /></button>
            </div>

            <form onSubmit={handleBannerSubmit} className="overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="grid lg:grid-cols-2 gap-8">

                {/* BOYS UPLOAD */}
                {(!editingBanner || editingBanner.title === 'BOYS_THEME') && (
                  <div className="space-y-4">
                    <label className="text-sm font-black text-blue-500 uppercase flex items-center gap-2 tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div> Boys Theme Banner
                    </label>
                    <div
                      className="relative aspect-video bg-blue-50/50 rounded-[32px] overflow-hidden border-4 border-dashed border-blue-200 hover:border-blue-400 transition-colors group cursor-pointer"
                      onClick={() => boysFileInputRef.current?.click()}
                    >
                      {boysImageUrl ? (
                        <>
                          <img src={boysImageUrl} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold z-20">Replace Boys Image</div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-blue-400">
                          {isUploadingBoys ? <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-10 h-10" />}
                          <p className="font-bold">Upload Boys Image</p>
                        </div>
                      )}
                    </div>
                    <input ref={boysFileInputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0], 'boys')} />
                  </div>
                )}

                {/* GIRLS UPLOAD */}
                {(!editingBanner || editingBanner.title === 'GIRLS_THEME') && (
                  <div className="space-y-4">
                    <label className="text-sm font-black text-pink-500 uppercase flex items-center gap-2 tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-pink-500"></div> Girls Theme Banner
                    </label>
                    <div
                      className="relative aspect-video bg-pink-50/50 rounded-[32px] overflow-hidden border-4 border-dashed border-pink-200 hover:border-pink-400 transition-colors group cursor-pointer"
                      onClick={() => girlsFileInputRef.current?.click()}
                    >
                      {girlsImageUrl ? (
                        <>
                          <img src={girlsImageUrl} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold z-20">Replace Girls Image</div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-pink-400">
                          {isUploadingGirls ? <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-10 h-10" />}
                          <p className="font-bold">Upload Girls Image</p>
                        </div>
                      )}
                    </div>
                    <input ref={girlsFileInputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0], 'girls')} />
                  </div>
                )}
              </div>

              {/* Shared Settings */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Navigation</label>
                <input
                  type="text"
                  placeholder="Where should this click go? (e.g. /shop/summer)"
                  className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-slate-200 border border-slate-100"
                  value={bannerLink}
                  onChange={e => setBannerLink(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeBannerModal} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black transition-colors hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-[2] py-5 bg-blue-700 text-white rounded-3xl font-black shadow-xl hover:bg-blue-800 transition-colors">Save Banners</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT PROMOTIONAL OFFER */}
      {/* ========================================================= */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl">
            <div className="p-8 border-b flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Tag className="text-blue-500" /> {editingOffer ? 'Edit Offer' : 'Create Special Offer'}</h2>
              <button onClick={closeOfferModal} className="p-2 hover:bg-slate-100 rounded-full"><XCircle /></button>
            </div>

            <form onSubmit={handleOfferSubmit} className="overflow-y-auto p-8 space-y-8 custom-scrollbar">

              {/* Custom Searchable Dropdown */}
              <div className="space-y-3 relative">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Select Target Product</label>

                {selectedProduct ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <img src={selectedProduct.images?.find((img: any) => img.isMain)?.url || selectedProduct.images?.[0]?.url || '/placeholder.png'} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-slate-800">{selectedProduct.name}</p>
                        <p className="text-xs font-bold text-slate-500">Regular: Rs. {Number(selectedProduct.price).toLocaleString()}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setSelectedProduct(null)} className="text-red-500 text-sm font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm">Change</button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search product by name..."
                      className="w-full p-5 pl-14 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100"
                      value={offerSearchTerm}
                      onChange={e => { setOfferSearchTerm(e.target.value); setIsSearchOpen(true); }}
                      onFocus={() => setIsSearchOpen(true)}
                    />
                    {isSearchOpen && offerSearchTerm && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-20 max-h-60 overflow-y-auto">
                        {filteredProducts.map(p => (
                          <div
                            key={p.id}
                            onClick={() => { setSelectedProduct(p); setIsSearchOpen(false); setOfferSearchTerm(''); }}
                            className="p-4 hover:bg-slate-50 flex items-center gap-3 cursor-pointer border-b border-slate-50 last:border-none"
                          >
                            <img src={p.images?.[0]?.url || '/placeholder.png'} className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                              <p className="font-bold text-slate-400 text-xs">Rs. {Number(p.price).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                        {filteredProducts.length === 0 && <div className="p-4 text-center text-sm font-bold text-slate-400">No products found.</div>}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Offer Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">2. Campaign Details</label>

                <input
                  type="text"
                  placeholder="Eye-catching Title (e.g. Flash Deal!)"
                  className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-100 border border-slate-100"
                  value={offerTitle}
                  onChange={e => setOfferTitle(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400">Rs.</div>
                    <input
                      type="number"
                      placeholder="Special Price"
                      className="w-full p-5 pl-14 bg-slate-50 rounded-2xl font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-100 border border-slate-100"
                      value={offerPrice}
                      onChange={e => setOfferPrice(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="datetime-local"
                      className="w-full p-5 pl-14 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 border border-slate-100"
                      value={offerEndDate}
                      onChange={e => setOfferEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeOfferModal}
                  className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOffer}
                  className={`flex-[2] py-5 text-white rounded-3xl font-black shadow-xl transition-all ${isSubmittingOffer ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  {isSubmittingOffer ? 'Launching...' : 'Launch Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
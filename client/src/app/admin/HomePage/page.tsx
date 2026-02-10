'use client';

import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon, Upload, AlertCircle, Monitor, Smartphone } from 'lucide-react';
import ImageKit from 'imagekit-javascript'; // Import SDK
import {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useToggleBannerStatusMutation,
  useGetImageKitAuthQuery,
  Banner,
} from '@/state/api';

const BANNER_POSITIONS = [
  { value: 'HERO', label: 'Hero Banner (Main Slider)', icon: '🎯' },
  { value: 'SECONDARY', label: 'Secondary Banners (Grid)', icon: '📱' },
  { value: 'PROMOTIONAL', label: 'Promotional Banner (Full Width)', icon: '🎁' },
  { value: 'FOOTER', label: 'Footer Banner', icon: '👇' },
];

const IMAGE_RESOLUTION_GUIDE = {
  HERO: { desktop: { display: '1920x600px' }, mobile: { display: '768x400px' } },
  SECONDARY: { desktop: { display: '800x600px' }, mobile: { display: '768x400px' } },
  PROMOTIONAL: { desktop: { display: '1920x400px' }, mobile: { display: '768x300px' } },
  FOOTER: { desktop: { display: '1920x200px' }, mobile: { display: '768x150px' } },
};

export default function AdminBannerManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  const desktopFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    mobileImageUrl: '',
    bannerPosition: 'HERO',
    isSlider: false,
    displayOrder: 0,
    isActive: true,
    link: '',
  });

  const { data: banners = [], isLoading, refetch } = useGetAllBannersQuery();
  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [toggleStatus] = useToggleBannerStatusMutation();
  

  // For fetching a fresh ImageKit auth token before each upload
  const getFreshImageKitAuth = async () => {
    // This is a hacky way to call the RTK Query hook imperatively
    // We use fetch directly to the API endpoint
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL
        ? process.env.NEXT_PUBLIC_API_BASE_URL + '/banners/imagekit/auth'
        : 'http://localhost:8000/banners/imagekit/auth'
    );
    if (!res.ok) throw new Error('Failed to get ImageKit auth');
    return await res.json();
  };

  const handleImageUpload = async (file: File, isMobile: boolean = false) => {
    try {
      if (isMobile) setUploadingMobile(true);
      else setUploadingDesktop(true);

      // Fetch a fresh ImageKit auth token for every upload
      const ikAuth = await getFreshImageKitAuth();
      if (!ikAuth) {
        setNotification({ message: 'Authentication not ready. Try again.', type: 'error' });
        return;
      }

      // Initialize ImageKit Frontend SDK
      const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL || '',
      });

      const response = await imagekit.upload({
        file: file,
        fileName: `banner-${isMobile ? 'mobile' : 'desktop'}-${Date.now()}`,
        folder: '/banners',
        token: ikAuth.token,
        signature: ikAuth.signature,
        expire: ikAuth.expire,
      });

      if (isMobile) {
        setFormData(prev => ({ ...prev, mobileImageUrl: response.url }));
      } else {
        setFormData(prev => ({ ...prev, imageUrl: response.url }));
      }

      setNotification({ message: 'Image uploaded successfully!', type: 'success' });
    } catch (error: any) {
      setNotification({ message: 'Upload failed: ' + error.message, type: 'error' });
    } finally {
      if (isMobile) setUploadingMobile(false);
      else setUploadingDesktop(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      setNotification({ message: 'Desktop image is required', type: 'error' });
      return;
    }

    try {
      if (editingBanner) {
        await updateBanner({ id: editingBanner.id, ...formData }).unwrap();
      } else {
        await createBanner(formData).unwrap();
      }
      setNotification({ message: 'Success!', type: 'success' });
      refetch();
      closeModal();
    } catch (error) {
      setNotification({ message: 'Failed to save banner', type: 'error' });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({ title: '', imageUrl: '', mobileImageUrl: '', bannerPosition: 'HERO', isSlider: false, displayOrder: 0, isActive: true, link: '' });
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData(prev => ({ ...prev, displayOrder: banners.length }));
    setShowModal(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      imageUrl: banner.imageUrl,
      mobileImageUrl: banner.mobileImageUrl || '',
      bannerPosition: banner.bannerPosition,
      isSlider: banner.isSlider,
      displayOrder: banner.displayOrder,
      isActive: banner.isActive,
      link: banner.link || '',
    });
    setShowModal(true);
  };

  const selectedPositionGuide = IMAGE_RESOLUTION_GUIDE[formData.bannerPosition as keyof typeof IMAGE_RESOLUTION_GUIDE];

  if (isLoading) return <div className="flex justify-center items-center min-h-screen text-pink-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 border shadow-lg z-50 rounded-md ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-pink-500" />
            Banner Management
          </h1>
          <button onClick={openCreateModal} className="bg-pink-500 text-white px-6 py-3 rounded-md font-bold hover:bg-rose-500 transition-shadow">
            Add Banner
          </button>
        </div>

        {/* List View */}
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {banners.map((banner) => (
                  <tr key={banner.id}>
                    <td className="px-6 py-4"><img src={banner.imageUrl} className="w-20 h-10 object-cover rounded" /></td>
                    <td className="px-6 py-4 font-medium">{banner.title || 'Untitled'}</td>
                    <td className="px-6 py-4"><span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">{banner.bannerPosition}</span></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(banner)} className="p-2 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={async () => { if(confirm('Delete?')) { await deleteBanner(banner.id); refetch(); } }} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editingBanner ? 'Edit' : 'Create'} Banner</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" /> {/* Fixed flex-shrink-0 */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Monitor className="w-4 h-4 text-blue-600" /> Desktop: {selectedPositionGuide.desktop.display}</div>
                    <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-blue-600" /> Mobile: {selectedPositionGuide.mobile.display}</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2"> <Monitor className="w-4 h-4 text-pink-500" /> Desktop Image *</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {formData.imageUrl ? (
                      <div>
                        <img src={formData.imageUrl} className="w-full h-32 object-cover rounded mb-2" />
                        <button type="button" onClick={() => desktopFileInputRef.current?.click()} className="text-sm text-pink-600">Change</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => desktopFileInputRef.current?.click()} className="w-full py-8 text-gray-400 hover:text-pink-500">
                        {uploadingDesktop ? <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto" /> : <Upload className="mx-auto" />}
                        <p className="text-xs mt-2">Upload Desktop</p>
                      </button>
                    )}
                    <input ref={desktopFileInputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], false)} />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2"> <Smartphone className="w-4 h-4 text-pink-500" /> Mobile Image</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {formData.mobileImageUrl ? (
                      <div>
                        <img src={formData.mobileImageUrl} className="w-full h-32 object-cover rounded mb-2" />
                        <button type="button" onClick={() => mobileFileInputRef.current?.click()} className="text-sm text-pink-600">Change</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => mobileFileInputRef.current?.click()} className="w-full py-8 text-gray-400 hover:text-pink-500">
                        {uploadingMobile ? <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto" /> : <Upload className="mx-auto" />}
                        <p className="text-xs mt-2">Upload Mobile</p>
                      </button>
                    )}
                    <input ref={mobileFileInputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded-md outline-pink-300" placeholder="Banner Title" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Link</label>
                <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full p-3 border rounded-md outline-pink-300" placeholder="/products/..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select value={formData.bannerPosition} onChange={e => setFormData({...formData, bannerPosition: e.target.value})} className="p-3 border rounded-md">
                  {BANNER_POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                <input type="number" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value)})} className="p-3 border rounded-md" placeholder="Order" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 p-3 bg-gray-100 rounded-md">Cancel</button>
                <button type="submit" className="flex-1 p-3 bg-pink-500 text-white rounded-md font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
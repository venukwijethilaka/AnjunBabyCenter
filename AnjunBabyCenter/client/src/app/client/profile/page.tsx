"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from "@/app/redux";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetLoyaltyLevelsQuery
} from '@/state/api';
import { logout } from '@/state/authSlice';
import { Button } from '@/app/client/(components)/ui/Button';
import { Input } from '@/app/client/(components)/ui/Input';
import { Modal } from '@/app/client/(components)/ui/Modal';
import ProtectedRoute from '@/app/client/(components)/ProtectedRoute';
import Navbar from '../(components)/NavBar';

const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user: authUser } = useAppSelector((state) => state.auth);

  const { data: profileData, isLoading: isProfileLoading, error: profileError, refetch } = useGetProfileQuery(
    authUser?.id?.toString() || "",
    { skip: !authUser }
  );

  const { data: loyaltyTiers } = useGetLoyaltyLevelsQuery(undefined, { skip: !authUser });
  const [updateProfileApi, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePasswordApi, { isLoading: isChangingPw }] = useChangePasswordMutation();

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [pwData, setPwData] = useState({ current: "", new: "", confirm: "" });

  // ✅ Removed 'bio' and 'taxId' from initial state
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: "", country: "", city: "", postalCode: "",
    avatar: DEFAULT_AVATAR
  });

  const userPoints = profileData?.loyaltyPoints || 0;

  // Loyalty Logic
  const { currentLevel, nextLevel } = useMemo(() => {
    const defaultState = {
      name: "Member",
      colorFrom: "#9ca3af",
      colorTo: "#6b7280",
      badgeColor: "#f9fafb",
      minPoints: 0
    };

    if (!loyaltyTiers || loyaltyTiers.length === 0) return { currentLevel: defaultState, nextLevel: null };

    const sortedDesc = [...loyaltyTiers].sort((a, b) => b.minPoints - a.minPoints);
    const current = sortedDesc.find(tier => userPoints >= tier.minPoints) || sortedDesc[sortedDesc.length - 1];

    const sortedAsc = [...loyaltyTiers].sort((a, b) => a.minPoints - b.minPoints);
    const next = sortedAsc.find(tier => tier.minPoints > userPoints) || null;

    const colors = current.color?.split('|') || [];

    return {
      currentLevel: {
        ...current,
        colorFrom: colors[0] || defaultState.colorFrom,
        colorTo: colors[1] || defaultState.colorTo
      },
      nextLevel: next
    };
  }, [loyaltyTiers, userPoints]);

  const loyaltyProgress = nextLevel
    ? Math.min(((userPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100, 100)
    : 100;

  // Handlers
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const validatePhone = (phone: string) => /^0\d{9}$/.test(phone);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score += 20;
    if (pass.length > 8) score += 20;
    if (/\d/.test(pass)) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return score;
  };
  const pwStrength = getPasswordStrength(pwData.new);

  useEffect(() => {
    if (profileError && 'status' in profileError) {
      // @ts-ignore
      const status = profileError.status;
      if (status === 404 || status === 401) {
        dispatch(logout());
        router.push("/client/sign-in");
      }
    }
  }, [profileError, dispatch, router]);

  useEffect(() => {
    if (profileData) {
      const nameParts = (profileData.name || "").split(" ");
      // ✅ Removed 'bio' and 'taxId' from population
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        street: profileData.street || "",
        country: profileData.country || "",
        city: profileData.city || "",
        postalCode: profileData.postalCode || "",
        avatar: profileData.avatar ? profileData.avatar : DEFAULT_AVATAR
      });
    }
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showNotification("File is too large. Max 2MB.", 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, avatar: base64String }));
      if (authUser?.id) {
        try {
          await updateProfileApi({
            id: authUser.id.toString(),
            data: { ...formData, avatar: base64String }
          }).unwrap();
          showNotification("Profile photo updated!", 'success');
        } catch (err) {
          showNotification("Failed to upload image.", 'error');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const saveSection = async (section: 'info' | 'address') => {
    if (!authUser?.id) return;
    if (section === 'info') {
      if (formData.phone && !validatePhone(formData.phone)) {
        showNotification("Phone number must start with 0 and have 10 digits.", 'error');
        return;
      }
    }
    try {
      await updateProfileApi({
        id: authUser.id.toString(),
        data: formData
      }).unwrap();
      showNotification(`${section === 'info' ? 'Personal Info' : 'Address'} saved successfully!`, 'success');
      if (section === 'info') setIsEditingInfo(false);
      else setIsEditingAddress(false);
      refetch();
    } catch (err) {
      showNotification("Failed to save changes.", 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwData.new !== pwData.confirm) {
      showNotification("New passwords do not match.", 'error');
      return;
    }
    if (pwData.new.length < 6) {
      showNotification("Password must be at least 6 characters.", 'error');
      return;
    }
    try {
      if (!authUser?.id) return;
      await changePasswordApi({
        userId: authUser.id,
        currentPassword: pwData.current,
        newPassword: pwData.new
      }).unwrap();
      showNotification("Password changed successfully!", 'success');
      setIsChangePasswordOpen(false);
      setPwData({ current: "", new: "", confirm: "" });
      setShowCurrentPw(false);
      setShowNewPw(false);
    } catch (err: any) {
      showNotification(err?.data?.message || "Failed to change password.", 'error');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/client/sign-in");
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/40">
        <div className="w-8 h-8 border-4 border-theme-toggle-bg border-t-theme-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50/40 pt-[110px] pb-32 px-4">

        {notification && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 shadow-xl border flex items-center gap-3 rounded-2xl bg-white animate-in slide-in-from-top-2 duration-300 ${notification.type === 'success' ? 'border-theme-border text-theme-primary bg-theme-toggle-bg' : 'border-rose-200 text-rose-700 bg-rose-50'
            }`}>
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-tight">My Profile</h1>

          {/* Header Card */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <img src={formData.avatar} alt="Profile" className="w-24 h-24 rounded-[24px] object-cover border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <EditIcon className="w-6 h-6 text-white drop-shadow-md" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-extrabold text-gray-900">{formData.firstName} {formData.lastName}</h2>
                <p className="text-gray-500 font-medium mb-3">{formData.email}</p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-100 bg-gray-50 group relative cursor-help">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: `linear-gradient(to right, ${currentLevel.colorFrom}, ${currentLevel.colorTo})` }}></span>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{currentLevel.name} Member</span>

                  <div className="absolute left-0 top-full mt-3 w-64 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-800">My Points</span>
                      <span className="text-sm font-bold" style={{ color: currentLevel.colorFrom }}>{userPoints}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full transition-all duration-500" style={{ width: `${loyaltyProgress}%`, background: `linear-gradient(to right, ${currentLevel.colorFrom}, ${currentLevel.colorTo})` }}></div>
                    </div>
                    {nextLevel ? (
                      <p className="text-xs text-gray-500 font-medium">{nextLevel.minPoints - userPoints} points to {nextLevel.name}</p>
                    ) : (
                      <p className="text-xs text-green-600 font-bold">Max Level Reached! 👑</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            <button onClick={() => fileInputRef.current?.click()} className="px-5 py-3 rounded-2xl border-2 border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all font-bold flex items-center gap-2 shadow-sm active:scale-95">
              Change Photo <EditIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Personal Info */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
              {isEditingInfo ? (
                <Button onClick={() => saveSection('info')} isLoading={isUpdating} className="w-24 py-2 text-sm">Save</Button>
              ) : (
                <button onClick={() => setIsEditingInfo(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-theme-border text-theme-primary bg-theme-toggle-bg hover:opacity-80 transition-all text-sm font-bold active:scale-95">
                  Edit <EditIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <EditableField label="First Name" name="firstName" value={formData.firstName} isEditing={isEditingInfo} onChange={handleChange} />
              <EditableField label="Last Name" name="lastName" value={formData.lastName} isEditing={isEditingInfo} onChange={handleChange} />
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-400">Email Address</p>
                <p className="text-gray-800 font-semibold py-2 bg-gray-50 px-4 rounded-xl border border-transparent">{formData.email}</p>
              </div>
              <EditableField label="Phone" name="phone" value={formData.phone} isEditing={isEditingInfo} onChange={handleChange} />
            </div>
          </div>

          {/* Address Details */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-800">Address Details</h3>
              {isEditingAddress ? (
                <Button onClick={() => saveSection('address')} isLoading={isUpdating} className="w-24 py-2 text-sm">Save</Button>
              ) : (
                <button onClick={() => setIsEditingAddress(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-theme-border text-theme-primary bg-theme-toggle-bg hover:opacity-80 transition-all text-sm font-bold active:scale-95">
                  Edit <EditIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <EditableField label="Street" name="street" value={formData.street} isEditing={isEditingAddress} onChange={handleChange} />
              <EditableField label="Country" name="country" value={formData.country} isEditing={isEditingAddress} onChange={handleChange} />
              <EditableField label="City / State" name="city" value={formData.city} isEditing={isEditingAddress} onChange={handleChange} />
              <EditableField label="Postal Code" name="postalCode" value={formData.postalCode} isEditing={isEditingAddress} onChange={handleChange} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6">
            <button onClick={() => setIsLogoutOpen(true)} className="px-8 py-3.5 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200 active:scale-[0.98]">Log Out</button>
            <button onClick={() => setIsChangePasswordOpen(true)} className="px-6 py-3.5 bg-white border-2 border-theme-border text-theme-primary rounded-2xl font-bold hover:bg-theme-bg transition-all active:scale-[0.98]">Change Password</button>
            <Link href="/client/rules" className="px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-[0.98]">Rules & Regulations</Link>
          </div>
        </div>
      </div>

      <Modal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} title="Change Password">
        <form className="space-y-5" onSubmit={handleChangePassword}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
            <div className="relative">
              <Input type={showCurrentPw ? "text" : "password"} value={pwData.current} onChange={(e) => setPwData({ ...pwData, current: e.target.value })} required />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-4 top-3.5 text-gray-400 hover:text-theme-primary transition-colors">{showCurrentPw ? <EyeIconOff /> : <EyeIcon />}</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
            <div className="relative">
              <Input type={showNewPw ? "text" : "password"} value={pwData.new} onChange={(e) => setPwData({ ...pwData, new: e.target.value })} required />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-3.5 text-gray-400 hover:text-theme-primary transition-colors">{showNewPw ? <EyeIconOff /> : <EyeIcon />}</button>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-theme-primary transition-all duration-300" style={{ width: `${pwStrength}%` }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
            <Input type="password" value={pwData.confirm} onChange={(e) => setPwData({ ...pwData, confirm: e.target.value })} required />
          </div>
          <div className="pt-6 flex gap-3">
            <Button type="button" variant="google" onClick={() => setIsChangePasswordOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isChangingPw}>Update Password</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} title="Log Out">
        <div className="text-center space-y-6 py-2">
          <p className="text-gray-600 font-medium">Are you sure you want to log out of your account?</p>
          <div className="flex gap-4">
            <Button variant="google" onClick={() => setIsLogoutOpen(false)}>Cancel</Button>
            <button onClick={handleLogout} className="w-full py-3.5 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 active:scale-[0.98] transition-all">Yes, Log Out</button>
          </div>
        </div>
      </Modal>

    </ProtectedRoute>
  );
}

// Sub-components
function EditableField({ label, value, name, isEditing, onChange }: {
  label: string; value: string; name: string; isEditing: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-bold text-gray-400">{label}</p>
      {isEditing ? (
        <Input name={name} value={value} onChange={onChange} className="bg-gray-50/50" />
      ) : (
        <p className="text-gray-900 font-semibold text-base py-2.5 px-4 bg-gray-50 border border-transparent rounded-xl">
          {value || "-"}
        </p>
      )}
    </div>
  );
}

function EditIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
}
function EyeIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
}
function EyeIconOff() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;
}
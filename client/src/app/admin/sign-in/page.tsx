"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { useLoginMutation } from '@/state/api'; 
import { setCredentials, logout } from '@/state/authSlice';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react'; 
import { Input } from '@/app/client/(components)/ui/Input'; 
import { Button } from '@/app/client/(components)/ui/Button';

export default function AdminSignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  
  const [loginUser, { isLoading }] = useLoginMutation();

  // Redirect if already logged in (Check string directly)
  useEffect(() => {
    if (user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
        router.push('/admin/HomePage');
    }
  }, [user, router]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Call Login API
      const result = await loginUser({ ...formData, rememberMe: false }).unwrap();
      
      // ✅ 2. DEBUG LOG (Open F12 Console to see this if it fails)
      console.log("LOGIN SUCCESS! User Role from Backend:", result.user.role);

      // ✅ 3. FOOLPROOF CHECK (Comparing strings)
      const userRole = String(result.user.role); // Convert to string just in case
      
      if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
          throw new Error(`Access Denied: Role '${userRole}' is not authorized.`);
      }

      // 4. Clear Old Data
      localStorage.clear();
      sessionStorage.clear();

      // 5. Save New Session
      sessionStorage.setItem("session_active", "true");
      sessionStorage.setItem("token", result.accessToken);
      sessionStorage.setItem("user", JSON.stringify(result.user));
      
      dispatch(setCredentials({ 
        user: result.user, 
        token: result.accessToken, 
        refreshToken: result.refreshToken 
      }));

      // 6. Redirect
      router.push('/admin/HomePage');

    } catch (err: any) {
      console.error("Login Error:", err);
      dispatch(logout()); 
      setError(err?.data?.message || err.message || "Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            
            <div className="bg-slate-800 p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                <p className="text-slate-400 text-sm mt-2">Restricted Access Only</p>
            </div>

            <div className="p-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleAdminLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <Input 
                            type="email" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            required 
                            className="pl-4 border-gray-300 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Input 
                                type="password" 
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                required 
                                className="pl-4 border-gray-300 focus:border-blue-500"
                            />
                            <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3.5" />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        isLoading={isLoading} 
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20"
                    >
                        Secure Login
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => router.push('/client/homePage')}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Back to Public Site
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
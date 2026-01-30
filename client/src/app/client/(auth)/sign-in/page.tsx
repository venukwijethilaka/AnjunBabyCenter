"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { useLoginMutation, useGoogleLoginMutation } from '@/state/api'; 
import { setCredentials } from '@/state/authSlice';
import { Input } from '@/app/client/(components)/ui/Input'; 
import { Button } from '@/app/client/(components)/ui/Button';
import { Checkbox } from '@/app/client/(components)/ui/Checkbox';
import { useGoogleLogin } from '@react-oauth/google';
import { ShieldAlert, Mail } from 'lucide-react'; 

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  
  // Ban State
  const [banDetails, setBanDetails] = useState<{ isBanned: boolean, reason: string, expires: string } | null>(null);

  const [loginUser, { isLoading: isLoggingIn }] = useLoginMutation();
  const [googleLoginApi, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  useEffect(() => {
    if (user) { router.push('/client/homePage'); }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBanDetails(null);

    try {
      const result = await loginUser({ ...formData, rememberMe }).unwrap();
      
      dispatch(setCredentials({ 
        user: result.user, 
        token: result.accessToken, 
        refreshToken: result.refreshToken 
      }));

      if (rememberMe) {
          localStorage.setItem("persist_auth", "true");
          localStorage.setItem("token", result.accessToken);
          localStorage.setItem("user", JSON.stringify(result.user));
          if(result.refreshToken) localStorage.setItem("refreshToken", result.refreshToken);
          sessionStorage.clear();
      } else {
          sessionStorage.setItem("session_active", "true");
          sessionStorage.setItem("token", result.accessToken);
          sessionStorage.setItem("user", JSON.stringify(result.user));
          if(result.refreshToken) sessionStorage.setItem("refreshToken", result.refreshToken);
          localStorage.clear();
      }

      router.push('/client/homePage');
    } catch (err: any) {
        // Handle Ban 403 Error
        if (err?.status === 403 && err?.data?.isBanned) {
            setBanDetails({
                isBanned: true,
                reason: err.data.banReason || "Violation of terms",
                expires: err.data.banExpiresAt
            });
        } else {
            setError(err?.data?.message || "Invalid credentials.");
        }
    }
  };

  const loginToGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${tokenResponse.access_token}` }, }).then(res => res.json());
        const result = await googleLoginApi({ email: userInfo.email, name: userInfo.name, googleId: userInfo.sub }).unwrap();

        localStorage.setItem("persist_auth", "true");
        localStorage.setItem("token", result.accessToken);
        localStorage.setItem("user", JSON.stringify(result.user));
        if(result.refreshToken) localStorage.setItem("refreshToken", result.refreshToken);
        
        dispatch(setCredentials({ user: result.user, token: result.accessToken, refreshToken: result.refreshToken }));
        router.push('/client/homePage');
      } catch (err: any) { 
          if (err?.status === 403 && err?.data?.isBanned) {
            setBanDetails({
                isBanned: true,
                reason: err.data.banReason || "Violation of terms",
                expires: err.data.banExpiresAt
            });
          } else {
            setError("Google Login failed. Please try again."); 
          }
      }
    },
    onError: () => setError("Google Login Failed"),
  });

  return (
    <div className="w-full relative">
        
        {/* ✅ BEAUTIFUL BAN POPUP */}
        {banDetails && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center relative overflow-hidden border border-white/50">
                    
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Access Restricted</h2>
                    <p className="text-gray-500 text-sm mb-6 px-4">
                        Your account has been temporarily suspended due to a violation of our community guidelines.
                    </p>

                    {/* Details Box */}
                    <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100 text-left space-y-3 shadow-inner">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Reason for Suspension</span>
                            <p className="text-gray-800 font-medium text-sm mt-0.5 leading-snug">{banDetails.reason}</p>
                        </div>
                        
                        {banDetails.expires && (
                            <div className="pt-2 border-t border-gray-200">
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Access Restored On</span>
                                <p className="text-gray-800 font-medium text-sm mt-0.5">
                                    {new Date(banDetails.expires).toLocaleDateString(undefined, { 
                                        weekday: 'short', 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                    })}
                                    <span className="text-gray-400 mx-1">•</span>
                                    {new Date(banDetails.expires).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <a 
                        href="mailto:upendrauniversity@gmail.com?subject=Account%20Suspension%20Appeal" 
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        <Mail className="w-4 h-4" />
                        Contact Support
                    </a>

                    {/* Close Link */}
                    <button 
                        onClick={() => setBanDetails(null)} 
                        className="mt-5 text-gray-400 hover:text-gray-600 text-xs font-semibold transition-colors"
                    >
                        CLOSE & GO BACK
                    </button>
                </div>
            </div>
        )}

        {/* --- Main Login Form --- */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-500 font-medium">Welcome back! Enter your details to continue.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl text-center font-bold border border-red-100 animate-in fade-in">
              {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required autoComplete="email" className="h-12" />
            
            <div className="relative">
              <Input type={showPw ? "text" : "password"} placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required autoComplete="current-password" className="h-12" />
              
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-3.5 text-gray-400 hover:text-pink-600 transition-colors">
                {showPw ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> 
              <span className="text-gray-500 font-medium group-hover:text-gray-900">Remember me</span>
            </label>
            <Link href="/client/forgot-password" className="text-pink-600 hover:text-pink-700 font-bold hover:underline">Forgot password?</Link>
          </div>

          <Button type="submit" isLoading={isLoggingIn} className="h-12 text-base shadow-pink-500/20">Sign In</Button>

          <div className="my-6 flex items-center gap-4">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">OR</span>
              <div className="h-px bg-gray-200 flex-1" />
          </div>

          <Button variant="google" type="button" onClick={() => loginToGoogle()} isLoading={isGoogleLoading} className="h-12">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </Button>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/client/sign-up" className="font-bold text-pink-600 hover:text-pink-700">Sign up</Link>
          </div>
        </form>
    </div>
  );
}
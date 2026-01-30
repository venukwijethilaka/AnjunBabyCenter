"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from "@/app/redux";
import { 
    useRegisterMutation, 
    useVerifyOtpMutation, 
    useGoogleLoginMutation,
    useResendOtpMutation 
} from '@/state/api'; 
import { setCredentials } from '@/state/authSlice';
import { Input } from '@/app/client/(components)/ui/Input'; 
import { Button } from '@/app/client/(components)/ui/Button';
import { Checkbox } from '@/app/client/(components)/ui/Checkbox';
import { InputOTP } from '@/app/client/(components)/ui/InputOTP';
import { useGoogleLogin } from '@react-oauth/google';

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [showPw, setShowPw] = useState(false);
  
  // Timer State for Resend Code
  const [countdown, setCountdown] = useState(0); 

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score += 20;
    if (pass.length > 8) score += 20;
    if (/\d/.test(pass)) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return score;
  };
  const pwStrength = getPasswordStrength(formData.password);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [googleLoginApi, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000); 
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwStrength < 40) { showNotification("Password is too weak.", 'error'); return; }
    try {
      await register(formData).unwrap();
      setStep('OTP');
      setCountdown(60); // Start 60s cooldown
      showNotification("Code sent! Check your email.", 'success');
    } catch (err: any) { showNotification(err?.data?.message || "Registration failed.", 'error'); }
  };

  const handleVerify = async (code: string) => {
    try {
      const codeToSend = code || otp; 
      const result = await verifyOtp({ email: formData.email, otp: codeToSend }).unwrap();
      
      // Default to Session Storage for new signups until they explicitly "Remember Me" later
      sessionStorage.setItem("session_active", "true");
      sessionStorage.setItem("token", result.accessToken);
      sessionStorage.setItem("user", JSON.stringify(result.user));
      if(result.refreshToken) sessionStorage.setItem("refreshToken", result.refreshToken);

      dispatch(setCredentials({ user: result.user, token: result.accessToken, refreshToken: result.refreshToken }));
      router.push('/client/homePage');
    } catch (err: any) { showNotification("Invalid Verification Code.", 'error'); }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
        await resendOtp({ email: formData.email }).unwrap();
        setCountdown(60);
        showNotification("New code sent!", 'success');
    } catch (err: any) {
        showNotification(err?.data?.message || "Failed to resend.", 'error');
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
      } catch (err: any) { showNotification("Google Sign-up failed.", 'error'); }
    },
    onError: () => showNotification("Google Sign-up Failed", 'error'),
  });

  return (
    <div className="w-full relative">
        
        {notification && (
            <div className={`absolute -top-20 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 w-max ${
                notification.type === 'success' ? 'bg-white text-green-700 border border-green-100' : 'bg-white text-red-600 border border-red-100'
            }`}>
                <span className="font-medium text-sm">{notification.message}</span>
            </div>
        )}

        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 font-medium">
            {step === 'DETAILS' ? "Join us to unlock exclusive rewards." : `Enter the code sent to ${formData.email}`}
            </p>
        </div>

        {step === 'DETAILS' ? (
            <form className="space-y-5" onSubmit={handleRegister}>
            <Input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required autoComplete="name" className="h-12" />
            <Input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required autoComplete="email" className="h-12" />
            
            <div className="space-y-2">
                <div className="relative">
                    <Input type={showPw ? "text" : "password"} placeholder="Create Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required autoComplete="new-password" className="h-12" />
                    
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-3.5 text-gray-400 hover:text-pink-600 transition-colors">
                        {showPw ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                    </button>
                </div>
                {formData.password && (
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300" style={{ width: `${pwStrength}%` }}></div>
                    </div>
                )}
            </div>
            
            <div className="flex items-start gap-3 text-sm mt-2">
                <div className="pt-0.5">
                  <Checkbox 
                    id="terms" 
                    required 
                    className="accent-pink-600 text-pink-600 focus:ring-pink-500" 
                  />
                </div>
                <label htmlFor="terms" className="text-gray-500 select-none leading-relaxed cursor-pointer font-medium">
                    I agree with the <Link href="/client/rules" className="text-pink-600 hover:text-pink-700 font-bold hover:underline">Terms & Regulations</Link>
                </label>
            </div>

            <Button type="submit" isLoading={isRegistering} className="h-12 text-base shadow-pink-500/20">Sign Up & Get Code</Button>
            
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
                Sign up with Google
            </Button>

            <div className="mt-8 text-center text-sm text-gray-500">
                Already have an account? <Link href="/client/sign-in" className="font-bold text-pink-600 hover:text-pink-700">Sign in</Link>
            </div>
            </form>
        ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-center">
                <InputOTP length={6} onComplete={(code) => { setOtp(code); }} />
            </div>
            
            <div className="space-y-4">
                <Button type="button" isLoading={isVerifying} onClick={() => handleVerify(otp)} disabled={otp.length !== 6} className="h-12 text-base shadow-pink-500/20">
                    Verify & Create Account
                </Button>

                <div className="text-center text-sm">
                    <span className="text-gray-500">Didn't receive code? </span>
                    <button 
                        type="button" 
                        onClick={handleResend} 
                        disabled={countdown > 0 || isResending}
                        className={`font-bold transition-colors ${
                            countdown > 0 ? "text-gray-300 cursor-not-allowed" : "text-pink-600 hover:text-pink-700 hover:underline"
                        }`}
                    >
                        {countdown > 0 ? `Resend in (${countdown}s)` : "Resend Code"}
                    </button>
                </div>
            </div>

            <button type="button" onClick={() => setStep('DETAILS')} className="w-full text-center text-sm text-gray-500 hover:text-gray-900 py-2 font-bold">Go back</button>
            </div>
        )}
    </div>
  );
}
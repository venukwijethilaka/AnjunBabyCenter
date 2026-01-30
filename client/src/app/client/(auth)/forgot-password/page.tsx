"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForgotPasswordMutation, useResetPasswordMutation } from '@/state/api';
import { Input } from '@/app/client/(components)/ui/Input';
import { Button } from '@/app/client/(components)/ui/Button';
import { InputOTP } from '@/app/client/(components)/ui/InputOTP';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Email, Step 2: OTP + New Pass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  
  // ✅ TIMER STATE
  const [countdown, setCountdown] = useState(0); 

  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [sendCodeApi, { isLoading: isSending }] = useForgotPasswordMutation();
  const [resetPasswordApi, { isLoading: isResetting }] = useResetPasswordMutation();

  // ✅ TIMER EFFECT
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

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score += 20;
    if (pass.length > 8) score += 20;
    if (/\d/.test(pass)) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return score;
  };
  const pwStrength = getPasswordStrength(newPassword);

  // --- Step 1: Send Code ---
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendCodeApi({ email }).unwrap();
      setStep(2); 
      setCountdown(60); // ✅ Start 60s cooldown
      showNotification("Code sent! Check your email.", 'success');
    } catch (err: any) {
      showNotification(err?.data?.message || "Failed to send code.", 'error');
    }
  };

  // ✅ NEW: Resend Logic (Reuses handleSendCode logic essentially)
  const handleResend = async () => {
    if (countdown > 0) return;
    try {
        await sendCodeApi({ email }).unwrap();
        setCountdown(60);
        showNotification("New code sent!", 'success');
    } catch (err: any) {
        showNotification(err?.data?.message || "Failed to resend.", 'error');
    }
  };

  // --- Step 2: Reset Password ---
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
        showNotification("Please enter the complete 6-digit code.", 'error');
        return;
    }

    try {
      await resetPasswordApi({ email, otp, newPassword }).unwrap();
      showNotification("Password Reset Successful! Redirecting...", 'success');
      setTimeout(() => router.push("/client/sign-in"), 2000);
    } catch (err: any) {
      showNotification(err?.data?.message || "Failed to reset password.", 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            notification.type === 'success' ? 'bg-white text-green-700 border border-green-100' : 'bg-white text-red-600 border border-red-100'
        }`}>
            {notification.type === 'success' ? (
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-gray-500">
            {step === 1 
              ? "Enter your email to receive a reset code." 
              : "Enter the code sent to your email and your new password."}
          </p>
        </div>

        {step === 1 ? (
          /* STEP 1 FORM */
          <form onSubmit={handleSendCode} className="space-y-5">
            <Input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Button type="submit" isLoading={isSending}>Send Reset Code</Button>
            <button 
              type="button"
              onClick={() => router.push("/client/sign-in")}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-900 mt-4 font-medium"
            >
              Back to Login
            </button>
          </form>
        ) : (
          /* STEP 2 FORM */
          <form onSubmit={handleReset} className="space-y-6">
             <div className="p-3 bg-pink-50 text-pink-700 text-sm rounded-xl text-center border border-pink-100 font-medium">
                Code sent to: <strong>{email}</strong>
            </div>
            
            <div className="flex justify-center">
                <InputOTP 
                    length={6} 
                    onComplete={(code) => setOtp(code)} 
                />
            </div>
            
            {/* New Password Field */}
            <div className="space-y-2">
                <div className="relative">
                    <Input 
                        type={showPw ? "text" : "password"} 
                        placeholder="New Password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        minLength={6}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-gray-400 hover:text-pink-600 transition-colors">
                        {showPw ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                    </button>
                </div>
                {/* Gradient Strength Bar */}
                {newPassword && (
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-1">
                        <div 
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300" 
                            style={{ width: `${pwStrength}%` }}
                        ></div>
                    </div>
                )}
            </div>
            
            <div className="space-y-4">
                <Button type="submit" isLoading={isResetting}>Change Password</Button>

                {/* ✅ ADDED: Resend Link with Timer */}
                <div className="text-center text-sm">
                    <span className="text-gray-500">Didn't receive code? </span>
                    <button 
                        type="button" 
                        onClick={handleResend} 
                        disabled={countdown > 0 || isSending}
                        className={`font-bold transition-colors ${
                            countdown > 0 ? "text-gray-300 cursor-not-allowed" : "text-pink-600 hover:text-pink-700 hover:underline"
                        }`}
                    >
                        {countdown > 0 ? `Resend in (${countdown}s)` : "Resend Code"}
                    </button>
                </div>
            </div>
            
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="w-full text-center text-sm text-gray-500 hover:text-gray-900 font-medium"
            >
              Wrong Email? Go Back
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
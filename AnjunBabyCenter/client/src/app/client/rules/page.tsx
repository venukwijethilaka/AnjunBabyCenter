"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function RulesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50/40 p-4 md:p-8 flex justify-center items-start">
      
      {/* Main Card Container */}
      <div className="max-w-3xl w-full mt-10 bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* --- Header Banner --- */}
        <div className="bg-theme-primary p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-8 translate-y-8"></div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 relative z-10 tracking-tight">Terms & Regulations</h1>
          <p className="text-white/90 text-sm md:text-base font-medium relative z-10">
            Please read our policies regarding your account and rewards.
          </p>
        </div>

        {/* --- Scrollable Content Area --- */}
        <div className="p-6 md:p-10 space-y-10 text-gray-600 leading-relaxed">
          
          {/* Section 1: General */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-theme-toggle-bg text-theme-primary flex items-center justify-center text-sm font-bold border border-theme-border">1</span>
              General Terms
            </h2>
            <p className="text-sm md:text-base font-medium">
              Welcome to our platform. By creating an account and using our services, you agree to comply with and be bound by the following terms and conditions. 
              We reserve the right to update these regulations at any time without prior notice.
            </p>
          </section>

          {/* Section 2: Loyalty Program (Highlighted) */}
          <section className="bg-theme-bg/50 p-6 md:p-8 rounded-[28px] border border-theme-border shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white text-theme-primary flex items-center justify-center text-sm font-bold shadow-sm border border-theme-border">2</span>
              Loyalty Program & Rewards
            </h2>
            <div className="space-y-5 text-sm md:text-base font-medium">
              <p>
                Our loyalty program is designed to reward our most valued customers. Points are accumulated automatically with every purchase.
              </p>
              
              <div className="bg-white p-5 rounded-2xl border border-theme-border flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-theme-toggle-bg text-theme-primary rounded-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-bold mb-0.5">Earning Rule</p>
                  <p className="text-gray-500 text-sm">For every <span className="text-theme-primary font-bold">1,000 LKR</span> spent, you earn <span className="text-theme-primary font-bold">1 Point</span>.</p>
                </div>
              </div>

              <ul className="list-disc list-inside space-y-2 pt-2 marker:text-theme-light">
                <li><strong className="text-gray-800">Tiers:</strong> Your loyalty tier (Silver, Gold, Platinum) is updated based on your total points earned.</li>
                <li><strong className="text-gray-800">Admin Rights:</strong> Point values and tier requirements are subject to change by the platform administration.</li>
                <li><strong className="text-gray-800">Expiration:</strong> Points may expire after 12 months of account inactivity.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: User Conduct */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-theme-toggle-bg text-theme-primary flex items-center justify-center text-sm font-bold border border-theme-border">3</span>
              User Conduct
            </h2>
            <p className="text-sm md:text-base font-medium">
              You agree not to engage in any activity that disrupts or interferes with our services, including but not limited to fraudulent transactions, 
              creating fake accounts to abuse the loyalty system, or attempting to breach our security measures.
            </p>
          </section>

          {/* Section 4: Privacy */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-theme-toggle-bg text-theme-primary flex items-center justify-center text-sm font-bold border border-theme-border">4</span>
              Privacy Policy
            </h2>
            <p className="text-sm md:text-base font-medium">
              We respect your privacy. Your personal data is used solely for processing orders and managing your account. 
              We do not sell your data to third parties. For a full copy of our data handling practices, please contact support.
            </p>
          </section>

        </div>

        {/* --- Footer Action --- */}
        <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/80 flex justify-center">
          <button 
            onClick={() => router.back()} 
            className="px-10 py-4 rounded-2xl font-bold bg-white border-2 border-gray-200 text-gray-600 hover:border-theme-primary hover:text-theme-primary hover:bg-theme-bg transition-all shadow-sm active:scale-[0.98]"
          >
            Accept & Go Back
          </button>
        </div>

      </div>
    </div>
  );
}
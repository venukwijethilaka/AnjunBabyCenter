'use client';

import { useState, useEffect } from 'react';
import { initializeTheme, setTheme } from '@/state/globalSlice';
import { useAppDispatch, useAppSelector } from '@/app/redux';

export default function ThemeWelcome() {
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);

    // --- REDUX THEME STATE ---
    const theme = useAppSelector((state) => state.global.theme);
    const themeInitialized = useAppSelector((state) => state.global.themeInitialized);

    // --- APPLY THEME TO ENTIRE APP + PERSIST TO LOCALSTORAGE ---
    useEffect(() => {
        if (!themeInitialized) return;

        if (theme === 'boy') {
            document.body.classList.add('theme-boy');
        } else {
            document.body.classList.remove('theme-boy');
        }

        localStorage.setItem('anjun_theme', theme);
    }, [theme, themeInitialized]);

    useEffect(() => {
        const saved = localStorage.getItem('anjun_theme');
        if (!saved) {
            // First visit — show welcome, default to girl theme and mark initialized
            dispatch(initializeTheme('girl'));
            setVisible(true);
        } else {
            // Returning visit — restore saved theme and mark initialized
            dispatch(initializeTheme(saved as 'girl' | 'boy'));
        }
    }, [dispatch]);

    const handleSelect = (choice: 'girl' | 'boy') => {
        localStorage.setItem('anjun_theme', choice);
        dispatch(setTheme(choice));
        setLeaving(true);
        setTimeout(() => setVisible(false), 500);
    };

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`}
            style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #eff6ff 100%)' }}
        >
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"
                style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 translate-x-1/2 translate-y-1/2"
                style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

            <div className="relative text-center px-6">
                {/* Header */}
                <div className="mb-2">
                    <img src="/Glogo.png" alt="Anjun Baby Center" className="h-16 mx-auto mb-6 object-contain" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2 leading-tight">
                    Welcome to<br />Anjun Baby Center! 🎉
                </h1>
                <p className="text-gray-500 font-semibold text-base sm:text-lg mb-10">
                    Tell us about your baby so we can personalise<br className="hidden sm:block" /> your shopping experience.
                </p>

                {/* Selection Cards */}
                <div className="flex gap-4 sm:gap-8 justify-center">

                    {/* Boy Card */}
                    <button
                        onClick={() => handleSelect('boy')}
                        className="group relative flex flex-col items-center gap-4 bg-white rounded-[32px] px-8 py-8 sm:px-12 sm:py-10 shadow-lg hover:shadow-2xl border-4 border-transparent hover:border-blue-400 transition-all duration-300 hover:-translate-y-2 active:scale-95 cursor-pointer"
                    >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-blue-50 flex items-center justify-center text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-300">
                            👦
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">It's a Boy!</p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">Boys collection & blue theme</p>
                        </div>
                        <div className="absolute inset-0 rounded-[32px] bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                    </button>

                    {/* Divider */}
                    <div className="flex items-center">
                        <div className="w-px h-32 bg-gray-200" />
                        <span className="absolute bg-white px-2 text-gray-400 font-bold text-sm" style={{ transform: 'translateX(-50%)' }}>or</span>
                    </div>

                    {/* Girl Card */}
                    <button
                        onClick={() => handleSelect('girl')}
                        className="group relative flex flex-col items-center gap-4 bg-white rounded-[32px] px-8 py-8 sm:px-12 sm:py-10 shadow-lg hover:shadow-2xl border-4 border-transparent hover:border-pink-400 transition-all duration-300 hover:-translate-y-2 active:scale-95 cursor-pointer"
                    >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-pink-50 flex items-center justify-center text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-300">
                            👧
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-black text-gray-800 group-hover:text-pink-500 transition-colors">It's a Girl!</p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">Girls collection & pink theme</p>
                        </div>
                        <div className="absolute inset-0 rounded-[32px] bg-pink-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                    </button>

                </div>

                <p className="mt-8 text-xs text-gray-400 font-medium">
                    You can always change this using the toggle in the navigation bar
                </p>
            </div>
        </div>
    );
}

// components/DarkModeToggle.tsx
'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function DarkModeToggle() {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <div
            className="relative h-10 w-10 border-[2px] border-black 
        dark:border-white rounded-xl flex items-center justify-center 
        transition-colors ease-in-out"
        >
            <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-full h-full transition-transform duration-300 ease-in-out"
            >
                {isDarkMode ? (
                    <SunIcon className="w-6 h-6 transition-all ease-in-out transform rotate-0" />
                ) : (
                    <MoonIcon className="w-6 h-6 transition-all ease-in-out transform rotate-0" />
                )}
            </button>
        </div>
    );
}

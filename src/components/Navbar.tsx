import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0B0C0E] border-b border-[#1E1F24] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1052FD"/>
              <path d="M9 8H13.5L19.5 16L13.5 24H9L15 16L9 8Z" fill="white"/>
              <path d="M17 8H21.5L23 10.5L19.5 16L23 21.5L21.5 24H17L20.5 16L17 8Z" fill="white" fillOpacity="0.55"/>
            </svg>
            <span className="text-[20px] font-bold text-white tracking-tight">
              Koin<span className="text-[#1052FD]">X</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            <a href="https://koinx.com/prices" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Prices
            </a>
            <a href="https://koinx.com/blog" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Blog
            </a>
            <a href="https://koinx.com" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              More
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://app.koinx.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Sign In
            </a>
            <a
              href="https://app.koinx.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1052FD] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Get Started
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#1E1F24] py-3 space-y-1">
            <a href="https://koinx.com/prices" target="_blank" rel="noopener noreferrer"
              className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
              Prices
            </a>
            <a href="https://koinx.com/blog" target="_blank" rel="noopener noreferrer"
              className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
              Blog
            </a>
            <a href="https://koinx.com" target="_blank" rel="noopener noreferrer"
              className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
              More
            </a>
            <div className="pt-2 flex gap-2">
              <a href="https://app.koinx.com/login" target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center text-sm font-medium text-gray-300 border border-[#2a2b30] px-3 py-2 rounded-lg hover:bg-white/5">
                Sign In
              </a>
              <a href="https://app.koinx.com/signup" target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center bg-[#1052FD] text-white text-sm font-semibold px-3 py-2 rounded-lg hover:bg-blue-600">
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

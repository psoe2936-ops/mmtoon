import React, { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <div className="flex items-center">
          <img src="./public/image.jpg-removebg-preview.png" className="w-[5.6rem] cursor-pointer" alt="Logo" />
          <span className="text-lg font-bold tracking-wide text-white ml-[-14px]">
            InkVerse
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 text-sm text-slate-300">
          <div className="relative hover:text-white transition duration-300 cursor-pointer">
            ပင်မစာမျက်နှာ
          </div>
          <div className="relative hover:text-white transition duration-300 cursor-pointer">
            စာအုပ်များ
          </div>
          <div className="relative hover:text-white transition duration-300 cursor-pointer">
            ရှာဖွေရန်
          </div>
        </div>

        {/* Right Side - Desktop Login */}
        <div className="hidden md:flex items-center gap-4">
          <button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-black shadow-md hover:opacity-90 transition cursor-pointer">
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <div className="flex flex-col gap-4 px-6 pb-6 text-slate-300">
          <div className="hover:text-white transition duration-300 cursor-pointer py-2">
            ပင်မစာမျက်နှာ
          </div>
          <div className="hover:text-white transition duration-300 cursor-pointer py-2">
            စာအုပ်များ
          </div>
          <div className="hover:text-white transition duration-300 cursor-pointer py-2">
            ရှာဖွေရန်
          </div>
          <button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-black shadow-md hover:opacity-90 transition cursor-pointer w-full">
            Login
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
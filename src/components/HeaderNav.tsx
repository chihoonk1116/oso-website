import React from 'react'
import { motion } from 'framer-motion'

interface HeaderNavProps {
  title?: string
  onHome?: () => void
  onPortfolio?: () => void
  onVideos?: () => void
  onAbout?: () => void
  onInquire?: () => void
}

const HeaderNav: React.FC<HeaderNavProps> = ({ title = 'OSO FILM', onHome, onPortfolio, onVideos, onAbout, onInquire }) => {
  return (
    <motion.header 
      className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo / Title */}
          <div className="text-lg font-semibold tracking-wide cursor-pointer" onClick={onHome}>
            {title}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={onPortfolio} className="text-sm tracking-wide hover:text-gray-600 transition-colors duration-300">PORTFOLIO</button>
            <button onClick={onVideos} className="text-sm tracking-wide hover:text-gray-600 transition-colors duration-300">VIDEOS</button>
            <button onClick={onAbout} className="text-sm tracking-wide hover:text-gray-600 transition-colors duration-300">ABOUT US</button>
            <button onClick={onInquire} className="text-sm tracking-wide hover:text-gray-600 transition-colors duration-300">INQUIRE</button>
          </nav>

          {/* Mobile Menu Button (no-op for now) */}
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  )
}

export default HeaderNav

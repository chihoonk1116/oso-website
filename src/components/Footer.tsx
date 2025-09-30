import React from 'react'

interface FooterProps {
  copyright?: string
}

const Footer: React.FC<FooterProps> = ({ copyright = 'ⓒ OSO FILM' }) => {
  return (
    <footer className="border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm text-gray-500 tracking-wide">{copyright}</p>
      </div>
    </footer>
  )
}

export default Footer

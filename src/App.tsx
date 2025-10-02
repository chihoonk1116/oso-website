import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import AdminPanel from './components/AdminPanel'
import AdminModal from './components/AdminModal'
import HeroSection from './components/HeroSection'
import PortfolioTemplate from './components/PortfolioTemplate'

// Replace with your actual Google OAuth Client ID from Google Cloud Console
const CLIENT_ID = 'your-google-client-id.apps.googleusercontent.com'

declare global {
  interface Window {
    google?: any
  }
}

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch (e) {
    return null
  }
}

// Main App component that handles routing
function AppContent() {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)

  useEffect(() => {
    const admin = localStorage.getItem('isAdmin')
    if (admin === 'true') setIsAdmin(true)
  }, [])

  // Load Google Identity Services script
  useEffect(() => {
    if (window.google) {
      setGoogleLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => setGoogleLoaded(true)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!googleLoaded) return
    if (!window.google) return

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response: any) => {
        const payload = decodeJwtPayload(response.credential)
        if (payload && payload.email) {
          setIsAdmin(true)
          localStorage.setItem('isAdmin', 'true')
          localStorage.setItem('adminEmail', payload.email)
        }
      },
    })

    const btn = document.getElementById('gsi-button')
    if (btn) {
      window.google.accounts.id.renderButton(btn, {
        theme: 'outline',
        size: 'medium',
      })
    }
  }, [googleLoaded])

  const signOut = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    setIsAdmin(false)
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminEmail')
  }

  const signIn = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt()
    } else {
      console.warn('Google Identity Services not loaded yet')
    }
  }

  const handlePortfolioClick = () => {
    navigate('/portfolio')
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <>
      {/* Admin controls overlay - Positioned below nav header */}
      <div className="fixed top-20 right-4 z-40 bg-black/90 p-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <span className="text-green-400 font-bold text-sm">CMS</span>
          <button 
            onClick={() => setEditorOpen(true)} 
            className="bg-white text-black px-3 py-1 rounded text-sm hover:bg-gray-200 transition font-medium"
          >
            Portfolio CMS
          </button>
          {isAdmin && (
            <button onClick={signOut} className="text-white hover:text-gray-300 transition text-sm">Logout</button>
          )}
        </div>
      </div>

      {/* Optional Google login for future use */}
      {!isAdmin && (
        <div className="fixed top-20 left-4 z-40">
          <button 
            onClick={signIn} 
            className="bg-gray-600/90 text-white px-3 py-2 rounded hover:bg-gray-700 transition text-sm"
          >
            Optional: Google Login
          </button>
        </div>
      )}

      <Routes>
        <Route 
          path="/" 
          element={
            <div className="min-h-screen bg-black text-white">
              <HeroSection onPortfolioClick={handlePortfolioClick} />
            </div>
          } 
        />
        <Route 
          path="/portfolio" 
          element={
            <PortfolioTemplate 
              onBack={handleBackToHome}
              isAdmin={true}
            />
          } 
        />
      </Routes>

      <AdminModal open={editorOpen} onClose={() => setEditorOpen(false)} />
    </>
  )
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppContent />
    </Router>
  )
}

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeaderNav from './HeaderNav'
import Footer from './Footer'

type GridLayout = 'individual' // Individual image grid control

interface ImageGridItem {
  url: string
  colSpan: number // 1-4 (width)
  rowSpan: number // 1-3 (height)
}

interface Portfolio {
  id: string
  title: string
  description: string
  images: string[]
  gridItems?: ImageGridItem[] // new grid-based image data
  client: string
  year: string
  category: string
  createdAt: string
  updatedAt: string
  gridLayout?: GridLayout
}

interface PortfolioTemplateProps {
  portfolioId?: string
  portfolio?: Portfolio
  onBack?: () => void
  isAdmin?: boolean
}

const PortfolioTemplate: React.FC<PortfolioTemplateProps> = ({ 
  portfolioId = 'cityhall',
  portfolio: initialPortfolio,
  onBack,
  isAdmin = false
}) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(initialPortfolio || null)
  const [isLoading, setIsLoading] = useState(!initialPortfolio)
  const [isAddingPhoto, setIsAddingPhoto] = useState(false)
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [currentGrid, setCurrentGrid] = useState<GridLayout>('individual')
  const [isGridEditing, setIsGridEditing] = useState(false)

  // Load portfolio data if not provided
  useEffect(() => {
    if (!initialPortfolio) {
      loadPortfolio()
    }
  }, [portfolioId, initialPortfolio])

  const loadPortfolio = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/portfolio/${portfolioId}`)
      const result = await response.json()
      
      if (result.success) {
        setPortfolio(result.data)
      } else {
        // Use mock data for development
        const mockImages = [
          'https://images.unsplash.com/photo-1555636222-cae831e670b3?q=80&w=2077&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2096&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?q=80&w=2071&auto=format&fit=crop'
        ]
        
        setPortfolio({
          id: portfolioId,
          title: 'City Hall',
          description: 'An exploration of urban architecture and civic spaces, capturing the grandeur and intimate details of this iconic building.',
          images: mockImages,
          gridItems: mockImages.map(url => ({
            url,
            colSpan: 1,
            rowSpan: 1
          })),
          client: 'City Planning Department',
          year: '2024',
          category: 'Architectural Photography',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error('Error loading portfolio:', err)
      setError('Failed to load portfolio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPhoto = async () => {
    if (!newPhotoUrl.trim() || !portfolio) return
    
    setIsLoading(true)
    try {
      const updatedPortfolio = {
        ...portfolio,
        images: [...portfolio.images, newPhotoUrl.trim()]
      }

      // Always add to gridItems for individual control
      if (portfolio.gridItems) {
        updatedPortfolio.gridItems = [
          ...portfolio.gridItems,
          {
            url: newPhotoUrl.trim(),
            colSpan: 1,
            rowSpan: 1
          }
        ]
      } else {
        // Initialize gridItems if not exists
        updatedPortfolio.gridItems = [
          ...portfolio.images.map(url => ({ url, colSpan: 1, rowSpan: 1 })),
          {
            url: newPhotoUrl.trim(),
            colSpan: 1,
            rowSpan: 1
          }
        ]
      }
      
      const response = await fetch(`http://localhost:5000/api/portfolio/${portfolio.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPortfolio)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setPortfolio(updatedPortfolio)
        setNewPhotoUrl('')
        setIsAddingPhoto(false)
      } else {
        setError('Failed to add photo')
      }
    } catch (err) {
      console.error('Error adding photo:', err)
      setError('Network error adding photo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemovePhoto = async (index: number) => {
    if (!portfolio || !confirm('Are you sure you want to remove this photo?')) return
    
    setIsLoading(true)
    try {
      const updatedPortfolio = {
        ...portfolio,
        images: portfolio.images.filter((_, i) => i !== index)
      }

      // Always remove from gridItems
      if (portfolio.gridItems) {
        updatedPortfolio.gridItems = portfolio.gridItems.filter((_, i) => i !== index)
      }
      
      const response = await fetch(`http://localhost:5000/api/portfolio/${portfolio.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPortfolio)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setPortfolio(updatedPortfolio)
      } else {
        setError('Failed to remove photo')
      }
    } catch (err) {
      console.error('Error removing photo:', err)
      setError('Network error removing photo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGridChange = async (newGridLayout: GridLayout) => {
    if (!portfolio) return
    
    setCurrentGrid(newGridLayout)
    
    // Initialize gridItems for individual control if not exists
    if (!portfolio.gridItems) {
      const initialGridItems: ImageGridItem[] = portfolio.images.map(url => ({
        url,
        colSpan: 1,
        rowSpan: 1
      }))
      
      const updatedPortfolio = {
        ...portfolio,
        gridItems: initialGridItems,
        gridLayout: newGridLayout
      }
      
      setPortfolio(updatedPortfolio)
    }
    
    // Auto-save grid layout
    try {
      const updatedPortfolio = {
        ...portfolio,
        gridLayout: newGridLayout
      }
      
      const response = await fetch(`http://localhost:5000/api/portfolio/${portfolio.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPortfolio)
      })
      
      if (response.ok) {
        setPortfolio(updatedPortfolio)
      }
    } catch (err) {
      console.error('Error saving grid layout:', err)
    }
  }

  const handleImageGridAdjust = async (imageIndex: number, colSpan: number, rowSpan: number) => {
    if (!portfolio || !portfolio.gridItems) return

    const updatedGridItems = [...portfolio.gridItems]
    updatedGridItems[imageIndex] = {
      ...updatedGridItems[imageIndex],
      colSpan,
      rowSpan
    }

    const updatedPortfolio = {
      ...portfolio,
      gridItems: updatedGridItems
    }

    setPortfolio(updatedPortfolio)

    // Auto-save changes
    try {
      const response = await fetch(`http://localhost:5000/api/portfolio/${portfolio.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPortfolio)
      })
      
      if (!response.ok) {
        console.error('Failed to save grid changes')
      }
    } catch (err) {
      console.error('Error saving grid changes:', err)
    }
  }

  const initializeGridItems = () => {
    if (!portfolio || portfolio.gridItems) return

    const gridItems: ImageGridItem[] = portfolio.images.map(url => ({
      url,
      colSpan: 1,
      rowSpan: 1
    }))

    setPortfolio({
      ...portfolio,
      gridItems
    })
  }

  const renderImageGrid = () => {
    if (!portfolio || !portfolio.images.length) return null

    // Always use individual grid control
    return renderIndividualGrid()
  }

  const renderIndividualGrid = () => {
    if (!portfolio?.gridItems?.length) {
      // Initialize grid items if not exists
      initializeGridItems()
      return null
    }

    return (
      <div className="grid grid-cols-6 gap-4 auto-rows-[200px]">
        {portfolio.gridItems.map((item, index) => (
          <motion.div
            key={index}
            className={`relative group overflow-hidden rounded-lg`}
            style={{
              gridColumn: `span ${item.colSpan}`,
              gridRow: `span ${item.rowSpan}`
            }}
            variants={itemVariants}
          >
            <img
              src={item.url}
              alt={`${portfolio.title} - ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            
            {/* Grid Size Controls */}
            {isAdmin && isGridEditing && (
              <div className="absolute top-2 left-2 bg-white bg-opacity-95 rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col space-y-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-700 font-medium min-w-[12px]">W:</span>
                    {[1, 2, 3, 4, 5, 6].map(span => (
                      <button
                        key={span}
                        onClick={() => handleImageGridAdjust(index, span, item.rowSpan)}
                        className={`w-7 h-7 text-xs rounded font-medium transition-colors ${
                          item.colSpan === span 
                            ? 'bg-blue-500 text-white shadow-sm' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {span}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-700 font-medium min-w-[12px]">H:</span>
                    {[1, 2, 3, 4].map(span => (
                      <button
                        key={span}
                        onClick={() => handleImageGridAdjust(index, item.colSpan, span)}
                        className={`w-7 h-7 text-xs rounded font-medium transition-colors ${
                          item.rowSpan === span 
                            ? 'bg-green-500 text-white shadow-sm' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {span}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Remove Photo Button */}
            {isAdmin && (
              <button
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
              >
                ×
              </button>
            )}
          </motion.div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Portfolio Not Found</h2>
          <button onClick={onBack} className="text-blue-500 hover:underline">← Back to Home</button>
        </div>
      </div>
    )
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header Navigation */}
      <HeaderNav title="OSO FILM" onHome={onBack} onPortfolio={onBack} />

      {/* Admin Photo Management Controls */}
      {isAdmin && (
        <div className="fixed top-20 left-4 z-40 bg-white border rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-bold mb-3 text-sm">Photo Management</h3>
          <button 
            onClick={() => setIsAddingPhoto(true)}
            className="w-full mb-2 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
          >
            + Add Photo
          </button>
          <p className="text-xs text-gray-500">
            Total: {portfolio?.images.length || 0} photos
          </p>
        </div>
      )}

      {/* Add Photo Modal */}
      {isAddingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Photo</h3>
            <input 
              type="url"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="Enter image URL..."
              className="w-full p-3 border rounded mb-4"
            />
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  setIsAddingPhoto(false)
                  setNewPhotoUrl('')
                }}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddPhoto}
                disabled={!newPhotoUrl.trim() || isLoading}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Adding...' : 'Add Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-32 right-4 z-40 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2">×</button>
        </div>
      )}

      {/* Main Content */}
      <motion.main 
        className="pt-20 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Project Title */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-4">
            {portfolio.title}
          </h1>
          <div className="w-16 h-px bg-black mx-auto"></div>
        </motion.div>

        {/* Individual Grid Controls */}
        {isAdmin && portfolio && (
          <motion.div 
            className="max-w-6xl mx-auto px-6 mb-8"
            variants={itemVariants}
          >
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Individual Image Grid Control</span>
                  <div className="text-xs text-gray-500">
                    Real-time preview • Auto-saved
                  </div>
                </div>
                <button
                  onClick={() => setIsGridEditing(!isGridEditing)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    isGridEditing
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isGridEditing ? '✓ Grid Edit Mode' : 'Enable Grid Edit'}
                </button>
              </div>

              {/* Grid Instructions */}
              {isGridEditing && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700">
                  <strong>How to use:</strong> Hover over any image to see size controls. 
                  <strong>W</strong> = Width (1-6 columns), <strong>H</strong> = Height (1-4 rows).
                  Each image can be sized independently. Changes are saved automatically.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Dynamic Image Grid */}
        <motion.div 
          className="max-w-6xl mx-auto px-6"
          variants={containerVariants}
        >
          {renderImageGrid()}
        </motion.div>

        {/* Project Description */}
        <motion.div 
          className="max-w-4xl mx-auto px-6 text-center"
          variants={itemVariants}
        >
          <div className="prose prose-lg mx-auto">
            <p className="text-gray-600 leading-relaxed mb-6">
              {portfolio.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-500 mt-8">
              <div>
                <h4 className="font-semibold text-black mb-2">CLIENT</h4>
                <p>{portfolio.client}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-2">YEAR</h4>
                <p>{portfolio.year}</p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-2">CATEGORY</h4>
                <p>{portfolio.category}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default PortfolioTemplate
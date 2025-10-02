import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Portfolio {
  id: string
  title: string
  description: string
  images: string[]
  client: string
  year: string
  category: string
  createdAt: string
  updatedAt: string
}

interface PortfolioCMSProps {
  isOpen: boolean
  onClose: () => void
}

const PortfolioCMS: React.FC<PortfolioCMSProps> = ({ isOpen, onClose }) => {
  // For static deployments (GitHub Pages), set this to true to disable API calls
  const DISABLE_API = true
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as string[],
    client: '',
    year: new Date().getFullYear().toString(),
    category: ''
  })

  // Load portfolios on mount
  useEffect(() => {
    if (isOpen) {
      loadPortfolios()
    }
  }, [isOpen])

  const loadPortfolios = async () => {
    setIsLoading(true)
    try {
      if (DISABLE_API) {
        // Static mode: provide mock portfolios
        const mock = [
          {
            id: 'cityhall',
            title: 'City Hall',
            description: 'Mock portfolio for static deploy',
            images: ['https://images.unsplash.com/photo-1555636222-cae831e670b3?q=80&w=2077&auto=format&fit=crop'],
            client: 'City Planning Department',
            year: '2024',
            category: 'Architecture',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        setPortfolios(mock)
      } else {
        const response = await fetch('http://localhost:5000/api/portfolio')
        const result = await response.json()
        
        if (result.success) {
          setPortfolios(result.data)
        } else {
          setError('Failed to load portfolios')
        }
      }
    } catch (err) {
      setError('Network error loading portfolios')
      console.error('Error loading portfolios:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio)
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      images: portfolio.images,
      client: portfolio.client,
      year: portfolio.year,
      category: portfolio.category
    })
    setIsEditing(true)
  }

  const handleCreate = () => {
    setSelectedPortfolio(null)
    setFormData({
      title: '',
      description: '',
      images: [],
      client: '',
      year: new Date().getFullYear().toString(),
      category: ''
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const url = selectedPortfolio 
        ? `http://localhost:5000/api/portfolio/${selectedPortfolio.id}` 
        : 'http://localhost:5000/api/portfolio'
      const method = selectedPortfolio ? 'PUT' : 'POST'
      if (DISABLE_API) {
        // Static mode: do not call backend. Simulate success and refresh list locally.
        setIsEditing(false)
        setSelectedPortfolio(null)
        await loadPortfolios()
      } else {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        
        const result = await response.json()
        
        if (result.success) {
          await loadPortfolios()
          setIsEditing(false)
          setSelectedPortfolio(null)
        } else {
          setError(result.error || 'Failed to save portfolio')
        }
      }
    } catch (err) {
      setError('Network error saving portfolio')
      console.error('Error saving portfolio:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return
    
    setIsLoading(true)
    try {
      if (DISABLE_API) {
        // Static mode: simulate deletion locally
        setPortfolios(prev => prev.filter(p => p.id !== id))
      } else {
        const response = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
          method: 'DELETE'
        })
        
        const result = await response.json()
        
        if (result.success) {
          await loadPortfolios()
        } else {
          setError(result.error || 'Failed to delete portfolio')
        }
      }
    } catch (err) {
      setError('Network error deleting portfolio')
      console.error('Error deleting portfolio:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageAdd = () => {
    const imageUrl = prompt('Enter image URL:')
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }))
    }
  }

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">Portfolio CMS</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>
          </div>

          {DISABLE_API && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-4">
              Note: API calls are disabled in static deploy mode. Changes will not be persisted to a backend.
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!isEditing ? (
            // Portfolio List View
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Portfolios</h3>
                <button 
                  onClick={handleCreate}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create New
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolios.map(portfolio => (
                    <div key={portfolio.id} className="border rounded-lg p-4">
                      <div className="aspect-video bg-gray-200 rounded mb-3 overflow-hidden">
                        {portfolio.images[0] && (
                          <img 
                            src={portfolio.images[0]} 
                            alt={portfolio.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h4 className="font-semibold mb-2">{portfolio.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {portfolio.description}
                      </p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(portfolio)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(portfolio.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Edit/Create Form
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedPortfolio ? 'Edit Portfolio' : 'Create Portfolio'}
                </h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-black"
                >
                  ← Back
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border rounded"
                    placeholder="Portfolio title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input 
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Architectural Photography"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Client</label>
                  <input 
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    className="w-full p-2 border rounded"
                    placeholder="Client name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <input 
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full p-2 border rounded"
                    placeholder="2024"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded h-24"
                    placeholder="Portfolio description..."
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Images</label>
                    <button 
                      onClick={handleImageAdd}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Add Image
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Image ${index + 1}`}
                          className="w-full aspect-video object-cover rounded border"
                        />
                        <button 
                          onClick={() => handleImageRemove(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default PortfolioCMS
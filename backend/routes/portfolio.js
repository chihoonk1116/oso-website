const express = require('express')
const { body, validationResult } = require('express-validator')
const firebaseService = require('../services/firebase')
const router = express.Router()

// Initialize Firebase
firebaseService.initialize()

// Validation middleware
const validatePortfolio = [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('images').isArray().withMessage('Images must be an array'),
  body('client').optional().trim().isLength({ max: 100 }).withMessage('Client name must be less than 100 characters'),
  body('year').optional().isLength({ min: 4, max: 4 }).withMessage('Year must be 4 digits'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('Category must be less than 50 characters')
]

// GET /api/portfolio - Get all portfolios
router.get('/', async (req, res) => {
  try {
    const db = firebaseService.getDB()
    const snapshot = await db.collection('portfolios').get()
    
    const portfolios = []
    snapshot.docs.forEach(doc => {
      portfolios.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    res.json({ success: true, data: portfolios })
  } catch (error) {
    console.error('Error fetching portfolios:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch portfolios' })
  }
})

// GET /api/portfolio/:id - Get single portfolio
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const db = firebaseService.getDB()
    const doc = await db.collection('portfolios').doc(id).get()
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' })
    }
    
    res.json({ 
      success: true, 
      data: { id: doc.id, ...doc.data() } 
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch portfolio' })
  }
})

// POST /api/portfolio - Create new portfolio
router.post('/', validatePortfolio, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      })
    }
    
    const { title, description, images, client, year, category } = req.body
    const db = firebaseService.getDB()
    
    const portfolioData = {
      title,
      description: description || '',
      images: images || [],
      client: client || '',
      year: year || new Date().getFullYear().toString(),
      category: category || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const docRef = await db.collection('portfolios').add(portfolioData)
    
    res.status(201).json({ 
      success: true, 
      data: { id: docRef.id, ...portfolioData } 
    })
  } catch (error) {
    console.error('Error creating portfolio:', error)
    res.status(500).json({ success: false, error: 'Failed to create portfolio' })
  }
})

// PUT /api/portfolio/:id - Update portfolio
router.put('/:id', validatePortfolio, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      })
    }
    
    const { id } = req.params
    const { title, description, images, client, year, category } = req.body
    const db = firebaseService.getDB()
    
    const portfolioRef = db.collection('portfolios').doc(id)
    const doc = await portfolioRef.get()
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' })
    }
    
    const updateData = {
      title,
      description: description || '',
      images: images || [],
      client: client || '',
      year: year || new Date().getFullYear().toString(),
      category: category || '',
      updatedAt: new Date().toISOString()
    }
    
    await portfolioRef.set({ ...doc.data(), ...updateData })
    
    res.json({ 
      success: true, 
      data: { id, ...updateData } 
    })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    res.status(500).json({ success: false, error: 'Failed to update portfolio' })
  }
})

// DELETE /api/portfolio/:id - Delete portfolio
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const db = firebaseService.getDB()
    
    const doc = await db.collection('portfolios').doc(id).get()
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' })
    }
    
    await db.collection('portfolios').doc(id).delete()
    
    res.json({ success: true, message: 'Portfolio deleted successfully' })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    res.status(500).json({ success: false, error: 'Failed to delete portfolio' })
  }
})

module.exports = router
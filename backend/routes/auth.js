const express = require('express')
const router = express.Router()

// POST /api/auth/login - Simple auth for demo (extend with proper JWT/OAuth)
router.post('/login', async (req, res) => {
  try {
    const { email, token } = req.body
    
    // In production, verify Google OAuth token here
    // For now, simple check for demo purposes
    if (!email || !token) {
      return res.status(400).json({ success: false, error: 'Email and token required' })
    }
    
    // Mock authentication - replace with real verification
    const isAdmin = email.includes('admin') || email.includes('oso')
    
    res.json({ 
      success: true, 
      data: { 
        isAdmin, 
        email, 
        token: 'demo-jwt-token' 
      } 
    })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({ success: false, error: 'Authentication failed' })
  }
})

// POST /api/auth/verify - Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token required' })
    }
    
    // Mock verification - replace with real JWT verification
    const isValid = token === 'demo-jwt-token'
    
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid token' })
    }
    
    res.json({ success: true, data: { valid: true } })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({ success: false, error: 'Token verification failed' })
  }
})

module.exports = router
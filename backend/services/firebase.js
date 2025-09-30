const admin = require('firebase-admin')

class FirebaseService {
  constructor() {
    this.db = null
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return

    try {
      // Initialize Firebase Admin SDK
      // In production, use service account key file or environment variables
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL
        })
      } else {
        // For development, use default credentials or service account file
        console.log('⚠️  Firebase not configured. Add FIREBASE_SERVICE_ACCOUNT_KEY to .env')
        // Mock database for development
        this.db = new MockFirestore()
        this.initialized = true
        return
      }

      this.db = admin.firestore()
      this.initialized = true
      console.log('✅ Firebase initialized successfully')
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error)
      // Fall back to mock for development
      this.db = new MockFirestore()
      this.initialized = true
    }
  }

  getDB() {
    if (!this.initialized) {
      throw new Error('Firebase service not initialized. Call initialize() first.')
    }
    return this.db
  }
}

// Mock Firestore for development without Firebase setup
class MockFirestore {
  constructor() {
    this.data = {
      portfolios: [
        {
          id: 'cityhall',
          title: 'CITYHALL',
          description: 'A comprehensive architectural photography series documenting the intersection of civic architecture and urban life.',
          images: [
            'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&h=800&fit=crop&q=80',
            'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop&q=80',
            'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop&q=80'
          ],
          client: 'City Planning Department',
          year: '2024',
          category: 'Architectural Photography',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    }
  }

  collection(name) {
    return {
      get: async () => ({
        docs: (this.data[name] || []).map(item => ({
          id: item.id,
          data: () => item
        }))
      }),
      doc: (id) => ({
        get: async () => {
          const item = (this.data[name] || []).find(item => item.id === id)
          return {
            exists: !!item,
            id: id,
            data: () => item
          }
        },
        set: async (data) => {
          const index = (this.data[name] || []).findIndex(item => item.id === id)
          const newItem = { ...data, id, updatedAt: new Date().toISOString() }
          if (index >= 0) {
            this.data[name][index] = newItem
          } else {
            if (!this.data[name]) this.data[name] = []
            this.data[name].push({ ...newItem, createdAt: new Date().toISOString() })
          }
          return newItem
        },
        delete: async () => {
          if (!this.data[name]) return
          this.data[name] = this.data[name].filter(item => item.id !== id)
        }
      }),
      add: async (data) => {
        const id = Date.now().toString()
        const newItem = { 
          ...data, 
          id, 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        if (!this.data[name]) this.data[name] = []
        this.data[name].push(newItem)
        return { id }
      }
    }
  }
}

const firebaseService = new FirebaseService()

module.exports = firebaseService
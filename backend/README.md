# OSO FILM Backend API

Node.js + Express backend with Firebase integration for portfolio CMS.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5174

# Optional: Add for production Firebase
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account"...}
# FIREBASE_DATABASE_URL=https://your-project.firebaseio.com/

JWT_SECRET=your-super-secure-secret
```

### 3. Start Development Server
```bash
npm run dev
```

## Mock Database

For development, the system uses a mock Firestore database with sample data. No Firebase setup required!

## API Routes

### Health Check
- `GET /health` - Server health status

### Portfolio CRUD
- `GET /api/portfolio` - List all portfolios
- `GET /api/portfolio/:id` - Get single portfolio  
- `POST /api/portfolio` - Create portfolio
- `PUT /api/portfolio/:id` - Update portfolio
- `DELETE /api/portfolio/:id` - Delete portfolio

### File Upload
- `POST /api/upload/image` - Single image upload
- `POST /api/upload/images` - Multiple image upload
- `GET /api/upload/files/:filename` - Serve uploaded files

### Authentication
- `POST /api/auth/login` - Login with Google OAuth token
- `POST /api/auth/verify` - Verify JWT token

## Request Examples

### Create Portfolio
```bash
curl -X POST http://localhost:5000/api/portfolio \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Project",
    "description": "Project description",
    "images": ["https://example.com/image1.jpg"],
    "client": "Client Name",
    "year": "2024",
    "category": "Photography"
  }'
```

### Upload Image
```bash
curl -X POST http://localhost:5000/api/upload/image \
  -F "image=@/path/to/image.jpg"
```

## Production Deployment

### Heroku
```bash
heroku create oso-film-backend
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
# Add other environment variables
git push heroku main
```

### Railway
```bash
railway login
railway new
railway add
railway deploy
```

## Firebase Setup (Production)

1. Create Firebase project
2. Enable Firestore Database
3. Generate service account key
4. Add environment variables:
   - `FIREBASE_SERVICE_ACCOUNT_KEY`
   - `FIREBASE_DATABASE_URL`

## Error Handling

All endpoints return consistent JSON responses:

```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // validation errors
}
```

## Validation

Portfolio data is validated using `express-validator`:
- `title`: Required, 1-100 characters
- `description`: Optional, max 1000 characters
- `images`: Required array
- `client`: Optional, max 100 characters
- `year`: Optional, 4 digits
- `category`: Optional, max 50 characters
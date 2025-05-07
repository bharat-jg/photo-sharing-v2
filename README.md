# 📸 Viscora - Photo Sharing Platform

A modern, full-stack photo sharing platform built with Django REST Framework and React. Share your moments, interact with others, and discover beautiful photography.

## 🌟 Features

- User authentication with JWT
- Profile management with customizable avatars
- Photo uploads and management
- Like, Comment, Download, Share and Save photos
- Photo sorting and filtering
- Responsive design
- Real-time updates
- Password management
- Photo categorization by topics

## 🏗️ Project Structure

```
photo-sharing/
├── backend/                # Django REST API
│   ├── core/              # Main application logic
│   ├── backend/           # Project settings
│   └── requirements.txt   # Python dependencies
│
└── frontend/              # React (Vite) application
    ├── src/              
    │   ├── components/    # Reusable components
    │   ├── pages/        # Page components
    │   └── services/     # API services
    └── package.json      # Node dependencies
```

## 📋 Technologies

- Python
- Django
- Node.js
- React + Tailwind
- MySQL 
- Cloudinary 

## 🔧 Backend Setup (Django)

1. Create virtual environment:
```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Apply migrations:
```bash
python manage.py migrate
```

## ⚛️ Frontend Setup (React + Vite)

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key

DB_NAME = your-db-name
DB_USER = your-db-user
DB_PASSWORD = your-db-password
DB_HOST = your-db-host
DB_PORT = you-db-port

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## 💾 Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE photo_sharing;
```

2. Update DATABASE_URL in backend/.env

## ☁️ Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from dashboard
3. Set up upload preset for frontend direct uploads
4. Update environment variables

## 🚀 Running the App

1. Start backend server:
```bash
cd backend
python manage.py runserver
```

2. Start frontend development server:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to view the app.

## 🔌 API Endpoints Summary

### Authentication
```
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
POST /api/auth/change-password/
```

### Profile
```
GET /api/profile/me/
PATCH /api/profile/me/
POST /api/profile/update-photo/
DELETE /api/profile/delete-photo/
```

### Photos
```
GET /api/photos/
POST /api/photos/
GET /api/photos/{id}/
DELETE /api/photos/{id}/
POST /api/photos/{id}/like/
GET /api/photos/saved/
```

## 🎥 Demo Video

[Watch Demo on YouTube](#) *(Coming soon)*

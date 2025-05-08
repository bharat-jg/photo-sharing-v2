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
- Photo categorization by username


## 🏗️ Project Structure

```
photo-sharing/
├── backend/                # Django REST API
│   ├── core/               # Main application logic
│   ├── backend/            # Project settings
│   └── requirements.txt    # Python dependencies
│
└── frontend/               # React (Vite) application
    ├── src/              
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   └── services/       # API services
    └── package.json        # Node dependencies
```


## 🧑‍💻 Technologies Used

- Python
- Django
- Node.js
- React + Tailwind
- MySQL 
- Cloudinary


## 💾 Database Setup

Create MySQL database:
```sql
CREATE DATABASE photo_sharing_db;
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

CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret

```

### Frontend (.env)
```env
VITE_API_URL = http://localhost:8000/api
VITE_CLOUDINARY_UPLOAD_PRESET = your-preset
VITE_CLOUDINARY_CLOUD_NAME = your-cloud-name
```


## ☁️ Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from dashboard
3. Set up upload preset for frontend direct uploads
4. Update environment variables


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
python manage.py makemigrations
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
POST /api/register/               # Register new user
POST /api/password-reset/         # Request password reset email
POST /api/auth/change-password/   # Change password when logged in
```

### Profile 
```
GET  /api/profile/me/                # Get current user profile
PUT  /api/profile/me/                # Update profile (full update)
PATCH /api/profile/me/               # Update profile (partial update)
POST /api/profile/update-photo/      # Upload new profile photo
DELETE /api/profile/delete-photo/    # Remove profile photo
```

### Photos
```
GET  /api/photos/                # List all photos (with optional filters)
POST /api/photos/                # Create new photo
GET  /api/photos/feed/           # Get photo feed
GET  /api/photos/<id>/           # Get single photo details
PATCH /api/photos/<id>/edit/     # Update photo
DELETE /api/photos/<id>/edit/    # Delete photo
```

### Comments
```
POST /api/comments/               # Create new comment
DELETE /api/comments/<id>/        # Delete comment
```

### Interaction
```
POST /api/photos/<id>/like-toggle/     # Toggle like on photo
POST /api/photos/<id>/save-toggle/     # Toggle save photo
GET  /api/photos/saved/                # List saved photos
```


## 🖼️ Diagrams

### Database Schema

![image](https://github.com/user-attachments/assets/3a75b762-d72d-4dd2-a2b1-147adfa72b5d)


### Architecure

![mermaid-architecture-1](https://github.com/user-attachments/assets/23501e47-0e67-4b57-839f-ac837de896d9)
 

### Upload Photo Flow

![mermaid-photo-upload](https://github.com/user-attachments/assets/033abf4d-5e11-4ba0-bbb4-9f304d64cded)

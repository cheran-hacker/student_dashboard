# Students Module - EDUCRM

A full-stack student management system with registration, admin dashboard, and analytics.

## Features

- **Student Registration**: Public registration form with validation
- **Admin Dashboard**: Complete CRUD operations for student management
- **Analytics**: Charts and statistics for students, placements, and academic performance
- **Maintenance Mode**: Admin can enable/disable student registration
- **Dark Mode**: Toggle between light and dark themes
- **CSV Export/Import**: Bulk operations for student data
- **Authentication**: JWT-based admin authentication

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- CORS enabled

### Frontend
- React 19
- Material-UI (MUI) v7
- React Router v7
- Axios for API calls
- Recharts for analytics

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/educrm
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

The backend will run on `http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file if you need to change the API URL:
```env
REACT_APP_API_URL=http://127.0.0.1:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Default Credentials

**Admin Login:**
- Username: `admin` or `admin@educrm.com`
- Password: `admin`

⚠️ **Important**: Change these credentials in production!

## API Endpoints

### Public Endpoints
- `GET /api/config/maintenance` - Check maintenance mode status
- `POST /api/students/register` - Register a new student
- `GET /api/students` - Get all students (public)

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/students` - Get all students (admin)
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student
- `POST /api/config/maintenance` - Toggle maintenance mode

## Project Structure

```
students Module/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── configController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Config.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── configRoutes.js
│   │   └── studentRoutes.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdminDashboard.js
    │   │   ├── AdminLayout.js
    │   │   ├── AdminLogin.js
    │   │   ├── AdminSettings.js
    │   │   └── StudentRegister.js
    │   ├── api.js
    │   ├── App.js
    │   ├── theme.js
    │   └── index.js
    └── package.json
```

## Key Features Explained

### Student Registration
- Public-facing form
- Validates email, register number uniqueness
- Checks maintenance mode before allowing registration
- Responsive design with modern UI

### Admin Dashboard
- View all students with search and filter
- Add/Edit/Delete students
- Analytics with charts:
  - CGPA distribution
  - Department split
  - Top skills
- CSV export/import functionality
- Bulk email (UI ready)
- Maintenance mode toggle

### Authentication
- JWT-based authentication
- Token stored in localStorage
- Protected routes with middleware
- Auto-redirect to login if unauthorized

## Development Notes

- The app uses MongoDB for data storage
- JWT tokens expire after 4 hours
- Maintenance mode prevents student registration
- All API calls include error handling
- Form validation on both frontend and backend

## Security Considerations

1. Change default admin credentials
2. Use a strong JWT_SECRET in production
3. Use environment variables for sensitive data
4. Enable HTTPS in production
5. Implement rate limiting for API endpoints
6. Add password hashing (bcrypt) for admin passwords
7. Implement proper CORS configuration for production

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify MONGO_URI in .env file
- Ensure port 5000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS settings in backend
- Verify API URL in frontend/api.js

### Registration fails
- Check if maintenance mode is enabled
- Verify MongoDB connection
- Check for duplicate email/register number

## License

ISC

## Author

Student Management System v2.0


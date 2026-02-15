# School Management System - Frontend

A modern React frontend for the School Management System built with Vite, React Router, and Tailwind CSS.

## Features

- 🎨 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🔐 **Authentication** - Secure login for admins and students
- 🎯 **Role-Based Access** - Different dashboards for admins and students
- 📱 **Performance** - Built with Vite for fast development and builds
- 🛣️ **Routing** - React Router v6 for client-side navigation

## Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with interceptors
├── context/
│   └── AuthContext.jsx       # Authentication state management
├── layouts/
│   ├── PublicLayout.jsx      # Layout for public pages
│   ├── AdminLayout.jsx       # Layout for admin dashboard
│   └── StudentLayout.jsx     # Layout for student dashboard
├── components/
│   ├── Navbar.jsx            # Navigation bar
│   ├── Sidebar.jsx           # Sidebar navigation
│   └── ProtectedRoute.jsx    # Route protection component
├── pages/
│   ├── public/               # Public pages
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Notices.jsx
│   ├── auth/                 # Authentication pages
│   │   ├── AdminLogin.jsx
│   │   └── StudentLogin.jsx
│   ├── admin/                # Admin dashboard pages
│   │   ├── Dashboard.jsx
│   │   ├── Students.jsx
│   │   ├── Attendance.jsx
│   │   ├── Fees.jsx
│   │   ├── Results.jsx
│   │   └── Pdfs.jsx
│   └── student/              # Student dashboard pages
│       ├── Dashboard.jsx
│       ├── Profile.jsx
│       ├── Attendance.jsx
│       ├── Fees.jsx
│       ├── Results.jsx
│       └── Pdfs.jsx
├── styles/
│   └── index.css             # Global Tailwind CSS styles
└── App.jsx                   # Main app component with routing
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your API URL:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Authentication

### Admin Login
- Navigate to `/login/admin`
- Default credentials: `admin` / `Admin@123`

### Student Login
- Navigate to `/login/student`
- Use student ID and date of birth

### Token Management
- Tokens are stored in `localStorage`
- Tokens are automatically included in all API requests
- Invalid tokens trigger automatic logout

## API Integration

The app communicates with the backend API at `http://localhost:8000`. Key endpoints:

- **Auth**: `/auth/admin/login`, `/auth/student/login`
- **Admin**: `/admin/*` endpoints
- **Student**: `/student/*` endpoints
- **Public**: `/public/*` endpoints

## Responsive Design

The frontend is fully responsive:
- Mobile: 340px+
- Tablet: 768px+
- Desktop: 1024px+

Uses Tailwind CSS breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Dependencies

- **react** (^18.2.0) - UI library
- **react-dom** (^18.2.0) - React DOM rendering
- **react-router-dom** (^6.20.0) - Client-side routing
- **axios** (^1.6.2) - HTTP client
- **tailwindcss** (^3.4.1) - Utility-first CSS framework
- **lucide-react** (^0.292.0) - Icon library

## Development Dependencies

- **vite** (^5.0.8) - Build tool and dev server
- **@vitejs/plugin-react** (^4.2.1) - React plugin for Vite
- **postcss** (^8.4.32) - CSS processing
- **autoprefixer** (^10.4.16) - CSS vendor prefixes

## Notes

- This is a frontend-only application. The backend API must be running on `http://localhost:8000`
- No business logic is implemented in this version, only structure and routing
- All data fetching and processing will be implemented in future phases
- The app uses React Context for authentication state management
- Protected routes require valid JWT tokens

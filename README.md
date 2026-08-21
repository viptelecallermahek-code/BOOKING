# Goa Package Manager

A modern, fast, and mobile-friendly web-based Package Data Entry and Management Software designed for tourism businesses in Goa.

## Features

✨ **Complete Booking Management**
- Add, edit, view, and delete customer bookings
- Automatic booking ID generation
- Real-time payment tracking
- Multiple booking status tracking

📊 **Dashboard & Analytics**
- Real-time statistics and metrics
- Today's arrivals tracking
- Upcoming arrivals forecast
- Revenue analytics
- Pending payment tracking
- Recent entries overview

📅 **Calendar View**
- Visual booking calendar
- Arrival and departure highlights
- Daily booking summaries
- Monthly revenue overview

👥 **Customer Management**
- Comprehensive customer database
- Booking history per customer
- Contact information management
- Customer search and filtering

📈 **Reporting System**
- Daily, weekly, and monthly reports
- Revenue reports with breakdown
- Pending payments report
- Cancelled bookings report
- Upcoming customers report
- Export to Excel/PDF

💬 **WhatsApp Integration**
- Direct WhatsApp messaging to customers
- Pre-built message templates
- Quick communication for booking confirmations
- One-click contact

🔐 **Secure Authentication**
- Admin login with JWT tokens
- Role-based access control
- Password encryption with bcrypt
- Secure session management

📱 **Responsive Design**
- Mobile-first design
- Fully responsive on all devices
- Touch-friendly interface
- Fast loading times

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for database
- **JWT** for authentication
- **bcryptjs** for password encryption
- **Mongoose** for ODM
- **CORS** for cross-origin support

### Frontend
- **React 18** with Hooks
- **React Router** for navigation
- **Axios** for API calls
- **React Calendar** for calendar view
- **XLSX** for Excel export
- **React Icons** for UI icons

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud - MongoDB Atlas recommended)
- npm or yarn

### Setup Instructions

#### 1. Clone and Install Dependencies
```bash
cd d:\ALT
npm install
```

#### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/goa-package-manager

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# Frontend URL
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WHATSAPP_PHONE=91xxxxx

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@goapackages.com
ADMIN_PASSWORD=change_me_in_production
```

#### 3. Start the Application

**Development Mode (with live reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Project Structure

```
goa-package-manager/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Navigation.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── AddBooking.js
│   │   ├── AllBookings.js
│   │   ├── Calendar.js
│   │   ├── Customers.js
│   │   ├── Reports.js
│   │   └── Settings.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── Navigation.css
│   │   ├── Login.css
│   │   ├── Dashboard.css
│   │   ├── AddBooking.css
│   │   ├── AllBookings.css
│   │   ├── Calendar.css
│   │   ├── Customers.css
│   │   ├── Reports.css
│   │   └── Settings.css
│   ├── App.js
│   └── index.js
├── models/
│   ├── User.js
│   └── Booking.js
├── routes/
│   ├── auth.js
│   ├── bookings.js
│   ├── customers.js
│   ├── dashboard.js
│   ├── reports.js
│   └── settings.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

## Usage Guide

### 1. Login
- Register a new account or login with existing credentials
- Demo credentials will be provided for testing

### 2. Add New Booking
1. Click "Add New Booking" from dashboard
2. Fill in customer details
3. Enter travel dates and package information
4. Set payment details
5. Click "Create Booking"

### 3. View All Bookings
- Search by customer name, phone, or booking ID
- Filter by booking status or date range
- Expand any booking to see full details
- Actions: View, Edit, Delete, Print, Download, or send WhatsApp message

### 4. Calendar View
- Visual calendar showing all bookings
- Color-coded for today's arrivals and future bookings
- Click on date to see all bookings for that day
- Monthly summary with revenue and statistics

### 5. Manage Customers
- View all unique customers
- Search and filter customers
- See customer booking history
- Quick actions: Call, Email, or WhatsApp

### 6. Generate Reports
- Daily, Weekly, or Monthly reports
- Revenue breakdown and pending payments
- Cancelled bookings report
- Upcoming customers forecast
- Export to Excel or print as PDF

### 7. Settings
- Update profile information
- Change password
- Configure app settings (business details, currency, timezone)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout

### Bookings
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/all` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/stats/today-arrivals` - Today's arrivals
- `GET /api/bookings/stats/upcoming-arrivals` - Upcoming arrivals
- `GET /api/bookings/range/:startDate/:endDate` - Bookings in date range

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/revenue/:period` - Revenue summary

### Reports
- `GET /api/reports/daily/:date` - Daily report
- `GET /api/reports/weekly/:startDate` - Weekly report
- `GET /api/reports/monthly/:year/:month` - Monthly report
- `GET /api/reports/pending-payments` - Pending payments
- `GET /api/reports/cancelled` - Cancelled bookings
- `GET /api/reports/upcoming-customers` - Upcoming customers

### Customers
- `GET /api/customers/all` - All customers
- `GET /api/customers/phone/:phone` - Customer by phone
- `GET /api/customers/search/:query` - Search customers

### Settings
- `GET /api/settings/profile` - User profile
- `PUT /api/settings/profile` - Update profile
- `POST /api/settings/change-password` - Change password
- `GET /api/settings/app-config` - App configuration

## Deployment

### Deploy to Heroku
```bash
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy to Vercel (Frontend)
```bash
npm run build
vercel --prod
```

### Deploy to AWS, Azure, or Google Cloud
Follow platform-specific deployment guides with Docker containerization.

## Future Enhancements

- [ ] Employee login and management
- [ ] Hotel management system
- [ ] Transport and driver details
- [ ] Activity/service management
- [ ] Invoice generation
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced analytics dashboard
- [ ] Booking conflict detection
- [ ] Customer feedback/reviews
- [ ] Automated reminders

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens have expiration
- CORS enabled for specific origins
- Input validation on all endpoints
- SQL injection prevention with Mongoose
- XSS protection with sanitization
- Environment variables for sensitive data
- HTTPS recommended for production

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB URI in `.env`
- Check MongoDB server is running
- Verify firewall and network settings
- For MongoDB Atlas, whitelist your IP

### React Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Restart development server

### Port Already in Use
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:5000 | xargs kill -9
```

## Support & Documentation

For issues, questions, or feature requests, please refer to the documentation or create an issue in the repository.

## License

This project is proprietary and designed for Goa tourism businesses.

## Credits

Developed with ❤️ for tourism management excellence.

---

**Last Updated:** August 2026
**Version:** 1.0.0

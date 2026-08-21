# Project File Structure & Description

Complete file listing for Goa Package Manager v1.0.0

## Root Level Files

### Configuration Files
- **package.json** - Project dependencies and scripts
- **.env.example** - Environment variables template
- **README.md** - Full project documentation
- **QUICKSTART.md** - Quick start guide (5-minute setup)
- **TESTING.md** - Comprehensive testing guide
- **FILES.md** - This file (complete file structure)

### Backend Entry Point
- **server.js** - Express server setup and routing

---

## Backend Structure

### Models (`/models`)
Database schemas for MongoDB

```
models/
├── User.js           - User authentication model
│   ├── name (string)
│   ├── email (string, unique)
│   ├── password (string, hashed)
│   ├── phone (string)
│   ├── role (enum: admin, staff, viewer)
│   ├── isActive (boolean)
│   └── lastLogin (date)
│
└── Booking.js        - Booking/Package model
    ├── bookingId (auto-generated)
    ├── customerName
    ├── phoneNumber
    ├── whatsappNumber
    ├── email
    ├── numberOfAdults
    ├── numberOfChildren
    ├── cityState
    ├── arrivalDate
    ├── departureDate
    ├── numberOfDays (auto-calculated)
    ├── arrivalTime
    ├── pickupLocation
    ├── hotelName
    ├── packageName
    ├── packageType
    ├── selectedActivities (array)
    ├── numberOfPeople
    ├── totalPackageAmount
    ├── advancePayment
    ├── remainingPayment (auto-calculated)
    ├── paymentStatus (Paid/Partial/Pending)
    ├── paymentMode (Cash/UPI/Bank Transfer/Other)
    ├── bookingStatus (New/Confirmed/Arrived/In Progress/Completed/Cancelled)
    ├── specialNotes
    ├── customerRequirements
    ├── internalNotes
    ├── createdBy (User reference)
    ├── createdAt
    ├── updatedAt
    └── isDeleted (soft delete)
```

### Routes (`/routes`)
API endpoint implementations

```
routes/
├── auth.js           - Authentication endpoints
│   ├── POST /auth/register
│   ├── POST /auth/login
│   ├── GET /auth/verify
│   └── POST /auth/logout
│
├── bookings.js       - Booking CRUD operations
│   ├── POST /bookings/create
│   ├── GET /bookings/all
│   ├── GET /bookings/:id
│   ├── PUT /bookings/:id
│   ├── DELETE /bookings/:id
│   ├── GET /bookings/stats/today-arrivals
│   ├── GET /bookings/stats/upcoming-arrivals
│   └── GET /bookings/range/:startDate/:endDate
│
├── dashboard.js      - Dashboard statistics
│   ├── GET /dashboard/stats
│   └── GET /dashboard/revenue/:period
│
├── reports.js        - Report generation
│   ├── GET /reports/daily/:date
│   ├── GET /reports/weekly/:startDate
│   ├── GET /reports/monthly/:year/:month
│   ├── GET /reports/pending-payments
│   ├── GET /reports/cancelled
│   └── GET /reports/upcoming-customers
│
├── customers.js      - Customer management
│   ├── GET /customers/all
│   ├── GET /customers/phone/:phone
│   └── GET /customers/search/:query
│
└── settings.js       - User and app settings
    ├── GET /settings/profile
    ├── PUT /settings/profile
    ├── POST /settings/change-password
    ├── GET /settings/users/all
    ├── POST /settings/users/create
    ├── DELETE /settings/users/:id
    └── GET /settings/app-config
```

---

## Frontend Structure

### Public Directory (`/public`)
Static files and HTML

```
public/
└── index.html        - Main HTML entry point (React root)
```

### Source Directory (`/src`)

#### Main Files
```
src/
├── index.js          - React entry point
├── App.js            - Main App component with routing
│
├── components/       - Reusable components
│   ├── Navigation.js  - Top navigation bar with menu
│   └── [Future components]
│
├── pages/           - Full page components
│   ├── Login.js     - Login/Register page
│   ├── Dashboard.js - Dashboard page with stats
│   ├── AddBooking.js - Create/Edit booking form
│   ├── AllBookings.js - Bookings list with filters
│   ├── Calendar.js  - Calendar view with bookings
│   ├── Customers.js - Customer database
│   ├── Reports.js   - Reports generation
│   └── Settings.js  - Account & app settings
│
└── styles/          - CSS stylesheets
    ├── index.css    - Global styles
    ├── App.css      - App layout styles
    ├── Navigation.css
    ├── Login.css
    ├── Dashboard.css
    ├── AddBooking.css
    ├── AllBookings.css
    ├── Calendar.css
    ├── Customers.css
    ├── Reports.css
    └── Settings.css
```

---

## Page & Feature Details

### 1. Login Page (`src/pages/Login.js`)
**Features:**
- User registration form
- User login form
- Password visibility toggle
- Form validation
- Error handling
- Demo credentials display
- Auto-login after registration

**Key Components:**
- Email/Password inputs
- Sign in / Sign up toggle
- Eye icon for password reveal
- Alert messages
- Loading state

---

### 2. Dashboard (`src/pages/Dashboard.js`)
**Features:**
- Real-time statistics
- Today's arrivals tracking
- Upcoming arrivals (7 days)
- Revenue overview
- Pending payments tracking
- Recent entries display
- Quick action buttons
- Responsive stat cards
- Financial summary

**Displays:**
- Total Bookings
- Today's Arrivals
- Upcoming Arrivals
- Completed Packages
- Cancelled Bookings
- Total Customers
- Total Revenue
- Pending Payments Amount
- Recent Bookings List

---

### 3. Add Booking (`src/pages/AddBooking.js`)
**Sections:**
1. **Customer Details**
   - Name, Phone, WhatsApp
   - Email, City/State
   - Number of adults/children

2. **Travel Details**
   - Arrival/Departure dates
   - Arrival time
   - Pickup location
   - Hotel name

3. **Package Details**
   - Package name/type
   - Selected activities (multi-select)
   - Number of people

4. **Payment Details**
   - Total amount
   - Advance payment
   - Auto-calculated remaining
   - Payment status (Paid/Partial/Pending)
   - Payment mode (Cash/UPI/Bank Transfer/Other)
   - Booking status

5. **Additional Information**
   - Special notes
   - Customer requirements
   - Internal staff notes

**Validations:**
- Required field checking
- Date validation (departure > arrival)
- Minimum password length
- Auto-calculation of remaining payment
- Auto-calculation of number of days

---

### 4. All Bookings (`src/pages/AllBookings.js`)
**Features:**
- Expandable booking cards
- Search functionality
  - By customer name
  - By phone number
  - By booking ID
- Filters
  - By booking status
  - By date range
- Actions per booking
  - View details
  - Edit booking
  - Send WhatsApp message
  - Print booking
  - Download as JSON
  - Delete booking

**Displayed Info:**
- Booking ID
- Customer name
- Dates (Arrival - Departure)
- Total amount
- Booking status
- Package name
- Hotel location
- Payment details
- Special notes

---

### 5. Calendar (`src/pages/Calendar.js`)
**Features:**
- Interactive calendar view
- Color-coded dates
  - Yellow = today
  - Green = has bookings
- Date selection
- Booking display for selected date
- Monthly summary
  - Total bookings
  - Total revenue
  - Arrivals count
  - Departures count

**Booking Info on Date:**
- Arrival/Departure/Staying badge
- Customer details
- Hotel information
- Payment status
- Package name
- Amount
- Special notes

---

### 6. Customers (`src/pages/Customers.js`)
**Features:**
- Customer cards grid
- Search functionality
- Customer avatar with initial
- Contact actions
  - Call button (tel: link)
  - Email button (mailto: link)
  - WhatsApp button (WhatsApp Web)
  - Expand to view history
- Booking history display
- Statistics
  - Total bookings
  - Total spent
  - Last booking date

**Displayed Info:**
- Customer name
- Location
- Phone number
- Email
- Total bookings
- Total spent amount
- Last booking date
- Booking history

---

### 7. Reports (`src/pages/Reports.js`)
**Report Types:**
1. **Daily Report**
   - Specific date
   - Daily statistics
   - Booking breakdown by status

2. **Weekly Report**
   - 7-day period
   - Weekly revenue
   - Payment status breakdown

3. **Monthly Report**
   - Year and month selection
   - Full month statistics
   - Package types count
   - Customer count

4. **Pending Payments Report**
   - All partial/pending bookings
   - Total pending amount
   - Breakdown by payment mode

5. **Cancelled Bookings Report**
   - All cancelled bookings
   - Lost revenue calculation
   - Refunded amounts

6. **Upcoming Customers Report**
   - Next month arrivals
   - Expected revenue
   - Customer details

**Export Options:**
- Download to Excel (.xlsx)
- Print to PDF
- View detailed table

---

### 8. Settings (`src/pages/Settings.js`)
**Tabs:**

1. **Profile Settings**
   - Email (read-only)
   - Role (read-only)
   - Full name (editable)
   - Phone number (editable)
   - Save button

2. **Change Password**
   - Current password input
   - New password input
   - Confirm password input
   - Validation (6+ chars, match)
   - Update button

3. **App Settings**
   - Business name
   - Business phone
   - Business email
   - WhatsApp number
   - Currency selection (INR/USD/EUR)
   - Date format selection
   - Timezone selection
   - Save button

---

## Navigation Component (`src/components/Navigation.js`)
**Features:**
- Sticky top navigation
- Logo with app name
- Menu items
  - Dashboard
  - Add New Booking
  - All Bookings
  - Calendar
  - Customers
  - Reports
  - Settings
- User profile section
  - Name display
  - Role display
  - Logout button
- Mobile hamburger menu
- Active route highlighting

---

## Styling Architecture

### Color Scheme
```
Primary: #1e40af (Blue)
Secondary: #0369a1 (Dark Blue)
Success: #15803d (Green)
Warning: #ea580c (Orange)
Danger: #dc2626 (Red)
Light BG: #f8fafc
Card BG: #ffffff
Border: #e2e8f0
Text Dark: #1e293b
Text Light: #64748b
```

### Responsive Breakpoints
```
Desktop: 1920px+
Tablet: 769px - 1024px
Mobile: 375px - 768px
```

### Typography
```
Font: System fonts (Segoe UI, Roboto, etc.)
Headers: 700 weight
Body: 400 weight
Small text: 0.85rem
Main text: 1rem
Large headers: 2rem
```

---

## Authentication Flow

### User Registration
1. User fills registration form
2. Submit to `POST /auth/register`
3. Validate input
4. Hash password with bcrypt
5. Create user in MongoDB
6. Generate JWT token
7. Return token and user data
8. Frontend stores token in localStorage
9. Redirect to dashboard

### User Login
1. User enters credentials
2. Submit to `POST /auth/login`
3. Find user by email
4. Compare password hash
5. Generate JWT token
6. Update lastLogin
7. Return token and user data
8. Frontend stores token
9. Redirect to dashboard

### Token Verification
1. On app load/refresh
2. Send `GET /auth/verify` with token
3. Verify JWT signature
4. Return user data
5. If invalid/expired, redirect to login

---

## Database Relationships

### User → Booking
- One user (admin/staff) creates many bookings
- createdBy field references User._id

### Phone Number → Multiple Bookings
- Same phone number can have multiple bookings
- Used to group customers in customer database

### Booking Status Flow
```
New Booking → Confirmed → Arrived → In Progress → Completed
                          ↓
                      Cancelled
```

### Payment Status Values
```
Pending: No payment received
Partial: Advance payment received
Paid: Full payment received
```

---

## File Statistics

### Backend
- Models: 2 files
- Routes: 6 files
- Main server: 1 file
- Total backend files: 9

### Frontend
- Pages: 8 files
- Components: 1 file
- Styles: 16 files (includes global)
- Entry files: 2 files (index.js, App.js)
- Total frontend files: 27

### Documentation
- README.md
- QUICKSTART.md
- TESTING.md
- FILES.md (this file)
- Total: 4 files

### Configuration
- package.json
- .env.example
- Total: 2 files

### Public
- index.html
- Total: 1 file

**Grand Total: ~43 files**

---

## Key Features by File

| File | Feature | Status |
|------|---------|--------|
| Login.js | Authentication | ✅ Complete |
| Dashboard.js | Statistics & Overview | ✅ Complete |
| AddBooking.js | Create Bookings | ✅ Complete |
| AllBookings.js | Manage Bookings | ✅ Complete |
| Calendar.js | Visual Calendar | ✅ Complete |
| Customers.js | Customer Database | ✅ Complete |
| Reports.js | Report Generation | ✅ Complete |
| Settings.js | Configuration | ✅ Complete |
| Navigation.js | App Navigation | ✅ Complete |
| auth.js | Authentication API | ✅ Complete |
| bookings.js | Booking CRUD API | ✅ Complete |
| dashboard.js | Dashboard API | ✅ Complete |
| reports.js | Reports API | ✅ Complete |
| customers.js | Customer API | ✅ Complete |
| settings.js | Settings API | ✅ Complete |

---

## File Sizes (Approximate)

### Largest Files
1. AllBookings.js: ~8KB
2. Reports.js: ~7KB
3. AddBooking.js: ~7KB
4. Dashboard.js: ~6KB
5. Calendar.js: ~6KB

### Total Codebase
- Backend: ~15KB
- Frontend components: ~40KB
- Styles: ~45KB
- Configuration: ~5KB
- **Total: ~105KB (minified production build: ~30KB)**

---

## Missing Files (For Future Enhancement)

- [ ] Edit booking page
- [ ] Admin user management page
- [ ] Employee management page
- [ ] Hotel management page
- [ ] Transport/Driver management
- [ ] Activity/Service management
- [ ] Invoice generation
- [ ] Payment gateway integration
- [ ] Email templates
- [ ] SMS notification templates
- [ ] Unit tests
- [ ] Integration tests
- [ ] Docker configuration
- [ ] CI/CD pipeline configuration

---

## Deployment Files Needed

For production deployment:
- [ ] Dockerfile
- [ ] docker-compose.yml
- [ ] .dockerignore
- [ ] .env (production)
- [ ] nginx.conf (if using Nginx)
- [ ] pm2.config.js (if using PM2)
- [ ] github/workflows/* (CI/CD)

---

## File Organization Best Practices Used

✅ Separation of concerns (Backend/Frontend)
✅ Modular page structure
✅ Centralized styling
✅ Clear naming conventions
✅ Consistent folder structure
✅ Reusable components
✅ API route organization
✅ Database model separation
✅ Environment variable management
✅ Documentation

---

## How to Locate Files

### For Feature Development
- UI: Check `src/pages/[FeatureName].js`
- Styles: Check `src/styles/[FeatureName].css`
- API: Check `routes/[resource].js`
- Database: Check `models/[Model].js`

### For Bug Fixes
1. Error from frontend? Check `src/pages/` or `src/components/`
2. API error? Check `routes/`
3. Database error? Check `models/`
4. Styling issue? Check `src/styles/`

### For Documentation
1. Setup: Read `QUICKSTART.md`
2. Testing: Read `TESTING.md`
3. Features: Read `README.md`
4. Structure: Read `FILES.md` (this file)

---

## Maintenance Checklist

- [ ] Regular backups of MongoDB
- [ ] Monitor API logs
- [ ] Track performance metrics
- [ ] Update dependencies monthly
- [ ] Security patches immediately
- [ ] Review error logs weekly
- [ ] Customer data validation
- [ ] Database optimization
- [ ] Clean old sessions
- [ ] Archive completed bookings

---

**Last Updated:** August 2026
**Version:** 1.0.0
**Total Lines of Code:** ~2,500 (including styles)

# Quick Start Guide - Goa Package Manager

Get up and running with Goa Package Manager in 5 minutes!

## System Requirements

- Node.js v14+ (Download from [nodejs.org](https://nodejs.org))
- MongoDB (Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) recommended)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation (5 minutes)

### Step 1: Clone and Install
```bash
cd d:\ALT
npm install
```

### Step 2: Setup Environment Variables
Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database - Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/goa-package-manager

# Security
JWT_SECRET=your_secret_key_here

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Start the Application
**Option A: Full Stack (Recommended)**
```bash
npm run dev
```
This runs both backend and frontend simultaneously.

**Option B: Separate Terminals**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Step 4: Access the Application
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## First Time Setup

### 1. Create First Account
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Phone: Your Phone
   - Password: Strong Password (6+ chars)
4. Click "Create Account"

### 2. Create Your First Booking
1. Click "Add New Booking"
2. Fill in customer details:
   ```
   Customer Name: Rajesh Kumar
   Phone: 9876543210
   Arrival Date: [Tomorrow's date]
   Departure Date: [After arrival date]
   Package Name: Beach Package
   Total Amount: 50000
   ```
3. Click "Create Booking"

### 3. Explore Features
- **Dashboard**: View all stats
- **Calendar**: See bookings on calendar
- **All Bookings**: Search and manage bookings
- **Customers**: View all customers
- **Reports**: Generate reports
- **Settings**: Configure app

---

## Quick Reference

### Navigation Menu
| Menu Item | Purpose |
|-----------|---------|
| 📊 Dashboard | Overview and key metrics |
| ➕ Add New Booking | Create new customer booking |
| 📋 All Bookings | Manage all bookings |
| 📅 Calendar | Visual booking calendar |
| 👥 Customers | Customer database |
| 📈 Reports | Generate business reports |
| ⚙️ Settings | Configure account & app |

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Ctrl+Q | Quick search (coming soon) |
| Ctrl+N | New booking (coming soon) |
| Escape | Close modals |

---

## Common Tasks

### Add a New Booking
1. Click "Add New Booking"
2. Enter customer details
3. Select dates and package
4. Set payment amount
5. Click "Create Booking"

**Time:** ~2 minutes

### Find a Customer
1. Go to "All Bookings" or "Customers"
2. Use search box
3. Search by: Name, Phone, or Booking ID

**Time:** <30 seconds

### Generate Report
1. Click "Reports"
2. Select report type (Daily/Weekly/Monthly)
3. Choose dates if needed
4. Click "Generate Report"
5. Download as Excel or PDF

**Time:** ~1 minute

### Send WhatsApp Message
1. Find booking in "All Bookings"
2. Expand booking details
3. Click WhatsApp button
4. Message opens in WhatsApp
5. Send confirmation message

**Time:** ~30 seconds

### Change Payment Status
1. Go to "All Bookings"
2. Expand booking
3. Edit booking
4. Update payment status
5. Save changes

**Time:** ~1 minute

---

## Default Values

### Package Types
- Scuba Diving
- Water Sports
- Beach Holiday
- Cultural Tour
- Adventure Tour
- Honeymoon Package
- Family Package
- Corporate Retreat

### Activities
- Scuba Diving
- Snorkeling
- Jet Ski
- Parasailing
- Island Hopping
- Beach Volleyball
- Sunset Cruise
- Spa Treatment
- Houseboat Ride
- Fort Visit
- Spice Plantation Tour
- Kayaking

### Payment Modes
- Cash
- UPI
- Bank Transfer
- Other

### Booking Status
- New Booking
- Confirmed
- Arrived
- In Progress
- Completed
- Cancelled

### Payment Status
- Paid
- Partial
- Pending

---

## Tips & Tricks

### Dashboard
- 💡 Click on any stat card to get more details
- 💡 Recent entries show last 5 bookings
- 💡 Quick action buttons are always available

### Bookings
- 💡 Use multiple filters together
- 💡 Search is case-insensitive
- 💡 Expand any booking to see full details
- 💡 Print and download bookings for record-keeping

### Calendar
- 🟢 Green dates = has bookings
- 🟡 Yellow dates = today
- 💡 Click any date to see all bookings
- 💡 Monthly summary shows revenue and arrivals

### Reports
- 💡 Export to Excel for further analysis
- 💡 PDF export for sharing with clients
- 💡 Filter reports by date range
- 💡 Use pending payments report to follow up

### Mobile
- 💡 Use landscape mode for tables
- 💡 Hamburger menu for navigation
- 💡 Touch-friendly buttons and forms
- 💡 All features work on mobile

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### MongoDB Connection Failed
1. Check MongoDB URL in `.env`
2. Verify MongoDB is running
3. For MongoDB Atlas: Whitelist your IP
4. Check network connectivity

### Blank Page on Startup
1. Check browser console for errors (F12)
2. Verify backend is running (http://localhost:5000/api/health)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart both frontend and backend

### Changes Not Reflecting
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Restart development servers
4. Check browser console for errors

### Styles Not Loading
1. Restart frontend: `npm run client`
2. Clear CSS cache
3. Check network tab in DevTools
4. Verify CSS files are in src/styles

---

## Environment Variables Explained

```env
# Server Configuration
PORT=5000                    # Server port
NODE_ENV=development         # Environment (development/production)

# Database
MONGODB_URI=...              # MongoDB connection string
                             # Format: mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Security
JWT_SECRET=...               # Secret key for JWT tokens (change in production!)

# Frontend
REACT_APP_API_URL=...        # API endpoint for frontend
REACT_APP_WHATSAPP_PHONE=... # WhatsApp business number
```

---

## Data Backup

### Export Data
1. Use MongoDB Atlas backup feature
2. Export reports to Excel
3. Download individual bookings as JSON

### Import Data
1. Use MongoDB Atlas restore
2. Backend will handle schema creation
3. Ensure data format matches

---

## Performance Tips

### For Better Speed
1. **Close unused browser tabs** - Reduces memory usage
2. **Use Chrome DevTools** - Identify slow components
3. **Optimize images** - If adding custom images
4. **Enable browser caching** - For static assets
5. **Use indexed fields** - In MongoDB queries

### Database
1. Ensure proper MongoDB indexes
2. Monitor database performance
3. Archive old data periodically
4. Regular backups

### Frontend
1. Install browser extensions sparingly
2. Clear cache regularly
3. Use modern browser version
4. Disable unnecessary plugins

---

## Security Best Practices

### Account Security
- ✅ Use strong passwords (12+ characters)
- ✅ Change default passwords immediately
- ✅ Enable browser security features
- ✅ Use HTTPS in production
- ✅ Keep software updated

### Data Security
- ✅ Regular backups (daily minimum)
- ✅ Use MongoDB encryption
- ✅ Access controls per user
- ✅ Audit logs for sensitive actions
- ✅ Data retention policies

### API Security
- ✅ Change JWT_SECRET in production
- ✅ Use environment variables
- ✅ Enable CORS for trusted origins only
- ✅ Implement rate limiting
- ✅ Monitor API access

---

## Deployment Checklist

Before going live, ensure:

- [ ] MongoDB database setup (MongoDB Atlas recommended)
- [ ] Environment variables configured
- [ ] JWT_SECRET changed to secure value
- [ ] Backend and frontend built for production
- [ ] SSL/HTTPS enabled
- [ ] Database backups configured
- [ ] Monitoring and logging setup
- [ ] Rate limiting enabled
- [ ] CORS configured for production domain
- [ ] Admin account created and tested
- [ ] Sample data loaded
- [ ] All features tested
- [ ] Documentation reviewed
- [ ] Support contact info configured

---

## Getting Help

### Check Logs
```bash
# Backend logs
npm run server
# Look for error messages in terminal

# Frontend logs
Open DevTools: F12
Go to Console tab
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Bookings not showing | Refresh page, check backend, verify data in MongoDB |
| Search not working | Clear filters, check if data exists |
| WhatsApp not opening | Check if phone number is valid, ensure WhatsApp Web is accessible |
| Export not working | Check file permissions, try different browser |
| Login not working | Check credentials, verify JWT_SECRET, check MongoDB connection |

---

## Next Steps

1. ✅ Setup and run the application
2. ✅ Create test bookings
3. ✅ Explore all features
4. ✅ Configure your business details in Settings
5. ✅ Customize for your needs
6. ✅ Train team members
7. ✅ Deploy to production
8. ✅ Setup backups and monitoring

---

## Additional Resources

- 📖 Full Documentation: See `README.md`
- 🧪 Testing Guide: See `TESTING.md`
- 🐛 Bug Reporting: Check known issues
- 💬 Support: Create GitHub issue

---

## Support

For issues or questions:
1. Check the TESTING.md guide
2. Review error messages in console
3. Check MongoDB logs
4. Verify environment variables
5. Try restarting servers
6. Clear browser cache

---

## Success! 🎉

You're now ready to start using Goa Package Manager!

### Next: 
- Add your first customer
- Create test bookings
- Explore calendar view
- Generate your first report

**Happy booking management!**

---

**Version:** 1.0.0
**Last Updated:** August 2026

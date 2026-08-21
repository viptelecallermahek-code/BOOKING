# Testing Guide - Goa Package Manager

This guide provides comprehensive testing instructions for all features of the Goa Package Manager application.

## Testing Environment Setup

### Prerequisites
- Node.js installed
- MongoDB running (local or cloud)
- Browser: Chrome, Firefox, Safari, or Edge
- API testing tool: Postman (optional)

### Start the Application

```bash
# Terminal 1: Start Backend Server
npm run server

# Terminal 2: Start Frontend
npm run client
```

Access the app at `http://localhost:3000`

---

## Test Cases

### 1. Authentication Tests

#### 1.1 User Registration
**Steps:**
1. Navigate to login page (`http://localhost:3000/login`)
2. Click "Sign Up" button
3. Enter test details:
   - Name: John Doe
   - Email: john@goapackages.com
   - Phone: 9876543210
   - Password: Test@123
4. Click "Create Account"

**Expected Results:**
- ✅ Account created successfully
- ✅ Automatic login after registration
- ✅ Redirected to dashboard
- ✅ User name appears in navigation

**Test Cases:**
- Empty fields validation
- Invalid email format
- Password less than 6 characters
- Duplicate email registration

#### 1.2 User Login
**Steps:**
1. Clear browser cache/logout
2. Enter valid credentials:
   - Email: john@goapackages.com
   - Password: Test@123
3. Click "Sign In"

**Expected Results:**
- ✅ Login successful
- ✅ JWT token stored in localStorage
- ✅ Redirected to dashboard
- ✅ Navigation menu visible

**Test Cases:**
- Invalid email
- Wrong password
- Non-existent user
- Empty credentials

#### 1.3 Session Management
**Steps:**
1. Login successfully
2. Close browser and reopen app
3. Verify still logged in
4. Click logout button
5. Verify redirected to login

**Expected Results:**
- ✅ Session persists after browser reload
- ✅ Logout clears token
- ✅ Redirects to login page
- ✅ Protected routes inaccessible without token

---

### 2. Dashboard Tests

#### 2.1 Statistics Display
**Steps:**
1. Login and navigate to dashboard
2. Observe statistics cards

**Verify:**
- ✅ Total Bookings count displays
- ✅ Today's Arrivals shows correct count
- ✅ Upcoming Arrivals (7 days) displays
- ✅ Total Customers shows unique customers
- ✅ Pending Payments count visible
- ✅ Completed Packages count displays
- ✅ Total Revenue shows correct amount (₹)
- ✅ Pending Amount displays correctly

#### 2.2 Recent Entries
**Steps:**
1. Check Recent Entries section
2. Verify booking information

**Expected Results:**
- ✅ Shows last 5 bookings
- ✅ Displays: Booking ID, Customer Name, Amount, Status
- ✅ Correct date formatting (DD/MM/YYYY)
- ✅ Status badges color-coded properly
- ✅ Amount formatted with ₹ symbol
- ✅ "View All" link works

#### 2.3 Quick Actions
**Steps:**
1. Verify quick action buttons present
2. Click each button

**Expected Results:**
- ✅ "Add New Booking" → Opens form
- ✅ "View All Bookings" → Shows bookings list
- ✅ "Generate Reports" → Opens reports page
- ✅ "Calendar View" → Shows calendar

---

### 3. Add Booking Tests

#### 3.1 Form Validation
**Steps:**
1. Navigate to "Add New Booking"
2. Try submitting empty form

**Expected Results:**
- ✅ Required field validation shows error
- ✅ Cannot submit with missing required fields
- ✅ Clear error messages displayed
- ✅ Focus on first invalid field

#### 3.2 Create Valid Booking
**Steps:**
1. Fill in all fields:
   ```
   Customer Name: Rajesh Kumar
   Phone: 9123456789
   WhatsApp: 9123456789
   Email: rajesh@example.com
   Adults: 2
   Children: 1
   City: Delhi
   Arrival Date: 2025-09-15
   Departure Date: 2025-09-20
   Arrival Time: 14:00
   Pickup: Airport
   Hotel: The Leela Goa
   Package Name: Beach Paradise
   Package Type: Beach Holiday
   Activities: Select 3-4
   People: 3
   Total Amount: 50000
   Advance: 25000
   Payment Status: Partial
   Mode: UPI
   Status: Confirmed
   Notes: VIP customer
   ```
2. Click "Create Booking"

**Expected Results:**
- ✅ Booking created successfully
- ✅ Success message displayed
- ✅ Redirected to bookings list
- ✅ New booking visible in list
- ✅ Booking ID auto-generated
- ✅ Remaining amount auto-calculated (25000)
- ✅ Number of days calculated (5)

#### 3.3 Date Validation
**Steps:**
1. Set Arrival: 2025-09-20
2. Set Departure: 2025-09-15 (before arrival)
3. Try to submit

**Expected Results:**
- ✅ Error: "Departure date must be after arrival date"
- ✅ Form not submitted

#### 3.4 Number Fields
**Steps:**
1. Enter negative numbers in amount fields
2. Enter decimals in people count
3. Try to submit

**Expected Results:**
- ✅ Validation prevents invalid data
- ✅ Clear error messages shown

---

### 4. All Bookings Tests

#### 4.1 Display Bookings
**Steps:**
1. Navigate to "All Bookings"
2. Observe bookings list

**Expected Results:**
- ✅ All bookings displayed as cards
- ✅ Shows: Booking ID, Customer Name, Dates, Amount, Status
- ✅ Proper formatting and alignment
- ✅ Status badges color-coded
- ✅ Amount in ₹ currency

#### 4.2 Search Functionality
**Steps:**
1. Test search by customer name
   - Enter "Rajesh" → Shows matching bookings
2. Test search by phone number
   - Enter "9123456789" → Shows matching bookings
3. Test search by booking ID
   - Enter "GOA" + date → Shows matching bookings

**Expected Results:**
- ✅ Search results update in real-time
- ✅ Case-insensitive search works
- ✅ Partial matching works
- ✅ Results count updates

#### 4.3 Filter by Status
**Steps:**
1. Click "All Status" dropdown
2. Select "Confirmed"
3. Verify results
4. Select "Cancelled"
5. Verify results

**Expected Results:**
- ✅ Bookings filtered by status
- ✅ Results count updates
- ✅ Only selected status shown
- ✅ "All Status" shows all again

#### 4.4 Filter by Date Range
**Steps:**
1. Set Start Date: 2025-09-01
2. Set End Date: 2025-09-30
3. Verify results
4. Change dates and verify updates

**Expected Results:**
- ✅ Filters bookings by date range
- ✅ Only bookings in range shown
- ✅ Works in combination with other filters
- ✅ Results update dynamically

#### 4.5 Clear Filters
**Steps:**
1. Apply multiple filters
2. Click "Clear Filters"

**Expected Results:**
- ✅ All filters reset
- ✅ All bookings displayed again
- ✅ Search field cleared
- ✅ All date fields cleared

#### 4.6 Expand Booking Details
**Steps:**
1. Click on any booking card
2. Observe expanded details

**Expected Results:**
- ✅ Details expand smoothly
- ✅ Shows: Package, Hotel, Payment, Advance, Remaining, Notes
- ✅ Action buttons appear: View, Edit, WhatsApp, Print, Download, Delete
- ✅ Click again to collapse

#### 4.7 WhatsApp Integration
**Steps:**
1. Expand a booking
2. Click WhatsApp button
3. Verify

**Expected Results:**
- ✅ Opens WhatsApp (web or app)
- ✅ Message pre-filled with booking details
- ✅ Customer name included in message
- ✅ Arrival date included in message

#### 4.8 Print Booking
**Steps:**
1. Expand booking
2. Click Print button
3. Print dialog appears

**Expected Results:**
- ✅ Print dialog opens
- ✅ Booking details formatted properly
- ✅ Can save as PDF
- ✅ All information visible in print

#### 4.9 Download Booking
**Steps:**
1. Expand booking
2. Click Download button

**Expected Results:**
- ✅ File downloads as JSON
- ✅ Filename: booking_[BookingID].json
- ✅ Contains all booking data
- ✅ Valid JSON format

#### 4.10 Delete Booking
**Steps:**
1. Expand booking
2. Click Delete button
3. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Booking deleted after confirmation
- ✅ Removed from list
- ✅ Count updates

---

### 5. Calendar Tests

#### 5.1 Calendar Navigation
**Steps:**
1. Navigate to Calendar page
2. Click next/previous month buttons
3. Verify dates update

**Expected Results:**
- ✅ Calendar displays current month
- ✅ Navigation changes months
- ✅ Dates update correctly
- ✅ Today highlighted in yellow

#### 5.2 Booking Indicators
**Steps:**
1. Look at calendar cells
2. Identify cells with bookings (green)
3. Identify today's cell (yellow)

**Expected Results:**
- ✅ Cells with bookings highlighted in green
- ✅ Today's date highlighted in yellow
- ✅ Empty cells have no highlighting
- ✅ Legend shows color meanings

#### 5.3 Date Selection
**Steps:**
1. Click on date with bookings
2. Verify right panel updates

**Expected Results:**
- ✅ Right panel shows selected date
- ✅ Lists all bookings for that date
- ✅ Shows: ARRIVAL, DEPARTURE, or STAYING badge
- ✅ Displays customer details
- ✅ Shows status and payment info

#### 5.4 Booking Details on Date
**Steps:**
1. Select a date with multiple bookings
2. Verify all bookings listed
3. Check booking information

**Expected Results:**
- ✅ All bookings for date shown
- ✅ Correct badges (ARRIVAL/DEPARTURE/STAYING)
- ✅ Customer names displayed
- ✅ Hotel/location info shown
- ✅ Payment status visible
- ✅ Amount displayed with ₹

#### 5.5 Monthly Summary
**Steps:**
1. Scroll to bottom of page
2. Check monthly summary cards

**Expected Results:**
- ✅ Shows Total Bookings for month
- ✅ Shows Total Revenue for month
- ✅ Shows Arrivals count
- ✅ Shows Departures count
- ✅ All values calculated correctly

---

### 6. Customers Tests

#### 6.1 View All Customers
**Steps:**
1. Navigate to Customers page
2. Observe customer cards

**Expected Results:**
- ✅ All unique customers displayed
- ✅ Shows: Avatar with initial, Name, Location
- ✅ Contact buttons visible: Call, Email, WhatsApp, Expand
- ✅ Customer details shown: Phone, Email, Bookings, Total Spent
- ✅ Last booking date displayed

#### 6.2 Search Customers
**Steps:**
1. Enter customer name: "Rajesh"
2. Verify results
3. Search by phone: "9123456789"
4. Search by email: "rajesh@example.com"

**Expected Results:**
- ✅ Results update in real-time
- ✅ Case-insensitive search
- ✅ Partial matching works
- ✅ Results count updates

#### 6.3 Contact Actions
**Steps:**
1. Click Call button → `tel:` link works
2. Click Email button → Email client opens
3. Click WhatsApp → WhatsApp opens with message

**Expected Results:**
- ✅ Call initiates phone call
- ✅ Email opens default client
- ✅ WhatsApp opens chat with customer
- ✅ Message pre-filled

#### 6.4 View Booking History
**Steps:**
1. Click Expand button on customer
2. Verify booking history shows

**Expected Results:**
- ✅ Booking history expands
- ✅ Lists all bookings by customer
- ✅ Shows: Package, Date, Amount
- ✅ Most recent first

#### 6.5 Customer Statistics
**Steps:**
1. Verify customer card shows:
   - Total Bookings count
   - Total Spent amount
   - Last Booking date

**Expected Results:**
- ✅ Totals calculated correctly
- ✅ Amounts formatted with ₹
- ✅ Dates formatted properly
- ✅ Updated after new booking

---

### 7. Reports Tests

#### 7.1 Daily Report
**Steps:**
1. Navigate to Reports
2. Select "Daily Report"
3. Select date: Today
4. Click "Generate Report"

**Expected Results:**
- ✅ Report generated in < 2 seconds
- ✅ Shows summary with:
  - Date
  - Total Bookings
  - Total Revenue
  - Total Advance
  - Pending Amount
  - Breakdown by status
- ✅ Detailed bookings table shown
- ✅ Export buttons visible

#### 7.2 Weekly Report
**Steps:**
1. Select "Weekly Report"
2. Select date: Any date
3. Generate report

**Expected Results:**
- ✅ Report shows 7-day period
- ✅ Summary for entire week
- ✅ All bookings in range listed
- ✅ Revenue totals correct

#### 7.3 Monthly Report
**Steps:**
1. Select "Monthly Report"
2. Select Month: September
3. Select Year: 2025
4. Generate report

**Expected Results:**
- ✅ Report shows full month
- ✅ Summary shows:
  - Total Bookings
  - Total Revenue
  - Total Customers
  - Total Packages
  - Payment breakdown
- ✅ All bookings listed
- ✅ Accurate calculations

#### 7.4 Pending Payments Report
**Steps:**
1. Select "Pending Payments"
2. Generate report

**Expected Results:**
- ✅ Lists all bookings with partial/pending payment
- ✅ Shows total pending amount
- ✅ Breakdown by payment mode
- ✅ Customer details included

#### 7.5 Cancelled Bookings Report
**Steps:**
1. Select "Cancelled Bookings"
2. Generate report

**Expected Results:**
- ✅ Lists all cancelled bookings
- ✅ Shows lost revenue
- ✅ Shows refunded amount
- ✅ Dates and amounts correct

#### 7.6 Upcoming Customers Report
**Steps:**
1. Select "Upcoming Customers"
2. Generate report

**Expected Results:**
- ✅ Lists customers arriving in next month
- ✅ Shows total upcoming bookings
- ✅ Shows expected revenue
- ✅ Sorted by arrival date

#### 7.7 Export to Excel
**Steps:**
1. Generate any report
2. Click "Download Excel"
3. Open downloaded file

**Expected Results:**
- ✅ File downloads successfully
- ✅ Filename: `[report-type]-report-[date].xlsx`
- ✅ Opens in Excel/Sheets
- ✅ Data properly formatted
- ✅ All bookings included
- ✅ Columns properly labeled

#### 7.8 Export to PDF/Print
**Steps:**
1. Generate any report
2. Click "Download PDF"

**Expected Results:**
- ✅ Print dialog opens
- ✅ Can save as PDF
- ✅ Data properly formatted
- ✅ Headers and summary visible
- ✅ All bookings listed

---

### 8. Settings Tests

#### 8.1 Update Profile
**Steps:**
1. Navigate to Settings
2. Click "Profile Settings" tab
3. Change Name: "John Doe Updated"
4. Change Phone: "9988776655"
5. Click "Save Profile"

**Expected Results:**
- ✅ Changes saved successfully
- ✅ Success message displayed
- ✅ Changes persist after reload
- ✅ Navigation shows updated name

#### 8.2 Change Password
**Steps:**
1. Click "Change Password" tab
2. Enter current password (correct)
3. Enter new password: "NewPass@123"
4. Confirm password
5. Click "Update Password"

**Expected Results:**
- ✅ Success message shown
- ✅ Password changed
- ✅ Next login uses new password

#### 8.3 Password Validation
**Steps:**
1. Try new and confirm passwords that don't match
2. Try password < 6 characters
3. Try empty fields

**Expected Results:**
- ✅ Validation errors shown
- ✅ Clear error messages
- ✅ Form not submitted
- ✅ Current password required

#### 8.4 App Settings
**Steps:**
1. Click "App Settings" tab
2. Update:
   - Business Name
   - Business Phone
   - WhatsApp Number
   - Currency
   - Date Format
   - Timezone
3. Click "Save Settings"

**Expected Results:**
- ✅ Settings saved successfully
- ✅ Success message shown
- ✅ Settings used in app (currency, date format)

---

### 9. Responsive Design Tests

#### 9.1 Desktop (1920x1080)
**Steps:**
1. Resize browser to 1920x1080
2. Test all pages

**Expected Results:**
- ✅ All content visible
- ✅ Proper spacing
- ✅ No scrolling needed for main content
- ✅ Tables full width

#### 9.2 Tablet (768x1024)
**Steps:**
1. Resize to tablet size
2. Navigate all pages
3. Test forms and buttons

**Expected Results:**
- ✅ Single column layout where needed
- ✅ Touch-friendly buttons (48px minimum)
- ✅ Readable text (16px minimum)
- ✅ Forms still usable
- ✅ No horizontal scrolling

#### 9.3 Mobile (375x667)
**Steps:**
1. Resize to mobile size (or use DevTools)
2. Test navigation menu
3. Test forms
4. Test tables
5. Test action buttons

**Expected Results:**
- ✅ Navigation hamburger menu works
- ✅ Forms stack vertically
- ✅ All fields visible
- ✅ Tables scrollable horizontally
- ✅ Buttons full width or stacked
- ✅ Readable without pinch-zoom
- ✅ All features accessible

#### 9.4 Mobile Landscape (667x375)
**Steps:**
1. Test in landscape mode
2. Verify layout adjustments

**Expected Results:**
- ✅ Content fits without scrolling
- ✅ Navigation still accessible
- ✅ Forms usable

---

### 10. Performance Tests

#### 10.1 Page Load Time
**Steps:**
1. Open DevTools Network tab
2. Load each page
3. Record load times

**Expected Results:**
- ✅ Dashboard: < 2 seconds
- ✅ Bookings: < 3 seconds
- ✅ Calendar: < 2 seconds
- ✅ Reports: < 2 seconds

#### 10.2 Search Performance
**Steps:**
1. With 1000+ bookings, search
2. Time response

**Expected Results:**
- ✅ Results update instantly (< 500ms)
- ✅ Smooth animation
- ✅ No UI freezing

#### 10.3 Form Performance
**Steps:**
1. Fill complex form with all fields
2. Check responsiveness while typing

**Expected Results:**
- ✅ No lag while typing
- ✅ Smooth real-time validation
- ✅ Instant amount calculation

---

### 11. Data Validation Tests

#### 11.1 Email Validation
**Steps:**
1. Test invalid emails:
   - "notanemail"
   - "test@"
   - "@example.com"

**Expected Results:**
- ✅ Invalid emails rejected
- ✅ Error message shown

#### 11.2 Phone Number
**Steps:**
1. Test phone numbers:
   - Valid: "9876543210"
   - Invalid: "abc123"
   - Empty: ""

**Expected Results:**
- ✅ Format validation (if any)
- ✅ Required field validation

#### 11.3 Amount Validation
**Steps:**
1. Enter negative amounts
2. Enter text in amount field
3. Enter decimal values

**Expected Results:**
- ✅ Only numbers accepted
- ✅ No negative numbers
- ✅ Decimal handling works
- ✅ Auto-calculation accurate

#### 11.4 Date Validation
**Steps:**
1. Invalid date: "32/13/2025"
2. Past date for future booking
3. Departure before arrival

**Expected Results:**
- ✅ Invalid dates rejected
- ✅ Clear error messages
- ✅ Logical validation enforced

---

### 12. Error Handling Tests

#### 12.1 Network Error
**Steps:**
1. Stop backend server
2. Try to load page/fetch data

**Expected Results:**
- ✅ Error message displayed
- ✅ User-friendly error text
- ✅ Retry option provided
- ✅ App doesn't crash

#### 12.2 Invalid API Response
**Steps:**
1. Simulate malformed API response
2. Verify error handling

**Expected Results:**
- ✅ Error caught gracefully
- ✅ User informed
- ✅ App remains functional

#### 12.3 Database Error
**Steps:**
1. Stop MongoDB
2. Try CRUD operations

**Expected Results:**
- ✅ Error message returned
- ✅ User sees clear error
- ✅ No sensitive data exposed

---

## Test Checklist Summary

- [ ] User Registration
- [ ] User Login
- [ ] Session Persistence
- [ ] Dashboard Statistics
- [ ] Recent Entries
- [ ] Quick Actions
- [ ] Add Booking (Valid)
- [ ] Add Booking (Invalid)
- [ ] Booking Display
- [ ] Search by Name
- [ ] Search by Phone
- [ ] Search by Booking ID
- [ ] Filter by Status
- [ ] Filter by Date
- [ ] Clear Filters
- [ ] Expand Booking
- [ ] WhatsApp Integration
- [ ] Print Booking
- [ ] Download Booking
- [ ] Delete Booking
- [ ] Calendar Navigation
- [ ] Calendar Date Selection
- [ ] Calendar Monthly Summary
- [ ] View Customers
- [ ] Search Customers
- [ ] Customer Contact Actions
- [ ] Customer Booking History
- [ ] Daily Report
- [ ] Weekly Report
- [ ] Monthly Report
- [ ] Pending Payments Report
- [ ] Cancelled Report
- [ ] Upcoming Customers Report
- [ ] Export to Excel
- [ ] Export to PDF
- [ ] Update Profile
- [ ] Change Password
- [ ] Update App Settings
- [ ] Desktop Responsive
- [ ] Tablet Responsive
- [ ] Mobile Responsive
- [ ] Performance Tests
- [ ] Data Validation
- [ ] Error Handling

---

## Known Limitations

1. Edit booking feature requires additional page creation
2. Multiple admin users require admin dashboard
3. Payment gateway integration not included
4. Email notifications not implemented
5. SMS notifications not implemented
6. API rate limiting not implemented
7. Audit logs not implemented

---

## Bug Reporting

If you find any issues, please document:
1. Steps to reproduce
2. Expected vs actual result
3. Browser/OS used
4. Screenshots/videos
5. Error messages from console

---

## Performance Optimization

For production use:
1. Enable gzip compression on server
2. Use CDN for static assets
3. Implement database indexing
4. Add caching layer (Redis)
5. Optimize MongoDB queries
6. Minify CSS/JavaScript
7. Lazy load components
8. Implement pagination for large datasets

---

**Testing Completed:** [Date]
**Tested By:** [Name]
**Result:** ✅ PASS / ❌ FAIL

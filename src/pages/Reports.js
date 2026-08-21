import React, { useState, useContext } from 'react';
import axios from 'axios';
import { FiDownload, FiCalendar, FiBarChart3 } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { AuthContext } from '../App';
import '../styles/Reports.css';

function Reports() {
  const { API_URL, token } = useContext(AuthContext);
  const [reportType, setReportType] = useState('monthly');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const generateReport = async () => {
    setLoading(true);
    setError('');
    setReportData(null);

    try {
      let response;

      switch (reportType) {
        case 'daily':
          response = await axios.get(`${API_URL}/reports/daily/${selectedDate}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;

        case 'weekly':
          response = await axios.get(`${API_URL}/reports/weekly/${selectedDate}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;

        case 'monthly':
          response = await axios.get(`${API_URL}/reports/monthly/${selectedYear}/${selectedMonth}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;

        case 'pending':
          response = await axios.get(`${API_URL}/reports/pending-payments`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;

        case 'cancelled':
          response = await axios.get(`${API_URL}/reports/cancelled`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;

        case 'upcoming':
          response = await axios.get(`${API_URL}/reports/upcoming-customers`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;

        default:
          throw new Error('Invalid report type');
      }

      setReportData(response.data);
    } catch (error) {
      setError('Failed to generate report: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (!reportData) return;

    const ws = XLSX.utils.json_to_sheet(reportData.bookings || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings');

    const filename = `${reportType}-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const downloadPDF = () => {
    if (!reportData) return;

    let content = `<h1>${reportType.toUpperCase()} Report</h1>`;
    
    if (reportData.summary) {
      content += '<h2>Summary</h2>';
      content += '<table border="1"><tr>';
      Object.keys(reportData.summary).forEach(key => {
        content += `<th>${key}</th>`;
      });
      content += '</tr><tr>';
      Object.values(reportData.summary).forEach(value => {
        content += `<td>${value}</td>`;
      });
      content += '</tr></table>';
    }

    if (reportData.bookings && reportData.bookings.length > 0) {
      content += '<h2>Bookings</h2>';
      content += '<table border="1"><tr>';
      Object.keys(reportData.bookings[0]).forEach(key => {
        content += `<th>${key}</th>`;
      });
      content += '</tr>';
      reportData.bookings.forEach(booking => {
        content += '<tr>';
        Object.values(booking).forEach(value => {
          content += `<td>${value}</td>`;
        });
        content += '</tr>';
      });
      content += '</table>';
    }

    const printWindow = window.open();
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="reports-container">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>Generate comprehensive business reports and analytics</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Report Type Selection */}
      <div className="report-selector">
        <div className="report-options">
          <label className={`report-option ${reportType === 'daily' ? 'active' : ''}`}>
            <input
              type="radio"
              value="daily"
              checked={reportType === 'daily'}
              onChange={(e) => setReportType(e.target.value)}
            />
            <span>Daily Report</span>
          </label>

          <label className={`report-option ${reportType === 'weekly' ? 'active' : ''}`}>
            <input
              type="radio"
              value="weekly"
              checked={reportType === 'weekly'}
              onChange={(e) => setReportType(e.target.value)}
            />
            <span>Weekly Report</span>
          </label>

          <label className={`report-option ${reportType === 'monthly' ? 'active' : ''}`}>
            <input
              type="radio"
              value="monthly"
              checked={reportType === 'monthly'}
              onChange={(e) => setReportType(e.target.value)}
            />
            <span>Monthly Report</span>
          </label>

          <label className={`report-option ${reportType === 'pending' ? 'active' : ''}`}>
            <input
              type="radio"
              value="pending"
              checked={reportType === 'pending'}
              onChange={(e) => setReportType(e.target.value)}
            />
            <span>Pending Payments</span>
          </label>

          <label className={`report-option ${reportType === 'cancelled' ? 'active' : ''}`}>
            <input
              type="radio"
              value="cancelled"
              checked={reportType === 'cancelled'}
              onChange={(e) => setReportType(e.target.value)}
            />
            <span>Cancelled Bookings</span>
          </label>

          <label className={`report-option ${reportType === 'upcoming' ? 'active' : ''}`}>
            <input
              type="radio"
              value="upcoming"
              checked={reportType === 'upcoming'}
              onChange={(e) => setReportType(e.target.value)}
            />
            <span>Upcoming Customers</span>
          </label>
        </div>

        {/* Date Filters */}
        <div className="date-filters">
          {(reportType === 'daily' || reportType === 'weekly') && (
            <div className="filter-group">
              <label>Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
            </div>
          )}

          {reportType === 'monthly' && (
            <div className="filter-group">
              <div className="month-year-selector">
                <div>
                  <label>Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="date-input"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <option key={m} value={m}>
                        {new Date(2024, m - 1).toLocaleString('en-US', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="date-input"
                  >
                    {[2024, 2025, 2026, 2027].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="report-results">
          {/* Summary Stats */}
          {reportData.summary && (
            <div className="summary-section">
              <h2>Summary</h2>
              <div className="summary-grid">
                {Object.entries(reportData.summary).map(([key, value]) => (
                  <div key={key} className="summary-item">
                    <span className="summary-label">{formatLabel(key)}</span>
                    <span className="summary-value">
                      {typeof value === 'number' && key.includes('Revenue')
                        ? `₹ ${value.toLocaleString('en-IN')}`
                        : typeof value === 'number'
                        ? value.toLocaleString('en-IN')
                        : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Table */}
          {reportData.bookings && reportData.bookings.length > 0 && (
            <div className="bookings-section">
              <h2>Bookings Details</h2>
              <div className="table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Package</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.bookings.map((booking, idx) => (
                      <tr key={idx}>
                        <td>{booking.bookingId}</td>
                        <td>{booking.customerName}</td>
                        <td>{booking.phoneNumber}</td>
                        <td>{booking.packageName}</td>
                        <td>₹ {booking.totalPackageAmount?.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`status-badge ${booking.bookingStatus?.toLowerCase()}`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`payment-badge ${booking.paymentStatus?.toLowerCase()}`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Download Buttons */}
          <div className="download-section">
            <button className="btn btn-success" onClick={downloadExcel}>
              <FiDownload size={18} />
              Download Excel
            </button>
            <button className="btn btn-secondary" onClick={downloadPDF}>
              <FiDownload size={18} />
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export default Reports;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar"; // Adjust the path based on your project structure

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("visitDate");
  const [order, setOrder] = useState("desc");
  const [error, setError] = useState("");
  // Temporary state for date inputs (doesn't trigger re-fetch)
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  // Actual filters that trigger API calls
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: 10,
        sortBy,
        order,
        ...(startDate && endDate ? { startDate, endDate } : {}), // Send only if filtering by date
      };

      const { data } = await axios.get(`http://localhost:5000/api/visitors/report`, { params });

      setReports(data.visitors || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching visitors:", err);
      setError("Failed to fetch visitors. Please try again.");
    }

    setLoading(false);
  }, [page, sortBy, order, startDate, endDate]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchReports();
    }, 500);
    return () => clearTimeout(debounceFetch);
  }, [fetchReports]);

  const toggleSort = (field) => {
    setSortBy(field);
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const downloadCSV = () => {
    if (reports.length === 0) {
      alert("No data available for export!");
      return;
    }

    // Define CSV headers
    const headers = ["Visitor Name", "Visit Date", "Purpose", "Host", "Meeting Duration (min)", "Attendees"];

    // Map data to CSV format
    const csvRows = [
      headers.join(","), // First row (column headers)
      ...reports.map(report =>
        [
          report.name,
          new Date(report.checkInTime).toLocaleDateString(),
          report.reasonForVisit,
          report.personToVisit,
          report.meetingDuration || "N/A",
          report.teamMembersCount || 1
        ].map(value => `"${value}"`).join(",") // Enclose values in quotes to handle commas
      )
    ];

    // Create CSV Blob
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // Create download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "visitor_reports.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Apply filters when button is clicked
  const applyFilters = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  return (
    <>
      <Navbar /> {/* Add the Navbar here */}
      <div style={{ padding: "20px" }}>
        <h2>Visitor Reports</h2>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <TextField
            label="Start Date"
            type="date"
            value={tempStartDate}
            onChange={(e) => setTempStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={tempEndDate}
            onChange={(e) => setTempEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" onClick={applyFilters}>Apply Filters</Button>
          <Button variant="contained" color="success" onClick={downloadCSV}>Download CSV</Button>
        </div>

        {/* Reports Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => toggleSort("visitorName")} style={{ cursor: "pointer" }}>
                  <b>Visitor Name {sortBy === "visitorName" ? (order === "asc" ? "▲" : "▼") : ""}</b>
                </TableCell>
                <TableCell onClick={() => toggleSort("visitDate")} style={{ cursor: "pointer" }}>
                  <b>Visit Date {sortBy === "visitDate" ? (order === "asc" ? "▲" : "▼") : ""}</b>
                </TableCell>
                <TableCell><b>Purpose</b></TableCell>
                <TableCell><b>Host</b></TableCell>
                <TableCell><b>Meeting Duration (min)</b></TableCell>
                <TableCell><b>Attendees</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" style={{ color: "red" }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No reports found.</TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{new Date(report.checkInTime).toLocaleDateString()}</TableCell>
                    <TableCell>{report.reasonForVisit}</TableCell>
                    <TableCell>{report.personToVisit}</TableCell>
                    <TableCell>{report.meetingDuration || "N/A"}</TableCell>
                    <TableCell>{report.teamMembersCount || 1}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span> Page {page} of {totalPages} </span>
          <Button disabled={page === totalPages || totalPages === 1} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>
    </>
  );
};

export default Reports;
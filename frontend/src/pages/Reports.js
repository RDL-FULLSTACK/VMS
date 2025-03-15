//report.js

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
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("checkInTime");
  const [order, setOrder] = useState("desc");
  const [error, setError] = useState("");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
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
        ...(startDate && endDate ? { startDate, endDate } : {}),
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

  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    const { hours, minutes } = duration;
    let result = "";
    if (hours > 0) result += `${hours} hr${hours !== 1 ? "s" : ""}`;
    if (minutes > 0) result += `${result ? " " : ""}${minutes} min`;
    return result || "0 min";
  };

  const downloadCSV = () => {
    if (reports.length === 0) {
      alert("No data available for export!");
      return;
    }

    const headers = [
      "Visitor Name",
      "Check-In Date",
      "Check-Out Date",
      "Purpose",
      "Host",
      "Meeting Duration",
      "Attendees",
    ];

    const csvRows = [
      headers.join(","),
      ...reports.map((report) => [
        report.name,
        new Date(report.checkInTime).toLocaleString(),
        report.checkOutTime ? new Date(report.checkOutTime).toLocaleString() : "N/A",
        report.reasonForVisit,
        report.personToVisit,
        formatDuration(report.meetingDuration),
        report.teamMembersCount || 1,
      ].map((value) => `"${value}"`).join(",")),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visitor_reports.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const applyFilters = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Visitor Reports</h2>

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
          <Button variant="contained" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="contained" color="success" onClick={downloadCSV}>
            Download CSV
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>
                  <b>Visitor Name {sortBy === "name" ? (order === "asc" ? "▲" : "▼") : ""}</b>
                </TableCell>
                <TableCell onClick={() => toggleSort("checkInTime")} style={{ cursor: "pointer" }}>
                  <b>Check-In {sortBy === "checkInTime" ? (order === "asc" ? "▲" : "▼") : ""}</b>
                </TableCell>
                <TableCell onClick={() => toggleSort("checkOutTime")} style={{ cursor: "pointer" }}>
                  <b>Check-Out {sortBy === "checkOutTime" ? (order === "asc" ? "▲" : "▼") : ""}</b>
                </TableCell>
                <TableCell>
                  <b>Purpose</b>
                </TableCell>
                <TableCell>
                  <b>Host</b>
                </TableCell>
                <TableCell
                  onClick={() => toggleSort("meetingDuration")}
                  style={{ cursor: "pointer" }}
                >
                  <b>
                    Duration {sortBy === "meetingDuration" ? (order === "asc" ? "▲" : "▼") : ""}
                  </b>
                </TableCell>
                <TableCell>
                  <b>Attendees</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" style={{ color: "red" }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No reports found.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{new Date(report.checkInTime).toLocaleString()}</TableCell>
                    <TableCell>
                      {report.checkOutTime ? new Date(report.checkOutTime).toLocaleString() : "N/A"}
                    </TableCell>
                    <TableCell>{report.reasonForVisit}</TableCell>
                    <TableCell>{report.personToVisit}</TableCell>
                    <TableCell>{formatDuration(report.meetingDuration)}</TableCell>
                    <TableCell>{report.teamMembersCount || 1}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages || totalPages === 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Reports;
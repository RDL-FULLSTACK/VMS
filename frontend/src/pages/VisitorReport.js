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
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const VisitorReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("checkInTime");
  const [order, setOrder] = useState("desc");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
        ...(searchQuery ? { search: searchQuery } : {}),
      };

      const { data } = await axios.get(`http://localhost:5000/api/visitors/report`, { params });

      setReports(data.visitors || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching visitors:", err);
      setError("Failed to fetch visitors. Please try again.");
    }

    setLoading(false);
  }, [page, sortBy, order, startDate, endDate, searchQuery]);

  useEffect(() => {
    fetchReports();
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

    const headers = [
      "Visitor Name",
      "Company Name",
      "Purpose",
      "Host",
      "Check-In Date",
      "Check-Out Date",
      "Duration",
      "Attendees",
    ];

    const csvRows = [
      headers.join(","),
      ...reports.map((report) => {
        const duration = report.meetingDuration
          ? `${report.meetingDuration.hours}h ${report.meetingDuration.minutes}m`
          : "N/A";
        return [
          report.name,
          report.visitorCompany || "N/A",
          report.reasonForVisit || "N/A",
          report.personToVisit || "N/A",
          new Date(report.checkInTime).toLocaleString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          }),
          report.checkOutTime
            ? new Date(report.checkOutTime).toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              })
            : "N/A",
          duration,
          report.teamMembersCount || 0,
        ]
          .map((value) => `"${value}"`)
          .join(",");
      }),
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

  // Pagination logic to display page numbers
  const maxPageButtons = 5;
  const pageNumbers = [];
  let startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {/* Search and Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
        <TextField
          label="Search Visitor Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "200px" }}
        />
        <TextField
          label="Start Date"
          type="date"
          value={tempStartDate}
          onChange={(e) => setTempStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ width: "150px" }}
        />
        <TextField
          label="End Date"
          type="date"
          value={tempEndDate}
          onChange={(e) => setTempEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ width: "150px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={applyFilters}
          style={{ height: "56px" }}
        >
          APPLY FILTERS
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={downloadCSV}
          style={{ height: "56px" }}
        >
          DOWNLOAD CSV
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>
                <b>Visitor Name {sortBy === "name" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell onClick={() => toggleSort("visitorCompany")} style={{ cursor: "pointer" }}>
                <b>Company Name {sortBy === "visitorCompany" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell onClick={() => toggleSort("reasonForVisit")} style={{ cursor: "pointer" }}>
                <b>Purpose {sortBy === "reasonForVisit" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell onClick={() => toggleSort("personToVisit")} style={{ cursor: "pointer" }}>
                <b>Host {sortBy === "personToVisit" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell onClick={() => toggleSort("checkInTime")} style={{ cursor: "pointer" }}>
                <b>Check-In {sortBy === "checkInTime" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell onClick={() => toggleSort("checkOutTime")} style={{ cursor: "pointer" }}>
                <b>Check-Out {sortBy === "checkOutTime" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell>
                <b>Duration</b> {/* Not sortable as it's calculated */}
              </TableCell>
              <TableCell onClick={() => toggleSort("teamMembersCount")} style={{ cursor: "pointer" }}>
                <b>Attendees {sortBy === "teamMembersCount" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} align="center" style={{ color: "red" }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No reports found.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.visitorCompany || "N/A"}</TableCell>
                  <TableCell>{report.reasonForVisit || "N/A"}</TableCell>
                  <TableCell>{report.personToVisit || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(report.checkInTime).toLocaleString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {report.checkOutTime
                      ? new Date(report.checkOutTime).toLocaleString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true,
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {report.meetingDuration
                      ? `${report.meetingDuration.hours}h ${report.meetingDuration.minutes}m`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{report.teamMembersCount || 0}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{ minWidth: "30px", padding: "5px" }}
        >
          <ArrowBackIos style={{ fontSize: "16px", color: page === 1 ? "gray" : "black" }} />
        </Button>

        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            style={{
              minWidth: "30px",
              padding: "5px",
              backgroundColor: page === pageNum ? "#1976d2" : "transparent",
              color: page === pageNum ? "white" : "black",
              borderRadius: "50%",
              fontSize: "14px",
              margin: "0 2px",
            }}
          >
            {pageNum}
          </Button>
        ))}

        {endPage < totalPages && (
          <span style={{ fontSize: "14px", margin: "0 5px" }}>...</span>
        )}

        {endPage < totalPages && (
          <Button
            onClick={() => setPage(totalPages)}
            style={{
              minWidth: "30px",
              padding: "5px",
              backgroundColor: "transparent",
              color: "black",
              fontSize: "14px",
              margin: "0 2px",
            }}
          >
            {totalPages}
          </Button>
        )}

        <Button
          disabled={page === totalPages || totalPages === 1}
          onClick={() => setPage(page + 1)}
          style={{ minWidth: "30px", padding: "5px" }}
        >
          <ArrowForwardIos
            style={{
              fontSize: "16px",
              color: page === totalPages || totalPages === 1 ? "gray" : "black",
            }}
          />
        </Button>
      </div>
    </div>
  );
};

export default VisitorReport;
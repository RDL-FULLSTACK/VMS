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
  Menu,
  MenuItem,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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
  const [maxPageButtons, setMaxPageButtons] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);

  const updateMaxPageButtons = useCallback(() => {
    const width = window.innerWidth;
    if (width < 600) setMaxPageButtons(3);
    else if (width < 900) setMaxPageButtons(5);
    else setMaxPageButtons(7);
  }, []);

  useEffect(() => {
    updateMaxPageButtons();
    window.addEventListener("resize", updateMaxPageButtons);
    return () => window.removeEventListener("resize", updateMaxPageButtons);
  }, [updateMaxPageButtons]);

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

  const fetchAllReports = useCallback(async () => {
    try {
      const params = {
        sortBy,
        order,
        ...(startDate && endDate ? { startDate, endDate } : {}),
        ...(searchQuery ? { search: searchQuery } : {}),
        export: true,
      };
      const { data } = await axios.get(`http://localhost:5000/api/visitors/report`, { params });
      return data.visitors || [];
    } catch (err) {
      console.error("Error fetching all visitors:", err);
      return [];
    }
  }, [sortBy, order, startDate, endDate, searchQuery]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const toggleSort = (field) => {
    setSortBy(field);
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const formatDateDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setAnchorEl(null);
  };

  const downloadCSV = async () => {
    const allReports = await fetchAllReports();
    if (allReports.length === 0) {
      alert("No data available for export!");
      return;
    }
    const headers = [
      "Visitor Name",
      "Company Name",
      "Purpose",
      "Host",
      "Date",
      "Check-In Time",
      "Check-Out Time",
      "Duration",
      "Attendees",
    ];
    const csvRows = [
      headers.join(","),
      ...allReports.map((report) => {
        const duration = report.meetingDuration
          ? `${report.meetingDuration.hours}h ${report.meetingDuration.minutes}m`
          : "N/A";
        return [
          report.name,
          report.visitorCompany || "N/A",
          report.reasonForVisit || "N/A",
          report.personToVisit || "N/A",
          formatDateDDMMYYYY(report.checkInTime),
          new Date(report.checkInTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
          report.checkOutTime
            ? new Date(report.checkOutTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
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
    a.click();
    window.URL.revokeObjectURL(url);
    handleDownloadClose();
  };

  const downloadPDF = async () => {
    const allReports = await fetchAllReports();
    if (allReports.length === 0) {
      alert("No data available for export!");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Visitor Reports", 10, 10);
    const tableColumn = [
      "Visitor Name",
      "Company",
      "Purpose",
      "Host",
      "Date",
      "Check-In",
      "Check-Out",
      "Duration",
      "Attendees",
    ];
    const tableRows = allReports.map((report) => {
      const duration = report.meetingDuration
        ? `${report.meetingDuration.hours}h ${report.meetingDuration.minutes}m`
        : "N/A";
      return [
        report.name,
        report.visitorCompany || "N/A",
        report.reasonForVisit || "N/A",
        report.personToVisit || "N/A",
        formatDateDDMMYYYY(report.checkInTime),
        new Date(report.checkInTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
        report.checkOutTime
          ? new Date(report.checkOutTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
          : "N/A",
        duration,
        report.teamMembersCount || 0,
      ];
    });
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("visitor_reports.pdf");
    handleDownloadClose();
  };

  const downloadXLS = async () => {
    const allReports = await fetchAllReports();
    if (allReports.length === 0) {
      alert("No data available for export!");
      return;
    }
    const data = allReports.map((report) => {
      const duration = report.meetingDuration
        ? `${report.meetingDuration.hours}h ${report.meetingDuration.minutes}m`
        : "N/A";
      return {
        "Visitor Name": report.name,
        "Company Name": report.visitorCompany || "N/A",
        Purpose: report.reasonForVisit || "N/A",
        Host: report.personToVisit || "N/A",
        Date: formatDateDDMMYYYY(report.checkInTime),
        "Check-In Time": new Date(report.checkInTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
        "Check-Out Time": report.checkOutTime
          ? new Date(report.checkOutTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
          : "N/A",
        Duration: duration,
        Attendees: report.teamMembersCount || 0,
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Visitor Reports");
    XLSX.writeFile(wb, "visitor_reports.xlsx");
    handleDownloadClose();
  };

  const applyFilters = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  const pageNumbers = [];
  let startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  return (
    <div>
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "15px", 
        marginBottom: "20px", 
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px"
      }}>
        <TextField
          label="Search Visitor Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            flex: "1 1 200px", 
            minWidth: "200px",
            backgroundColor: "white",
            borderRadius: "4px"
          }}
        />
        <TextField
          label="Start Date"
          type="date"
          value={tempStartDate}
          onChange={(e) => setTempStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ 
            flex: "1 1 150px", 
            minWidth: "150px",
            backgroundColor: "white",
            borderRadius: "4px"
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={tempEndDate}
          onChange={(e) => setTempEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ 
            flex: "1 1 150px", 
            minWidth: "150px",
            backgroundColor: "white",
            borderRadius: "4px"
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={applyFilters}
          style={{ 
            height: "56px", 
            flex: "1 1 auto",
            minWidth: "120px",
            backgroundColor: "#1976d2",
            '&:hover': {
              backgroundColor: "#115293"
            }
          }}
        >
          APPLY FILTERS
        </Button>
        <div style={{ position: "relative", flex: "1 1 auto", minWidth: "120px" }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadClick}
            style={{ 
              height: "56px", 
              width: "100%",
              backgroundColor: "#2e7d32",
              '&:hover': {
                backgroundColor: "#1b5e20"
              }
            }}
          >
            DOWNLOAD
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleDownloadClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              style: {
                minWidth: "120px",
                marginTop: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                borderRadius: "4px",
                zIndex: 1300 // Ensure menu appears above other elements
              },
            }}
          >
            <MenuItem 
              onClick={downloadCSV} 
              style={{ 
                padding: "12px 20px", 
                fontSize: "14px",
                '&:hover': {
                  backgroundColor: "#f0f0f0"
                }
              }}
            >
              CSV
            </MenuItem>
            <MenuItem 
              onClick={downloadPDF} 
              style={{ 
                padding: "12px 20px", 
                fontSize: "14px",
                '&:hover': {
                  backgroundColor: "#f0f0f0"
                }
              }}
            >
              PDF
            </MenuItem>
            <MenuItem 
              onClick={downloadXLS} 
              style={{ 
                padding: "12px 20px", 
                fontSize: "14px",
                '&:hover': {
                  backgroundColor: "#f0f0f0"
                }
              }}
            >
              XLS
            </MenuItem>
          </Menu>
        </div>
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
                <b>Date {sortBy === "checkInTime" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell>
                <b>Check-In</b>
              </TableCell>
              <TableCell onClick={() => toggleSort("checkOutTime")} style={{ cursor: "pointer" }}>
                <b>Check-Out {sortBy === "checkOutTime" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell>
                <b>Duration</b>
              </TableCell>
              <TableCell onClick={() => toggleSort("teamMembersCount")} style={{ cursor: "pointer" }}>
                <b>Attendees {sortBy === "teamMembersCount" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={9} align="center" style={{ color: "red" }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
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
                  <TableCell>{formatDateDDMMYYYY(report.checkInTime)}</TableCell>
                  <TableCell>
                    {new Date(report.checkInTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                  </TableCell>
                  <TableCell>
                    {report.checkOutTime
                      ? new Date(report.checkOutTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
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

      <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ minWidth: "30px", padding: "5px" }}>
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
        {endPage < totalPages && <span style={{ fontSize: "14px", margin: "0 5px" }}>...</span>}
        {endPage < totalPages && (
          <Button
            onClick={() => setPage(totalPages)}
            style={{ minWidth: "30px", padding: "5px", backgroundColor: "transparent", color: "black", fontSize: "14px", margin: "0 2px" }}
          >
            {totalPages}
          </Button>
        )}
        <Button
          disabled={page === totalPages || totalPages === 1}
          onClick={() => setPage(page + 1)}
          style={{ minWidth: "30px", padding: "5px" }}
        >
          <ArrowForwardIos style={{ fontSize: "16px", color: page === totalPages || totalPages === 1 ? "gray" : "black" }} />
        </Button>
      </div>
    </div>
  );
};

export default VisitorReport;
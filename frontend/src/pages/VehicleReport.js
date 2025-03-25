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

const VehicleReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("date");
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
      const { data } = await axios.get(`http://localhost:5000/api/vehicles/report`, { params });
      setReports(data.vehicles || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to fetch vehicles. Please try again.");
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
      const { data } = await axios.get(`http://localhost:5000/api/vehicles/report`, { params });
      return data.vehicles || [];
    } catch (err) {
      console.error("Error fetching all vehicles:", err);
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
    const headers = ["Vehicle Number", "Purpose", "Date", "Check-In Time", "Check-Out Time"];
    const csvRows = [
      headers.join(","),
      ...allReports.map((report) =>
        [
          report.vehicleNumber,
          report.purpose,
          formatDateDDMMYYYY(report.date),
          report.checkInTime,
          report.checkOutTime || "N/A",
        ]
          .map((value) => `"${value}"`)
          .join(",")
      ),
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vehicle_reports.csv";
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
    doc.text("Vehicle Reports", 10, 10);
    const tableColumn = ["Vehicle Number", "Purpose", "Date", "Check-In", "Check-Out"];
    const tableRows = allReports.map((report) => [
      report.vehicleNumber,
      report.purpose,
      formatDateDDMMYYYY(report.date),
      report.checkInTime,
      report.checkOutTime || "N/A",
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("vehicle_reports.pdf");
    handleDownloadClose();
  };

  const downloadXLS = async () => {
    const allReports = await fetchAllReports();
    if (allReports.length === 0) {
      alert("No data available for export!");
      return;
    }
    const data = allReports.map((report) => ({
      "Vehicle Number": report.vehicleNumber,
      Purpose: report.purpose,
      Date: formatDateDDMMYYYY(report.date),
      "Check-In Time": report.checkInTime,
      "Check-Out Time": report.checkOutTime || "N/A",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vehicle Reports");
    XLSX.writeFile(wb, "vehicle_reports.xlsx");
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
          label="Search Vehicle Number"
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
              <TableCell onClick={() => toggleSort("vehicleNumber")} style={{ cursor: "pointer" }}>
                <b>Vehicle Number {sortBy === "vehicleNumber" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell>
                <b>Purpose</b>
              </TableCell>
              <TableCell onClick={() => toggleSort("date")} style={{ cursor: "pointer" }}>
                <b>Date {sortBy === "date" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell onClick={() => toggleSort("checkInTime")} style={{ cursor: "pointer" }}>
                <b>Check-In {sortBy === "checkInTime" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
              <TableCell onClick={() => toggleSort("checkOutTime")} style={{ cursor: "pointer" }}>
                <b>Check-Out {sortBy === "checkOutTime" ? (order === "asc" ? "▲" : "▼") : ""}</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center" style={{ color: "red" }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No reports found.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{report.vehicleNumber}</TableCell>
                  <TableCell>{report.purpose}</TableCell>
                  <TableCell>{formatDateDDMMYYYY(report.date)}</TableCell>
                  <TableCell>{report.checkInTime}</TableCell>
                  <TableCell>{report.checkOutTime || "N/A"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
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

export default VehicleReport;
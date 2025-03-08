// import React, { useEffect, useState, useRef } from "react";
// import {
//   Typography,
//   IconButton,
//   Card,
//   CardContent,
//   Avatar,
//   Grid,
//   Container,
//   Box,
// } from "@mui/material";
// import { QRCodeCanvas } from "qrcode.react";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
// import html2canvas from "html2canvas";
// import Navbar from "../components/Navbar";

// const VisitorCard = () => {
//   const visitorRef = useRef(null);
//   const [visitor, setVisitor] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/visitors/latest") // Adjust API endpoint as needed
//       .then((res) => res.json())
//       .then((data) => setVisitor(data))
//       .catch((err) => console.error("Error fetching visitor details:", err));
//   }, []);

//   const downloadEPass = () => {
//     html2canvas(visitorRef.current).then((canvas) => {
//       const link = document.createElement("a");
//       link.href = canvas.toDataURL("image/png");
//       link.download = "Visitor_E_Pass.png";
//       link.click();
//     });
//   };

//   const printEPass = () => {
//     if (!visitor) return;

//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print Visitor E-Pass</title>
//         </head>
//         <body>
//           <h2>VISITOR E-PASS</h2>
//           <img src="${visitor.photo}" alt="Visitor Photo" width="100" height="100" />
//           <h3>${visitor.fullName}</h3>
//           <p><strong>ID:</strong> ${visitor.id}</p>
//           <p><strong>Time:</strong> ${visitor.time}</p>
//           <p><strong>Host:</strong> ${visitor.personToVisit}</p>
//           <p><strong>Purpose:</strong> ${visitor.reasonForVisit}</p>
//           <p><strong>Company:</strong> ${visitor.visitorCompany}</p>
//           <p><strong>Scan QR Code to Verify</strong></p>
//           <script>window.print();</script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   if (!visitor) {
//     return (
//       <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
//         <Typography variant="h6">Loading Visitor Details...</Typography>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
//         <Card
//           ref={visitorRef}
//           sx={{
//             maxWidth: 800,
//             margin: "auto",
//             p: 3,
//             textAlign: "center",
//             backgroundColor: "#EDE7F6",
//             color: "#000",
//             borderRadius: 2,
//             boxShadow: 3,
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               mb: 2,
//               fontWeight: "bold",
//               backgroundColor: "#D1C4E9",
//               padding: "10px",
//               borderRadius: 1,
//             }}
//           >
//             VISITOR E-PASS
//           </Typography>
//           <Grid
//             container
//             spacing={2}
//             alignItems="center"
//             justifyContent="space-between"
//           >
//             <Grid
//               item
//               textAlign="left"
//               sx={{ display: "flex", alignItems: "center", gap: 2 }}
//             >
//               <Avatar src={visitor.data.photo} sx={{ width: 100, height: 100 }} />
//               <Box>
//                 <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//                   {visitor.data.fullName}
//                 </Typography>
//                 <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                   {visitor.data.time}
//                 </Typography>
//                 <Typography variant="body2">ID: {visitor.data._id}</Typography>
//               </Box>
//             </Grid>
//             <Grid item textAlign="left" sx={{ ml: 4 }}>
//               <Typography sx={{ mt: 1 }}>
//                 Purpose: {visitor.data.reasonForVisit}
//               </Typography>
//               <Typography>
//                 Visitor Designation: {visitor.data.designation}
//               </Typography>
//               <Typography>Company Name: {visitor.data.visitorCompany}</Typography>
//             </Grid>
//           </Grid>
//           <hr />
//           <CardContent>
//             <Grid
//               container
//               spacing={2}
//               alignItems="center"
//               justifyContent="space-between"
//             >
//               <Grid item textAlign="left">
//                 <Typography>Host Name: {visitor.data.personToVisit}</Typography>
//                 <Typography>Host Designation: {visitor.data.designation}</Typography>
//                 <Typography>Mobile: {visitor.data.phoneNumber}</Typography>
//                 <Typography>Email: {visitor.data.email}</Typography>
//               </Grid>
//               <Grid item>
//                 <QRCodeCanvas value={visitor.data.id} size={100} />
//                 <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
//                   Scan QR CODE to verify E-pass
//                 </Typography>
//               </Grid>
//             </Grid>
//           </CardContent>
//           <Typography
//             variant="body2"
//             sx={{ mt: 1, fontWeight: "bold", color: "#5F3B91" }}
//           >
//             This E-pass is valid for one-time entry only
//           </Typography>
//           <Grid
//             container
//             spacing={2}
//             justifyContent="flex-end"
//             sx={{ mt: 2, pr: 2 }}
//           >
//             <Grid item>
//               <IconButton sx={{ color: "#5F3B91" }} onClick={downloadEPass}>
//                 <CloudDownloadIcon fontSize="large" />
//               </IconButton>
//             </Grid>
//             <Grid item>
//               <IconButton sx={{ color: "#5F3B91" }} onClick={printEPass}>
//                 <PrintOutlinedIcon fontSize="large" />
//               </IconButton>
//             </Grid>
//           </Grid>
//         </Card>
//       </Container>
//     </>
//   );
// };

// export default VisitorCard;




import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Grid,
  Container,
  Box,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import html2canvas from "html2canvas";
import Navbar from "../components/Navbar";

const VisitorCard = () => {
  const { visitorId } = useParams(); // Get visitorId from URL params
  const visitorRef = useRef(null);
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/visitors/latest";
        if (visitorId) {
          url = `http://localhost:5000/api/visitors/${visitorId}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch visitor data");
        }
        
        const data = await response.json();
        // Handle different response structures
        const visitorData = data.data || data;
        setVisitor(visitorData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching visitor details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, [visitorId]);

  const downloadEPass = () => {
    html2canvas(visitorRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Visitor_E_Pass_${visitorId || 'latest'}.png`;
      link.click();
    });
  };

  const printEPass = () => {
    if (!visitor) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Visitor E-Pass</title>
        </head>
        <body>
          <h2>VISITOR E-PASS</h2>
          <img src="${visitor.photo}" alt="Visitor Photo" width="100" height="100" />
          <h3>${visitor.fullName}</h3>
          <p><strong>ID:</strong> ${visitor._id || visitor.id}</p>
          <p><strong>Time:</strong> ${visitor.time}</p>
          <p><strong>Host:</strong> ${visitor.personToVisit}</p>
          <p><strong>Purpose:</strong> ${visitor.reasonForVisit}</p>
          <p><strong>Company:</strong> ${visitor.visitorCompany}</p>
          <p><strong>Scan QR Code to Verify</strong></p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
        <Typography variant="h6">Loading Visitor Details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!visitor) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
        <Typography variant="h6">No Visitor Data Available</Typography>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
        <Card
          ref={visitorRef}
          sx={{
            maxWidth: 800,
            margin: "auto",
            p: 3,
            textAlign: "center",
            backgroundColor: "#EDE7F6",
            color: "#000",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              backgroundColor: "#D1C4E9",
              padding: "10px",
              borderRadius: 1,
            }}
          >
            VISITOR E-PASS
          </Typography>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid
              item
              textAlign="left"
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <Avatar src={visitor.photo} sx={{ width: 100, height: 100 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {visitor.fullName}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {visitor.time}
                </Typography>
                <Typography variant="body2">ID: {visitor._id || visitor.id}</Typography>
              </Box>
            </Grid>
            <Grid item textAlign="left" sx={{ ml: 4 }}>
              <Typography sx={{ mt: 1 }}>
                Purpose: {visitor.reasonForVisit}
              </Typography>
              <Typography>
                Visitor Designation: {visitor.designation}
              </Typography>
              <Typography>Company Name: {visitor.visitorCompany}</Typography>
            </Grid>
          </Grid>
          <hr />
          <CardContent>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item textAlign="left">
                <Typography>Host Name: {visitor.personToVisit}</Typography>
                <Typography>Host Designation: {visitor.designation}</Typography>
                <Typography>Mobile: {visitor.phoneNumber}</Typography>
                <Typography>Email: {visitor.email}</Typography>
              </Grid>
              <Grid item>
                <QRCodeCanvas value={visitor._id || visitor.id} size={100} />
                <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                  Scan QR CODE to verify E-pass
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <Typography
            variant="body2"
            sx={{ mt: 1, fontWeight: "bold", color: "#5F3B91" }}
          >
            This E-pass is valid for one-time entry only
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 2, pr: 2 }}
          >
            <Grid item>
              <IconButton sx={{ color: "#5F3B91" }} onClick={downloadEPass}>
                <CloudDownloadIcon fontSize="large" />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton sx={{ color: "#5F3B91" }} onClick={printEPass}>
                <PrintOutlinedIcon fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
};

export default VisitorCard;
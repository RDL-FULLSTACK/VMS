import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Link,
  IconButton,
  Divider,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #5a3d91 0%, #3f2a6d 100%)",
        color: "white",
        py: 1.5,
        mt: "auto",
        boxShadow: "0 -1px 3px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={1}>
          {/* Company Info Section */}
          <Grid item xs={12} sm={6} md={4}>
            {" "}
            {/* Adjusted md from 3 to 4 */}
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                letterSpacing: 0.3,
                background: "linear-gradient(to right, #ffffff, #e0d4ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                m: 0,
              }}
            >
              VisitorSync
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, lineHeight: 1.2, fontSize: "0.7rem" }}
            >
              Visitor management.
            </Typography>
            <Chip
              label="500+"
              size="small"
              sx={{
                mt: 0.5,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontSize: "0.6rem",
                height: 16,
                "&:hover": { bgcolor: "#e0d4ff", color: "#5a3d91" },
              }}
            />
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} sm={6} md={4}>
            {" "}
            {/* Adjusted md from 3 to 4 */}
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: "bold", letterSpacing: 0.2, m: 0 }}
            >
              Contact Us
            </Typography>
            <Stack spacing={0.5}>
              <Tooltip title="Email us" arrow>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    "&:hover": { color: "#e0d4ff" },
                  }}
                >
                  <Email sx={{ mr: 0.5, opacity: 0.9, fontSize: 16 }} />
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.9, fontSize: "0.7rem" }}
                  >
                    abhishektandel127@gmail.com
                  </Typography>
                </Box>
              </Tooltip>
              <Tooltip title="Call us" arrow>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    "&:hover": { color: "#e0d4ff" },
                  }}
                >
                  <Phone sx={{ mr: 0.5, opacity: 0.9, fontSize: 16 }} />
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.9, fontSize: "0.7rem" }}
                  >
                    +91 8804339456
                  </Typography>
                </Box>
              </Tooltip>
              <Tooltip title="Find us" arrow>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    "&:hover": { color: "#e0d4ff" },
                  }}
                >
                  <LocationOn sx={{ mr: 0.5, opacity: 0.9, fontSize: 16 }} />
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.9, fontSize: "0.7rem" }}
                  >
                    3th Floor, Sahyadri Campus, Adyar, Mangaluru, Karnataka
                    575007 RDL Technologies Pvt Ltd, address
                  </Typography>
                </Box>
              </Tooltip>
            </Stack>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} sm={6} md={4}>
            {" "}
            {/* Adjusted md from 3 to 4 */}
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: "bold", letterSpacing: 0.2, m: 0 }}
            >
              Follow Us
            </Typography>
            <Stack direction="row" spacing={0.3}>
              {[
                {
                  Icon: Facebook,
                  href: "https://www.facebook.com/researchdesignlab",
                  name: "Facebook",
                },
                { Icon: Twitter, href: "https://x.com/RDLab09", name: "Twitter" },
                {
                  Icon: LinkedIn,
                  href: "https://www.linkedin.com/company/rdl-technologies-pvt-ltd/posts/?feedView=all",
                  name: "LinkedIn",
                },
                {
                  Icon: Instagram,
                  href: "https://www.instagram.com/researchdesignlab/",
                  name: "Instagram",
                },
              ].map(({ Icon, href, name }, index) => (
                <Tooltip key={index} title={name} arrow>
                  <IconButton
                    href={href}
                    target="_blank"
                    sx={{
                      color: "white",
                      padding: 0.3,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#e0d4ff",
                        transform: "scale(1.1)",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider
          sx={{
            my: 1,
            background:
              "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent)",
          }}
        />

        {/* Bottom Section */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="caption"
            sx={{ opacity: 0.8, fontSize: "0.65rem", letterSpacing: 0.2 }}
          >
            © {new Date().getFullYear()} VisitorSync. All rights reserved.
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
            sx={{ mt: 0.5 }}
          >
            {["Privacy", "Terms"].map((text) => (
              <Link
                key={text}
                href={`/${text.toLowerCase()}`}
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.9,
                  fontSize: "0.7rem",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#e0d4ff",
                    borderBottom: "1px solid #e0d4ff",
                  },
                }}
              >
                {text}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

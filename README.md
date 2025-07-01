## 🚀 VMS: Visitor Management System
Welcome to VMS, a powerful and modern full-stack solution designed to streamline visitor management with efficiency, security, and scalability. Built with Node.js, Express, and React, and enhanced with Cloudinary for media handling, VMS offers a seamless experience for registering visitors, generating QR code badges, sending email notifications, and analyzing visitor data. Whether you're managing visitors for an office, event, or facility, VMS is your all-in-one platform—fast, secure, and future-ready.

## 🌌 Features That Redefine Visitor Management

### Visitor Registration  

Streamlined check-in/check-out with a user-friendly React interface.  
Capture visitor details (name, contact, purpose) and store securely in MongoDB.  
Generate QR code badges for secure access using qrcode.react.


### Event & Appointment Scheduling  

Schedule visitor appointments and assign hosts with automated workflows.  
Send email notifications to hosts and visitors via @emailjs/nodejs or nodemailer.  
Real-time tracking of visitor arrivals and departures.


### Reporting & Analytics  

Generate detailed visitor logs and export them as CSV (json2csv) or PDF (jspdf, jspdf-autotable).  
Visualize visitor trends with interactive charts using recharts.  
Download reports and badges using file-saver and jszip.


### Media Management  

Upload and manage visitor photos securely with Cloudinary.  
Optimize and transform images for badges or profiles effortlessly.


### User Interface  

Modern, responsive frontend built with React and Material-UI (@mui/material).  
Enhanced user experience with notifications (react-toastify) and alerts (sweetalert2).  
Date handling with @mui/x-date-pickers and dayjs for appointment scheduling.


### Robust & Scalable  

Backend powered by Express.js and MongoDB for high-performance data handling.  
Secure authentication with jsonwebtoken and password hashing via bcryptjs.  
Session management with express-session and connect-mongo.




## 🛠️ Tech Stack

## Backend

### Node.js & Express: High-performance server framework for RESTful APIs.  

### MongoDB: Scalable NoSQL database for visitor data storage.  

### Mongoose: Elegant MongoDB object modeling.  

### jsonwebtoken: Secure JWT-based authentication for admins and hosts.  

### bcryptjs: Password hashing for secure user management.  

### Cloudinary: Cloud-based storage and optimization for visitor photos.  

### Multer: File upload handling for images and documents.  

### @emailjs/nodejs & nodemailer: Email notifications for visitors and hosts.  

### json2csv: Export visitor logs as CSV files.  

### uuid: Generate unique identifiers for visitors or badges.  

### cors: Cross-origin resource sharing for secure frontend-backend communication.  

### dotenv: Environment variable management for secure configuration.  

### nodemon: Development server with auto-restart for efficiency.

## Frontend

### React: Modern JavaScript library for building user interfaces.  

### Material-UI (@mui/material, @mui/lab): Sleek, customizable UI components.  

### @mui/x-data-grid: Advanced data tables for visitor logs.  

### @mui/x-date-pickers & dayjs: Date and time handling for scheduling.  

### qrcode.react: Generate QR codes for visitor badges.  

### jspdf & jspdf-autotable: Generate PDF reports and badges.  

### recharts: Interactive charts for analytics.  

### axios: API requests to communicate with the backend.  

### react-router-dom: Client-side routing for seamless navigation.  

### react-toastify & sweetalert2: User notifications and alerts.  

### file-saver & jszip: Download reports and badges.  

### html2canvas: Capture UI elements for PDF generation.


## 🌠 Getting Started
## Prerequisites

Node.js (v16 or higher)  
npm (v8 or higher)  
MongoDB (local or cloud instance, e.g., MongoDB Atlas)  
A Cloudinary Account (with API credentials for media uploads)  
A JWT Secret Key (for authentication)  
Email service credentials (for @emailjs/nodejs or nodemailer)

## Backend Installation

Clone the Repository  
```
git clone https://github.com/RDL-FULLSTACK/VMS
````
    cd VMS/backend
Install Dependencies  
```
npm install
```

Set Up Environment VariablesCreate a .env file in the backend directory and add:  
```
PORT=5000
````
    MONGODB_URI=your_mongodb_connection_string
```
JWT_SECRET=your_jwt_secret_key
```
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```
CLOUDINARY_API_KEY=your_cloudinary_api_key
```
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
EMAILJS_API_KEY=your_emailjs_api_key (optional, for EmailJS)
```
    NODEMAILER_CONFIG=your_nodemailer_config (optional, for Nodemailer)


Run the Backend Server  
```
npm start
```
## The server will launch at http://localhost:5000.


## Frontend Installation

Navigate to the Frontend Directory  
```
cd VMS/frontend
```
Install Dependencies  
```
npm install
```
Run the Frontend Server  
```
npm start
```
## The frontend will launch at http://localhost:3000.



## 🔒 Security & Limits

### Authentication: JWT-based secure access for admins and hosts with bcryptjs password hashing.  

### File Size Limits: Visitor photos/documents capped at 5MB via Multer.  

### Data Validation: Strict input validation to prevent malicious data.  

### Media Security: Cloudinary ensures secure storage and access control for uploads.  

### Session Management: Secure sessions with express-session and connect-mongo.  

### Temporary Files: Automatically deleted after processing for privacy.


## 🌟 Why VMS?

### Efficiency: Streamlined check-in/check-out with QR code badges.  

### Security: Robust JWT authentication, secure media storage, and session management.  

### Versatility: Handles registration, scheduling, media, and analytics with a modern UI.  

### Future-Ready: Modular full-stack design for easy feature expansion.


## 🤝 Contributing
We welcome contributions from the community! To contribute:  

### Fork the repo.  
### Create a feature branch (git checkout -b feature/awesome-idea).  
### Commit your changes (git commit -m "Add awesome idea").  
### Push to the branch (git push origin feature/awesome-idea).  
### Open a Pull Request.


## Contributors
The following individuals have contributed to making VMS a reality:

| Name          | GitHub Link                              | Role                  |
|---------------|------------------------------------------|-----------------------|
| Ashish Goswami| https://github.com/Ashish6298            | Frontend, Backend  |
| Abhishek Vijay Tandel    | https://github.com/Abhishek1111333             | Frontend, UI/UX Designer    |
| Varun A L  | https://github.com/varun-al           | UI/UX Designer, Frontend        |
| Afrhan     | https://github.com/AfrhanSYED            | Frontend |

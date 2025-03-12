const Report = require("../models/Report"); // Import Report model
const fs = require("fs");
const { Parser } = require("json2csv"); // For CSV export
const multer = require("multer");
const upload = multer();

// Fetch all reports
const getReports = async (req, res) => {
  console.log("done")
  try {
    let query = {}; // Default: fetch all reports

  //   // Filter by Date (Optional)
  //   if (req.query.startDate && req.query.endDate) {
  //     query.visitDate = {
  //       $gte: new Date(req.query.startDate),
  //       $lte: new Date(req.query.endDate),
  //     };
    // }

    const reports = await Report.find(query);
    console.log("reports",reports) // Sort by latest visit date

    if (reports.length === 0) {
      return res.status(404).json({ message: "No reports found" });
    }

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
};

// Export reports as CSV
const exportReportsCSV = async (req, res) => {
  try {
    const reports = await Report.find();

    if (reports.length === 0) {
      return res.status(404).json({ message: "No reports available for export" });
    }

    const fields = ["_id", "visitorName", "visitDate", "purpose", "hostName"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(reports);

    res.header("Content-Type", "text/csv");
    res.attachment("reports.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Error exporting CSV", error: error.message });
  }
};

// Export reports as JSON file
const exportReportsJSON = async (req, res) => {
  try {
    const reports = await Report.find();
    if (reports.length === 0) {
      return res.status(404).json({ message: "No reports available for export" });
    }

    const filePath = "./exports/reports.json";
    fs.writeFileSync(filePath, JSON.stringify(reports, null, 2), "utf-8");

    res.download(filePath, "reports.json", () => {
      fs.unlinkSync(filePath); // Delete file after sending
    });
  } catch (error) {
    res.status(500).json({ message: "Error exporting JSON", error: error.message });
  }
};

const Addreport= async(req,res)=>{

  console.log("Add report")
  try {
    const {
      fullName,
      personToVisit,
      reasonForVisit,
      visit_date,
      // expectedDuration: expectedDurationString,
      // teamMembers: teamMembersString,
    } = req.body;

    console.log(req.body);
    console.log(fullName);
    console.log(personToVisit);
    console.log(reasonForVisit);
    console.log(visit_date);

    

    let expectedDuration, assets, teamMembers;
    // try {
    //   expectedDuration = expectedDurationString ? JSON.parse(expectedDurationString) : null;
    //   assets = assetsString ? JSON.parse(assetsString) : [];
    //   teamMembers = teamMembersString ? JSON.parse(teamMembersString) : [];
    // } catch (parseError) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid JSON format in fields",
    //     error: parseError.message,
    //   });
    // }

     // Validate required fields
     const requiredFields = {
      fullName,
      personToVisit,
      reasonForVisit,
      visit_date
      // expectedDuration,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => value === undefined || value === null || value === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

     // Additional validation
     if (!/^[A-Za-z\s]+$/.test(fullName) || !/^[A-Za-z\s]+$/.test(personToVisit)) {
      return res.status(400).json({
        success: false,
        message: "Names must contain only letters and spaces",
      });
    }
        // Validate team members
        // if (teamMembers && teamMembers.length > 0) {
        //   for (const member of teamMembers) {
        //     if (
        //       !member.name ||
        //       !member.email ||
        //       !member.documentDetail ||
        //       !["yes", "no"].includes(member.hasAssets)
        //     ) {
        //       return res.status(400).json({
        //         success: false,
        //         message:
        //           "All team member fields (name, email, documentDetail, hasAssets) are required",
        //       });
        //     }
        //     if (member.hasAssets === "yes" && (!member.assets || member.assets.length === 0)) {
        //       return res.status(400).json({
        //         success: false,
        //         message: "Assets required for team member if hasAssets is 'yes'",
        //       });
        //     }
        //     if (member.hasAssets === "yes") {
        //       for (const asset of member.assets) {
        //         if (!asset.quantity || !asset.type || !asset.serialNumber) {
        //           return res.status(400).json({
        //             success: false,
        //             message:
        //               "All team member asset fields (quantity, type, serialNumber) are required",
        //           });
        //         }
        //       }
        //     }
        //   }
        // }
         // Validate expectedDuration
    // if (
    //   !expectedDuration ||
    //   typeof expectedDuration.hours !== "number" ||
    //   typeof expectedDuration.minutes !== "number" ||
    //   expectedDuration.hours < 0 ||
    //   expectedDuration.minutes < 0 ||
    //   expectedDuration.minutes > 59
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "expectedDuration must be an object with valid hours (≥ 0) and minutes (0-59)",
    //   });
    // }

    const newreport = new Report({
          fullName,
          personToVisit,
          reasonForVisit,
          visit_date
         
        });
    
        await newreport.save();
    
        res.status(201).json({
          success: true,
          message: "Visitor report added successfully",
          data: newVisitor,
        });
      } catch (error) {
        console.error(error);
        res.status(400).json({
          success: false,
          message: "Error adding visitor report",
          error: error.message,
        });
      }
}

module.exports = { getReports, exportReportsCSV, exportReportsJSON,Addreport };

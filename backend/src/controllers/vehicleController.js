const Vehicle = require("../models/Vehicle");

// Existing functions remain unchanged...
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addVehicle = async (req, res) => {
  try {
    const { vehicleNumber, purpose, date, checkInTime } = req.body;

    if (!vehicleNumber || !purpose || !date || !checkInTime) {
      return res.status(400).json({
        message: "Missing required fields: vehicleNumber, purpose, date, and checkInTime are required"
      });
    }

    const existingVehicle = await Vehicle.findOne({
      vehicleNumber,
      checkOutTime: ""
    });

    if (existingVehicle) {
      return res.status(400).json({
        message: "Vehicle is already checked in and hasn't checked out yet"
      });
    }

    const newVehicle = new Vehicle({
      vehicleNumber,
      purpose,
      date,
      checkInTime,
      checkOutTime: "",
    });
    await newVehicle.save();
    res.status(201).json({
      message: "Vehicle registered successfully",
      vehicle: newVehicle
    });
  } catch (error) {
    console.error("Error in addVehicle:", error);
    res.status(400).json({
      message: error.message || "Failed to register vehicle due to server error"
    });
  }
};

exports.checkoutVehicle = async (req, res) => {
  try {
    const { vehicleNumber, checkOutTime } = req.body;
    const vehicle = await Vehicle.findOne({ vehicleNumber });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (vehicle.checkOutTime !== "") {
      return res.status(400).json({ message: "Vehicle already checked out" });
    }

    vehicle.checkOutTime = checkOutTime;
    await vehicle.save();
    res.status(200).json({ message: "Vehicle checked out successfully", vehicle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New function for vehicle reports with pagination, sorting, and filtering
exports.getVehicleReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "checkInTime", order = "desc", startDate, endDate, search, export: isExport } = req.query;

    let query = {};
    // Filter by date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    // Filter by vehicleNumber if search is provided
    if (search) {
      query.vehicleNumber = { $regex: search, $options: "i" }; // Case-insensitive search on vehicleNumber
    }

    const pageNum = parseInt(page);
    const limitNum = isExport ? 0 : parseInt(limit); // Disable limit for export
    const skip = isExport ? 0 : (pageNum - 1) * limitNum;

    let vehicles;
    if (isExport) {
      // Fetch all records for export
      vehicles = await Vehicle.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 });
    } else {
      // Paginated fetch for regular requests
      vehicles = await Vehicle.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limitNum);
    }

    const total = await Vehicle.countDocuments(query);
    const totalPages = isExport ? 1 : Math.ceil(total / limitNum);

    if (vehicles.length === 0) {
      return res.status(404).json({ message: "No vehicle reports found", vehicles: [], totalPages });
    }

    if (isExport) {
      return res.status(200).json({ vehicles });
    }

    res.status(200).json({ vehicles, totalPages });
  } catch (error) {
    console.error("Error fetching vehicle reports:", error);
    res.status(500).json({ message: "Error fetching vehicle reports", error: error.message });
  }
};
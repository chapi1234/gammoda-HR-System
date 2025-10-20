import Device from "../models/Device.js";

// Get all devices
export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find().populate("assignedTo");
    if (!devices || devices.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No devices found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Devices fetched successfully",
      data: devices,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

// Get device by ID
export const getDeviceById = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await Device.findById(id).populate("assignedTo");
    if (!device) {
      return res.status(404).json({
        status: false,
        message: "Device not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Device fetched successfully",
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

// Create a new device
export const createDevice = async (req, res) => {
  try {
    const device = new Device(req.body);
    await device.save();
    res.status(201).json({
      status: true,
      message: "Device created successfully",
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

// Update a device
export const updateDevice = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await Device.findByIdAndUpdate(id, req.body, { new: true });
    if (!device) {
      return res.status(404).json({
        status: false,
        message: "Device not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Device updated successfully",
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

// Delete a device
export const deleteDevice = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await Device.findByIdAndDelete(id);
    if (!device) {
      return res.status(404).json({
        status: false,
        message: "Device not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Device deleted successfully",
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

// Search devices by name/type/serialNumber
export const searchDevices = async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, "i");
    const devices = await Device.find({
      $or: [{ name: regex }, { type: regex }, { serialNumber: regex }],
    });
    if (!devices || devices.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No devices found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Devices fetched successfully",
      data: devices,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

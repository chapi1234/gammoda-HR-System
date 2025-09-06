import Employee from "../models/Employee.js";
import getRemoveEmployeeMailOptions from "../Email/removeEmployee.js";
import bcrypt from "bcryptjs";
import transporter from "../Email/nodemailer.js";
import getAddEmployeeMailOptions from "../Email/addEmployee.js";

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    if (!employees || employees.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No employees found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Employees fetched successfully",
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Employee fetched successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

export const createEmployee = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    department,
    salary,
    position,
    joinDate,
  } = req.body;

  try {
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !department ||
      !salary ||
      !position ||
      !address ||
      !joinDate
    ) {
      return res.status(400).json({
        status: false,
        message: "Please fill in all required fields",
      });
    }

    if (await Employee.exists({ email })) {
      return res.status(400).json({
        status: false,
        message: "Employee with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new Employee({
      name,
      email,
      password: hashedPassword,
      phone,
      department,
      salary,
      position,
      joinDate,
    });

    await user.save();
    transporter.sendMail(
      getAddEmployeeMailOptions(
        user.email,
        user.name,
        user.position,
        user.department,
        user.salary,
        password
      ),
      (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );
    res.status(201).json({
      status: true,
      message: "Employee created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    dateOfBirth,
    address,
    bio,
    skills,
    emergencyContact,
    emergencyPhone,
  } = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        dateOfBirth,
        address,
        bio,
        skills,
        emergencyContact,
        emergencyPhone,
      },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

export const editEmployee = async (req, res) => {
  const { name, email, phone, department, salary, position } = req.body;
  const { id } = req.params;
  try {
    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        department,
        salary,
        position,
      },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }
    // Send removal email before deleting
    transporter.sendMail(
      getRemoveEmployeeMailOptions(
        employee.email,
        employee.name,
        employee.position,
        employee.department
      ),
      (err, info) => {
        if (err) {
          console.error("Error sending removal email:", err);
        } else {
          console.log("Removal email sent:", info.response);
        }
      }
    );
    await Employee.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};


// export const resumeUpload = async (req, res) => {
//   const { id } = req.params;
//   const { file } = req;

//   if (!file) {
//     return res.status(400).json({
//       status: false,
//       message: "No file uploaded",
//     });
//   }

//   try {
//     const employee = await Employee.findById(id);
//     if (!employee) {
//       return res.status(404).json({
//         status: false,
//         message: "Employee not found",
//       });
//     }

//     // Update the employee's resume field
//     employee.resume = {
//       name: file.originalname,
//       type: file.mimetype,
//       url: file.path,
//       uploadDate: Date.now(),
//     };

//     await employee.save();

//     res.status(200).json({
//       status: true,
//       message: "Resume uploaded successfully",
//       data: employee.resume,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "Internal server error: " + error,
//     });
//   }
// }

export const resumeUpload = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({
      status: false,
      message: "No file uploaded",
    });
  }

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }

    // multer-storage-cloudinary already returns Cloudinary URL in file.path
    employee.resume = {
      name: req.file.originalname,
      type: req.file.mimetype,
      url: req.file.path, // Cloudinary secure URL
      uploadDate: Date.now(),
    };
    console.log('Runtime resume schema type:', Employee.schema.path('resume').constructor.name);
    console.log('Assigned resume value:', employee.resume);

    await employee.save();

    res.status(200).json({
      status: true,
      message: "Resume uploaded successfully",
      data: employee.resume,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

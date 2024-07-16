import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import ErrorHandler from "../middlewares/error.middlewares.js";
import { generateToken } from "../utils/jwtToken.js";
import { resModel } from "../utils/response.js";
import validator from "validator";
import cloudinary from "cloudinary";

const validateStringField = (field, value) => {
  if (typeof value == "string" && value.trim() === "") {
    throw new ErrorHandler(`${field} is required`, 400);
  }
};

const validateEmailField = (email) => {
  if (!validator.isEmail(email)) {
    throw new ErrorHandler("Invalid email format", 400);
  }
};

const validateDateField = (dob) => {
    const dateRegex =/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/(19|20)\d\d$/;

    if (!dateRegex.test(dob)) {
      throw new ErrorHandler(404, "dob must be in the format dd/mm/yyyy");
    }

    const [day, month, year] = dob.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      throw new ErrorHandler("dob must be a valid date", 400);
    }
};

const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    switch (key) {
      case "email":
        validateEmailField(value);
        break;
      case "dob":
        validateDateField(value);
        break;
      default:
        validateStringField(key, value);
        break;
    }
  }
};


/*:::::::::::::::::::::::::::::::::::::::::::::::PATIENT-REGISTRATION:::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const registerPatient = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  
    validateFields({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
    });

  const isRegistered = await User.findOne({ $or: {email, phone} });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });

  const payload=await User.findById(user._id).select("-password -refreshToken")
  generateToken(payload, "User Registered!", 201, res);
});

/*:::::::::::::::::::::::::::::::::::::::::::::::ADMIN-REGISTRATION:::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const registerAdmin=asyncHandler(async (req,res,next)=>{
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  
    validateFields({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
    });

  const isRegistered = await User.findOne({ $or: {email, phone} });
  if (isRegistered) {
    return next(new ErrorHandler("Admin already Registered!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });

  const payload=await User.findById(admin._id).select("-password -refreshToken")
  generateToken(payload, "Admin Registered!", 201, res);
})

/*:::::::::::::::::::::::::::::::::::::::::::::::DOCTOR-REGISTRATION:::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const registerDoctor = asyncHandler(async (req, res, next) => {
  console.log(req.files)
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }

  const { firstName, lastName, email, phone, nic, dob, gender, doctorDepartment, password } =
    req.body;

    console.log(typeof dob)

  validateFields({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    doctorDepartment,
    password,
  });

  const isRegistered = await User.findOne({ $or: { email, phone } });
  if (isRegistered) {
    return next(new ErrorHandler("Doctor already Registered!", 400));
  }

   const cloudinaryResponse = await cloudinary.uploader.upload(
     avatar.tempFilePath
   );
   if (!cloudinaryResponse || cloudinaryResponse.error) {
     console.error(
       "Cloudinary Error:",
       cloudinaryResponse.error || "Unknown Cloudinary error"
     );
     return next(
       new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
     );
   }

  const doc = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
    role: "Doctor",
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  const payload = await User.findById(doc._id).select(
    "-password -refreshToken"
  );
  generateToken(payload, "Doctor Registered!", 201, res);
});

/*::::::::::::::::::::::::::::::::::::::::::::::: GET USER-DATA :::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const getAllDoctors=asyncHandler(async (req, res)=>{
  try {
    const doctors = await User.find({role: "Doctor"});
    res.status(200).json(resModel(true, "Doctors retrieved successfully.", doctors));
  } catch (error) {
    res.status(404).json(resModel(false, "Failed to fetch doctors.", null));
  }
})

export const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.find({ role: "Patient" })
  res.status(200).json({
    success: true,
    user,
  });
});



/*::::::::::::::::::::::::::::::::::::::::::::::: USER-LOGIN :::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const userLogin=asyncHandler(async (req, res, next)=>{
  const {email, password, confirmPassword, role}=req.body;
  if(!email || !password || !confirmPassword || !role) throw new ErrorHandler("Please fill all the fields", 400);

  if(password !== confirmPassword){
    throw new ErrorHandler("Password and confirm password does not match", 400);
  } 

  const user= await User.findOne({email}).select("+password");  //fetches user data with the pswd field which was turned off for fetching in model
  if(!user){
    throw new ErrorHandler("Invalid email", 400);
  }

  const isPasswordMatch = await user.comparePassword(password);
  if(!isPasswordMatch){
    throw new ErrorHandler("Invalid password", 400);
  }

  if(role!==user.role){
    throw new ErrorHandler("User with this role is not found", 404);
  }

  const payload = await User.findOne({ email }).select("-password");
  generateToken(payload, "User logged in successfully!", 200, res);
  // res.status(200).json({success:true, message: "User logged in successfully!"})
})

/*::::::::::::::::::::::::::::::::::::::::::::::: USER-LOGOUT :::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

// Logout function for dashboard admin
export const logoutAdmin = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expiresIn: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutPatient = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      expiresIn: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutDoctor = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("doctorToken", "", {
      httpOnly: true,
      expiresIn: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Doctor Logged Out Successfully.",
    });
});


/*::::::::::::::::::::::::::::::::::::::::::::::: ADMIN-CONTROLS :::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

export const getAllAdmins=asyncHandler(async (req, res)=>{
  try {
    const admins = await User.find({role: "Admin"});
    res.status(200).json(resModel(true, "Admins retrieved successfully.", admins));
  } catch (error) {
    res.status(404).json(resModel(false, "Failed to fetch admins.", null));
  }
})

export const getAllPatients=asyncHandler(async (req, res)=>{
  try {
    const patients = await User.find({role: "Patient"});
    res.status(200).json(resModel(true, "Patients retrieved successfully.", patients));
  } catch (error) {
    res.status(404).json(resModel(false, "Failed to fetch patients.", null));
  }
})

export const getAdminById=asyncHandler(async (req, res)=>{
  try {
    const admin = await User.findOne({ role: "Admin", _id: req.params.id });
    if (!admin) {
      return res.status(404).json(resModel(false, "Admin with this id doesn't exist", null));
    }
    res.status(200).json(resModel(true, "Admin retrieved successfully.", admin));
  } catch (error) {
    res.status(400).json(resModel(true, "Failed to fetch admin.", null));
  }
})

// async function createAdmin(req, res) {
//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(req.body.passWord, 10);

//     const lastAdmin = await Admin.findOne().sort({ adminId: -1 });
//     const lastAdminId = lastAdmin ? lastAdmin.adminId : 0;

//     const admin = new Admin({
//       ...req.body,
//       passWord: hashedPassword,
//       adminId: lastAdminId + 1,
//     });
//     await admin.save();
//     res.json(resModel("SUCCESS", "Admin created successfully.", admin));
//   } catch (error) {
//     res.json(resModel("ERROR", "Failed to create admin.", error));
//   }
// }

export const updateAdmin=asyncHandler(async (req, res)=>{
  try {
    // Hash the password if it's included in the request body
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedAdmin = await User.findOneAndUpdate(
      { _id: req.params.id, role: "Admin" },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json(resModel(false, "Admin not found.", null));
    }
    res.status(200).json(resModel(true, "Admin updated successfully.", updatedAdmin));
  } catch (error) {
    res.status(400).json(resModel(false, "Failed to update admin.", error));
  }
})

export const deleteAdmin=asyncHandler(async (req, res)=>{
  try {
    const deletedAdmin = await User.findOneAndDelete({
      _id: req.params.id,
      role: "Admin"
    });
    if (!deletedAdmin) {
      return res.status(404).json(resModel(false, "Admin not found.", null));
    }
    res.status(200).json(resModel(true, "Admin deleted successfully.", deletedAdmin));
  } catch (error) {
    res.status(400).json(resModel(false, "Failed to delete admin.", error));
  }
})

export const updateDoctor = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Get doctor ID from URL params
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    doctorDepartment,
  } = req.body; // Get updated fields from the request body

  // Find the doctor by ID
  const doctor = await User.findById(id);

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404)); // If the doctor is not found, return an error
  }

  // Check if a new avatar is uploaded
  if (req.files && req.files.avatar) {
    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(avatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported!", 400));
    }

    // Delete old avatar from Cloudinary
    if (doctor.avatar && doctor.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(doctor.avatar.public_id);
    }

    // Upload new avatar to Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(
      docAvatar.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(
        new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
      );
    }

    doctor.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  doctor.firstName = firstName || doctor.firstName;
  doctor.lastName = lastName || doctor.lastName;
  doctor.email = email || doctor.email;
  doctor.phone = phone || doctor.phone;
  doctor.nic = nic || doctor.nic;
  doctor.dob = dob || doctor.dob;
  doctor.gender = gender || doctor.gender;
  doctor.doctorDepartment = doctorDepartment || doctor.doctorDepartment;

  await doctor.save();

  res.status(200).json(resModel(true, "Doctor updated successfully", doctor));
});

export const deleteDoctor = asyncHandler(async (req, res) => {
  try {
    const deletedDoctor = await User.findOneAndDelete({
      _id: req.params.id,
      role: "Doctor",
    });
    if (!deletedDoctor) {
      return res.status(404).json(resModel(false, "Doctor not found.", null));
    }
    res
      .status(200)
      .json(resModel(true, "Doctor deleted successfully.", deletedDoctor));
  } catch (error) {
    res.status(400).json(resModel(false, "Failed to delete Doctor", error));
  }
});
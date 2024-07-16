import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

//zod schema for user validation
const userZodSchema = z.object({
  firstName: z
    .string()
    .min(3, "First Name must contain at least 3 characters!"),

  lastName: z.string().min(3, "Last Name must contain at least 3 characters!"),

  email: z.string().email("Please provide a valid email address!"),
  
  phone: z.string().length(10, "Phone Number must contain exactly 10 digits!"),
  
  nic: z.string().length(13, "NIC must contain exactly 13 digits!"),
  
  dob: z.date().refine((date) => date < new Date(), "DOB must be in the past!"),
  
  gender: z.enum(
    ["Male", "Female", "Other"],
    "Gender must be either 'Male', 'Female' or 'Other'"
  ),
  
  password: z.string().min(8, "Password must contain at least 8 characters!"),
  
  role: z.enum(
    ["Admin", "Patient", "Doctor"],
    "Role must be 'Admin', 'Patient', or 'Doctor'"
  ),
  
  doctorDepartment: z.string().optional(),
  
  avatar: z
    .object({
      public_id: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
});

// Function to validate each field using zod
const validateField = (field, value) => {
  const result = userZodSchema.shape[field].safeParse(value);
  return result.success;
};

// User Schema definition
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validateField("firstName", value),
      message: "First Name must contain at least 3 characters!",
    },
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validateField("lastName", value),
      message: "Last Name must contain at least 3 characters!",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validateField("email", value),
      message: "Please provide a valid email address!",
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validateField("phone", value),
      message: "Phone Number must contain exactly 10 digits!",
    },
  },
  nic: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validateField("nic", value),
      message: "NIC must contain exactly 13 digits!",
    },
  },
  dob: {
    type: String,
    required: true,
    // validate: {
    //   validator: (value) => validateField("dob", value),
    //   message: "DOB must be in the past!",
    // },
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
    validate: {
      validator: (value) => validateField("gender", value),
      message: "Gender must be either 'Male' or 'Female'!",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: (value) => validateField("password", value),
      message: "Password must contain at least 8 characters!",
    },
  },
  refreshToken: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "Patient", "Doctor"],
    validate: {
      validator: (value) => validateField("role", value),
      message: "Role must be 'Admin', 'Patient', or 'Doctor'!",
    },
  },
  doctorDepartment: {
    type: String,
    validate: {
      validator: (value) => !value || validateField("doctorDepartment", value),
      message: "Invalid doctor department!",
    },
  },
  avatar: {
    public_id: String,
    url: String,
  },
});

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT
userSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);

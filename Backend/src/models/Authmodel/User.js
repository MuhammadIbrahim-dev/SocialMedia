import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // make sure name is required
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,   // no duplicate emails
      lowercase: true,
      trim: true,
    },
    avater :{
        type: String,
        default: ''

    },
    bio :{
        type: String,
        default: ''


    },
    score :{
        type: Number,
        default: 0

    },



  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
    password: {
      type: String,
      required: true,
      minlength: 6,   // enforce minimum password length
      select: false,  // Don't include password in queries by default
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);

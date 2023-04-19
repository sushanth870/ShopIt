const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: [30, "Your name cant exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter your password "],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Your password should be longer than 6 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
// Encrypting password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//return a jsonwebtoken
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

userSchema.methods.comparePassword = async function (recivedPassword) {
  return await bcrypt.compare(recivedPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {

  //genarate password reset 
  const resetToken =crypto.randomBytes(20).toString('hex');
  //Hash and set to resetPasswordToken
  this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
  // set resetPasswordExpire
  this.resetPasswordExpire = Date.now()+30*60*1000;
 
console.log(this.resetPasswordToken+"\n"+resetToken+"\n"+this.resetPasswordExpire);
  //return without hashed 
  return resetToken;
}
module.exports = mongoose.model("User", userSchema);

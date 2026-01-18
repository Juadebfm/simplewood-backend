const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define what a user looks like in our database
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // match: [/^[A-Za-z\s]+$/, "Name must only contain letters and spaces."],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true, // Automaticall generates the time the user was created (it comes default from MongoDB)
  }
);

// Hash Password
userSchema.pre("save", async function (next) {
  // if not new or recently modified continue to saving
  if (!this.isModified("password")) return next();

  // if it's new or recently modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// to compare password on login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// exports the schema to be used in a controller
module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true } // Automatically creates createdAt and updatedAt fields
);


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.hashPassword = async function () {
  const salt = await bcrypt.genSalt(11);
  this.password = await bcrypt.hash(this.password, salt);
  return this.password;
};

// Custom toFirestore method to prepare data for Firestore
userSchema.methods.toFirestore = function () {
  return {
    name: this.name,
    email: this.email,
    password: this.password,
    pic: this.pic,
    isAdmin: this.isAdmin,
    createdAt: this.createdAt || new Date(),
  };
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;

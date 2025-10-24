const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const StudentProfile = require("./studentProfile")
const TeacherProfile = require("./teacherProfile")
const AdminProfile = require("./adminProfile")

const userSchema = mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'student', 'teacher'],
      default: 'student',
    },
    isApproved: {
      type: Boolean,
      required: true,
      default: false,
    },
    salary: {
      type: Number,
    },
    fees: {
      type: Number,
    },
    country: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"]
    },
    age: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Active", "Demo", "Left"],
      default: "Active"
    },
    fcmToken: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// userSchema.post("save", async function (doc, next) {
//   try {
//     if (doc.role === "student") {
//       await StudentProfile.create({ user: doc._id });
//     } else if (doc.role === "teacher") {
//       await TeacherProfile.create({ user: doc._id });
//     } else if (doc.role === "admin") {
//       await AdminProfile.create({ user: doc._id });
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

const User = mongoose.model('User', userSchema);

module.exports = User;

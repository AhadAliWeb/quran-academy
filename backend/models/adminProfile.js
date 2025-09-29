const mongoose = require("mongoose")

const AdminProfileSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    permissions: [String] // e.g., ["manageUsers", "viewReports"]
  }, { timestamps: true });
  
const AdminProfile = mongoose.model("AdminProfile", AdminProfileSchema);


module.exports = AdminProfile;
  
// models/RecruiterRequest.js
const mongoose = require("mongoose");

const RecruiterRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  requestedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RecruiterRequest", RecruiterRequestSchema);

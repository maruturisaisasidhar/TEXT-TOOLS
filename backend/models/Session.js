const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  history: [
    {
      action: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Sessions expire after 24 hours
  },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;

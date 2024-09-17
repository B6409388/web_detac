const mongoose = require("mongoose");

const DataLicentSchema = new mongoose.Schema({
  licentplateNumber: String,
  licentplateProvince: String,
  licentplateImg: String,
  lat: String,
  long: String,
  created_at: { type: Date, default: Date.now },
});

const DataLicent = mongoose.model("DataLicent", DataLicentSchema);
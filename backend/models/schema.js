const mongoose = require("mongoose");

// สร้าง Schema สำหรับบันทึกข้อมูลป้ายทะเบียนรถ
const DataLicentSchema = new mongoose.Schema({
  licentplateNumber: String, // ฟิลด์นี้สามารถเพิ่มในอนาคตได้หากต้องการเก็บหมายเลขทะเบียน
  licentplateProvince: String, // ฟิลด์นี้สามารถเพิ่มในอนาคตได้หากต้องการเก็บจังหวัด
  licentplateImg: String, // รูปภาพที่บันทึกเป็น Base64
  lat: String, // ละติจูด
  long: String, // ลองจิจูด
  created_at: { type: Date, default: Date.now }, // วันที่และเวลาที่สร้างข้อมูล
});

// สร้าง Mongoose Model และส่งออก
module.exports = mongoose.model("LicensePlate", DataLicentSchema);

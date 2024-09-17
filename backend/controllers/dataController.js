const LicensePlate = require("../models/schema").DataLicent; // เรียกใช้งานโมเดล LicensePlate ที่สร้างไว้

// ฟังก์ชันสร้างและบันทึกข้อมูลใหม่
exports.createData = async (req, res) => {
  try {
    const { image, lat, long } = req.body; // รับค่าจาก request body

    // สร้างเอกสารใหม่จากโมเดล
    const newData = new LicensePlate({
      licentplateImg: image,
      lat: lat,
      long: long,
    });

    // บันทึกข้อมูลลงฐานข้อมูล
    await newData.save();

    res.status(201).json(newData); // ส่งข้อมูลที่บันทึกกลับไปยัง client
  } catch (error) {
    res.status(400).json({ message: error.message }); // ส่งข้อผิดพลาดกลับไปยัง client
  }
};

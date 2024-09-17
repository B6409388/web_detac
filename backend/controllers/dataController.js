// นำเข้าโมเดล LicensePlate ที่สร้างไว้
const LicensePlate = require("../models/schema");

// ฟังก์ชันสร้างและบันทึกข้อมูลใหม่
exports.createData = async (req, res) => {
  try {
    const { image, lat, long } = req.body; // รับค่าจาก request body

    // ตรวจสอบว่าค่าที่ส่งมาไม่เป็น undefined หรือ null
    if (!image || !lat || !long) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

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

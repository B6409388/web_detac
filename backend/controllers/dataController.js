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

//get
 // ��ังก์ชันด��งข้อมูลทั้งหมดจา����านข้อมูล
exports.getAllData = async (req, res) => {
  try {
    const data = await LicensePlate.find(); // ด��งข้อมูลทั้งหมดจา����านข้อมูล

    res.json(data); // ส่งข้อมูลทั้งหมดกลับไปยัง client
  } catch (error) {
    res.status(500).json({ message: error.message }); // ส่งข้อ��ิดพลา��กลับไปยัง client
  }
};

//getbyid
 // ฟังก์ชันดึงข้อมูลตาม id
exports.getDataById = async (req, res) => {
  try {
    const data = await LicensePlate.findById(req.params.id); // ดึงข้อมูลตาม id

    if (!data) return res.status(404).json({ message: "ไม่พบข้อมูล" }); // ตรวจสอบว่าข้อมูลหากไม่พบ

    res.json(data); // ส่งข้อมูลที่พบกลับไปยัง client
  } catch (error) {
    res.status(500).json({ message: error.message }); // ส่งข้อผิดพ
  }
}

//delete all
 // ��ังก์ชันลบข้อมูลทั้งหมด
 exports.deleteAllData = async (req, res) => {
  try {
    await LicensePlate.deleteMany(); // ลบข้อมูลทั้งหมด

    res.json({ message: "ข้อมูลทั้งหมดถูกลบแล้ว" }); // ส่งข้อมูลที่ถูกลบกลับไปยัง client
  } catch (error) {
    res.status(500).json({ message: error.message }); // ส่งข้อ��ิดพลา��กลับไปยัง client
  }
};

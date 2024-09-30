import axios from "axios";

//const url = "https://web-detac-1.onrender.com/api";

// // ใช้ URL สำหรับ API
const url = "http://localhost:3000/api"; // หรือ URL ที่คุณต้องการ เช่น https://web-detac-1.onrender.com/api

// ฟังก์ชันสำหรับสร้างข้อมูลป้ายทะเบียน
export const createLicensePlate = async (data) => {
  try {
    const response = await axios.post(`${url}/data`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // ส่งกลับข้อมูลที่ได้รับจากเซิร์ฟเวอร์
  } catch (error) {
    console.error("Error creating license plate:", error);
    throw error; // โยน error กลับไปหากเกิดข้อผิดพลาด
  }
};

// ฟังก์ชันเพื่อดึงข้อมูล location ทั้งหมด
export const fetchLocations = async () => {
  try {
    const response = await axios.get(`${url}/data`); // ดึงข้อมูลจาก API
    return response.data; // ส่งข้อมูลที่ได้จาก backend
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error; // โยน error กลับไปหากเกิดข้อผิดพลาด
  }
};

// ฟังก์ชันสำหรับลบข้อมูลทั้งหมด
export const deleteAllData = async () => {
  try {
    const response = await axios.delete(`${url}/data`); // ส่งคำขอลบข้อมูลทั้งหมดไปยัง API
    return response.data; // ส่งกลับข้อมูลที่ได้รับจากเซิร์ฟเวอร์
  } catch (error) {
    console.error("Error deleting all data:", error);
    throw error; // โยน error กลับไปหากเกิดข้อผิดพลาด
  }
};

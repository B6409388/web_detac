import React, { useState, useEffect } from "react";
import { fetchLocations } from "../services/api";
import * as XLSX from "xlsx"; // import ไลบรารีสำหรับการสร้าง Excel

const PagetableComponent = () => {
  const [locations, setLocations] = useState([]); // เก็บข้อมูล location ใน state
  const [filteredLocations, setFilteredLocations] = useState([]); // ข้อมูลที่ถูกกรอง
  const [loading, setLoading] = useState(true); // ใช้สำหรับแสดงสถานะการโหลด
  const [searchTerm, setSearchTerm] = useState(""); // เก็บค่าการค้นหา

  useEffect(() => {
    const getLocations = async () => {
      try {
        const data = await fetchLocations(); // ดึงข้อมูลจากฟังก์ชัน fetchLocations
        setLocations(data); // เก็บข้อมูลใน state
        setFilteredLocations(data); // ตั้งค่าเริ่มต้นของข้อมูลที่ถูกกรองเป็นข้อมูลทั้งหมด
        setLoading(false); // เปลี่ยนสถานะการโหลดเมื่อดึงข้อมูลเสร็จ
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false); // ยกเลิกสถานะการโหลดหากเกิดข้อผิดพลาด
      }
    };

    getLocations(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลเมื่อ component ถูก mount
  }, []);

  useEffect(() => {
    const results = locations.filter(location =>
      location.licentplateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.licentplateProvince.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(results); // กรองข้อมูลตามคำค้นหา
  }, [searchTerm, locations]);

  // ฟังก์ชันสำหรับการดาวน์โหลดข้อมูลเป็น Excel
  const downloadExcel = () => {
    // จำกัดความยาวของข้อมูลในแต่ละเซลล์ไม่เกิน 32,767 ตัวอักษร
    const shortenedLocations = filteredLocations.map(location => ({
      licentplateNumber: location.licentplateNumber.length > 32767 ? location.licentplateNumber.substring(0, 32767) : location.licentplateNumber,
      licentplateProvince: location.licentplateProvince.length > 32767 ? location.licentplateProvince.substring(0, 32767) : location.licentplateProvince,
      lat: location.lat,
      long: location.long,
      created_at: location.created_at
    }));

    const worksheet = XLSX.utils.json_to_sheet(shortenedLocations); // แปลงข้อมูลเป็น worksheet
    const workbook = XLSX.utils.book_new(); // สร้าง workbook ใหม่
    XLSX.utils.book_append_sheet(workbook, worksheet, "Locations"); // เพิ่ม worksheet ใน workbook

    // ดาวน์โหลดไฟล์ Excel
    XLSX.writeFile(workbook, "locations_data.xlsx");
  };

  if (loading) {
    return <div>Loading...</div>; // แสดงข้อความ loading เมื่อกำลังดึงข้อมูล
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Parking Information</h1>

      {/* Input ค้นหาข้อมูล */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by license plate or province"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // อัปเดตค่าค้นหา
        />
      </div>

      {/* ปุ่มดาวน์โหลดเป็น Excel */}
      <div className="mb-4">
        <button className="btn btn-success" onClick={downloadExcel}>
          Download as Excel
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">License Plate</th>
            <th scope="col">Province</th>
            <th scope="col">Latitude</th>
            <th scope="col">Longitude</th>
            <th scope="col">Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredLocations.map((location, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{location.licentplateNumber}</td>
              <td>{location.licentplateProvince}</td>
              <td>{location.lat}</td>
              <td>{location.long}</td>
              <td>{new Date(location.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PagetableComponent;

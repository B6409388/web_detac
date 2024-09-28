import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchLocations } from "../services/api"; // นำเข้าฟังก์ชันจาก services.js
import "./MapComponent.css";

// ฟังก์ชันสร้าง custom icon เปลี่ยนเป็นมุด
const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-icon", // ใช้ className เพื่อใช้ CSS ปรับแต่ง
    html: '🪨', // แสดงไอคอน "มุด"
    iconSize: [30, 30], // กำหนดขนาดของไอคอน
    iconAnchor: [15, 30], // จุดยึดของไอคอนตรงกลาง
    popupAnchor: [0, -30], // จุดยึดของ popup
  });
};

// ฟังก์ชันสำหรับเลื่อนไปยังตำแหน่งที่เลือก
const FlyToLocation = ({ lat, long, resetLocation }) => {
  const map = useMap(); // ใช้ useMap เพื่อควบคุมแผนที่
  useEffect(() => {
    if (lat && long) {
      map.flyTo([lat, long], 18, { duration: 2 }); // เลื่อนไปยังตำแหน่งและซูมเข้า
      resetLocation(); // Reset หลังจากเลื่อนไปหาตำแหน่งเสร็จ
    }
  }, [lat, long, map, resetLocation]);
  return null; // ไม่ต้องการ render อะไรจาก component นี้
};

const MapComponent = () => {
  const [locations, setLocations] = useState([]); // สร้าง state สำหรับเก็บ location
  const [loading, setLoading] = useState(true);  // จัดการ loading state
  const [searchTerm, setSearchTerm] = useState(""); // สร้าง state สำหรับเก็บข้อมูลที่ค้นหา
  const [filteredLocation, setFilteredLocation] = useState(null); // เก็บ location ที่ค้นหาแล้วเจอ

  useEffect(() => {
    // ใช้ฟังก์ชันจาก services เพื่อดึงข้อมูล
    const loadLocations = async () => {
      try {
        const data = await fetchLocations(); // เรียกใช้ฟังก์ชันที่เราสร้างใน services
        setLocations(data); // เก็บข้อมูลใน state
        setLoading(false); // ปิด loading state
      } catch (error) {
        console.error("Error loading locations:", error);
        setLoading(false); // ถ้าดึงข้อมูลไม่ได้ ให้ปิด loading state
      }
    };

    loadLocations();
  }, []);

  // ฟังก์ชันสำหรับจัดการการค้นหาเมื่อกดปุ่ม Search
  const handleSearch = () => {
    // กรอง location ตามป้ายทะเบียนที่ค้นหา
    const filtered = locations.find((item) =>
      item.licentplateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ถ้ามีป้ายทะเบียนที่ค้นหาเจอ ให้ตั้งค่าตำแหน่งที่เจอ
    if (filtered) {
      setFilteredLocation(filtered); // เลือกตำแหน่งแรกที่เจอ
    } else {
      alert("ไม่พบป้ายทะเบียนที่ค้นหา"); // แจ้งเตือนถ้าไม่เจอป้ายทะเบียน
    }
  };

  // ฟังก์ชัน reset สถานะหลังจาก flyTo เรียบร้อย
  const resetLocation = () => {
    setFilteredLocation(null);
  };

  if (loading) {
    return <div>Loading map...</div>; // แสดงข้อความระหว่างกำลังโหลดข้อมูล
  }

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="ค้นหาป้ายทะเบียน..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // จัดการการเปลี่ยนแปลงของ input
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      
      <MapContainer
        center={[14.8824, 102.0174]} // ตำแหน่งเริ่มต้นของแผนที่
        zoom={16}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* ถ้ามีการค้นหาที่เจอให้เลื่อนไปยังตำแหน่งนั้น */}
        {filteredLocation && (
          <FlyToLocation
            lat={filteredLocation.lat}
            long={filteredLocation.long}
            resetLocation={resetLocation} // Reset สถานะหลังจาก flyTo เสร็จ
          />
        )}

        {locations.map((item, index) => (
          <Marker
            key={index}
            position={[item.lat, item.long]} // ดึง lat, long จากข้อมูลที่ได้จาก backend
            icon={createCustomIcon()} // ใช้ไอคอน "มุด"
          >
            <Popup>
              <div className="popup-content">
                <p className="popup-plate">ทะเบียน: {item.licentplateNumber}</p>
                <p className="popup-province">จังหวัด: {item.licentplateProvince}</p>
                <p className="popup-date">จอดเมื่อ: {new Date(item.created_at).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchLocations } from "../services/api"; // นำเข้าฟังก์ชันจาก services.js
import "./MapComponent.css";

// ฟังก์ชันสร้าง custom icon
const createCustomIcon = (imageUrl) => {
  return L.icon({
    iconUrl: imageUrl,
    iconSize: [60, 40],
    iconAnchor: [30, 40],
    popupAnchor: [0, -40],
    className: "custom-marker",
  });
};

const MapComponent = () => {
  const [locations, setLocations] = useState([]); // สร้าง state สำหรับเก็บ location
  const [loading, setLoading] = useState(true);  // จัดการ loading state

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

  if (loading) {
    return <div>Loading map...</div>; // แสดงข้อความระหว่างกำลังโหลดข้อมูล
  }

  return (
    <MapContainer
      center={[14.8824, 102.0174]} // ตำแหน่งเริ่มต้นของแผนที่
      zoom={16}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((item, index) => (
        <Marker
          key={index}
          position={[item.lat, item.long]} // ดึง lat, long จากข้อมูลที่ได้จาก backend
          icon={createCustomIcon(item.licentplateImg)} // สร้าง icon จาก url ของภาพ
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
  );
};

export default MapComponent;

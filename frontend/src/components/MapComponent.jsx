import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchLocations } from "../services/api";
import "./MapComponent.css";

// ฟังก์ชันสร้าง custom icon
const createCustomIcon = (imageUrl) => {
  return L.icon({
    iconUrl: imageUrl,
    iconSize: [50, 50],
    iconAnchor: [30, 40],
    popupAnchor: [0, -40],
    className: "custom-marker",
  });
};

// ฟังก์ชันสำหรับเลื่อนไปยังตำแหน่งที่เลือก
const FlyToLocation = ({ lat, long, resetLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && long) {
      map.flyTo([lat, long], 18, { duration: 2 });
      resetLocation();
    }
  }, [lat, long, map, resetLocation]);
  return null;
};

// ฟังก์ชันสำหรับตั้งเวลาเที่ยงคืนของวันนี้ (UTC+7)
const getMidnightTimeInThailand = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // ตั้งเวลาเป็นเที่ยงคืน (ตามท้องถิ่น)
  now.setTime(now.getTime() + 7 * 60 * 60 * 1000); // ปรับเวลาเป็น UTC+7
  return now.toISOString().slice(0, 16);
};

// ฟังก์ชันสำหรับตั้งเวลาปัจจุบันในประเทศไทย (UTC+7)
const getCurrentTimeInThailand = () => {
  const now = new Date();
  now.setTime(now.getTime() + 7 * 60 * 60 * 1000); // ปรับเวลาเป็น UTC+7
  return now.toISOString().slice(0, 16);
};

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [displayedLocations, setDisplayedLocations] = useState([]); // ใช้แสดงผลที่กรองแล้ว
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // ตั้งค่าเวลาเริ่มต้นเป็นเที่ยงคืนของวันนี้ในประเทศไทย และเวลาสิ้นสุดเป็นเวลาปัจจุบันในประเทศไทย
  const [startTime, setStartTime] = useState(getMidnightTimeInThailand()); 
  const [endTime, setEndTime] = useState(getCurrentTimeInThailand()); // เวลาสิ้นสุดเป็นเวลาปัจจุบัน
  const popupRefs = useRef([]);

  // ฟังก์ชันสำหรับโหลดข้อมูลตำแหน่ง
  const loadLocations = async () => {
    try {
      const data = await fetchLocations();
      
      // โหลดข้อมูลทั้งหมดเข้ามา และไม่ทำการกรอง
      setLocations(data);
      setFilteredLocations(data); // ตั้งค่าเริ่มต้นของ filteredLocations ให้เป็นข้อมูลทั้งหมด
      setDisplayedLocations(data); // แสดงข้อมูลทั้งหมดเริ่มต้น
      setLoading(false);
    } catch (error) {
      console.error("Error loading locations:", error);
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับกรองข้อมูลตามช่วงเวลาที่เลือก
  const filterLocationsByTime = () => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const filteredData = locations.filter((item) => {
      const itemTime = new Date(item.created_at).getTime();
      return itemTime >= start && itemTime <= end;
    });

    setFilteredLocations(filteredData); // กรองข้อมูลที่อยู่ในช่วงเวลานั้น
    setDisplayedLocations(filteredData); // อัปเดตข้อมูลที่จะแสดงบนแผนที่
  };

  // ฟังก์ชันสำหรับการค้นหาป้ายทะเบียนตามคำค้นหา
  const handleSearch = () => {
    // ค้นหาข้อมูลที่ตรงกับป้ายทะเบียนที่ค้นหา แต่ไม่เปลี่ยนแปลง displayedLocations
    const searchResult = filteredLocations.find((item) => 
      item.licentplateNumber && 
      item.licentplateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (searchResult) {
      // หา index ของข้อมูลที่ค้นหาเจอ
      const index = filteredLocations.findIndex(item => 
        item.licentplateNumber && 
        item.licentplateNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // เปิด popup โดยใช้ ref
      if (popupRefs.current[index]) {
        popupRefs.current[index].openPopup();
      }
    } else {
      alert("ไม่พบป้ายทะเบียนที่ค้นหา");
    }
  };

  // เรียกใช้การกรองข้อมูลเมื่อเวลาที่กำหนดเปลี่ยนแปลง
  useEffect(() => {
    filterLocationsByTime();
  }, [startTime, endTime, locations]);

  useEffect(() => {
    loadLocations(); // โหลดข้อมูลครั้งแรกเมื่อคอมโพเนนต์ถูกติดตั้ง
  }, []);

  if (loading) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="ค้นหาป้ายทะเบียน..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="filter-container">
        <label>เวลาเริ่มต้น:</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <label>เวลาสิ้นสุด:</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <MapContainer
        center={[14.8824, 102.0174]} // ตำแหน่งเริ่มต้นของแผนที่
        zoom={16}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {displayedLocations.map((item, index) => (
          <Marker
            key={index}
            position={[item.lat, item.long]}
            icon={createCustomIcon(item.licentplateImg)}
            ref={(ref) => (popupRefs.current[index] = ref)} // เก็บ ref ของ Marker
          >
            <Popup>
              <div className="popup-content">
                <img src={item.licentplateImg} alt="License Plate" />
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

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

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocation, setFilteredLocation] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const popupRefs = useRef([]);

  // ฟังก์ชันสำหรับโหลดข้อมูลตำแหน่ง
  const loadLocations = async () => {
    try {
      const data = await fetchLocations();
      
      // โหลดข้อมูลทั้งหมดเข้ามา ไม่กรองตามช่วงเวลาในขั้นตอนนี้
      setLocations(data);
      setFilteredLocations(data); // ตั้งค่าเริ่มต้นของ filteredLocations ให้เป็นข้อมูลทั้งหมด
      setLoading(false);
    } catch (error) {
      console.error("Error loading locations:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  // ฟังก์ชัน handle สำหรับค้นหาป้ายทะเบียน
  const handleSearch = () => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const filtered = filteredLocations.find((item) => {
      const itemTime = new Date(item.created_at).getTime();
      
      // ตรวจสอบทั้งป้ายทะเบียนและช่วงเวลา
      return item.licentplateNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
             itemTime >= start && itemTime <= end;
    });

    if (filtered) {
      const index = filteredLocations.indexOf(filtered);
      setFilteredLocation(filtered);
      popupRefs.current[index].openPopup();
    } else {
      alert("ไม่พบป้ายทะเบียนที่ค้นหาในช่วงเวลาที่กำหนด");
    }
  };

  const resetLocation = () => {
    setFilteredLocation(null);
  };

  // ฟังก์ชันสำหรับการกรองตามช่วงเวลา
  const handleFilterByTime = () => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const filteredData = locations.filter((item) => {
      const itemTime = new Date(item.created_at).getTime();
      return itemTime >= start && itemTime <= end;
    });

    setFilteredLocations(filteredData); // ใช้ filteredLocations แทน locations
  };

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
        <button onClick={handleFilterByTime} className="filter-button">
          Filter
        </button>
      </div>

      <MapContainer
        center={[14.8824, 102.0174]} // ตำแหน่งเริ่มต้นของแผนที่
        zoom={16}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {filteredLocation && (
          <FlyToLocation
            lat={filteredLocation.lat}
            long={filteredLocation.long}
            resetLocation={resetLocation}
          />
        )}

        {filteredLocations.map((item, index) => (
          <Marker
            key={index}
            position={[item.lat, item.long]}
            icon={createCustomIcon(item.licentplateImg)}
            ref={(ref) => (popupRefs.current[index] = ref)}
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

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchLocations, deleteAllData } from "../services/api"; // นำเข้าฟังก์ชัน deleteAllData
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocation, setFilteredLocation] = useState(null);
  const popupRefs = useRef([]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchLocations();
        setLocations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading locations:", error);
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  // ฟังก์ชัน handle สำหรับค้นหาป้ายทะเบียน
  const handleSearch = () => {
    const filtered = locations.find((item) =>
      item.licentplateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered) {
      const index = locations.indexOf(filtered);
      setFilteredLocation(filtered);
      popupRefs.current[index].openPopup();
    } else {
      alert("ไม่พบป้ายทะเบียนที่ค้นหา");
    }
  };

  const resetLocation = () => {
    setFilteredLocation(null);
  };

  // ฟังก์ชันสำหรับลบข้อมูลทั้งหมด
  const handleDeleteAll = async () => {
    try {
      await deleteAllData(); // เรียกใช้ฟังก์ชันลบข้อมูล
      alert("ลบข้อมูลทั้งหมดสำเร็จไปถ่ายใหม่ครับ :)");
      window.location.reload(); // รีเฟรชหน้าเมื่อกดลบข้อมูลทั้งหมด
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
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
        <button onClick={handleDeleteAll} className="delete-button">
          ลบข้อมูลทั้งหมดสำเร็จไปถ่ายใหม่ครับ :
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

        
        {locations.map((item, index) => (
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
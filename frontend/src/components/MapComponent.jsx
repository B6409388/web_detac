import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapComponent.css";

const createCustomIcon = (imageUrl) => {
  return L.icon({
    iconUrl: imageUrl,
    iconSize: [60, 40],
    iconAnchor: [30, 40],
    popupAnchor: [0, -40],
    className: "custom-marker",
  });
};

const locations = [
  {
    lat: 14.8824,
    long: 102.0174,
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSltvz4NShUL4wxlRBn64-Qzv6G-NFJ6mZtu8uGlMHPWccDvSSdTmyhaYfIOufxRRD2ht84h7z-LtGPMpyRtINZUTDOWh9iNdCFoZtLJZqOTIhR-vP5VVmIuESE0Jo8sxhks1QwpVL9Fw&usqp=CAc",
    plateNumber: "9กฉ 8899",
    province: "กรุงเทพมหานคร",
  },
  {
    lat: 14.8828,
    long: 102.0169,
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTgq9SVpNP1onLiZ687izTo8j7O2TEUcrxFIYeIwotSyucrs307EYcflmPasbSFRmHjuyDPynSViNanSQJ0bu-v7nrpt1Rw39Qj3DoZdHSfgYWLN6XxYSbyNCVBqnTP&usqp=CAc",
    plateNumber: "กต 9999",
    province: "นนทบุรี",
  },
];

const MapComponent = () => {
  return (
    <MapContainer
      center={[14.8824, 102.0174]}
      zoom={16}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((item, index) => (
        <Marker
          key={index}
          position={[item.lat, item.long]}
          icon={createCustomIcon(item.image)}
        >
          <Popup>
            <div className="popup-content">
              <p className="popup-plate">ทะเบียน: {item.plateNumber}</p>
              <p className="popup-province">จังหวัด: {item.province}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;

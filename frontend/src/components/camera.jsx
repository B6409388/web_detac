import React, { useRef, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Webcam from "react-webcam";
import { useGeolocated } from "react-geolocated";
import "./camera.css";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [position, setPosition] = useState(null);

  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    getPosition,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      maximumAge: 0, // No cache, always get fresh location
      timeout: 10000, // Timeout if it takes too long to get position
    },
    userDecisionTimeout: 5000,
  });

  // Continuously watch for position updates to get better accuracy
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (error) => console.error("Error fetching location", error),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Function to send data to the backend
  const sendToBackend = async (data) => {
    try {
      const response = await fetch(
        "https://web-detac-1.onrender.com/api/data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("การส่งข้อมูลไปยัง Backend ไม่สำเร็จ");
      }

      const result = await response.json();
      console.log("ผลลัพธ์จาก Backend:", result);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error);
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot(); // Take picture and convert to Base64

    if (!isGeolocationAvailable) {
      console.error("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
      return;
    }

    if (!isGeolocationEnabled) {
      console.error("คุณยังไม่ได้เปิดการใช้งานระบุตำแหน่ง");
      return;
    }

    if (position) {
      const data = {
        image: imageSrc,
        lat: position.latitude,
        long: position.longitude,
        accuracy: position.accuracy, // Additional info about accuracy
      };

      console.log("ข้อมูลที่จะส่ง:", data);
      sendToBackend(data);
    } else {
      console.log("กำลังรอรับข้อมูลตำแหน่ง...");
    }
  };

  const videoConstraints = {
    facingMode: "environment",
  };

  return (
    <div className=" d-flex flex-column justify-content-center align-items-center">
      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      </div>
      <Button onClick={capture} className="btn-pp">
        ถ่ายรูปและบันทึกตำแหน่ง
      </Button>
    </div>
  );
};

export default CameraComponent;

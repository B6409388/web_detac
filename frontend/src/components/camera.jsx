import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import Webcam from "react-webcam";
import { useGeolocated } from "react-geolocated";

const CameraComponent = () => {
  const webcamRef = useRef(null);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  // ฟังก์ชันส่งข้อมูลไปยัง Backend
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
    const imageSrc = webcamRef.current.getScreenshot(); // ถ่ายรูปและแปลงเป็น Base64

    if (!isGeolocationAvailable) {
      console.error("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
      return;
    }

    if (!isGeolocationEnabled) {
      console.error("คุณยังไม่ได้เปิดการใช้งานระบุตำแหน่ง");
      return;
    }

    if (coords) {
      const data = {
        image: imageSrc,
        lat: coords.latitude,
        long: coords.longitude,
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
    <div className="bg-secondary d-flex flex-column justify-content-center align-items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <Button onClick={capture} className="btn-pp">
        ถ่ายรูปและบันทึกตำแหน่ง
      </Button>
    </div>
  );
};

export default CameraComponent;

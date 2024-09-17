import React, { useRef } from "react";
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
      const response = await fetch("http://localhost:3000/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

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

      // เรียกฟังก์ชันเพื่อส่งข้อมูลไปยัง Backend
      sendToBackend(data);
    } else {
      console.log("กำลังรอรับข้อมูลตำแหน่ง...");
    }
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <button onClick={capture}>ถ่ายรูปและบันทึกตำแหน่ง</button>
    </div>
  );
};

export default CameraComponent;

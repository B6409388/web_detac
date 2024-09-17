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

      // sent data to backend server endpoint http://localhost:3000/api/data
      if (data) {
        try {
          const res = createLicensePlate(data);
          console.log(res);
        } catch (error) {
          console.log(error);
        }
      }

      console.log(data);
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

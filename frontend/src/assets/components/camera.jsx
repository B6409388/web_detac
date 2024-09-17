import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [location, setLocation] = useState({ lat: null, long: null });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error retrieving location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    getLocation();

    const data = {
      image: imageSrc,
      lat: location.lat,
      long: location.long,
    };

    console.log(data); 
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
      <button onClick={capture}>ถ่ายรูป</button>
    </div>
  );
};

export default CameraComponent;

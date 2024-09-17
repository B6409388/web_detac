import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrc(imageSrc);
      console.log(imageSrc);
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
      <button onClick={capture}>ถ่ายรูป</button>
      {imageSrc && <img src={imageSrc} alt="ถ่ายรูป" />}
    </div>
  );
};

export default CameraComponent;

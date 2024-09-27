import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import CameraComponent from "./components/camera";
import MapComponent from "./components/MapComponent";
import { useState } from "react";  // นำเข้าฟังก์ชัน useState เพื่อจัดการการปิด/เปิดเมนู

function App() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            Home
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-toggle="collapse" 
            data-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded={!isNavCollapsed ? true : false} 
            aria-label="Toggle navigation" 
            onClick={handleNavCollapse}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/camera">
                  Camera
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/map">
                  Map
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<CameraComponent />} />
          <Route path="/map" element={<MapComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className="mt-4">
    <h2>Welcome to Camera and Map App</h2>
    <p>Use the navigation bar to access the Camera or Map.</p>
  </div>
);

export default App;

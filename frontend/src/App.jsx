import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css"; // Include CSS for video background
import CameraComponent from "./components/camera";
import MapComponent from "./components/MapComponent";
import TabelComponent from "./components/pagetable";
import { useState } from "react";

function App() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <div className="app">
      <Router>
        <div className="container">
          {/* Background Video */}
          <video autoPlay muted loop id="background-video">
            <source src="https://videos.pexels.com/video-files/28638125/12438300_2560_1440_24fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Navbar */}
          <nav className="navbar navbar-expand-lg ">
            <Link className="navbar-brand" to="/">
              Home
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              aria-controls="navbarNav" 
              aria-expanded={!isNavCollapsed ? true : false} 
              aria-label="Toggle navigation" 
              onClick={handleNavCollapse}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
                <li className="nav-item">
                  <Link className="nav-link" to="/tabel">
                    Table
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/camera" element={<CameraComponent />} />
            <Route path="/map" element={<MapComponent />} />
            <Route path="/tabel" element={<TabelComponent />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

const Home = () => (
  <div className="mt-4">
    <h2>Welcome to Camera and Map App</h2>
    <p>Use the navigation bar to access the Camera or Map.</p>
  </div>
);

export default App;

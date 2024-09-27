import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import CameraComponent from "./components/camera";
import MapComponent from "./components/MapComponent";
function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            Home
          </Link>
          <div className="collapse navbar-collapse">
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

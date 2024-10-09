import React, { useState, useEffect } from "react";
import { fetchLocations } from "../services/api";
import * as XLSX from "xlsx";

const PagetableComponent = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getLocations = async () => {
      try {
        const data = await fetchLocations();
        console.log(data); // ตรวจสอบข้อมูล
        setLocations(data);
        setFilteredLocations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    getLocations();
  }, []);

  useEffect(() => {
    const results = locations.filter(location =>
      (location.licentplateNumber && location.licentplateNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (location.licentplateProvince && location.licentplateProvince.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredLocations(results);
  }, [searchTerm, locations]);

  const downloadExcel = () => {
    const shortenedLocations = filteredLocations.map(location => ({
      licentplateNumber: location.licentplateNumber,
      licentplateProvince: location.licentplateProvince,
      lat: location.lat,
      long: location.long,
      created_at: location.created_at
    }));

    const worksheet = XLSX.utils.json_to_sheet(shortenedLocations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");

    XLSX.writeFile(workbook, "locations_data.xlsx");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Parking Information</h1>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by license plate or province"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <button className="btn btn-success" onClick={downloadExcel}>
          Download as Excel
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">License Plate</th>
            <th scope="col">Province</th>
            <th scope="col">Latitude</th>
            <th scope="col">Longitude</th>
            <th scope="col">Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{location.licentplateNumber}</td>
                <td>{location.licentplateProvince}</td>
                <td>{location.lat}</td>
                <td>{location.long}</td>
                <td>{new Date(location.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PagetableComponent;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CarList.css';

const countryFlags = {
    'Japan': '🇯🇵',
    'Germany': '🇩🇪',
    'United States': '🇺🇸',
    'Italy': '🇮🇹',
    'France': '🇫🇷',
    'United Kingdom': '🇬🇧',
    'Austria': '🇦🇹',
    'South Korea': '🇰🇷',
    'Czech': '🇨🇿',
    'Sweden': '🇸🇪',
  };

function CarList() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('YOUR_API_URL/api/cars');
        setCars(response.data);
        setFilteredCars(response.data);
        
        const uniqueCountries = [...new Set(response.data.map(car => car.country))].sort();
        const uniqueManufacturers = [...new Set(response.data.map(car => car.manufacturer))].sort();
        
        setCountries(uniqueCountries);
        setManufacturers(uniqueManufacturers);
        setLoading(false);
      } catch (err) {
        setError('Error fetching cars');
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = cars;
      if (selectedCountry) {
        filtered = filtered.filter(car => car.country === selectedCountry);
      }
      if (selectedManufacturer) {
        filtered = filtered.filter(car => car.manufacturer === selectedManufacturer);
      }
      setFilteredCars(filtered);
    };

    applyFilters();
  }, [cars, selectedCountry, selectedManufacturer]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedManufacturer('');
  };

  const handleManufacturerChange = (e) => {
    setSelectedManufacturer(e.target.value);
    setSelectedCountry('');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="car-list-container">
      <h1>GT7 Car List</h1>
      <div className="filters">
        <select value={selectedCountry} onChange={handleCountryChange}>
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>
              {countryFlags[country] || ''} {country}
            </option>
          ))}
        </select>
        <select value={selectedManufacturer} onChange={handleManufacturerChange}>
          <option value="">All Manufacturers</option>
          {manufacturers.map(manufacturer => (
            <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
          ))}
        </select>
      </div>
      <div className="car-grid">
        {filteredCars.map(car => (
          <Link to={`/car/${car.id}`} key={car.id} className="car-card">
            <div className="car-image" style={{backgroundImage: `url(${car.image_url || 'default-car-image.jpg'})`}}></div>
            <div className="car-info">
              <h2>{car.name}</h2>
              <p>{car.manufacturer}</p>
              <p>{countryFlags[car.country] || ''} {car.country}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CarList;
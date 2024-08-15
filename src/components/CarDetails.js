import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CarDetails.css';
import { API_BASE_URL, COUNTRY_FLAGS } from '../config';

function CarDetails() {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cars/${id}`);
        setCar(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching car details');
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!car) return <div className="not-found">Car not found</div>;

  return (
    <div className="car-details-container">
      <div className="car-details">
        <div className="car-details-image" style={{backgroundImage: `url(${car.image_url || 'default-car-image.jpg'})`}}></div>
        <div className="car-details-info">
          <h1>{car.name}</h1>
          <p><strong>Manufacturer:</strong> {car.manufacturer}</p>
          <p><strong>Country:</strong> {COUNTRY_FLAGS[car.country] || ''} {car.country}</p>
          {/* Add more car details here as needed */}
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
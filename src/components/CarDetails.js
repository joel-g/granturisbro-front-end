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
          <div className="car-details-grid">
            {car.manufacturer && <p><strong>Manufacturer:</strong> {car.manufacturer}</p>}
            {car.country && <p><strong>Country:</strong> {COUNTRY_FLAGS[car.country] || ''} {car.country}</p>}
            {car.year && <p><strong>Year:</strong> {car.year}</p>}
            {car.hp && <p><strong>Horsepower:</strong> {car.hp}</p>}
            {car.pp && <p><strong>Performance Points:</strong> {car.pp.toFixed(1)}</p>}
            {car.drivetrain && <p><strong>Drivetrain:</strong> {car.drivetrain}</p>}
            {car.aspiration && <p><strong>Aspiration:</strong> {car.aspiration}</p>}
            {car.availability && <p><strong>Availability:</strong> {car.availability}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
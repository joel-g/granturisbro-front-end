import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import './CarDetails.css';
import { API_BASE_URL, COUNTRY_FLAGS, IMAGES_BASE_URL } from '../config';

function CarDetails() {
  const { theme } = useContext(ThemeContext);
  const { user, userCars, fetchUserCars, addCarToCollection, removeCarFromCollection } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cars/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCar(data);
        } else {
          setError('Error fetching car details');
        }
      } catch (err) {
        setError('Error fetching car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const isOwned = userCars.some(userCar => userCar.id === parseInt(id));

  const toggleUserCar = async () => {
    if (!user) return;

    try {
      if (isOwned) {
        await removeCarFromCollection(id);
      } else {
        await addCarToCollection(id);
      }
      await fetchUserCars();
    } catch (error) {
      console.error('Error updating user car:', error);
    }
  };

  const formatRewardInfo = (rewardFrom) => {
    if (!rewardFrom) return null;
    const [type, ...details] = rewardFrom.split(';');

    const capitalizeWords = (str) => {
      return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formatType = (type) => {
      return type === 'menubook' ? 'Menu Book' : capitalizeWords(type);
    };

    const getEmojiForMedal = (detail) => {
      if (detail.toLowerCase().includes('bronze')) return '🥉';
      if (detail.toLowerCase().includes('gold')) return '🥇';
      return '';
    };

    const formatDetail = (detail) => {
      const emoji = getEmojiForMedal(detail);
      const cleanDetail = detail.replace(/(bronze|gold)/i, '').trim();
      return `${cleanDetail}${emoji}`.trim();
    };

    return (
      <div className="reward-info-box">
        <h3>Reward Information</h3>
        <p><strong>Reward Type:</strong> {formatType(type)}</p>
        {details.length > 0 && (
          <p>
            <strong>Details:</strong> {details.map(formatDetail).join(' ')}
          </p>
        )}
      </div>
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!car) return <div className="not-found">Car not found</div>;

  return (
    <div className={`car-details-container ${theme} ${isOwned ? 'owned' : ''}`}>
      <div className="car-details">
        <div className="car-details-image" style={{ backgroundImage: `url(${IMAGES_BASE_URL + "/large/" + car.image_url || 'default-car-image.jpg'})` }}></div>
        <div className="car-details-info">
          <h1>{car.name}</h1>
          {user && (
            <button 
              className="toggle-ownership"
              onClick={toggleUserCar}
            >
              {isOwned ? 'Remove from My Collection' : 'Add to My Collection'}
            </button>
          )}
          <div className="car-details-grid">
            {car.manufacturer && <p><strong>Manufacturer:</strong> {car.manufacturer}</p>}
            {car.country && <p><strong>Country:</strong> {COUNTRY_FLAGS[car.country] || ''} {car.country}</p>}
            {car.year && <p><strong>Year:</strong> {car.year}</p>}
            {car.hp && <p><strong>Horsepower:</strong> {car.hp}</p>}
            {car.weight && <p><strong>Weight:</strong> {car.weight} lb</p>}
            {car.weight && car.hp && <p><strong>Power-to-Weight Ratio:</strong> {(car.hp / car.weight).toFixed(2)} hp/lb</p>}
            {car.pp && <p><strong>Performance Points:</strong> {car.pp.toFixed(1)}</p>}
            {car.drivetrain && <p><strong>Drivetrain:</strong> {car.drivetrain}</p>}
            {car.aspiration && <p><strong>Aspiration:</strong> {car.aspiration}</p>}
            {car.availability && <p><strong>Availability:</strong> {car.availability}</p>}
            {car.price && <p><strong>Price:</strong> {car.price.toLocaleString()} Cr</p>}
          </div>
        </div>
      </div>
      {car.reward_from && formatRewardInfo(car.reward_from)}
    </div>
  );
}

export default CarDetails;
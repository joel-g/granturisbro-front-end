import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CarDetails() {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`https://gt7.joelguerra.dev/api/cars/${id}`)
      .then(response => {
        setCar(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching car details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!car) return <div>Car not found</div>;

  return (
    <div>
      <h1>{car.year} {car.manufacturer} {car.name}</h1>
      <img src={car.image_url} alt={`${car.manufacturer} ${car.name}`} />
      <p>Category: {car.category}</p>
      <p>Country: {car.country}</p>
      <p>Price: {car.price}</p>
      <h2>Tags</h2>
      <ul>
        {car.tags && car.tags.map(tag => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
      <h2>Acquisition Options</h2>
      <ul>
        {car.acquisitionOptions && car.acquisitionOptions.map(option => (
          <li key={option.id}>
            {option.acquisition_method}: {option.price || option.cost}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CarDetails;
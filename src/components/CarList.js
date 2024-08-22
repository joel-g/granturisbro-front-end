import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './CarList.css';
import { API_BASE_URL, COUNTRY_FLAGS, IMAGES_BASE_URL } from '../config';

function CarList() {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countries, setCountries] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [categories, setCategories] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const getParamValue = (param) => searchParams.get(param) || '';

    const [filters, setFilters] = useState({
        country: getParamValue('country'),
        manufacturer: getParamValue('manufacturer'),
        availability: getParamValue('availability'),
        category: getParamValue('category'),
        search: getParamValue('search'),
        sortBy: getParamValue('sortBy'),
        sortOrder: getParamValue('sortOrder') || 'asc'
    });

    const updateURL = useCallback(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        setSearchParams(params);
    }, [filters, setSearchParams]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/cars`);
                setCars(response.data);

                const uniqueCountries = [...new Set(response.data.map(car => car.country))].sort();
                const uniqueManufacturers = [...new Set(response.data.map(car => car.manufacturer))].sort();
                const uniqueCategories = [...new Set(response.data.map(car => car.category))].sort();

                setCountries(uniqueCountries);
                setManufacturers(uniqueManufacturers);
                setCategories(uniqueCategories);
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
            if (filters.country) {
                filtered = filtered.filter(car => car.country === filters.country);
            }
            if (filters.manufacturer) {
                filtered = filtered.filter(car => car.manufacturer === filters.manufacturer);
            }
            if (filters.availability) {
                filtered = filtered.filter(car => car.availability === filters.availability);
            }
            if (filters.category) {
                filtered = filtered.filter(car => car.category === filters.category);
            }
            if (filters.search) {
                filtered = filtered.filter(car =>
                    car.name.toLowerCase().includes(filters.search.toLowerCase())
                );
            }

            if (filters.sortBy) {
                filtered = filtered.filter(car => car[filters.sortBy] != null);
                filtered.sort((a, b) => {
                    if (a[filters.sortBy] < b[filters.sortBy]) return filters.sortOrder === 'asc' ? -1 : 1;
                    if (a[filters.sortBy] > b[filters.sortBy]) return filters.sortOrder === 'asc' ? 1 : -1;
                    return 0;
                });
            }

            setFilteredCars(filtered);
        };

        applyFilters();
        updateURL();
    }, [cars, filters, updateURL]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    const handleSortChange = (e) => {
        const [newSortBy, newSortOrder] = e.target.value.split('-');
        setFilters(prevFilters => ({
            ...prevFilters,
            sortBy: newSortBy,
            sortOrder: newSortOrder
        }));
    };

    const clearFilters = () => {
        setFilters({
            country: '',
            manufacturer: '',
            availability: '',
            category: '',
            search: '',
            sortBy: '',
            sortOrder: 'asc'
        });
        navigate('', { replace: true });
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="car-list-container">
            <h1>GT7 Car List</h1>
            <div className="filters">
                <div className="filters-row">
                    <input
                        type="text"
                        placeholder="Search car name..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={filters.manufacturer}
                        onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                    >
                        <option value="">All Manufacturers</option>
                        {manufacturers.map(manufacturer => (
                            <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                        ))}
                    </select>
                    <select
                        value={filters.country}
                        onChange={(e) => handleFilterChange('country', e.target.value)}
                    >
                        <option value="">All Countries</option>
                        {countries.map(country => (
                            <option key={country} value={country}>
                                {COUNTRY_FLAGS[country] || ''} {country}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.availability}
                        onChange={(e) => handleFilterChange('availability', e.target.value)}
                        className="availability-select"
                    >
                        <option value="">All Availabilities</option>
                        <option value="Brand Central">Brand Central</option>
                        <option value="Used Car Dealership">Used Car Dealership</option>
                        <option value="Legendary Dealership">Legendary Dealership</option>
                        <option value="Invitation Only">Invitation Only</option>
                        <option value="Gift">Gift</option>
                    </select>
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="category-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <select onChange={handleSortChange} value={`${filters.sortBy}-${filters.sortOrder}`}>
                        <option value="">Sort by...</option>
                        <option value="hp-asc">HP (Low to High)</option>
                        <option value="hp-desc">HP (High to Low)</option>
                        <option value="pp-asc">PP (Low to High)</option>
                        <option value="pp-desc">PP (High to Low)</option>
                        <option value="year-asc">Year (Old to New)</option>
                        <option value="year-desc">Year (New to Old)</option>
                        <option value="price-asc">Price (Low to High)</option>
                        <option value="price-desc">Price (High to Low)</option>
                        <option value="weight-asc">Weight (Light to Heavy)</option>
                        <option value="weight-desc">Weight (Heavy to Light)</option>
                    </select>
                    <button onClick={clearFilters} className="clear-filters-btn">Clear Filters</button>
                </div>
            </div>
            <div className="car-grid">
                {filteredCars.map(car => (
                    <Link to={`/car/${car.id}`} key={car.id} className="car-card">
                        <div className="car-image" style={{ backgroundImage: `url(${IMAGES_BASE_URL}/small/${car.image_url || 'default-car-image.jpg'})` }}></div>
                        <div className="car-info">
                            <h2>{car.name}</h2>
                            {car.manufacturer && <p>{car.manufacturer}</p>}
                            {car.year && <p>{car.year}</p>}
                            {car.country && <p>{COUNTRY_FLAGS[car.country] || ''} {car.country}</p>}
                            <div className="car-specs">
                                {car.hp && <p><strong>HP:</strong> {car.hp}</p>}
                                {car.pp && <p><strong>PP:</strong> {car.pp.toFixed(1)}</p>}
                                {car.drivetrain && <p><strong>Drivetrain:</strong> {car.drivetrain}</p>}
                                {car.aspiration && <p><strong>Aspiration:</strong> {car.aspiration}</p>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default CarList;
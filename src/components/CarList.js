import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedAvailability, setSelectedAvailability] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const navigate = useNavigate();
    const location = useLocation();

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
        const params = new URLSearchParams(location.search);
        setSelectedCountry(params.get('country') || '');
        setSelectedManufacturer(params.get('manufacturer') || '');
        setSelectedAvailability(params.get('availability') || '');
        setSelectedCategory(params.get('category') || '');
        setSearchTerm(params.get('search') || '');
        setSortBy(params.get('sortBy') || '');
        setSortOrder(params.get('sortOrder') || 'asc');
    }, [location]);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = cars;
            if (selectedCountry) {
                filtered = filtered.filter(car => car.country === selectedCountry);
            }
            if (selectedManufacturer) {
                filtered = filtered.filter(car => car.manufacturer === selectedManufacturer);
            }
            if (selectedAvailability) {
                filtered = filtered.filter(car => car.availability === selectedAvailability);
            }
            if (selectedCategory) {
                filtered = filtered.filter(car => car.category === selectedCategory);
            }
            if (searchTerm) {
                filtered = filtered.filter(car => 
                    car.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            if (sortBy) {
                filtered = filtered.filter(car => car[sortBy] != null);
                filtered.sort((a, b) => {
                    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
                    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
                    return 0;
                });
            }
            
            setFilteredCars(filtered);
        };

        applyFilters();
        updateURL();
    }, [cars, selectedCountry, selectedManufacturer, selectedAvailability, selectedCategory, searchTerm, sortBy, sortOrder]);

    const updateURL = () => {
        const params = new URLSearchParams();
        if (selectedCountry) params.append('country', selectedCountry);
        if (selectedManufacturer) params.append('manufacturer', selectedManufacturer);
        if (selectedAvailability) params.append('availability', selectedAvailability);
        if (selectedCategory) params.append('category', selectedCategory);
        if (searchTerm) params.append('search', searchTerm);
        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);

        navigate(`?${params.toString()}`, { replace: true });
    };

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
        setSelectedManufacturer('');
    };
  
    const handleManufacturerChange = (e) => {
        setSelectedManufacturer(e.target.value);
        setSelectedCountry('');
    };

    const handleAvailabilityChange = (e) => {
        setSelectedAvailability(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        const [newSortBy, newSortOrder] = e.target.value.split('-');
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    const clearFilters = () => {
        setSelectedCountry('');
        setSelectedManufacturer('');
        setSelectedAvailability('');
        setSelectedCategory('');
        setSearchTerm('');
        setSortBy('');
        setSortOrder('asc');
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
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select value={selectedManufacturer} onChange={handleManufacturerChange}>
                        <option value="">All Manufacturers</option>
                        {manufacturers.map(manufacturer => (
                            <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                        ))}
                    </select>
                    <select value={selectedCountry} onChange={handleCountryChange}>
                        <option value="">All Countries</option>
                        {countries.map(country => (
                            <option key={country} value={country}>
                                {COUNTRY_FLAGS[country] || ''} {country}
                            </option>
                        ))}
                    </select>
                    <select 
                        value={selectedAvailability} 
                        onChange={handleAvailabilityChange}
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
                        value={selectedCategory} 
                        onChange={handleCategoryChange}
                        className="category-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <select onChange={handleSortChange} value={`${sortBy}-${sortOrder}`}>
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
                        <div className="car-image" style={{backgroundImage: `url(${IMAGES_BASE_URL}/small/${car.image_url || 'default-car-image.jpg'})`}}></div>
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
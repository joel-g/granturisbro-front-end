import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Changelog from './Changelog';
import './CarList.css';
import { API_BASE_URL, COUNTRY_FLAGS, IMAGES_BASE_URL } from '../config';

function CarList() {
    const { theme } = useContext(ThemeContext);
    const { user, userCars, fetchUserCars, addCarToCollection, removeCarFromCollection } = useAuth();
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const countries = useMemo(() => [...new Set(cars.map(car => car.country))].sort(), [cars]);
    const manufacturers = useMemo(() => [...new Set(cars.map(car => car.manufacturer))].sort(), [cars]);
    const categories = useMemo(() => [...new Set(cars.map(car => car.category))].sort(), [cars]);

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
        sortOrder: getParamValue('sortOrder') || '',
        reward: getParamValue('reward'),
        ownership: user ? (getParamValue('ownership') || 'all') : 'all',
    });

    const [loadingCars, setLoadingCars] = useState({});

    const updateURL = useCallback(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== 'asc' && (key !== 'ownership' || user)) {
                params.append(key, value);
            }
        });
        setSearchParams(params);
    }, [filters, setSearchParams, user]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/cars`);
                if (response.ok) {
                    const data = await response.json();
                    setCars(data);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch cars');
                }
            } catch (err) {
                setError('Error fetching cars');
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    const applyFilters = useCallback(() => {
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
        if (filters.reward) {
            switch (filters.reward) {
                case 'not_available':
                    filtered = filtered.filter(car => !car.reward_from);
                    break;
                case 'any_reward':
                    filtered = filtered.filter(car => car.reward_from);
                    break;
                default:
                    filtered = filtered.filter(car =>
                        car.reward_from && car.reward_from.split(';')[0] === filters.reward
                    );
            }
        }
        if (user && filters.ownership !== 'all') {
            const isOwned = filters.ownership === 'owned';
            filtered = filtered.filter(car =>
                isOwned === userCars.some(userCar => userCar.id === car.id)
            );
        }

        if (filters.sortBy) {
            filtered = filtered.filter(car => car[filters.sortBy] != null);
            filtered.sort((a, b) => {
                const order = filters.sortOrder || 'asc';
                if (a[filters.sortBy] < b[filters.sortBy]) return order === 'asc' ? -1 : 1;
                if (a[filters.sortBy] > b[filters.sortBy]) return order === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredCars(filtered);
    }, [cars, filters, userCars, user]);

    useEffect(() => {
        applyFilters();
        updateURL();
    }, [cars, filters, userCars, applyFilters, updateURL]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters, [filterName]: value };

            if (filterName === 'country' && value !== '') {
                newFilters.manufacturer = '';
            } else if (filterName === 'manufacturer' && value !== '') {
                newFilters.country = '';
            }

            return newFilters;
        });
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
            sortOrder: 'asc',
            reward: '',
            ownership: 'all'
        });
        navigate('', { replace: true });
    };

    const toggleUserCar = async (carId) => {
        if (!user) return;

        setLoadingCars(prev => ({ ...prev, [carId]: true }));

        const isOwned = userCars.some(car => car.id === carId);
        try {
            if (isOwned) {
                await removeCarFromCollection(carId);
            } else {
                await addCarToCollection(carId);
            }
            await fetchUserCars();
        } catch (error) {
            console.error('Error updating user car:', error);
        } finally {
            setLoadingCars(prev => ({ ...prev, [carId]: false }));
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className={`car-list-container ${theme}`}>
            <div className="filters">
                <div className="filters-row">
                    <input
                        type="text"
                        placeholder="Search car name..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="search-input"
                        aria-label="Search cars by name"
                    />
                    <select
                        value={filters.manufacturer}
                        onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                        aria-label="Filter by manufacturer"
                    >
                        <option value="">All Manufacturers</option>
                        {manufacturers.map(manufacturer => (
                            <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                        ))}
                    </select>
                    <select
                        value={filters.country}
                        onChange={(e) => handleFilterChange('country', e.target.value)}
                        aria-label="Filter by country"
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
                        aria-label="Filter by availability"
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
                        aria-label="Filter by category"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <select
                        value={filters.reward}
                        onChange={(e) => handleFilterChange('reward', e.target.value)}
                        className="reward-select"
                        aria-label="Filter by reward type"
                    >
                        <option value="">All Rewards</option>
                        <option value="license">License</option>
                        <option value="mission">Mission</option>
                        <option value="menubook">Menu Book</option>
                        <option value="any_reward">Any Reward Type</option>
                        <option value="not_available">Not Available from Reward</option>
                    </select>
                    {user && (
                        <select
                            value={filters.ownership}
                            onChange={(e) => handleFilterChange('ownership', e.target.value)}
                            className="ownership-select"
                            aria-label="Filter by ownership"
                        >
                            <option value="all">All Cars</option>
                            <option value="owned">Owned Cars</option>
                            <option value="not_owned">Not Owned Cars</option>
                        </select>
                    )}
                    <select
                        onChange={handleSortChange}
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        aria-label="Sort cars"
                    >
                        <option value="">Sort by...</option>
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
                {filteredCars.map(car => {
                    const isOwned = userCars.some(userCar => userCar.id === car.id);
                    const isLoading = loadingCars[car.id];
                    return (
                        <div key={car.id} className="car-card">
                            <Link to={`/car/${car.id}`} className="car-link">
                                <div className="car-image">
                                    <img
                                        src={`${IMAGES_BASE_URL}/small/${car.image_url || 'default-car-image.jpg'}`}
                                        alt={car.name}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="car-info">
                                    <h2>{car.name}</h2>
                                    {car.manufacturer && <p>{car.manufacturer}</p>}
                                    {car.year && <p>{car.year}</p>}
                                    {car.country && <p>{COUNTRY_FLAGS[car.country] || ''} {car.country}</p>}
                                    <div className="car-specs">
                                        {car.price && <p><strong>Price:</strong> {car.price.toLocaleString()} Cr</p>}
                                        {car.pp && <p><strong>PP:</strong> {car.pp.toFixed(1)}</p>}
                                        {car.weight && <p><strong>Weight:</strong> {car.weight} lb</p>}
                                    </div>
                                    {car.reward_from && (
                                        <span
                                            className="reward-indicator"
                                            title="This car can be won as a reward"
                                        >
                                            🏆
                                        </span>
                                    )}
                                </div>
                            </Link>
                            {user && (
                                <label className={`ownership-checkbox ${isLoading ? 'loading' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={isOwned}
                                        onChange={() => toggleUserCar(car.id)}
                                        disabled={isLoading}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            )}
                        </div>
                    );
                })}
            </div>
            <Changelog />
            <footer className="footer">
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-of-service">Terms of Service</Link>
            </footer>
        </div>
    );
}

export default CarList;
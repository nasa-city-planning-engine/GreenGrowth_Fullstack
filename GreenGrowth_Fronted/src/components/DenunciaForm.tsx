import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons - use CDN URLs instead of imports
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png';
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
});

const DenunciaForm = () => {
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('');
  const [detectedCity, setDetectedCity] = useState('');
  const [detectedCountry, setDetectedCountry] = useState('');

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Category mapping: display text in English, but send Spanish tags to backend
  const categories = [
    { value: 'Infraestructura', label: 'Infrastructure' },
    { value: 'Seguridad', label: 'Security' },
    { value: 'Movibilidad', label: 'Mobility' },
    { value: 'Servicios Publicos', label: 'Public Services' }
  ];

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    console.log('🗺️ Initializing map...');

    // Longer delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) {
        console.error('❌ Map container not found');
        return;
      }

      try {
        console.log('📐 Container dimensions:', {
          width: mapContainerRef.current.offsetWidth,
          height: mapContainerRef.current.offsetHeight
        });

        // Create map centered on Hermosillo by default
        const map = L.map(mapContainerRef.current, {
          center: [29.0729, -110.9559],
          zoom: 13,
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: true,
          preferCanvas: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          minZoom: 3
        }).addTo(map);

        // Multiple invalidateSize calls to ensure proper rendering
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
        
        setTimeout(() => {
          map.invalidateSize();
          console.log('✅ Map initialized successfully');
          setMapLoaded(true);
        }, 300);

        // Add click event to map
        map.on('click', async (e: L.LeafletMouseEvent) => {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;

          console.log('📍 Map clicked:', { lat, lng });

          setLatitude(lat);
          setLongitude(lng);

          // Remove old marker if exists
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Add new marker
          markerRef.current = L.marker([lat, lng]).addTo(map);

          // Get address from coordinates
          await getAddressFromCoordinates(lat, lng);
        });

        mapRef.current = map;
      } catch (error) {
        console.error('❌ Error initializing map:', error);
        setMapLoaded(false);
      }
    }, 200);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        console.log('🧹 Cleaning up map');
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    setDetectedAddress('Loading...');
    setDetectedCity('Loading...');
    setDetectedCountry('Loading...');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'GreenGrowth/1.0'
          }
        }
      );

      const data = await response.json();

      const address = data.display_name || 'Address not available';
      const city = data.address.city || 
                   data.address.town || 
                   data.address.village || 
                   data.address.municipality || 
                   'Unknown city';
      const country = data.address.country || 'Unknown country';

      setDetectedAddress(address);
      setDetectedCity(city);
      setDetectedCountry(country);
      setLocation(address);

    } catch (error) {
      console.error('Error getting address:', error);
      setDetectedAddress('Error loading address');
      setDetectedCity('');
      setDetectedCountry('');
    }
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Your browser does not support geolocation');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);
        setGettingLocation(false);

        console.log('📍 Location obtained:', { lat, lng });

        // Center map on current location
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 15);

          // Remove old marker if exists
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Add new marker
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        }

        // Get address
        await getAddressFromCoordinates(lat, lng);
      },
      (error) => {
        setError('Could not get location. Check browser permissions.');
        setGettingLocation(false);
        console.error('❌ Geolocation error:', error);
      }
    );
  };

  const handleSubmit = async () => {
    setError('');

    // Validations
    if (!content.trim()) {
      setError('Please describe the report details');
      return;
    }

    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    const tag = selectedCategory;

    // Build payload - Backend REQUIRES latitude and longitude
    const payload: any = {
      content: content.trim(),
      user_id: 1, // TODO: Replace with real user ID from your auth system
      tags: [tag],
      // Default values for Hermosillo if no GPS
      latitude: latitude !== null ? latitude : 29.0729,
      longitude: longitude !== null ? longitude : -110.9559,
      // Location is optional
      location: location.trim() || "No specific location"
    };

    console.log('📤 Payload to send:', JSON.stringify(payload, null, 2));

    setIsLoading(true);

    try {
      const BACKEND_URL = 'http://localhost:5001'; // Change port if needed
      
      const response = await fetch(`${BACKEND_URL}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Server error:', errorData);
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Server response:', data);

      // Show confirmation modal
      setShowModal(true);

      // Auto-close modal and clear form after 3 seconds
      setTimeout(() => {
        setShowModal(false);
        // Clear form
        setContent('');
        setSelectedCategory('');
        setLocation('');
        setLatitude(null);
        setLongitude(null);
        setDetectedAddress('');
        setDetectedCity('');
        setDetectedCountry('');
        
        // Remove marker from map
        if (markerRef.current) {
          markerRef.current.remove();
          markerRef.current = null;
        }
        
        // Optional: go back to previous page
        // navigate(-1);
        navigate('/reportList');

      }, 3000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error sending report';
      setError(errorMessage);
      console.error('❌ Complete error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with back button */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-8 h-8 text-gray-700" />
          </button>
          <h1 className="text-5xl font-bold text-gray-900">
            Make a Report
          </h1>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          {/* Map section (left) */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-purple-300 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 flex-shrink-0">
              <MapPin className="w-7 h-7 text-green-600" />
              Location
            </h2>

            {/* Interactive map */}
            <div 
              ref={mapContainerRef}
              className="w-full rounded-lg mb-6 border-2 border-gray-300"
              style={{ 
                height: '400px',
                maxHeight: '400px',
                minHeight: '400px',
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#e5e7eb'
              }}
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-semibold text-lg">Loading map...</p>
                  </div>
                </div>
              )}
            </div>

            {/* GPS button */}
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gettingLocation}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg mb-4 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              <MapPin className="w-6 h-6" />
              {gettingLocation ? 'Getting location...' : 'Get My Location'}
            </button>

            {/* Manual location input */}
            <div className="mb-4">
              <label htmlFor="location-input" className="block text-base font-semibold text-gray-700 mb-3">
                Or write the location manually:
              </label>
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g., 5th Avenue #123"
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base"
              />
            </div>

            {/* Location info */}
            {(detectedAddress || detectedCity || detectedCountry) && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <strong className="text-green-900 block mb-2 text-lg">Selected Location:</strong>
                {detectedAddress && (
                  <p className="text-base text-green-800 mb-2">
                    <strong>Address:</strong> {detectedAddress}
                  </p>
                )}
                {detectedCity && (
                  <p className="text-base text-green-800 mb-2">
                    <strong>City:</strong> {detectedCity}
                  </p>
                )}
                {detectedCountry && (
                  <p className="text-base text-green-800 mb-2">
                    <strong>Country:</strong> {detectedCountry}
                  </p>
                )}
                {latitude && longitude && (
                  <p className="text-sm text-green-600 mt-2">
                    📍 Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Form section (right) */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-purple-300">
            <div className="h-full flex flex-col">
              {/* Category selector */}
              <div className="mb-8">
                <label htmlFor="category-select" className="block text-2xl font-bold text-gray-800 mb-4">
                  Category
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Details text area */}
              <div className="mb-8 flex-1">
                <label htmlFor="details-textarea" className="block text-2xl font-bold text-gray-800 mb-4">
                  Details
                </label>
                <textarea
                  id="details-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe the report details..."
                  rows={12}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none text-lg"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg" role="alert">
                  <p className="text-red-700 text-base font-semibold">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-5 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-scale-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Report submitted successfully
              </h2>
              <p className="text-gray-600">
                The information will be updated...eventually
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        
        /* Fix Leaflet map container to stay within bounds */
        .leaflet-container {
          width: 100% !important;
          height: 400px !important;
          max-height: 400px !important;
          min-height: 400px !important;
          border-radius: 0.5rem;
          position: relative !important;
        }
        
        /* Ensure map panes stay within bounds */
        .leaflet-pane,
        .leaflet-map-pane,
        .leaflet-tile-pane,
        .leaflet-overlay-pane {
          position: absolute !important;
        }
        
        /* Fix attribution */
        .leaflet-control-attribution {
          font-size: 10px !important;
        }
        
        /* Prevent full screen takeover */
        .leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {
          position: relative !important;
          height: 400px !important;
          max-height: 400px !important;
        }
        
        /* Ensure modal appears above map */
        .leaflet-container {
          z-index: 1 !important;
        }
        
        .leaflet-pane,
        .leaflet-top,
        .leaflet-bottom {
          z-index: auto !important;
        }
      `}</style>
    </div>
  );
};

export default DenunciaForm;
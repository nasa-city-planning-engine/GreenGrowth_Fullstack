import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Tag, User, AlertCircle, Loader2, Search } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  latitude: number;
  longitude: number;
  location: string;
  tags: string[];
  created_at?: string;
  city?: string;
  country?: string;
  state?: string;
}

interface GeocodingResult {
  city: string;
  country: string;
  state?: string;
}

// Spanish tags from backend with English display colors
const tagColors: { [key: string]: string } = {
  'Infraestructura': 'bg-blue-100 text-blue-800 border-blue-300',
  'Seguridad': 'bg-red-100 text-red-800 border-red-300',
  'Movibilidad': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Servicios Publicos': 'bg-green-100 text-green-800 border-green-300'
};

// Mapping Spanish tags to English display names
const tagDisplayNames: { [key: string]: string } = {
  'Infraestructura': 'Infrastructure',
  'Seguridad': 'Security',
  'Movibilidad': 'Mobility',
  'Servicios Publicos': 'Public Services'
};

// Cache for geocoding
const cityCache: { [key: string]: GeocodingResult } = {};

// Function to get city from coordinates using Nominatim
const getCityFromCoordinates = async (lat: number, lng: number): Promise<GeocodingResult> => {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  
  if (cityCache[cacheKey]) {
    return cityCache[cacheKey];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'GreenGrowth/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error getting location');
    }

    const data = await response.json();
    
    const city = data.address.city || 
                 data.address.town || 
                 data.address.village || 
                 data.address.municipality || 
                 data.address.county ||
                 data.address.state ||
                 'Unknown location';
    
    const country = data.address.country || 'Unknown country';
    const state = data.address.state || data.address.province || '';

    const result: GeocodingResult = { city, country, state };
    cityCache[cacheKey] = result;
    
    return result;
  } catch (error) {
    console.error('Geocoding error:', error);
    return { city: 'Unknown location', country: '', state: '' };
  }
};

const ListaDenuncias = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/messages/');

      if (!response.ok) {
        throw new Error('Error loading reports');
      }

      const data = await response.json();

      if (data.status === 'success') {
        const messagesData = data.payload;
        
        // Get cities for each message
        setIsLoadingCities(true);
        const messagesWithCities = await Promise.all(
          messagesData.map(async (msg: Message) => {
            // Small delay to respect API rate limits (1 req/second)
            await new Promise(resolve => setTimeout(resolve, 150));
            
            const { city, country, state } = await getCityFromCoordinates(msg.latitude, msg.longitude);
            
            return { ...msg, city, country, state };
          })
        );
        
        setMessages(messagesWithCities);
        setIsLoadingCities(false);
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading reports');
      console.error('❌ Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cascade reset: if country changes, reset state and city
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedState('all');
    setSelectedCity('all');
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity('all');
  };

  // Filter messages by category, location and search
  const filteredMessages = messages
    .filter(msg => selectedTag === 'all' || msg.tags.includes(selectedTag))
    .filter(msg => selectedCountry === 'all' || msg.country === selectedCountry)
    .filter(msg => selectedState === 'all' || msg.state === selectedState)
    .filter(msg => selectedCity === 'all' || msg.city === selectedCity)
    .filter(msg => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        msg.city?.toLowerCase().includes(query) ||
        msg.country?.toLowerCase().includes(query) ||
        msg.location.toLowerCase().includes(query) ||
        msg.content.toLowerCase().includes(query)
      );
    });

  // Use Spanish tag names for filtering (backend values)
  const allTags = ['Infraestructura', 'Seguridad', 'Movibilidad', 'Servicios Publicos'];
  
  // Get unique countries
  const countries = Array.from(new Set(messages.map(msg => msg.country).filter(Boolean))).sort();
  
  // Get states/provinces from selected country
  const states = selectedCountry === 'all' 
    ? []
    : Array.from(new Set(
        messages
          .filter(msg => msg.country === selectedCountry && msg.state)
          .map(msg => msg.state)
      )).sort();
  
  // Get cities from selected state (or country if no state)
  const cities = selectedState === 'all' && selectedCountry === 'all'
    ? []
    : selectedState !== 'all'
    ? Array.from(new Set(
        messages
          .filter(msg => msg.state === selectedState && msg.city)
          .map(msg => msg.city)
      )).sort()
    : Array.from(new Set(
        messages
          .filter(msg => msg.country === selectedCountry && msg.city)
          .map(msg => msg.city)
      )).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Title and button */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              🌍 Global Reports
            </h2>
            <p className="text-gray-600">
              {filteredMessages.length} {filteredMessages.length === 1 ? 'report' : 'reports'}
              {selectedTag !== 'all' && ` - ${tagDisplayNames[selectedTag] || selectedTag}`}
              {selectedCountry !== 'all' && ` - ${selectedCountry}`}
              {selectedState !== 'all' && ` - ${selectedState}`}
              {selectedCity !== 'all' && ` - ${selectedCity}`}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/map')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
            >
              {`🗺️ View Map`}
            </button>
            
            <button 
              onClick={() => navigate('/login')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
            >
              + New Report
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search by city, country, location or content..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-base"
            />
          </div>
        </div>

        {/* Cities loading indicator */}
        {isLoadingCities && (
          <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-blue-800 font-medium">
                Detecting cities from GPS coordinates...
              </p>
            </div>
          </div>
        )}

        {/* Cascade location filters */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Filter by Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Country selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base font-medium bg-white cursor-pointer hover:border-gray-400 transition-colors"
              >
                <option value="all">All countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* State/Province selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State/Province
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                disabled={selectedCountry === 'all' || states.length === 0}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base font-medium bg-white cursor-pointer hover:border-gray-400 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                <option value="all">
                  {selectedCountry === 'all' 
                    ? 'Select a country first' 
                    : states.length === 0
                    ? 'No administrative division'
                    : 'All states'}
                </option>
                {states.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* City selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={selectedCountry === 'all' || cities.length === 0}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base font-medium bg-white cursor-pointer hover:border-gray-400 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                <option value="all">
                  {selectedCountry === 'all'
                    ? 'Select a country first'
                    : cities.length === 0
                    ? 'No cities available'
                    : 'All cities'}
                </option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Button to clear location filters */}
          {(selectedCountry !== 'all' || selectedState !== 'all' || selectedCity !== 'all') && (
            <button
              onClick={() => {
                setSelectedCountry('all');
                setSelectedState('all');
                setSelectedCity('all');
              }}
              className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              ✕ Clear location filters
            </button>
          )}
        </div>

        {/* Filter by Category */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-green-600" />
            Filter by Category
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                selectedTag === 'all'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                  selectedTag === tag
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tagDisplayNames[tag]}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md">
            <Loader2 className="w-16 h-16 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600 text-xl font-medium">Loading reports...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6 shadow-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-bold text-red-900 text-lg">Loading error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchMessages}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
            >
              Retry
            </button>
          </div>
        )}

        {/* No results */}
        {!isLoading && !error && filteredMessages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No reports found
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              {searchQuery 
                ? `No reports found with "${searchQuery}"`
                : selectedTag === 'all' 
                  ? 'No reports have been registered yet.'
                  : `No reports in the "${tagDisplayNames[selectedTag] || selectedTag}" category.`}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('all');
                setSelectedCountry('all');
                setSelectedState('all');
                setSelectedCity('all');
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors mr-3"
            >
              Clear filters
            </button>
            <button
              onClick={() => navigate('/report')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Create report
            </button>
          </div>
        )}

        {/* Reports list */}
        {!isLoading && !error && filteredMessages.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-2xl hover:border-green-400 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Report #{message.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {message.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                        tagColors[tag] || 'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tagDisplayNames[tag] || tag}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-800 mb-4 line-clamp-3 leading-relaxed">
                  {message.content}
                </p>

                {/* Location with city and country */}
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <div className="flex-1">
                      <p className="font-bold text-green-900 text-base">
                        {message.city || 'Loading...'}
                      </p>
                      {message.country && (
                        <p className="text-green-700 text-sm">
                          {message.country}
                        </p>
                      )}
                      {message.state && (
                        <p className="text-green-600 text-xs">
                          {message.state}
                        </p>
                      )}
                      <p className="text-gray-600 text-xs mt-1">
                        {message.location}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        📍 {message.latitude.toFixed(4)}, {message.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date */}
                {message.created_at && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 pt-3 border-t-2 border-gray-100">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date(message.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Floating button for mobile */}
        <button
          onClick={() => navigate('/report')}
          className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white font-bold p-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 md:hidden z-50"
        >
          <span className="text-3xl leading-none">+</span>
        </button>
      </main>
    </div>
  );
};

export default ListaDenuncias;
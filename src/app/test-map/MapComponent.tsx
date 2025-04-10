'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Position = LatLngExpression;

const MapComponent: React.FC = () => {
  const [marker, setMarker] = useState<Position | any>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [address, setAddress] = useState<string>('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State cho ô tìm kiếm
  const [suggestions, setSuggestions] = useState<any[]>([]); // State cho danh sách gợi ý
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false); // Hiển thị/ẩn gợi ý

  // Hàm lấy địa chỉ từ tọa độ (reverse geocoding)
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=vi`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('Không thể xác định địa chỉ');
      }
    } catch (error) {
      console.error('Lỗi khi lấy địa chỉ:', error);
      setAddress('Lỗi khi lấy địa chỉ');
    }
  };

  // Hàm tìm tọa độ từ địa chỉ (forward geocoding)
  const getCoordinatesFromAddress = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&accept-language=vi&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: Position = [parseFloat(lat), parseFloat(lon)];
        setMarker(newPosition);
        setCurrentPosition(newPosition);
        setAddress(data[0].display_name);
        setLocationError(null);
        setSearchQuery(data[0].display_name); // Cập nhật ô tìm kiếm với địa chỉ đầy đủ
        setShowSuggestions(false); // Ẩn gợi ý sau khi chọn
      } else {
        setLocationError('Không tìm thấy địa chỉ. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi tìm địa chỉ:', error);
      setLocationError('Lỗi khi tìm địa chỉ. Vui lòng thử lại.');
    }
  };

  // Hàm lấy gợi ý địa chỉ (debounced)
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&accept-language=vi&limit=10`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Lỗi khi lấy gợi ý:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Debounce fetchSuggestions để tránh gọi API quá nhiều
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300); // Chờ 300ms trước khi gọi API

    return () => clearTimeout(timer); // Hủy timer nếu searchQuery thay đổi trước khi 300ms trôi qua
  }, [searchQuery, fetchSuggestions]);

  // Xử lý khi người dùng nhập vào ô tìm kiếm
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true); // Hiển thị gợi ý khi người dùng nhập
  };

  // Xử lý khi người dùng chọn một gợi ý
  const handleSuggestionClick = (suggestion: any) => {
    const newPosition: Position = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
    setMarker(newPosition);
    setCurrentPosition(newPosition);
    setAddress(suggestion.display_name);
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    setLocationError(null);
  };

  // Xử lý khi người dùng nhấn Enter hoặc nút tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      getCoordinatesFromAddress(searchQuery);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const newPosition: Position = [latitude, longitude];
          setCurrentPosition(newPosition);
          setMarker(newPosition);
          getAddressFromCoordinates(latitude, longitude);

          if (accuracy > 100) {
            setLocationError(
              'Độ chính xác vị trí thấp (sai số: ' +
              accuracy.toFixed(0) +
              'm). Vui lòng bật GPS hoặc kiểm tra lại.'
            );
          }
        },
        (error) => {
          console.error('Lỗi khi lấy vị trí:', error);
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Bạn đã từ chối cấp quyền truy cập vị trí.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Không thể xác định vị trí.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Yêu cầu lấy vị trí quá thời gian.';
              break;
            default:
              errorMessage = 'Đã xảy ra lỗi khi lấy vị trí.';
              break;
          }
          setLocationError(errorMessage);
          const defaultPosition: Position = [18.56, 106.79];
          setCurrentPosition(defaultPosition);
          setMarker(defaultPosition);
          getAddressFromCoordinates(18.56, 106.79);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Trình duyệt của bạn không hỗ trợ Geolocation.');
      const defaultPosition: Position = [18.56, 106.79];
      setCurrentPosition(defaultPosition);
      setMarker(defaultPosition);
      getAddressFromCoordinates(18.56, 106.79);
    }
  }, []);

  const LocationMarker: React.FC = () => {
    const map = useMap();

    useMapEvents({
      click(e) {
        const newMarker: Position = [e.latlng.lat, e.latlng.lng];
        setMarker(newMarker);
        getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
        setLocationError(null);
        map.setView(newMarker, 20);
      },
    });

    // Chỉ cập nhật trung tâm bản đồ khi currentPosition thay đổi lần đầu tiên
    useEffect(() => {
      if (currentPosition) {
        map.setView(currentPosition, 20);
      }
    }, [currentPosition, map]); // Dependency array vẫn giữ nguyên, nhưng logic bên trong không gây loop

    return null;
  };

  if (!currentPosition) {
    return <div>Đang tải vị trí...</div>;
  }

  return (
    <div>
      {/* Ô tìm kiếm địa chỉ với gợi ý */}
      <div style={{ marginBottom: '10px', position: 'relative' }}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Nhập địa chỉ (VD: 123 Đường Láng, Hà Nội)"
            style={{
              padding: '8px',
              width: '300px',
              marginRight: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Tìm
          </button>
        </form>

        {/* Danh sách gợi ý */}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '40px',
              left: '0',
              width: '300px',
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 1000,
              listStyle: 'none',
              padding: '0',
              margin: '0',
            }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f0f0f0')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'white')
                }
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hiển thị thông báo lỗi nếu có */}
      {locationError && (
        <div style={{ marginBottom: '10px', color: 'red' }}>
          <p>{locationError}</p>
        </div>
      )}

      {/* Hiển thị địa chỉ và tọa độ */}
      {marker && (
        <div style={{ marginBottom: '10px' }}>
          <p>
            Vị trí được ghim: {address || 'Đang tải địa chỉ...'}
          </p>
          <p>
            Tọa độ: Lat: {marker[0].toFixed(4)}, Lng: {marker[1].toFixed(4)}
          </p>
        </div>
      )}

      {/* Bản đồ */}
      <MapContainer
        center={currentPosition}
        zoom={20}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {marker && (
          <Marker position={marker}>
            <Popup>
              {marker === currentPosition
                ? 'Vị trí hiện tại của bạn'
                : 'Địa điểm được ghim'}
              <br />
              {address || 'Đang tải địa chỉ...'}
            </Popup>
          </Marker>
        )}
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
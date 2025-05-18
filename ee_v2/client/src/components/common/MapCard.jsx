import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxwaGF4dGVhbTciLCJhIjoiY2x1NnNiM3NrMHVjejJsbnZ5YWR2dDA3eCJ9.7aWPOSxuc_i55jKkqFtE_Q';

const MapCard = ({ address }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const formattedAddress = address ? 
    `${address.country}, ${address.state}, ${address.district}, ${address.city}, ${address.pincode}`.replace(/undefined,?\s*/g, '').replace(/,\s*,/g, ',').trim() :
    'Location not available';

  const geocodeAddress = async (address) => {
    if (!address) return null;
    
    const query = `${address.city}, ${address.state}, ${address.country}`.replace(/undefined,?\s*/g, '').replace(/,\s*,/g, ',').trim();
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].center; // Returns [longitude, latitude]
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  useEffect(() => {
    const initializeMap = async () => {
      let coordinates = [-122.4, 37.8]; // Default coordinates

      if (address) {
        if (address?.location?.coordinates) {
          coordinates = address.location.coordinates;
        } else {
          const geocodedCoordinates = await geocodeAddress(address);
          if (geocodedCoordinates) {
            coordinates = geocodedCoordinates;
          }
        }
      }

      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: coordinates,
          zoom: 12
        });
      } else {
        map.current.setCenter(coordinates);
      }

      // Remove existing marker if it exists
      if (marker.current) {
        marker.current.remove();
      }

      // Add new marker
      marker.current = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map.current);
    };

    initializeMap();

    // Cleanup
    return () => {
      if (map.current) {
        if (marker.current) {
          marker.current.remove();
        }
        map.current.remove();
        map.current = null;
      }
    };
  }, [address]);

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="h-10 w-10 text-icons" />
          <h3 className="font-medium">{formattedAddress}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-40 rounded-lg overflow-hidden shadow-lg">
          <div ref={mapContainer} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapCard;
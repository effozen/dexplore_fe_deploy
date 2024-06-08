import { getLocation } from "@lib/gps/gps";
import { useEffect, useRef, useState } from "react";

const loadKakaoMap = () => {
  const appKey = 'ac57d560967002f1a1f07dc63f9c0242'; // Kakao Developers에서 발급받은 App Key
  const scriptUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;

  if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log("Kakao Maps API loaded.");
          const event = new Event('kakao-maps-api-loaded');
          window.dispatchEvent(event);
        });
      }
    };
    document.head.appendChild(script);
  }
};

const useKakaoMap = (mapRef, setLoc) => {
  useEffect(() => {
    const controlKakaoMap = async () => {
      try {
        const location = await getLocation();
        if (window.kakao && window.kakao.maps) {
          const container = mapRef.current;
          const options = {
            center: new window.kakao.maps.LatLng(location.latitude, location.longitude),
            level: 3,
          };
          const map = new window.kakao.maps.Map(container, options);

          const marker = new kakao.maps.Marker({
            position: map.getCenter(),
          });
          marker.setMap(map);

          const geocoder = new kakao.maps.services.Geocoder();

          kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
            const latlng = mouseEvent.latLng;
            marker.setPosition(latlng);

            const bounds = map.getBounds();
            const swLatLng = bounds.getSouthWest();
            const neLatLng = bounds.getNorthEast();

            geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                const loc = {
                  latitude: latlng.getLat(),
                  longitude: latlng.getLng(),
                  roadAddress: result[0].road_address ? result[0].road_address.address_name : null,
                  level: map.getLevel(),
                  edgeLatitude1: swLatLng.getLat(),
                  edgeLongitude1: swLatLng.getLng(),
                  edgeLatitude2: neLatLng.getLat(),
                  edgeLongitude2: neLatLng.getLng(),
                };
                setLoc && setLoc(loc);
              }
            });
          });
        } else {
          console.error("Kakao Maps API is not loaded.");
        }
      } catch (error) {
        console.error("Failed to get location:", error);
      }
    };

    const handleMapLoad = () => {
      if (window.kakao && window.kakao.maps) {
        controlKakaoMap();
      }
    };

    if (window.kakao && window.kakao.maps) {
      handleMapLoad();
    } else {
      window.addEventListener('kakao-maps-api-loaded', handleMapLoad);
    }

    return () => {
      window.removeEventListener('kakao-maps-api-loaded', handleMapLoad);
    };
  }, [mapRef, setLoc]);
};

const KakaoMap = ({ setLoc }) => {
  const mapRef = useRef(null);
  useKakaoMap(mapRef, setLoc);

  return (<div id="map" ref={mapRef} style={{ width: '100%', height: '400px' }}></div>);
};

const Map = () => {
  const [loc, setLoc] = useState({});
  const mapRef = useRef(null);

  useEffect(() => {
    const loadLocation = async () => {
      const location = await getLocation();
      setLoc(location);
    };

    loadLocation();
  }, []);

  useEffect(() => {
    const loadMap = () => {
      if (Object.keys(loc).length !== 0 && window.kakao && window.kakao.maps) {
        const container = mapRef.current;
        const mapOption = {
          center: new window.kakao.maps.LatLng(loc.latitude, loc.longitude),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, mapOption);

        const markerPosition = new window.kakao.maps.LatLng(loc.latitude, loc.longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        marker.setMap(map);
      } else {
        setTimeout(loadMap, 500); // Retry after 500 milliseconds
      }
    };

    loadMap();
  }, [loc]);

  return (
    <div
      id="map"
      ref={mapRef}
      style={{ width: '100%', height: '300px', borderRadius: '15px', padding: 0, margin: 0 }}
    />
  );
};

export { loadKakaoMap, KakaoMap, Map };

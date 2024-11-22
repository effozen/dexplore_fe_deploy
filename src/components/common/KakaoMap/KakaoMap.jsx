// KakaoMap.jsx
import { useEffect, useRef, useState } from 'react';
import { getLocation } from '@lib/gps/gps';

const KakaoMap = ({ setLoc }) => {
  const mapRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initializeMap = async () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error('Kakao Maps API가 로드되지 않았습니다.');
        setErrorMessage('지도 로드에 실패했습니다.');
        return;
      }

      window.kakao.maps.load(async () => {
        // 기본 좌표값 설정
        let location = { latitude: 32.321967, longitude: 127.123410 };
        try {
          const userLocation = await getLocation();
          if (userLocation.err === 0 && userLocation.latitude && userLocation.longitude) {
            location = {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            };
          }
        } catch (error) {
          console.error('위치 정보를 가져오는 데 실패했습니다:', error);
        }

        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(location.latitude, location.longitude),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        const marker = new window.kakao.maps.Marker({
          position: map.getCenter(),
        });
        marker.setMap(map);

        const geocoder = new window.kakao.maps.services.Geocoder();

        const handleMapClick = (mouseEvent) => {
          const latlng = mouseEvent.latLng;
          marker.setPosition(latlng);

          geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
            const newLoc = {
              latitude: latlng.getLat(),
              longitude: latlng.getLng(),
              roadAddress: null, // roadAddress는 null로 설정
              level: map.getLevel(),
              edgeLatitude1: map.getBounds().getSouthWest().getLat(),
              edgeLongitude1: map.getBounds().getSouthWest().getLng(),
              edgeLatitude2: map.getBounds().getNorthEast().getLat(),
              edgeLongitude2: map.getBounds().getNorthEast().getLng(),
            };

            if (status === window.kakao.maps.services.Status.OK) {
              const roadAddress = result[0].road_address
                ? result[0].road_address.address_name
                : null;
              newLoc.roadAddress = roadAddress;
            }

            // roadAddress가 없어도 setLoc을 호출
            console.log('위치 선택:', newLoc); // 디버깅 로그
            setLoc(newLoc);
            setErrorMessage('');
          });
        };

        window.kakao.maps.event.addListener(map, 'click', handleMapClick);

        // Cleanup function
        return () => {
          window.kakao.maps.event.removeListener(map, 'click', handleMapClick);
        };
      });
    };

    initializeMap();
  }, [setLoc]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

const Map = ({ museumLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error('Kakao Maps API가 로드되지 않았습니다.');
        return;
      }

      if (!museumLocation || Object.keys(museumLocation).length === 0) {
        console.error('museumLocation이 제공되지 않았습니다.');
        return;
      }

      window.kakao.maps.load(() => {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(
            museumLocation.latitude,
            museumLocation.longitude
          ),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        const markerPosition = new window.kakao.maps.LatLng(
          museumLocation.latitude,
          museumLocation.longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        marker.setMap(map);
      });
    };

    initializeMap();
  }, [museumLocation]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '300px',
        borderRadius: '15px',
        padding: 0,
        margin: 0,
      }}
    />
  );
};

export { KakaoMap, Map };

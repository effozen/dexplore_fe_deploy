import React, { useEffect, useRef, useState } from 'react';
import { getLocation } from '../../../modules/gps/gps';

// 스크립트 동적 로드 함수
const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const KakaoMap = ({ locationHandler }) => {
  const [location, setLocation] = useState(null);
  const map = useRef(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const loc = await getLocation();
      setLocation(loc);
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const appKey = 'ac57d560967002f1a1f07dc63f9c0242'; // Kakao Developers에서 발급받은 App Key
    const scriptUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;

    const initializeMap = async () => {
      await loadScript(scriptUrl);

      window.kakao.maps.load(() => {
        const container = document.getElementById('map'); // 지도를 표시할 div
        const options = {
          center: new window.kakao.maps.LatLng(location.latitude, location.longitude), // 지도 중심 좌표
          level: 0, // 지도 확대 레벨
        };
        map.current = new window.kakao.maps.Map(container, options); // 지도 생성
        if (locationHandler) {
          locationHandler(map.current);
        }
      });
    };

    if (location) {
      initializeMap();
    }
  }, [location, locationHandler]);

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default KakaoMap;

import {getLocation} from "@lib/gps/gps";
import {useEffect, useRef, useState} from "react";

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
          // Kakao Maps API가 로드된 후에 실행할 코드를 여기에서 작성
          console.log("Kakao Maps API loaded.");
        });
      }
    };
    document.head.appendChild(script);
  }
};

const KakaoMap = ({setLoc}) => {
  const mapRef = useRef(null);

  const controlKakaoMap = async () => {
    try {
      const location = await getLocation();
      if (window.kakao && window.kakao.maps) {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(location.latitude, location.longitude), // 지도 중심 좌표
          level: 3, // 지도 확대 레벨 (0은 너무 확대되어 있어서 3으로 변경)
        };
        const map = new window.kakao.maps.Map(container, options); // 지도 생성

        // 지도를 클릭한 위치에 표출할 마커입니다
        let marker = new kakao.maps.Marker({
          // 지도 중심좌표에 마커를 생성합니다
          position: map.getCenter()
        });
        // 지도에 마커를 표시합니다
        marker.setMap(map);

        // 주소-좌표 변환 객체를 생성합니다
        let geocoder = new kakao.maps.services.Geocoder();

        // 지도에 클릭 이벤트를 등록합니다
        // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {

          // 클릭한 위도, 경도 정보를 가져옵니다
          let latlng = mouseEvent.latLng;
          console.log(latlng);

          // 마커 위치를 클릭한 위치로 옮깁니다
          marker.setPosition(latlng);

          let message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
          message += '경도는 ' + latlng.getLng() + ' 입니다';

          console.log(message);

          // 지도의 현재 영역을 얻어옵니다
          var bounds = map.getBounds();

          // 영역의 남서쪽 좌표를 얻어옵니다
          var swLatLng = bounds.getSouthWest();

          // 영역의 북동쪽 좌표를 얻어옵니다
          var neLatLng = bounds.getNorthEast();

          geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              console.log(result[0].road_address); // null 주의
              let loc = {
                latitude: latlng.getLat(),
                longitude: latlng.getLng(),
                roadAddress: result[0].road_address
                  ? result[0].road_address.address_name
                  : null,
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

  useEffect(() => {
    const handleMapLoad = () => {
      if (window.kakao && window.kakao.maps) {
        controlKakaoMap();
      } else {
        const intervalId = setInterval(() => {
          if (window.kakao && window.kakao.maps) {
            clearInterval(intervalId);
            controlKakaoMap();
          }
        }, 100); // Kakao Maps API가 로드될 때까지 반복 체크
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
  }, []);

  return (<div id="map" ref={mapRef} style={{width: '100%', height: '400px'}}>
  </div>);
};

const Map = () => {
  // const mapRef = useRef(null);
  const [loc, setLoc] = useState({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Object.keys(loc).length === 0) {
        getLocation().then(v => {
          setLoc(v);
          console.log(v);
          if(Object.keys(loc).length === 0) clearInterval(intervalId);
        });
      } else {
          clearInterval(intervalId);
      }
    }, 1000)

  }, []);

  useEffect(() => {
    const container = document.getElementById('map');

    if(Object.keys(loc).length !==0 && window.kakao && window.kakao.maps) {
      const mapOption = {
        center: new window.kakao.maps.LatLng(loc.latitude, loc.longitude),
        level: 3
      };
      const map = new window.kakao.maps.Map(container, mapOption);

      // 마커가 표시될 위치입니다
      var markerPosition  = new window.kakao.maps.LatLng(loc.latitude, loc.longitude);

      // 마커를 생성합니다
      var marker = new window.kakao.maps.Marker({
        position: markerPosition
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);
    }
  }, [loc]);

  return (
      <div id="map" style={{width: '100%', height: '300px'}}/>
  );
}

export {loadKakaoMap, KakaoMap, Map};

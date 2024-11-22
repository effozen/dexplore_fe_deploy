// gps.js
function getLocation() {
  return new Promise((resolve) => { // reject 제거
    if (!navigator.geolocation) {
      // reject 대신 resolve로 변경
      resolve({
        code: -2,
        message: "Geolocation is not supported by this browser.",
        latitude: 32.321967,
        longitude: 127.123410,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const now = new Date();
        resolve({
          err: 0,
          time: now.toLocaleTimeString(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        // 오류 유형에 따라 다르게 처리
        let errorMessage;
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "사용자가 위치 정보 제공을 거부했습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보를 가져오는 데 시간이 초과되었습니다.";
            break;
          default:
            errorMessage = "알 수 없는 오류가 발생했습니다.";
            break;
        }
        console.error(errorMessage);
        resolve({
          code: error.code,
          message: errorMessage,
          latitude: 32.321967,  // 기본 좌표값 유지
          longitude: 127.123410,
        });
      },
      {
        enableHighAccuracy: true,    // 필요에 따라 조정
        maximumAge: 60000,           // 필요에 따라 조정
        timeout: 5000                // 필요에 따라 조정
      }
    );
  });
}

export { getLocation };

function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve({
        err: -2,
        latitude: -1,
        longitude: -1,
      });
      return;
    }

    const now = new Date();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          err: 0,
          time: now.toLocaleTimeString(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve({
          err: -1,
          latitude: 32.1,
          longitude: 127.1,
        });
      },
      {
        enableHighAccuracy: false,  // Lower accuracy for faster response
        maximumAge: 10000,          // Use cached position if available within last 10 seconds
        timeout: 2000               // Shorter timeout for faster failure
      }
    );
  });
}

export { getLocation };

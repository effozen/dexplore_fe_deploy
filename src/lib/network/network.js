import axios from "axios";

const getCookie = (name) => {
  let cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");

    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

const checkToken = () => {
  const accessToken = getCookie('accessToken');

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    // 'Content-Type': 'multipart/form-data'
  };

  console.log(headers);

  return headers;
}

const requestGet = async (url, params = null) => {
  const headers = checkToken();

  try {
    const response = await axios.get(url, { headers, params });
    return response.data;
  } catch (error) {
    console.error('Error during GET request:', error);
    throw error;
  }
};

const requestPost = async (url, bodyData = null) => {
  const headers = checkToken();

  try {
    const response = await axios.post(url, bodyData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error during POST request:', error);
    throw error;
  }
};

export { requestGet, requestPost };

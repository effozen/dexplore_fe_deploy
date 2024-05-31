import axios from "axios";

const getCookie = (name) => {
  let cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");

    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

const checkToken = () => {
  const accessToken = getCookie('accessToken');

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'multipart/form-data'
  };

  return headers;
}

const requestGet = (url, params = null) => {
  const headers = checkToken();

  let result;
  axios.get(url, {headers, params})
    .then((data) => {
      result = new Promise((resolve, reject) => {
      resolve(data);
    })}
    );

  return result;
};

const requestPost = (url, bodyData = null) => {
  const headers = checkToken();

  let result;
  axios.post(url, bodyData, {headers})
    .then((data) => {
      result = new Promise((resolve, reject) => {
        resolve(data);
      })}
    );

  return result;
};

export {requestGet, requestPost};
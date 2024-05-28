import axios from "axios";
import {useCookies} from "react-cookie";

function requestGet(url, params, callBack) {
  // const param

  let result;

  axios.get(`${url}`)
    .then((response) => {
      callBack(response.data);
    })
    .catch((error) => {
      result = error;
    })

  return result;
}

function requestPost(url, dataObject, callBack) {
  axios.post(`${url}`, dataObject)
    .then((response) => {
      callBack(response.data);
    })
    .catch((error) => {
    })
}

const communicateServer = async () => {
  // 쿠키에서 accessToken을 가져옵니다.
  const token = cookies.accessToken;

  if (!token) {
    console.error('Access token is not available.');
    return;
  }

  // 요청에 Authorization 헤더를 설정합니다.
  const headers = {
    Authorization: `Bearer ${token}`
  };

  const result = await axios.get('https://dexplore.info/api/v1/user/get-nearest-museum', {headers});

};

const post = async () => {
  // const [cookies] = useCookies(['accessToken']);

  // 쿠키에서 accessToken을 가져옵니다.
  const token = cookies.accessToken;

  if (!token) {
    console.error('Access token is not available.');
    return;
  }

  // 요청에 Authorization 헤더를 설정합니다.
  const headers = {
    Authorization: `Bearer ${token}`
  };

  const requestBody = {};

  const result = await axios.post('https://dexplore.info/api/v1/user/get-nearest-museum', requestBody, {headers});

}

export {requestGet, requestPost};

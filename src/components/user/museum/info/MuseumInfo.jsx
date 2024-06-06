import InfoHeader from "@components/common/frame/InfoHeader";
import MuseumMain from "@components/user/museum/info/MuseumMain";
import MuseumLoc from "@components/user/museum/info/MuseumLoc";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {requestGet} from "@lib/network/network";
import ToggleButton from "@components/common/gunwoo/ToggleButton";
import { useCookies } from "react-cookie";
import {jwtDecode} from "jwt-decode";

const MuseumInfo = () => {
  const location = useLocation();
  const [museumId, setMuseumId] = useState(false);
  const [museumInfo, setMuseumInfo] = useState(false);
  const [cookie, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    setMuseumId(location.state.museumId);
  }, []);

  useEffect(() => {
    if(museumId) {
      requestGet('https://dexplore.info/api/v1/user/get-museum', {museumId}).then((v) => {
        setMuseumInfo(v.museum);
      });
    }
  }, [museumId]);

  // 사용자 정보 및 토큰 검사
  useEffect(() => {
    const token = cookie.accessToken;
    if (token) {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decodedToken.exp < now) {
        removeCookie('accessToken', { path: '/' });
        navigate("/auth/sign-in");
      }
    } else {
      navigate('/auth/sign-in');
    }
  }, [cookie, removeCookie]);

  return (
    <div>
      <InfoHeader name={museumInfo ? museumInfo.museumName : '로딩중'}></InfoHeader>
      <MuseumMain museumInfo={museumInfo}></MuseumMain>
      <MuseumLoc></MuseumLoc>
      <ToggleButton/>
    </div>
  );
}

export default MuseumInfo;
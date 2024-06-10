import InfoHeader from "@components/common/frame/InfoHeader";
import MuseumMain from "@components/user/museum/info/MuseumMain";
import MuseumLoc from "@components/user/museum/info/MuseumLoc";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {requestGet} from "@lib/network/network";
import ToggleButton from "@components/common/gunwoo/ToggleButton";
import { useCookies } from "react-cookie";
import {jwtDecode} from "jwt-decode";
import Joyride, {ACTIONS, STATUS} from "react-joyride";

const MuseumInfo = () => {
  const location = useLocation();
  const [museumId, setMuseumId] = useState(false);
  const [museumInfo, setMuseumInfo] = useState(false);
  const [museumLocation, setMuseumLocation] = useState(false);
  const [cookie, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();
  const [runTour, setRunTour] = useState(false);
  const [tourKey, setTourKey] = useState(0);

  useEffect(() => {
    setMuseumId(location.state.museumId);
  }, []);

  useEffect(() => {
    if(museumId) {
      requestGet('https://dexplore.info/api/v1/user/get-museum', {museumId}).then((v) => {
        setMuseumInfo(v.museum);
        setMuseumLocation(v.location);
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

  const steps = [
    {
      target: '.startButton',
      content: '여기를 눌러 관람을 시작할 수 있어요.',
      disableBeacon: true,
    },
    {
      target: '.artList',
      content: '여기에서 해당 박물관의 대표 작품을 볼 수 있어요.',
      disableBeacon: true,
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status, action } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) || action === ACTIONS.CLOSE) {
      setRunTour(false);
      setTourKey((prevKey) => prevKey + 1); // Reset the Joyride instance
    }
  };

  return (
    <div>\
      <Joyride
          key={tourKey}
          steps={steps}
          run={runTour}
          continuous
          showSkipButton
          callback={handleJoyrideCallback}
          spotlightClicks={true}
          styles={{
            options: {
              zIndex: 10000,
              arrowColor: '#FFFFFF',
              backgroundColor: '#FFFFFF',
              primaryColor: '#000000',
              textColor: '#000000',
              width: 900,
              height: 900,
            },
          }}
      />
      <InfoHeader name={museumInfo ? museumInfo.museumName : '로딩중'}></InfoHeader>
      <MuseumMain museumInfo={museumInfo}></MuseumMain>
      <MuseumLoc museumLocation={museumLocation}></MuseumLoc>
      <ToggleButton setRunTour={setRunTour}/>
    </div>
  );
}

export default MuseumInfo;
import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";
import {requestGet} from "@lib/network/network";
import {useEffect, useState} from "react";
import {getLocation} from "@lib/gps/gps";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {jwtDecode} from "jwt-decode";
import ArtMatrix from "@components/common/frame/ArtMatrix";
import adBannerImage from '@assets/images/adBanner1.png';
import ToggleButton from "@components/common/gunwoo/ToggleButton";
import styled from "styled-components";
import Joyride, {ACTIONS, STATUS} from "react-joyride";

const dataList = {
  museumList: 'https://dexplore.info/api/v1/user/get-nearest-n-museums',
  recommendMuseumList: 'https://dexplore.info/api/v1/user/get-museum-recommendations',
  artList: 'https://dexplore.info/api/v1/user/get-bookmarked-arts',
  title1: '내 위치에서 가까운 박물관',
  title2: '님을 위한 추천 박물관',
  title3: '님이 북마크한 작품'
};

const AdContainer = styled.div`
  margin: auto;
  background-image: url("${adBannerImage}");
  background-size: cover;
  height: 60px;
  width: 350px;
  border-radius: 10px;

  @media (min-width: 769px) {
    height: 100px; /* 데스크탑에서는 높이를 100px로 설정 */
    width: 600px; /* 데스크탑에서는 너비를 600px로 설정 */
  }

  @media (min-width: 1024px) {
    height: 150px; /* 더 큰 화면에서는 높이를 120px로 설정 */
    width: 800px; /* 더 큰 화면에서는 너비를 800px로 설정 */
  }
`;
const UserMain = () => {
  const [chosenMuseum, setChosenMuseum] = useState({});
  const [artList, setArtList] = useState([]);
  const [museumList, setMuseumList] = useState([]);
  const [recommendMuseumList, setRecommendMuseumList] = useState([]);
  const [gps, setGps] = useState({});
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies();
  const [userName, setUserName] = useState('홍길동');
  const [runTour, setRunTour] = useState(false);
  const [tourKey, setTourKey] = useState(0);
  const [museumLoaded, setMuseumLoaded] = useState(false);
  const [artLoaded, setArtLoaded] = useState(false);
  const [recommendedLoaded, setRecommendedLoaded] = useState(false);

  useEffect(() => {
    if (Object.keys(gps).length === 0) {
      getLocation().then(v => {
        const tmp = {...v};
        setGps(tmp);
        console.log(tmp);
      });
    }
  }, []);

  useEffect (() => {
    const token = cookie.accessToken;
    if (token) {
      const decodedToken = jwtDecode (token) ;
      setUserName(decodedToken.sub);
      const now = Date.now / 1000;
      if (decodedToken.exp < now) {
        // 토큰이 만료된 경우
        removeCookie('accessToken', { path: '/' }); // 만료된 토큰 삭제
        navigate("/auth/sign-in");
      }
      else {
        // 토큰이 유효한 경우
        const userRole = decodedToken.role;
        if(userRole && userRole === "ROLE_ADMIN" ) {
          if(location.pathname !== "/user/main" || location.pathname !== "/user") navigate("/user");
        } else if ((userRole && userRole === "ROLE_USER") || (userRole && userRole === "ROLE_ADMIN")) {
          navigate("/user/main");
        } else {
          alert("잘못된 접근입니다.");
          navigate('/auth/sign-in');
        }
      }
    }
    else {
      navigate('/auth/sign-in');
    }
  }, [cookie]);

  useEffect(() => {
    setMuseumLoaded(false);setRecommendedLoaded(false);
    if (Object.keys(gps).length > 0) {
      // 박물관 리스트 받아오기
      requestGet(dataList.museumList, {latitude: gps.latitude, longitude: gps.longitude, amount: 10}).then(response => {
        setMuseumList(response.museumList);
        setChosenMuseum(response.museumList[0]);
        setMuseumLoaded(true);
      });

      // 추천 박물관 리스트 받아오기
      requestGet(dataList.recommendMuseumList, {amount: 10}).then(response => {
        setRecommendMuseumList(response.museumList);
        setChosenMuseum(response.museumList[0]);
        setRecommendedLoaded(true);
      });
    }
  }, [gps]);

  useEffect(() => {
    setArtLoaded(false);
    // 작품 리스트 받아오기
    if ((chosenMuseum !== null) && (chosenMuseum !== undefined) && Object.keys(chosenMuseum).length !== 0) {
      // {museumId: chosenMuseum.museumId, latitude: gps.latitude, longitude: gps.longitude, amount: 10}
      requestGet(dataList.artList).then(response => {
        setArtList(response.artList);
        setArtLoaded(true);
      });
    }
  }, [chosenMuseum]);

  const steps = [
    {
      target: '.nearMuseum',
      content: '여기에서 회원님과 가까운 박물관 리스트를 확인할 수 있어요.',
      disableBeacon: true,
    },
    {
      target: '.recommendedMuseum',
      content: '여기에서 회원님을 위한 맞춤 박물관을 추천해드려요.',
      disableBeacon: true,
    },
    {
      target: '.artMatrix',
      content: '여기에서 회원님이 북마크한 작품 리스트를 모아볼 수 있어요.',
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
    <div className="flex flex-col">
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
                arrowColor: '#e3ffeb',
                backgroundColor: '#e3ffeb',
                primaryColor: '#000000',
                textColor: '#000000',
                width: 900,
                height: 900,
              },
            }}
        />
      <Header name={`${userName}님, 환영합니다.`} height="130px"/>
      <div className={"nearMuseum"}>
        <ContentCarousel name={dataList.title1} itemInfo={museumList} isAdmin={false} isMuseum={true} loaded={museumLoaded}/>
      </div>
      <AdContainer className="ad-container"/>
      <div className={"recommendedMuseum"}>
        <ContentCarousel name={`${userName}` + dataList.title2} itemInfo={recommendMuseumList} isAdmin={false} isMuseum={true} isRecommend={true} loaded={recommendedLoaded} />
      </div>
      <div className="artMatrix">
        <ArtMatrix title={`${userName}` + dataList.title3} itemInfo={artList} loaded={artLoaded}></ArtMatrix>
      </div>
      <ToggleButton setRunTour={setRunTour} />
    </div>
  );
};

export default UserMain;
import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";
import SelectList from "@components/common/frame/SelectList";
import {requestGet} from "@lib/network/network";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {jwtDecode} from "jwt-decode";
import ToggleButton from "@components/common/gunwoo/ToggleButton";
import Joyride, {ACTIONS, STATUS} from "react-joyride";

const dataList = {
  museumList: 'https://dexplore.info/api/v1/admin/get-museums',
  artList: 'https://dexplore.info/api/v1/admin/get-arts',
  title1: '박물관 관리',
  title2: '작품 관리',
};

const AdminManagement = () => {
  const [chosenMuseum, setChosenMuseum] = useState({});
  const [artList, setArtList] = useState([]);
  const [museumList, setMuseumList] = useState([]);
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies();
  const [userName, setUserName] = useState('홍길동');
  const [loaded, setLoaded] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [tourKey, setTourKey] = useState(0);

  const steps = [
    {
      target: '.management1',
      content: '여기에서 박물관을 관리할 수 있어요.',
      disableBeacon: true,
    },
    {
      target: '.addArt',
      content: '여기에서 박물관을 추가할 수 있어요.',
      disableBeacon: true,
    },
    {
      target: '.dropDown',
      content: '여기를 클릭해서 QR코드를 다운받거나, 작품을 수정/삭제해요.',
      disableBeacon: true,
    },
    {
      target: '.management2',
      content: '여기에서 작품을 관리할 수 있어요.',
      disableBeacon: true,
    },
    {
      target: '.selector2',
      content: '여기에서 작품을 관리할 박물관을 선택할 수 있어요.',
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status, action } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) || action === ACTIONS.CLOSE) {
      setRunTour(false);
      setTourKey((prevKey) => prevKey + 1); // Reset the Joyride instance
    }
  };

  useEffect(() => {
    setLoaded(false);
    requestGet(dataList.museumList).then(response => {
      console.log(response);
      setMuseumList(response.museumList);
      setChosenMuseum(response.museumList[0]);
      setLoaded(true);
    });
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
          if(location.pathname !== "/admin/management" || location.pathname !== "/admin") navigate("/admin/management");
        } else if (userRole && userRole === "ROLE_USER") {
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
    if ((chosenMuseum !== null) && (chosenMuseum !== undefined) && Object.keys(chosenMuseum).length !== 0) {
      try {
      requestGet(dataList.artList, {museumId: chosenMuseum.museumId}).then(response => {
        setArtList(response.arts);
      });} catch (e) {
        console.error('error');
      };
    }
  }, [chosenMuseum]);

  return (
    <div className="flex flex-col">
      <Joyride
          key={tourKey}
          steps={steps}
          run={runTour}
          continuous
          showSkipButton
          showProgress
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
      <div className={"management1"}>
        <ContentCarousel name={dataList.title1} itemInfo={museumList} isAdmin={true} isMuseum={true} loaded={loaded}/>
      </div>
      <div className={"management2"}>
      <ContentCarousel name={dataList.title2} itemInfo={artList} isAdmin={true} isMuseum={false} loaded={loaded}
                       museumSelector={<SelectList selectItems={museumList} setChosenMuseum={setChosenMuseum}/>}  chosenMuseum={chosenMuseum}/>
      </div>
      <ToggleButton setRunTour={setRunTour} />
    </div>
  );
};

export default AdminManagement;

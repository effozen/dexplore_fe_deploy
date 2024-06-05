import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";
import SelectList from "@components/common/frame/SelectList";
import {requestGet} from "@lib/network/network";
import {useEffect, useState} from "react";
import {getLocation} from "@lib/gps/gps";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {jwtDecode} from "jwt-decode";
import ArtMatrix from "@components/common/frame/ArtMatrix";
import adBannerImage from '@assets/images/adBanner1.png';
import ToggleButton from "@components/common/gunwoo/ToggleButton";

const dataList = {
  museumList: 'https://dexplore.info/api/v1/user/get-nearest-n-museums',
  recommendMuseumList: 'https://dexplore.info/api/v1/user/get-museum-recommendations',
  artList: 'https://dexplore.info/api/v1/user/get-nearest-n-arts',
  title1: '내 위치에서 가까운 박물관',
  title2: '님을 위한 추천 박물관',
  title3: '님이 북마크한 작품'
};

const UserMain = () => {
  const [chosenMuseum, setChosenMuseum] = useState({});
  const [artList, setArtList] = useState([]);
  const [museumList, setMuseumList] = useState([]);
  const [recommendMuseumList, setRecommendMuseumList] = useState([]);
  const [gps, setGps] = useState({});
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies();

  const name = '홍길동님, 환영합니다.'; // 나중에 지울 것

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
      console.log (decodedToken);
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
    if (Object.keys(gps).length > 0 && gps.err === 0) {
      // 박물관 리스트 받아오기
      requestGet(dataList.museumList, {latitude: gps.latitude, longitude: gps.longitude, amount: 10}).then(response => {
        setMuseumList(response.museumList);
        setChosenMuseum(response.museumList[0]);
      });

      // 추천 박물관 리스트 받아오기
      requestGet(dataList.recommendMuseumList, {amount: 10}).then(response => {
        setRecommendMuseumList(response.museumList);
        setChosenMuseum(response.museumList[0]);
      });
    }
  }, [gps]);

  useEffect(() => {
    // 작품 리스트 받아오기
    if ((chosenMuseum !== null) && (chosenMuseum !== undefined) && Object.keys(chosenMuseum).length !== 0) {
      console.log(chosenMuseum);
      requestGet(dataList.artList, {museumId: chosenMuseum.museumId, latitude: gps.latitude, longitude: gps.longitude, amount: 10}).then(response => {
        console.log(response);
        setArtList(response.artList);
      });
    }
  }, [chosenMuseum]);

  return (
    <div className="flex flex-col">
      <Header name={name} height="130px"/>
      <ContentCarousel name={dataList.title1} itemInfo={museumList} isAdmin={false} isMuseum={true}/>
      <div className='mr-auto ml-auto pr-[15px] pl-[15px] max-w-[1000px] mb-[30px] mt-[10px]'>
        <img src={adBannerImage} alt="광고 이미지" className='max-h-[400px] rounded-[10px]'/>
      </div>
      <ContentCarousel name={'홍길동' + dataList.title2} itemInfo={recommendMuseumList} isAdmin={false} isMuseum={true} isRecommend={true} />
      <ArtMatrix title={'홍길동' + dataList.title3} itemInfo={artList}></ArtMatrix>
      <ToggleButton/>
    </div>
  );
};

export default UserMain;

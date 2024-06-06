import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";
import SelectList from "@components/common/frame/SelectList";
import { requestGet } from "@lib/network/network";
import { useEffect, useState } from "react";
import { getLocation } from "@lib/gps/gps";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {jwtDecode} from "jwt-decode";
import ArtMatrix from "@components/common/frame/ArtMatrix";
import adBannerImage from "@assets/images/adBanner1.png";
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
  const [userName, setUserName] = useState('홍길동');

  // GPS 정보 가져오기
  useEffect(() => {
    if (Object.keys(gps).length === 0) {
      getLocation().then(setGps);
    }
  }, [gps]);

  // 사용자 정보 및 토큰 검사
  useEffect(() => {
    const token = cookie.accessToken;
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.sub);
      const now = Date.now() / 1000;
      if (decodedToken.exp < now) {
        removeCookie('accessToken', { path: '/' });
        navigate("/auth/sign-in");
      } else {
        const userRole = decodedToken.role;
        if (userRole === "ROLE_ADMIN" && !["/user/main", "/user"].includes(location.pathname)) {
          navigate("/user");
        } else if (["ROLE_USER", "ROLE_ADMIN"].includes(userRole)) {
          navigate("/user/main");
        } else {
          alert("잘못된 접근입니다.");
          navigate('/auth/sign-in');
        }
      }
    } else {
      navigate('/auth/sign-in');
    }
  }, [cookie, navigate, removeCookie]);

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      if (gps.err === 0) {
        const [museumResponse, recommendResponse] = await Promise.all([
          requestGet(dataList.museumList, { latitude: gps.latitude, longitude: gps.longitude, amount: 10 }),
          requestGet(dataList.recommendMuseumList, { amount: 10 })
        ]);

        setMuseumList(museumResponse.museumList);
        setRecommendMuseumList(recommendResponse.museumList);

        if (museumResponse.museumList.length > 0) {
          setChosenMuseum(museumResponse.museumList[0]);
        }
      }
    };

    if (Object.keys(gps).length > 0) {
      fetchData();
    }
  }, [gps]);

  // 작품 리스트 받아오기
  useEffect(() => {
    const fetchArtList = async () => {
      if (chosenMuseum && Object.keys(chosenMuseum).length !== 0) {
        const artResponse = await requestGet(dataList.artList, { museumId: chosenMuseum.museumId, latitude: gps.latitude, longitude: gps.longitude, amount: 10 });
        setArtList(artResponse.artList);
      }
    };

    fetchArtList();
  }, [chosenMuseum, gps]);

  return (
    <div className="flex flex-col">
      <Header name={`${userName}님, 환영합니다.`} height="130px" />
      <ContentCarousel name={dataList.title1} itemInfo={museumList} isAdmin={false} isMuseum={true} />
      <div className='mr-auto ml-auto pr-[15px] pl-[15px] max-w-[1000px] mb-[30px] mt-[10px]'>
        <img src={adBannerImage} alt="광고 이미지" className='max-h-[400px] rounded-[10px]' />
      </div>
      <ContentCarousel name={`${userName}` + dataList.title2} itemInfo={recommendMuseumList} isAdmin={false} isMuseum={true} isRecommend={true} />
      <ArtMatrix title={`${userName}` + dataList.title3} itemInfo={artList} />
      <ToggleButton />
    </div>
  );
};

export default UserMain;

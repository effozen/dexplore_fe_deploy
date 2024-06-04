import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";
import SelectList from "@components/common/frame/SelectList";
import {requestGet} from "@lib/network/network";
import {useEffect, useState} from "react";
import {getLocation} from "@lib/gps/gps";
import ArtMatrix from "@components/common/frame/ArtMatrix";
import adBannerImage from '@assets/images/adBanner1.png';

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
      <ContentCarousel name={'홍길동' + dataList.title2} itemInfo={recommendMuseumList} isAdmin={false} isMuseum={true}
                       museumSelector={<SelectList selectItems={museumList} setChosenMuseum={setChosenMuseum}/>}
                       chosenMuseum={chosenMuseum}/>
      <ArtMatrix title={'홍길동' + dataList.title3} itemInfo={artList}></ArtMatrix>
    </div>
  );
};

export default UserMain;

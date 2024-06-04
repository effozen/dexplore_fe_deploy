import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";
import SelectList from "@components/common/frame/SelectList";
import {requestGet} from "@lib/network/network";
import {useEffect, useState} from "react";
import {getLocation} from "@lib/gps/gps";

const dataList = {
  museumList: 'https://dexplore.info/api/v1/user/get-nearest-museum',
  artList: 'https://dexplore.info/api/v1/admin/get-arts',
  title1: '내 위치에서 가까운 박물관',
  title2: '님을 위한 추천 박물관을 준비했어요!',
};

const UserMain = () => {
  const [chosenMuseum, setChosenMuseum] = useState({});
  const [artList, setArtList] = useState([]);
  const [museumList, setMuseumList] = useState([]);
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
    if(Object.keys(gps).length > 0 && gps.err === 0) {
    requestGet(dataList.museumList, {latitude:gps.latitude, longitude:gps.longitude}).then(response => {
      console.log(response);
      setMuseumList(response.museumList);
      // setChosenMuseum(response.museumList[0]);
    });
    }
  }, [gps]);

  useEffect(() => {
    if ((chosenMuseum !== null) && (chosenMuseum !== undefined) && Object.keys(chosenMuseum).length !== 0) {
      requestGet(dataList.artList, {museumId: chosenMuseum.museumId}).then(response => {
        setArtList(response.arts);
      });
    }
  }, [chosenMuseum]);

  return (
    <div className="flex flex-col">
      <Header name={name} height="130px"/>
      {/* <ContentCarousel name={dataList.title1} itemInfo={museumList} isAdmin={true} isMuseum={true}/> */}
      {/* <ContentCarousel name={'홍길동' + dataList.title2} itemInfo={artList} isAdmin={true} isMuseum={false} */}
      {/*                  museumSelector={<SelectList selectItems={museumList} setChosenMuseum={setChosenMuseum}/>} */}
      {/*                  chosenMuseum={chosenMuseum}/> */}
    </div>
  );
};

export default UserMain;

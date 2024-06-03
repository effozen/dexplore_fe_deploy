import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";
import SelectList from "@components/common/frame/SelectList";
import {requestGet} from "@lib/network/network";
import {useEffect, useState} from "react";

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

  const name = '홍길동님, 환영합니다.'; // 나중에 지울 것

  useEffect(() => {
    requestGet(dataList.museumList).then(response => {
      console.log(response);
      setMuseumList(response.museumList);
      setChosenMuseum(response.museumList[0]);
    });
  }, []);

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
      <ContentCarousel name={dataList.title1} itemInfo={museumList} isAdmin={true} isMuseum={true}/>
      <ContentCarousel name={dataList.title2} itemInfo={artList} isAdmin={true} isMuseum={false}
                       museumSelector={<SelectList selectItems={museumList} setChosenMuseum={setChosenMuseum}/>}  chosenMuseum={chosenMuseum}/>
    </div>
  );
};

export default AdminManagement;

import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";
import SelectList from "@components/common/frame/SelectList";
import {requestPost, requestGet} from "@lib/network/network";
import {useEffect, useState} from "react";

const dataList = {
  museumList : 'https://dexplore.info/api/v1/admin/get-museums',
  artList : 'https://dexplore.info/api/v1/admin/get-arts',
  title1: '박물관 관리',
  title2: '작품 관리',
}

const AdminManagement = () => {
  const [chosenMuseum, setChosenMuseum] = useState({});
  const [artList, setArtList] = useState([]);
  const [museumList, setMuseumList] = useState([{
    museumName:'박물관 이름',
    museumId:1,
    imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8Oyu2hViKqza-dCOvJfcgyVtQTPabPZwzJw&s',
    description:'박물관 설명',
  },
    {
    museumName:'박물관 이름2',
    museumId:2,
    imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8Oyu2hViKqza-dCOvJfcgyVtQTPabPZwzJw&s',
    description:'박물관 설명',
  }]);

  const name = '홍길동님, 환영합니다.'; // 나중에 지울 것

  useEffect( () => {
     requestGet(dataList.museumList).then(v => {
       console.log(v);
      setMuseumList(v.museumList);
      setChosenMuseum(v.museumList[0]);
    });
  }, []);

  // useEffect(() => {
  //   requestGet(dataList.artList, {museumId: chosenMuseum.museumId}).then(v => {
  //     setArtList(v.data.arts);
  //   });
  // }, [chosenMuseum]);

  return (
    <div className='flex flex-col'>
      <Header name={name} height="130px" />
      <ContentCarousel name={dataList.title1} itemInfo={museumList} isAdmin={true} isMuseum={true}/>
      <ContentCarousel name={dataList.title2} itemInfo={artList} isAdmin={true} isMuseum={false} museumSelector={<SelectList selectItems={museumList} setChosenMuseum={setChosenMuseum}/>}/>
    </div>
  );
}

export default AdminManagement;

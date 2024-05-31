import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";
import {requestPost, requestGet} from "@lib/network/network";

const urlList = {
  museumList : 'https://dexplore.info/api/v1/admin/get-museums',
  artList : 'https://dexplore.info/api/v1/admin/get-arts'
}

const AdminManagement = () => {
  const name = '홍길동';
  const title1 = '박물관 관리';
  const title2 = '작품 관리';

  //const museumList = requestPost(urlList.museumList);

  requestPost(urlList.museumList).then(v => console.log(v));

  return (
    <div className='flex flex-col'>
      <Header name={name} height="130px" />
      <ContentCarousel name={title1}/>
      <ContentCarousel name={title2}/>
    </div>
  );
}

export default AdminManagement;

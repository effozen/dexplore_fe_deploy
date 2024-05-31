import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";

const AdminManagement = () => {
  const name = '홍길동';
  const title1 = '박물관 관리';
  const title2 = '작품 관리';

  return (
    <div className='flex flex-col'>
      <Header name={name} height="130px" />
      <ContentCarousel name={title1}/>
      <ContentCarousel name={title2}/>
    </div>
  );
}

export default AdminManagement;

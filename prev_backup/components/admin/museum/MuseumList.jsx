import classNames from "classnames";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MuseumItem = ({ museumId, museumName, imgUrl, isOn }) => {
  const navigate = useNavigate();

  const clickHandler = () => {
    if (isOn) {
      navigate('/admin/art', { state: { museumId } });
    } else {
      navigate('/admin/museum/update', { state: { museumId } });
    }
  };

  return (
    <li className={classNames('admin-museum-list-box')} onClick={clickHandler}>
      <img src={imgUrl} alt="img" className={classNames('admin-museum-list-img')} />
      <span className={classNames('admin-museum-list-content')}>
        <div className={classNames('admin-museum-list-content-item', 'font-size-large', 'font-color-primary', 'font-weight-strong')}>{museumName}</div>
        {/* <div className={classNames('admin-museum-list-content-item', 'font-size-extraSmall', 'font-color-gray')}>서울 용산구 서빙고로137 국립중앙박물관</div> */}
      </span>
    </li>
  );
};

const MuseumAddItem = () => {
  const navigate = useNavigate();

  const addButtonHandler = () => {
    navigate('/admin/museum/create');
  };

  return (
    <li className={classNames('admin-museum-list-box', 'add')} onClick={addButtonHandler}>
      <AiOutlinePlus size="100px" />
    </li>
  );
};

const MuseumList = ({ isOn }) => {
  const [cookies] = useCookies(['accessToken']);
  const [museumList, setMuseumList] = useState([]);
  const [viewList, setViewList] = useState([]);

  const communicate = async () => {
    // 쿠키에서 accessToken을 가져옵니다.
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    // 요청에 Authorization 헤더를 설정합니다.
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const result = await axios.get('https://dexplore.info/api/v1/admin/get-museums', { headers });

    let resultList = result.data.museumList;
    setMuseumList(resultList);

    console.log(resultList);
  };

  useEffect(() => {
    communicate();
  }, [cookies]);

  useEffect(() => {
    const tmp = museumList.map((v, i) => {
      return <MuseumItem key={i} museumId={v.museumId} museumName={v.museumName} imgUrl={v.imgUrl} isOn={isOn} />;
    });

    setViewList(tmp);
  }, [museumList, isOn]);

  return (
    <ul className={classNames('admin-museum-list-frame')}>
      {viewList}
      <MuseumAddItem />
    </ul>
  );
};

export default MuseumList;

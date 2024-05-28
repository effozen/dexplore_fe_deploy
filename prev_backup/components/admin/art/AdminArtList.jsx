import './AdminArt.scss';
import classNames from "classnames";
import Line from '../../frames/Line';
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";

const ArtItem = ({ artId, artName, artYear, authName, imgUrl, isOn, museumId }) => {
  const [cookies] = useCookies(['accessToken']);
  const navigate = useNavigate();

  const clickHandler = () => {
    if (!isOn) {
      navigate('/admin/art/update', { state: { artId, museumId } });
    }
  };

  const deleteRequest = async () => {
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const requestBody = { artId };

    console.log(requestBody);

    const result = await axios.post('https://dexplore.info/api/v1/admin/delete-art', requestBody, { headers });

    console.log(`Deleting item with artId: ${artId}`);
  }

  const handleDelete = () => {
    deleteRequest(artId);
  };

  return (
    <li className={classNames('admin-art-list-box')} onClick={clickHandler}>
      <img src={imgUrl} alt="img" className={classNames('admin-art-list-img')} />
      <span className={classNames('admin-art-list-box-column')}>
        <div className={classNames('font-size-large', 'font-color-primary', 'font-weight-strong')}>
          {artName}
        </div>
        <div className={classNames('font-size-midLarge', 'font-color-secondary')}>
          {artYear}
        </div>
        <div className={classNames('font-size-mid', 'margin-top-7')}>
          <div>{authName}</div>
        </div>
        <div className={classNames('admin-art-list-button-layout')}>
          <div className={classNames('font-size-mid', 'margin-top-7', 'admin-art-list-button')} onClick={handleDelete}>삭제</div>
        </div>
      </span>
    </li>
  );
};

const ArtAddItem = ({ museumId }) => {
  const navigate = useNavigate();

  const addButtonHandler = () => {
    navigate('/admin/art/create', { state: { museumId } });
  };

  return (
    <li className={classNames('admin-art-list-box-button', 'add')} onClick={addButtonHandler}>
      <AiOutlinePlus size="100px" />
    </li>
  );
};

const AdminArtList = ({ museumId, isOn }) => {
  const [cookies] = useCookies(['accessToken']);
  const [artList, setArtList] = useState([]);
  const [viewList, setViewList] = useState([]);

  const communicate = async () => {
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    let params = { museumId }

    console.log(museumId)

    const result = await axios.get('https://dexplore.info/api/v1/admin/get-arts', { headers, params });

    console.log(result);

    let resultList = result.data.arts;
    setArtList(resultList);

    console.log(resultList);
  };

  useEffect(() => {
    communicate();
  }, [cookies]);

  useEffect(() => {
    const tmp = artList.map((v, i) => {
      return (
        <Fragment key={`artFragment${i}`}>
          <ArtItem key={`art${i}`} artId={v.artId} artName={v.artName} artYear={v.artYear} imgUrl={v.imgUrl} authName={v.authName} isOn={isOn} museumId={museumId} />
          <Line key={`line${i}`} />
        </Fragment>
      );
    });

    setViewList(tmp);
  }, [artList, isOn]);

  return (
    <ul className={classNames('admin-art-list-frame')}>
      {viewList}
      <ArtAddItem museumId={museumId}></ArtAddItem>
    </ul>
  );
};

export default AdminArtList;

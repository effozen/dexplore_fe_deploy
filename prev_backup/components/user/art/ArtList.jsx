import './Art.scss';
import classNames from "classnames";
import Line from '../../frames/Line';
import {AiOutlinePicture, AiOutlinePlus, AiOutlineQrcode, AiOutlineReload} from "react-icons/ai";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {useEffect, useState, Fragment, useRef} from "react";
import {getLocation} from "../../../modules/gps/gps";
import MenuButton from "../../frames/MenuButton";


const ArtItem = ({artId, artName, artYear, authName, imgUrl, isOn, museumId}) => {
  const [cookies] = useCookies(['accessToken']);
  const navigate = useNavigate();

  const clickHandler = (e) => {
    e.preventDefault();
    navigate('/user/art/info', {state: {artId, museumId}});
  };

  return (
    <li className={classNames('admin-art-list-box')} onClick={clickHandler}>
      <img src={imgUrl} alt="img" className={classNames('admin-art-list-img')}/>
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
      </span>
    </li>
  );
};

const ArtList = ({museumId, isOn}) => {
  const [cookies] = useCookies(['accessToken']);
  const [artList, setArtList] = useState([]);
  const [viewList, setViewList] = useState([]);
  const didMount = useRef(false);
  const navigate = useNavigate();

  const getData = async () => {
    let location = await getLocation();

    if (Object.keys(location).length === 0) {
      console.log('GPS is not updated');
    } else {
      const token = cookies.accessToken;

      if (!token) {
        console.error('Access token is not available.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      let params = {
        museumId,
        latitude: location.latitude,
        longitude: location.longitude,
        amount: "10",
      };

      try {
        const result = await axios.get('https://dexplore.info/api/v1/user/get-nearest-n-arts', {headers, params});

        console.log(result);

        let resultList = result.data.artList;
        console.log('resultList : ', resultList);

        setArtList(resultList);

        console.log('result.data: ', result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    if (!didMount.current) {
      getData();
      didMount.current = true;
    }
  }, [cookies]);

  // const handleClick = (e, artId) => {
  //   navigate('/user/art/artInfo', {state:{artId}});
  // }

  useEffect(() => {
    const tmp = artList.map((v, i) => (
      <Fragment key={`artFragment${i}`}>
        <ArtItem key={`art${i}`} artId={v.artId} artName={v.artName} artYear={v.artYear} imgUrl={v.imgUrl}
                 authName={v.authName} isOn={isOn} museumId={museumId} />
        <Line key={`line${i}`}/>
      </Fragment>
    ), [artList]);

    setViewList(tmp);
  }, [artList, isOn]);

  const handleReload = () => {
    getData();
    window.alert("재검색합니다.");
  }

  const handleQR = () => {
    navigate('/user/qr', {state:{museumId:museumId}});
  }

  const eventHandlers = {
    handleReload,
  };

  return (
    <>
      <ul className={classNames('admin-art-list-frame')}>
        {viewList}
      </ul>
      <div className={classNames('flex-box')}>
        <div className={classNames('flex-content-around')}>
          <span className={classNames('flex-box-column')}>
            <button className={classNames('button-size', 'background-color-btn1')}
                    onClick={handleReload}><AiOutlineReload size="5rem"
                                                            color="white"/></button>
            <div className={classNames('font-size-midLarge', 'margin-topBottom')}>다시 검색</div>
          </span>
          <span className={classNames('flex-box-column')}>
            <button className={classNames('button-size', 'background-color-btn3')} onClick={handleQR}><AiOutlineQrcode size="5rem"
                                                                                                    color="white"/></button>
            <div className={classNames('font-size-midLarge', 'margin-topBottom')}>QR 안내</div>
          </span>
        </div>
      </div>
      <MenuButton museumId={museumId} componentLists={['reload', 'museum', 'qr']} eventHandlers={eventHandlers}/>
    </>
  );
};

export default ArtList;

import './MuseumInfo.scss';
import classNames from "classnames";
import {getLocation} from "../../../modules/gps/gps";
import {useEffect, useState, useRef} from "react";
import {AiOutlineReload, AiOutlineQrcode, AiOutlinePicture} from "react-icons/ai";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

import Frame from "../../frames/Frame";
import Header from '../../frames/Header';
import Line from '../../frames/Line';
import MenuButton from "../../frames/MenuButton";


const MuseumInfo = () => {
  // const [GPS, setGPS] = useState({});
  const [museumInfo, setMuseumInfo] = useState({
    museumName: '',
    imgUrl: '',
    description: '',
    museumId: '',
  });
  const didMount = useRef(false);
  const [cookies] = useCookies(['accessToken']);
  const navigate = useNavigate();

  const communicateGPS = async () => {
    let location = await getLocation();

    // console.log(location);

    if (Object.keys(location).length === 0) {
      console.log('GPS is not updated');
    } else {
      let params = {
        latitude: location.latitude,
        longitude: location.longitude,
      }
      // console.log(params);

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

      const result = await axios.get('https://dexplore.info/api/v1/user/get-nearest-museum', {headers, params});

      let {...obj} = result.data.museum;

      console.log(obj);

      setMuseumInfo(obj);
    }
  };

  useEffect(() => {
    communicateGPS();
  }, []);

  const handleReload = () => {
    communicateGPS();
    window.alert("재검색합니다.");
  }

  const handleList = () => {
    navigate('/user/art', {state:{museumId:museumInfo.museumId}});
  }

  const handleQR = () => {
    navigate('/user/qr', {state:{museumId:museumInfo.museumId}});
  }

  const eventHandlers = {
    handleReload,
  }

  return (
    <Frame>
      <Header>
        방문한 박물관
      </Header>
      <div className={classNames('flex-box')}>
        <img className={classNames('museum-img')} src={museumInfo.imgUrl} alt="test"/>
      </div>
      <Line/>
      <div className={classNames('flex-box')}>
        <div className={classNames('flex-content-left', 'font-size-large', 'font-weight-strong', 'font-color-primary')}>
          {museumInfo.museumName}
        </div>
        <div className={classNames('flex-content-left', 'margin-topBottom', 'font-size-extraSmall', 'font-color-gray')}>
          {/* {museumInfo.location} */}
        </div>
        <div className={classNames( 'pre')}>{museumInfo.description}</div>
      </div>
      <Line/>
      <div className={classNames('flex-box')}>
        <div className={classNames('flex-content-around')}>
          <span className={classNames('flex-box-column')}>
            <button className={classNames('button-size', 'background-color-btn1', 'button-click')} onClick={handleReload}><AiOutlineReload size="5rem"
                                                                                                    color="white"/></button>
            <div className={classNames('font-size-midLarge', 'margin-topBottom')}>다시 검색</div>
          </span>
            <span className={classNames('flex-box-column')}>
            <button className={classNames('button-size', 'background-color-btn2', 'button-click')} onClick={handleList}><AiOutlinePicture size="4.5rem"
                                                                                                     color="white"/></button>
            <div className={classNames('font-size-midLarge', 'margin-topBottom')}>관람 시작</div>
          </span>
            <span className={classNames('flex-box-column')}>
            <button className={classNames('button-size', 'background-color-btn3', 'button-click')} onClick={handleQR}><AiOutlineQrcode size="5rem"
                                                                                                    color="white"/></button>
            <div className={classNames('font-size-midLarge', 'margin-topBottom')}>QR 안내</div>
          </span>
        </div>
      </div>
      <MenuButton museumId={museumInfo.museumId} componentLists={['reload','list','qr']} eventHandlers={eventHandlers}/>
    </Frame>
  );
};

export default MuseumInfo;

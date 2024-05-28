import './Art.scss';
import Frame from "../../frames/Frame";
import classNames from "classnames";
import Line from '../../frames/Line';
import { AiFillSound } from "react-icons/ai";
import {useNavigate, useLocation} from "react-router-dom";
import MenuButton from "../../frames/MenuButton";
import Header from "../../frames/Header";


import testImg from '../../../modules/img/testImage400.jpeg';
import {useCookies} from "react-cookie";
import axios from "axios";
import {useEffect, useState, useRef} from "react";

const ArtInfo = () => {
  const [cookies] = useCookies(['accessToken']);
  const location = useLocation();
  const { artId, museumId } = location.state || {};
  const [formData, setFormData] = useState({
    artName: '',
    artDescription: '',
    artYear: '',
    authName: '',
    imgUrl:'',
    ttsId:'',
  });
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [ttsUrl, setTtsUrl] = useState('');

  const message = `
  옆의 버튼을 눌러서
  오디오 큐레이팅을 들어보세요!
  `;

  const getData = async () => {
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    let params = {artId};

    const result = await axios.get('https://dexplore.info/api/v1/user/get-art', {headers, params});

    console.log(result);

    let {...gettedData} = result.data.art;

    setFormData(gettedData);
    return gettedData;  // 데이터 반환
  };

  const getTtsUrl = async (ttsId) => {
    const token = cookies.accessToken;

    if (!token) {
      console.error('Access token is not available.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    let params = {ttsId};

    const result = await axios.get('https://dexplore.info/api/v1/user/get-tts', {headers, params});

    console.log(result);

    const ttsUrl = result.data.tts.bucketUrl;

    setTtsUrl(ttsUrl);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      if (data && data.ttsId) {
        await getTtsUrl(data.ttsId);
      }
    };
    fetchData();
  }, []);

  const handleTTS = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }

  const eventHandlers = {
  }

  return (
    <Frame>
      <div className={classNames('margin-top-30')}></div>
      <div className={classNames('flex-box')}>
        <img src={formData.imgUrl} alt="img" className={classNames('info-img')}/>
      </div>
      <Line/>
      <div className={classNames('flex-box', 'info', 'margin-topBottom-20')}>
        <div className={classNames('flex-content-left', 'font-size-large', 'font-weight-light')}>
          {formData.authName}
        </div>
        <div className={classNames('flex-content-left', 'font-size-extraLarge', 'font-weight-strong', 'font-color-primary', 'margin-topBottom-7')}>
          {formData.artName}
        </div>
        <div className={classNames('flex-content-left', 'font-size-large')}>
          {formData.artYear}
        </div>
      </div>
      <Line/>
      <div className={classNames('flex-box', 'margin-topBottom-20')}>
        <div className={classNames('flex-content-around-center')}>
        <span className={classNames()}>
          <button className={classNames('background-color-secondary', 'button-size')} onClick={handleTTS}>
            <AiFillSound size='3.5rem'/>
          </button>
        </span>
          <span>
          <pre className={classNames('font-size-midLargeLarge')}>
            {message}
          </pre>
        </span>
        </div>
      </div>
      <div className={classNames('info-text')}>
        {formData.artDescription}
      </div>
      <audio ref={audioRef} src={ttsUrl}/>
      <MenuButton museumId={museumId} componentLists={['list', 'qr', 'museum']} eventHandlers={eventHandlers}/>
    </Frame>
  );
}

export default ArtInfo;

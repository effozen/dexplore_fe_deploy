import {Scanner} from '@yudiel/react-qr-scanner';
import {useState, Fragment} from "react";
import testImage from "../../../modules/img/testImage400.jpeg";
import classNames from "classnames";
import './QRCode.scss';
import { AiOutlineQrcode } from "react-icons/ai";
import {useCookies} from "react-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";



export default function QRCodeMain({children, museumId}) {
  const [clickState, setClickState] = useState(false);
  const [cookies] = useCookies(['accessToken']);
  const navigate = useNavigate();

  function onButtonClick() {
    setClickState(true);
  }

  const getArtId = async (qrcodeHashkey) => {
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

    let params = {qrcodeHashKey:qrcodeHashkey};

    console.log(params);

    const result = await axios.get('https://dexplore.info/api/v1/user/get-art-by-hash', {headers, params});

    let artId = result.data.art.artId;

    navigate('/user/art/info', {state:{museumId, artId}});

  };

  let htmlTag = (
    <div className={classNames()}>
      <button className={classNames('flex-content-center', 'qr-button')} onClick={onButtonClick}><AiOutlineQrcode size='70vw'/>
      </button>
      <div className={classNames('flex-content-center', 'font-size-midLargeLarge', 'margin-top-15')}>
        버튼을 누르면 촬영이 시작됩니다
      </div>
    </div>
  );

  if (clickState) {
    htmlTag = (
      <div>
        <Scanner
          onResult={(text, result) => {
            console.log(text, result);
            getArtId(text);
          }}
          onError={(error) => console.log(error?.message)}
          className={classNames('flex-content-center')}
        />
        <div className={classNames('flex-content-center', 'font-size-midLargeLarge', 'margin-top-15')}>
          카메라를 QR코드로 향하세요
        </div>
      </div>
    );
  }

  return (
    <div className={classNames('flex-box-column')}>
      {htmlTag}
      {children}
    </div>
  );
}
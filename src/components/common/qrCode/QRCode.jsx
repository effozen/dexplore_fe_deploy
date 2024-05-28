// QRCode는 https://www.npmjs.com/package/@yudiel/react-qr-scanner 라이브러리 이용

import QRCodeMain from "./QRCodeMain";
import Frame from "../../frames/Frame";
import Header from "../../frames/Header";
import {useNavigate, useLocation} from "react-router-dom";

import './QRCode.scss';
import classNames from "classnames";
import {AiOutlinePicture} from "react-icons/ai";
import MenuButton from "../../frames/MenuButton";



const QRCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { museumId } = location.state || {};

  const handleMenu = () => {
    navigate('/user/art');
  };

  const handleList = () => {
    navigate('/user/art', {state:{museumId}});
  }

  const eventHandlers = {
    handleList,
  }

  return (
    <>
      <Frame>
        <Header>QR 코드 스캔</Header>
        <QRCodeMain museumId={museumId}></QRCodeMain>
        <div className={classNames('flex-box')}>
          <div className={classNames('flex-content-center')}>
            <span className={classNames('flex-box-column')}>
            <button className={classNames('button-size', 'background-color-btn2', 'margin-top-30')}
                    onClick={handleMenu}><AiOutlinePicture size="4.5rem"
                                                            color="white"/></button>
            <div className={classNames('font-size-midLarge', 'margin-topBottom')}>주변 작품 확인</div>
          </span>
          </div>
        </div>
        <MenuButton museumId={museumId} componentLists={['list', 'museum']} eventHandlers={eventHandlers}/>
      </Frame>
    </>
  );
}

export default QRCode;
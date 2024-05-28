import './MenuButton.scss';
import classNames from "classnames";
import Frame from "./Frame";
import {
  AiOutlineLogout,
  AiOutlineReload,
  AiOutlineQrcode,
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlinePlus,
  AiOutlineHome
} from "react-icons/ai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

const MenuButton = ({ museumId, componentLists, eventHandlers}) => {
  const [menuState, setMenuState] = useState(false);
  const [menuList, setMenuList] = useState([
  ]);
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);


  const navigate = useNavigate();

  const allHandlers = {
    handleReload: ()=>{},
  }

  const handlerList = {
    ...allHandlers,
    ...eventHandlers
  }

  const handleMuseum = () => {
    navigate('/');
  }

  const handleList = () => {
    navigate('/user/art', {state:{museumId}});
  }

  const handleQR = () => {
    navigate('/user/qr', {state:{museumId}});
  }

  useEffect(() => {
    const showObj = {
      reload: (
        <div className={classNames('flex-box', 'fixedButton-margin')}>
          <span className={classNames('margin-right-10')}>다시 검색</span>
          <span className={classNames('fixedButton-button', 'reload')} onClick={handlerList.handleReload}>
            <AiOutlineReload size="35px" color="white" />
          </span>
        </div>
      ),
      qr: (
        <div className={classNames('flex-box', 'fixedButton-margin')}>
          <span className={classNames('margin-right-10')}>QR 안내</span>
          <span className={classNames('fixedButton-button', 'qr')} onClick={handleQR}>
            <AiOutlineQrcode size="35px" color="white" />
          </span>
        </div>
      ),
      list: (
        <div className={classNames('flex-box', 'fixedButton-margin')}>
          <span className={classNames('margin-right-10')}>작품목록</span>
          <span className={classNames('fixedButton-button', 'list')} onClick={handleList}>
            <AiOutlineMenu size="35px" color="white" />
          </span>
        </div>
      ),
      logout: (
        <div className={classNames('flex-box', 'fixedButton-margin')}>
          <span className={classNames('margin-right-10')}>로그아웃</span>
          <span className={classNames('fixedButton-button', 'logout')} onClick={handleLogout}>
            <AiOutlineLogout size="35px" color="white" />
          </span>
        </div>
      ),
      museum: (
        <div className={classNames('flex-box', 'fixedButton-margin')}>
          <span className={classNames('margin-right-10')}>박물관 정보</span>
          <span className={classNames('fixedButton-button', 'museum')} onClick={handleMuseum}>
            <AiOutlineHome size="35px" color="white" />
          </span>
        </div>
      ),
    };

    if (menuState) {
      const tmp = componentLists.map(v => {
        return showObj[v];
      });

      const showList = [showObj.logout, ...tmp];

      showList.push(<div className={classNames('flex-box', 'fixedButton-margin')}>
          <span className={classNames('fixedButton-button', 'exit')} onClick={handleMenu}>
            <AiOutlineClose size="35px" color="white" />
          </span>
        </div>);
      setMenuList(showList);
    } else {
      const noneShowList = [
        <div className={classNames('flex-box', 'fixedButton-margin')}>
          <span className={classNames('fixedButton-button', 'logout')} onClick={handleMenu}>
            <AiOutlinePlus size="35px" color="white" />
          </span>
        </div>
      ];
      setMenuList(noneShowList);
    }
  }, [menuState]);

  const handleMenu = () => {
    setMenuState(!menuState);
  };

  const handleClickMenu = (e) => {
    console.log(e.target);
  };

  const handleLogout = () => {
    removeCookie('accessToken');
    alert('로그아웃 완료');
    navigate('/');
  }

  return (
    <Frame>
      <div className={classNames('fixedButton-layout', 'margin-right-5')}>
        {menuList}
      </div>
    </Frame>
  );
};

export default MenuButton;

import Header from "@components/common/frame/Header";
import ContentCarousel from "@components/common/frame/ContentCarousel";
import SelectList from "@components/common/frame/SelectList";
import {requestGet} from "@lib/network/network";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {jwtDecode} from "jwt-decode";
import ToggleButton from "@components/common/gunwoo/ToggleButton";

const dataList = {
  museumList: 'https://dexplore.info/api/v1/admin/get-museums',
  artList: 'https://dexplore.info/api/v1/admin/get-arts',
  title1: '박물관 관리',
  title2: '작품 관리',
};

const AdminManagement = () => {
  const [chosenMuseum, setChosenMuseum] = useState({});
  const [artList, setArtList] = useState([]);
  const [museumList, setMuseumList] = useState([]);
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies();

  const name = '홍길동님, 환영합니다.'; // 나중에 지울 것

  useEffect(() => {
    requestGet(dataList.museumList).then(response => {
      console.log(response);
      setMuseumList(response.museumList);
      setChosenMuseum(response.museumList[0]);
    });
  }, []);

  useEffect (() => {
    const token = cookie.accessToken;
    if (token) {
      const decodedToken = jwtDecode (token) ;
      console.log (decodedToken);
      const now = Date.now / 1000;
      if (decodedToken.exp < now) {
        // 토큰이 만료된 경우
        removeCookie('accessToken', { path: '/' }); // 만료된 토큰 삭제
        navigate("/auth/sign-in");
      }
      else {
        // 토큰이 유효한 경우
        const userRole = decodedToken.role;
        if(userRole && userRole === "ROLE_ADMIN" ) {
          if(location.pathname !== "/admin/management" || location.pathname !== "/admin") navigate("/admin/management");
        } else if (userRole && userRole === "ROLE_USER") {
          navigate("/user/main");
        } else {
          alert("잘못된 접근입니다.");
          navigate('/auth/sign-in');
        }
      }
    }
    else {
      navigate('/auth/sign-in');
    }
  }, [cookie]);

  useEffect(() => {
    if ((chosenMuseum !== null) && (chosenMuseum !== undefined) && Object.keys(chosenMuseum).length !== 0) {
      try {
      requestGet(dataList.artList, {museumId: chosenMuseum.museumId}).then(response => {
        setArtList(response.arts);
      });} catch (e) {
        console.error('error');
      };
    }
  }, [chosenMuseum]);

  return (
    <div className="flex flex-col">
      <Header name={name} height="130px"/>
      <ContentCarousel name={dataList.title1} itemInfo={museumList} isAdmin={true} isMuseum={true}/>
      <ContentCarousel name={dataList.title2} itemInfo={artList} isAdmin={true} isMuseum={false}
                       museumSelector={<SelectList selectItems={museumList} setChosenMuseum={setChosenMuseum}/>}  chosenMuseum={chosenMuseum}/>
      <ToggleButton/>
    </div>
  );
};

export default AdminManagement;

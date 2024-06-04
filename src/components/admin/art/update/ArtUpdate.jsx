import {Fragment, useEffect} from "react";
import Header from "@components/common/frame/Header";
import ArtUpdateForm from "@components/admin/art/update/ArtUpdateForm";
import {useLocation, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {jwtDecode} from "jwt-decode";

const ArtUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies();

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
      } else {
        // 토큰이 유효한 경우
        const userRole = decodedToken.role;
        if(userRole && userRole === "ROLE_ADMIN" ) {
          if(location.pathname !== "/admin/art/update") navigate("/admin/art/update");
        } else if (userRole && userRole === "ROLE_USER") {
          navigate("/user/main");
        } else {
          alert("잘못된 접근입니다.");
          navigate('/auth/sign-in');
        }
      }
    } else {
      navigate('/auth/sign-in');
    }
  }, [cookie]);

  return (
    <>
      <Header name='새로운 작품을 등록하세요' height='100px' isDate={false}></Header>
      <ArtUpdateForm></ArtUpdateForm>
    </>
  );
}

export default ArtUpdate;
import {BrowserRouter, Routes, Route, Form} from "react-router-dom";
import {useCookies} from 'react-cookie';
import AdminManagement from "@components/admin/management/AdminManagement";
import WelcomePage from "@components/minseok/Pages/WelcomePage/WelcomePage";
import SignUpPage from "@components/minseok/Pages/SignUpPage/SignUpPage";
import SignInPage from "@components/minseok/Pages/SignInPage/SignInPage";
import OAuth from "@components/minseok/Pages/OAuth/OAuth";
import ToggleButton from "@components/common/gunwoo/ToggleButton";
import MuseumCreate from "@components/admin/museum/create/MuseumCreate";
import MuseumUpdate from "@components/admin/museum/update/MuseumUpdate";
import ArtCreate from "@components/admin/art/create/ArtCreate";
import ArtUpdate from "@components/admin/art/update/ArtUpdate";
import UserMain from "@components/user/main/UserMain";
import MuseumInfo from "@components/user/museum/info/MuseumInfo";

function ContentsRouter() {
  const [cookies] = useCookies(['accessToken']); // 'myCookie' 쿠키에 접근

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="" element={<WelcomePage/>}/>
          </Route>
          <Route path="auth">
            <Route path="sign-up" element={<SignUpPage/>}/>
            <Route path="sign-in" element={<SignInPage/>}/>
            <Route path="oauth-response/:token/:expirationTime" element={<OAuth/>}/>
          </Route>
          <Route path='admin'>
            <Route path="" element={<AdminManagement/>}/>
            <Route path="management" element={<AdminManagement/>}/>
            <Route path="museum">
              <Route path='create' element={<MuseumCreate />} />
              <Route path='update' element={<MuseumUpdate />} />
            </Route>
            <Route path="art">
              <Route path='create' element={<ArtCreate />}></Route>
              <Route path='update' element={<ArtUpdate />}></Route>
            </Route>
          </Route>
          <Route path='user'>
            <Route path='' element={<UserMain/>}></Route>
            <Route path='main' element={<UserMain/>}></Route>
            <Route path='museum'>
              <Route path='' element={<MuseumInfo/>}></Route>
              <Route path='info' element={<MuseumInfo/>}></Route>
            </Route>
          </Route>

          <Route path="test">
            <Route path="" element={<AdminManagement/>}></Route>
            <Route path="toggle" element={<ToggleButton/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default ContentsRouter;

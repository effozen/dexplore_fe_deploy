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

// import Main from "../main/Main";
// import MuseumInfo from "../user/museumInfo/MuseumInfo";
// import Art from "../user/art/Art";
// import ArtInfo from "../user/art/ArtInfo";
// import QRCode from "../user/qrCode/QRCode";
// import AdminMuseum from "../admin/museum/AdminMuseum";
// import MuseumInfoCreate from "../admin/museum/MuseumInfoCreate";
// import MuseumInfoUpdate from "../admin/museum/MuseumInfoUpdate";
// import AdminArt from "../admin/art/AdminArt";
// import AdminArtCreate from "../admin/art/AdminArtCreate";
// import AdminArtUpdate from "../admin/art/AdminArtUpdate";
// import KakaoMap from "../admin/location/KakaoMap";
// import AdminMap from "../admin/location/AdminMap";

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
          {/* <Route path='user'> */}
          {/*   <Route path='' element={<MuseumInfo />}></Route> */}
          {/*   <Route path='art'> */}
          {/*     <Route path='' element={<Art />}></Route> */}
          {/*     <Route path='info' element={<ArtInfo />}></Route> */}
          {/*   </Route> */}
          {/*   <Route path='qr'> */}
          {/*     <Route path='' element={<QRCode />}></Route> */}
          {/*   </Route> */}
          {/* </Route> */}
          {/* <Route path='admin'> */}
          {/*   <Route path='' element={<AdminMuseum />}></Route> */}
          {/*   <Route path="museum"> */}
          {/*     <Route path="create" element={<MuseumInfoCreate />}></Route> */}
          {/*     <Route path='update' element={<MuseumInfoUpdate />}></Route> */}
          {/*   </Route> */}
          {/*   <Route path="art"> */}
          {/*     <Route path='' element={<AdminArt />}></Route> */}
          {/*     <Route path='create' element={<AdminArtCreate />}></Route> */}
          {/*     <Route path='update' element={<AdminArtUpdate />}></Route> */}
          {/*   </Route> */}
          {/*   <Route path="map" element={<AdminMap />}></Route> */}
          {/*   <Route path="kakomap" element={<KakaoMap />}></Route> */}
          {/* </Route> */}
          <Route path='admin'>
            <Route path="" element={<AdminManagement/>}/>
            <Route path="management" element={<AdminManagement/>}/>
            <Route path="museum">
              <Route path='create' element={<MuseumCreate />} />
              <Route path='update' element={<MuseumUpdate />} />
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

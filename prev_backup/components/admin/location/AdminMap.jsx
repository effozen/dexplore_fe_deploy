import Frame from "../../frames/Frame";
import Header from "../../frames/Header";
import Line from "../../frames/Line";
import KakaoMap from "./KakaoMap";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import classNames from "classnames";

const AdminMap = () => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const locInfo = useRef();

  const clickHandler = (e) => {
    e.preventDefault();

    // 지도의 중심 좌표 얻어오기
    const center = map.getCenter();

    // 지도의 현재 영역을 얻어옵니다
    const bounds = map.getBounds();

    // 영역의 남서쪽 좌표를 얻어옵니다
    const swLatLng = bounds.getSouthWest();

    // 영역의 북동쪽 좌표를 얻어옵니다
    const neLatLng = bounds.getNorthEast();

    locInfo.current = {
      latitude : center.getLat(),
      longitude : center.getLng(),
      level: map.getLevel(),
      // 남서쪽
      edgeLatitude1 : swLatLng.getLat(),
      edgeLongitude1 : swLatLng.getLng(),
      // //북동쪽
      edgeLatitude2 : neLatLng.getLat(),
      edgeLongitude2 : neLatLng.getLng(),
    };

    console.log(locInfo.current);

    navigate('/admin/museum/create', {state:{locInfo:locInfo.current}});
  };

  return (
    <Frame>
      <Header>박물관 위치 찾기</Header>
      <Line/>
      <KakaoMap locationHandler={setMap} />
      <div>
        <button onClick={clickHandler} className={classNames('form-input-submit')}>저장하기</button>
      </div>
    </Frame>
  );
};

export default AdminMap;
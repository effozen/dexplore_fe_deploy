import InfoHeader from "@components/common/frame/InfoHeader";
import MuseumMain from "@components/user/museum/info/MuseumMain";
import MuseumLoc from "@components/user/museum/info/MuseumLoc";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {requestGet} from "@lib/network/network";
import ToggleButton from "@components/common/gunwoo/ToggleButton";

const MuseumInfo = () => {
  const location = useLocation();
  const [museumId, setMuseumId] = useState(false);
  const [museumInfo, setMuseumInfo] = useState(false);

  useEffect(() => {
    setMuseumId(location.state.museumId);
  }, []);

  useEffect(() => {
    if(museumId) {
      requestGet('https://dexplore.info/api/v1/user/get-museum', {museumId}).then((v) => {
        setMuseumInfo(v.museum);
      });
    }
  }, [museumId]);

  return (
    <div>
      <InfoHeader name={museumInfo ? museumInfo.museumName : '로딩중'}></InfoHeader>
      <MuseumMain museumInfo={museumInfo}></MuseumMain>
      <MuseumLoc></MuseumLoc>
      <ToggleButton/>
    </div>
  );
}

export default MuseumInfo;
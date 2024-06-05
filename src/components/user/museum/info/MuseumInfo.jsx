import InfoHeader from "@components/common/frame/InfoHeader";
import MuseumMain from "@components/user/museum/info/MuseumMain";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {requestGet} from "@lib/network/network";

const MuseumInfo = () => {
  const location = useLocation();
  const [museumId, setMuseumId] = useState(false);
  const [museumInfo, setMuseumInfo] = useState(false);

  useEffect(() => {
    setMuseumId(location.state.museumId);
  }, []);

  useEffect(() => {
    if(museumId) {
      requestGet('https://dexplore.info/api/v1/admin/get-museum', {museumId}).then((v) => {
        setMuseumInfo(v.museum);
      });
    }
  }, [museumId]);

  return (
    <div>
      <InfoHeader name={museumInfo}></InfoHeader>
      <MuseumMain museumInfo={museumInfo}></MuseumMain>
    </div>
  );
}

export default MuseumInfo;